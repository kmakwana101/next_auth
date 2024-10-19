import Joi from 'joi';

export const userValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
    mobileNumber: Joi.string().pattern(/^\d+$/).min(10).max(15).required().messages({
        "string.pattern.base": "Mobile number must contain only digits",
        "string.min": "Mobile number must be at least 10 digits long",
        "string.max": "Mobile number must not exceed 15 digits",
        "any.required": "Mobile number is required",
    }),
    profileImage: Joi.string().uri().allow(null, '').optional().messages({
        "string.uri": "Invalid URL format for profile image",
    }),
    role: Joi.string().valid("user", "admin").required().messages({
        "any.only": "Role must be either 'user' or 'admin'",
        "any.required": "Role is required",
    }),
    username: Joi.string().min(3).required().messages({
        "string.min": "Username must be at least 3 characters long",
        "any.required": "Username is required",
    }),
});
