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
    
    let gameExists = await Game.findOne({ id: gameBody.id })
    if ((gameExists && !gameBody.onPlaylist && !gameBody.completed)){

        // remove from db and send back existing list of games
        const result = await Game.findOneAndDelete({ id: gameBody.id })
                .then(doc => {
                    console.log(`${gameExists.name} was removed from playlist and DB`)
                })
                .then(async () => {
                    allGames = await Game.find()
                })

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        games: allGames
                    })
                }
    } else {
        if(!gameExists){
            const newGame = new Game({
                id: gameBody.id,
                cover: gameBody.cover,
                name: gameBody.name,
                companies: gameBody.companies,
                summary: gameBody.summary,
                releaseDate: gameBody.releaseDate,
                esrbRating: gameBody.esrbRating,
                gameCollection: gameBody.gameCollection,
                genre: gameBody.genre,
                wikia: gameBody.wikia,
                aggregatedRating: gameBody.aggregatedRating,
                onPlaylist: true,
                completed: false,
                userRating: ''
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
        } else {

            if(gameExists.onPlaylist){
                gameExists.onPlaylist = false
            } else {
                gameExists.onPlaylist = true
            }

            let result = await gameExists.save()

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `${gameExists.onPlaylist ? `${gameExists.name} is now on playlist` : `${gameExists.name} has been removed from playlist`}`,
                    games: allGames,
                    change: result
                })
            }
        }
    }
}