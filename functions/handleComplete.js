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
    if ((gameExists && !gameBody.completed && !gameBody.onPlaylist)){

        // remove from db and send back existing list of games
        const result = await Game.findOneAndDelete({ id: gameBody.id })
                .then(doc => {
                    console.log(`${gameExists.name} was removed from completed list and DB`)
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
                onPlaylist: false,
                completed: true
            })
    
            // send to DB
            const result = await newGame.save()
                .then(doc => {
                    console.log(`Added ${newGame.name} to completed list.`)
                })
                .then(async () => {
                    allGames = await Game.find()
                })
    
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'game was added to completed list',
                    games: allGames
                })
            }
        } else {

            gameExists.completed = !gameExists.completed

            let result = await gameExists.save()

            console.log(`${gameExists.completed ? `${gameExists.name} is now marked as complete` : `${gameExists.name} has been removed from completed list`}`)

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `${gameExists.completed ? `${gameExists.name} is now marked as complete` : `${gameExists.name} has been removed from completed list`}`,
                    games: allGames,
                    change: result
                })
            }
        }
    }
}