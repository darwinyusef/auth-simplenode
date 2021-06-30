const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    user: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    email: {
        type: String,
        required: false,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        required: false,
    },
    status: {
        type: Boolean,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema);