const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Token = require('../models/Token')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    const token = await Token.find()
    let expiredSeconds = token[0].expires_in
    let now = new Date(Date.now())
    let expiredDate = now.setSeconds(now.getSeconds() + expiredSeconds)

    if(expiredDate < now){

        // delete token if it has expired and send message
        await Token.deleteOne({ token: token[0].token })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'token expired'
            })
        }

    } else {
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'token found',
                token: token[0].token,
                expires: token[0].expires_in
            })
        }
    }
}