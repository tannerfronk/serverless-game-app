const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Game = require('../models/Game')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let gameBody = JSON.parse(event.body)
    let game = await Game.findOne({ id: gameBody.id })
    let allGames

    game.userRating = gameBody.userRating
    let result = await game.save()
        .then(doc => {
            console.log(doc)
            console.log(`Rated ${game.name} ${game.userRating} out of 10`)
        })
        .then(async () => {
            allGames = await Game.find()
        })

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Rated ${game.name} ${game.userRating} out of 10`,
            change: result,
            games: allGames
        })
    }
}