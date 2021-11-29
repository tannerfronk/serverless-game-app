const {model, Schema} = require('mongoose')

const Token = new Schema({
    token: {
        type: String,
        required: true
    },
    expires_in: {
        type: Number,
        required: true
    }
})

module.exports = model ('token', Token)