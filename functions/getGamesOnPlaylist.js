const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Game = require('../models/Game')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let gamesOnPlaylist = await Game.find({ onPlaylist: true })

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Successfully returned games on playlist.',
            games: gamesOnPlaylist
        })
    }
}