const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Game = require('../models/Game')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let completedGames = await Game.find({ completed: true })

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Successfully returned games marked as complete.',
            games: completedGames
        })
    }
}