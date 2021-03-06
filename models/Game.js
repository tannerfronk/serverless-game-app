const {model, Schema} = require('mongoose')

const Game = new Schema({
    id: String,
    cover: String,
    name: String,
    companies: Array,
    summary: String,
    releaseDate: String,
    esrbRating: String,
    gameCollection: String,
    genre: Array,
    wikia: String,
    aggregatedRating: Number,
    onPlaylist: Boolean,
    completed: Boolean,
    userRating: String,
})


module.exports = model ('game', Game)