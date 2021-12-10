const {model, Schema} = require('mongoose')

const Game = new Schema({
    id: String,
    cover: String,
    name: String,
    companies: Array,
    summary: String,
    first_release_date: String,
    esrb_rating: String,
    gameCollection: String,
    genre: Array,
    wikia: String,
    aggregated_rating: String,
    onPlaylist: Boolean,
    completed: Boolean
})


module.exports = model ('game', Game)