const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Token = require('../models/Token')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    const token = await Token.find()
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'token found',
            token: token[0].token,
            expires: token[0].expires_in
        })
    }
}