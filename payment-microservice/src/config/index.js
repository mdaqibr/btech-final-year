import Joi from 'joi';

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development','production','test').default('development'),
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  WEBHOOK_SECRET: Joi.string().required(),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
  RATE_LIMIT_MAX: Joi.number().default(100),
  ALLOWED_ORIGINS: Joi.any().default('*')
}).unknown();

const { value: env, error } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET,
  WEBHOOK_SECRET: env.WEBHOOK_SECRET,
  RATE_LIMIT_WINDOW_MS: Number(env.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: Number(env.RATE_LIMIT_MAX),
  ALLOWED_ORIGINS: env.ALLOWED_ORIGINS === '*' ? '*' : String(env.ALLOWED_ORIGINS).split(','),
};

export default config;
