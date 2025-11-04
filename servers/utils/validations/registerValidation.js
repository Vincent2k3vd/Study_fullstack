const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Username không được để trống",
        "string.min": "Username phải có ít nhất 3 ký tự",
        "any.required": "Username là bắt buộc"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc"
    }),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{7,30}$/)
        .required()
        .messages({
            "string.empty": "Password không được để trống",
            "string.pattern.base": "Password phải có 7–30 ký tự, chỉ gồm chữ và số",
            "any.required": "Password là bắt buộc"
        })
});

module.exports = registerSchema;