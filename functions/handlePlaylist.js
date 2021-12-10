const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Game = require('../models/Game')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let gameExists = await Game.findOne({ id: event.body.id })
    if (gameExists && event.body.onPlaylist === false){

        // remove from db and send back existing list of games
        const result = await Game.findOneAndDelete({ id: req.body.id })
                .then(async () => {
                    let allGames = await Book.find()
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: 'Book was removed from playlist and DB',
                            games: allGames
                        })
                    }
                })
    } else {
        const newGame = new Game({
            id: event.body.id,
            cover: event.body.cover,
            name: event.body.name,
            companies: event.body.companies,
            summary: event.body.summary,
            first_release_date: event.body.first_release_date,
            esrb_rating: event.body.esrb_rating,
            collection: event.body.collection,
            genre: event.body.genres,
            wikia: event.body.wikia,
            aggregated_rating: event.body.aggregated_rating,
            onPlaylist: event.body.onPlaylist,
            completed: event.body.completed
        })

        // send to DB
        const result = newGame.save()
            .then(doc => {
                console.log(doc)
                console.log(`Added ${newGame.name} to reading list.`)
            })
            .then(async () => {
                let allGames = await Game.find()
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Book was added to playlist',
                        games: allGames
                    })
                }
            })
    }
}