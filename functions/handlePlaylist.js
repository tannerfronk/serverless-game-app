const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Game = require('../models/Game')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let gameBody = JSON.parse(event.body)
    let allGames
    
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
            id: gameBody.id,
            cover: gameBody.cover.url,
            name: gameBody.name,
            companies: gameBody.companies,
            summary: gameBody.summary,
            first_release_date: gameBody.first_release_date,
            esrb_rating: gameBody.esrb_rating,
            gameCollection: gameBody.collection.name,
            genre: gameBody.genres,
            wikia: gameBody.wikia,
            aggregated_rating: gameBody.aggregated_rating,
            onPlaylist: true,
            completed: gameBody.completed
        })

        // send to DB
        const result = await newGame.save()
            .then(doc => {
                console.log(`Added ${newGame.name} to playlist.`)
            })
            .then(async () => {
                allGames = await Game.find()
            })
            
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'game was added to playlist',
                games: allGames
            })
        }
    }
}