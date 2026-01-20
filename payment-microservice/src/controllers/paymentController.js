// src / controllers / paymentController.js;
import * as razorpayService from "../services/razorpayService.js";
import { verifyPaymentSignature } from "../utils/signature.js";
import config from "../config/index.js";

/**
 * POST /payments/create-order
 * Body: { amount, currency, receipt, notes }
 * amount in smallest currency unit (e.g., INR paise)
 */
export const createOrder = async (req, res, next) => {
  try {
    let { amount, currency = "INR", receipt, notes = {} } = req.body;

    // 🔥 CONVERT RUPEES → PAISE HERE
    const amountInPaise = Math.round(Number(amount) * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes,
    };

    const order = await razorpayService.createOrder(orderOptions);

    if (!order?.id) {
      return res.status(500).json({ error: "Failed to create Razorpay order" });
    }

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    console.log("Refund the payment.")
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ error: "Missing razorpay_order_id" });
    }

    const payments = await razorpayService.fetchPaymentsByOrderId(razorpay_order_id);

    if (!payments?.items?.length) {
      return res.status(404).json({ error: "No payments found for this order" });
    }

    const refunds = [];

    for (const payment of payments.items) {
      try {
        const refund = await razorpayService.refundPayment(payment.id, payment.amount);
        refunds.push({ payment_id: payment.id, status: "refunded", details: refund });
      } catch (err) {
        if (
          err?.error?.code === "BAD_REQUEST_ERROR" &&
          err?.error?.description?.includes("already refunded")
        ) {
          console.warn(`Payment ${payment.id} already refunded.`);
          refunds.push({ payment_id: payment.id, status: "ALREADY_REFUNDED" });
        } else {
          refunds.push({ payment_id: payment.id, status: "FAILED", error: err.message || err });
        }
      }
    }

    res.json({ success: true, refunds });
  } catch (err) {
    console.log("ERROR: ", err);
    next(err);
  }
};

/**
 * POST /payments/verify
 * Verifies a payment signature sent from client after checkout
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: config.RAZORPAY_KEY_SECRET,
    });

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Optionally fetch payment details for extra verification
    const payment = await razorpayService.fetchPayment(razorpay_payment_id);

    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /payments/webhook
 * Handles Razorpay webhooks. verifyWebhook middleware already verifies signature.
 */
export const handleWebhook = async (req, res) => {
  const event = req.body;

  if (event.event === "payment.captured") {
    await axios.post(
      config.ORDER_SERVICE_URL + "/order/payment-webhook/",
      event,
      {
        headers: {
          "X-SERVICE-SECRET": config.SERVICE_SECRET,
        },
      }
    );
  }
  res.json({ received: true });
};
