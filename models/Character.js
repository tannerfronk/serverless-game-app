const {model, Schema} = require('mongoose')

const Character = new Schema({
    id: String,
    name: String,
    games: Array,
    description: String,
    akas: Array,
    mugShot: String,
    favorite: Boolean
})


module.exports = model ('character', Character)