const Joi = require("joi");

exports.validateEmail = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate({ email: body.email });
};

exports.validatePassword = (body) => {
  const schema = Joi.object({
    password: Joi.string().min(6).max(18).required(),
  });
  return schema.validate({ password: body.password });
};

exports.validatePost = (body) => {
  const schema = Joi.object({
    title: Joi.string().min(10).max(128).required(),
    content: Joi.string().min(10).max(50000).required(),
  });
  return schema.validate({
    title: body.title,
    content: body.content,
  });
};
