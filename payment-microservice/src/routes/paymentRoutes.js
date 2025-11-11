import express from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import validateBody from '../middlewares/validateBody.js';
import verifyWebhook from '../middlewares/verifyWebhook.js';
import Joi from 'joi';

const router = express.Router();

const createOrderSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(), // smallest unit (paise)
  currency: Joi.string().default('INR'),
  receipt: Joi.string().optional(),
  notes: Joi.object().optional()
});

const verifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});

router.post('/create-order', validateBody(createOrderSchema), createOrder);
router.post('/verify', validateBody(verifySchema), verifyPayment);

// Webhook uses raw body and signature verification middleware
router.post('/webhook', verifyWebhook, handleWebhook);

export default router;
