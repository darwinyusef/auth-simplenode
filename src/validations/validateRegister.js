const Joi = require('@hapi/joi');


const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    user: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
    email: Joi.string().min(6).max(255).email(),
    age: Joi.number(),
})

module.exports = schemaRegister;


