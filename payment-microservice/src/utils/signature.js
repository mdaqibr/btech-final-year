import crypto from 'crypto';

/**
 * Verifies checkout signature (client-side flow)
 * For checkout the signature is computed over order_id + '|' + payment_id using key_secret.
 *
 * @param {Object} params
 * @param {string} params.orderId
 * @param {string} params.paymentId
 * @param {string} params.signature
 * @param {string} params.secret
 * @returns {boolean}
 */
export function verifyPaymentSignature({ orderId, paymentId, signature, secret }) {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return expected === signature;
}

/**
 * Verify webhook signature (Razorpay sends hex HMAC of raw body using WEBHOOK_SECRET)
 * @param {string} rawBody
 * @param {string} signatureHeader
 * @param {string} secret
 * @returns {boolean}
 */
export function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signatureHeader;
}
