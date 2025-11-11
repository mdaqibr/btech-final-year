import Joi from 'joi';

/**
 * validateBody(schema) -> middleware
 * schema is Joi schema
 */
export default function validateBody(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next({ status: 400, message: 'Validation error', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
  };
}
