const {model, Schema} = require('mongoose')

const Game = new Schema({
    id: String,
    cover: String,
    name: String,
    companies: Array,
    summary: String,
    first_release_date: String,
    esrb_rating: String,
    collection: String,
    genre: Array,
    wikia: String,
    aggregated_rating: String,
    onPlaylist: {
        required: true,
        type: Boolean,
    },
    completed: {
        required: true,
        type: Boolean
    }
})


module.exports = model ('game', Game)