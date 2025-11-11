import * as razorpayService from '../services/razorpayService.js';
import { verifyPaymentSignature } from '../utils/signature.js';
import config from '../config/index.js';

/**
 * POST /payments/create-order
 * Body: { amount, currency, receipt, notes }
 * amount in smallest currency unit (e.g., INR paise)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;

    const orderOptions = {
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1, // 1 => auto-capture; set 0 for manual capture
      notes
    };

    const order = await razorpayService.createOrder(orderOptions);
    res.status(201).json({ order });
  } catch (err) {
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: config.RAZORPAY_KEY_SECRET
    });

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
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
export const handleWebhook = async (req, res, next) => {
  try {
    // req.body contains parsed JSON. For strict signature check, middleware used raw body
    const event = req.body;

    // Implement logic: update order status in DB, send email, etc.
    // Keep processing idempotent: check event.payload.payment.entity.id before updating.
    // Example:
    // const paymentId = event?.payload?.payment?.entity?.id;

    // For now just log and return 200
    return res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};
