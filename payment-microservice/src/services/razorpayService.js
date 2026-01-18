import Razorpay from "razorpay";
import config from "../config/index.js";
import logger from "../config/logger.js";

if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
  console.log("❌ Razorpay keys missing in config");
  throw new Error("❌ Razorpay keys missing in config");
} else {
  console.log("config.RAZORPAY_KEY_SECRET: ", config.RAZORPAY_KEY_SECRET)
  console.log("config.RAZORPAY_KEY_SECRET: ", config.RAZORPAY_KEY_ID)
  console.log("Razorpay keys are present.");
}

console.log("Aqib1");
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID.trim(),
  key_secret: config.RAZORPAY_KEY_SECRET.trim(),
});
console.log("Aqib2");
/**
 * Create an order with Razorpay
 * @param {Object} options { amount, currency, receipt, notes, payment_capture }
 * amount must be in smallest currency unit (e.g., paise for INR)
 */
export async function createOrder(options) {
  try {
    const order = await razorpay.orders.create(options);
    console.log("order: ", order);
    return order;
  } catch (err) {
    logger.error("🔥 Razorpay Order Creation Failed");

    if (err?.error) logger.error(err.error);
    if (err?.response?.data) logger.error(err.response.data);
    logger.error(JSON.stringify(err, null, 2));

    throw err;
  }
}

/**
 * Fetch payment details (useful for capture / verification)
 * @param {string} paymentId
 */
export async function fetchPayment(paymentId) {
  return razorpay.payments.fetch(paymentId);
}

/**
 * Capture a payment (if manual capture is used)
 * @param {string} paymentId
 * @param {number} amount
 */
export async function capturePayment(paymentId, amount) {
  return razorpay.payments.capture(paymentId, amount);
}

export default {
  createOrder,
  fetchPayment,
  capturePayment,
};
