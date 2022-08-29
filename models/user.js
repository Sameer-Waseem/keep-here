const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, min: 3, max: 50, required: true },
  last_name: { type: String, min: 3, max: 50, required: true },
  email: { type: String, lowercase: true, unique: true, required: true },
  phone: { type: Number, required: true },
  password: { type: String, min: 3, max: 50, required: true },
});

const User = mongoose.model("User", userSchema);

function validateRegister(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(50).required(),
    last_name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    password: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateLogin = validateLogin;
module.exports.validateRegister = validateRegister;
