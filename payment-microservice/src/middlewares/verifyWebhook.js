import rawBody from 'raw-body';
import contentType from 'content-type';
import { verifyWebhookSignature } from '../utils/signature.js';
import config from '../config/index.js';

export default async function verifyWebhook(req, res, next) {
  try {
    // Read raw body
    const encoding = (req.headers['content-type'] && contentType.parse(req).parameters.charset) || 'utf-8';
    const buf = await rawBody(req, { length: req.headers['content-length'], encoding });
    const raw = buf.toString(encoding);

    // compute signature
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing X-Razorpay-Signature header' });
    }
    const isValid = verifyWebhookSignature(raw, signature, config.WEBHOOK_SECRET);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Attach parsed body for controller
    req.body = JSON.parse(raw);
    next();
  } catch (err) {
    next(err);
  }
}
