import Razorpay from 'razorpay';
import config from '../config/index.js';
import logger from '../config/logger.js';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

/**
 * Create an order with Razorpay
 * @param {Object} options { amount, currency, receipt, notes, payment_capture }
 * amount must be in smallest currency unit (e.g., paise for INR)
 */
export async function createOrder(options) {
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (err) {
    logger.error(`Razorpay createOrder error: ${err.message}`);
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
  capturePayment
};
