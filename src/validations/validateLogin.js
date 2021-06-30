const Joi = require('@hapi/joi');

const schemaLogin = Joi.object({
    connect: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required()
})

module.exports = schemaLogin;