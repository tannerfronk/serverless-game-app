const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Character = require('../models/Character')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let favoriteCharacters = await Character.find({ favorite: true })

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Successfully retrieved favorite characters.',
            characters: favoriteCharacters
        })
    }
}