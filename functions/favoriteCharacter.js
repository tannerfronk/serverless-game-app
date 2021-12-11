const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const Character = require('../models/Character')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

exports.handler = async function (event, context) {
    let character = JSON.parse(event.body)
    let allCharacters

    let charExists = await Character.findOne({ id: character.id })
    if(charExists){

        const result = await Character.findOneAndDelete({ id: character.id })
        .then(doc => {
            console.log(`${charExists.name} has been removed from favorites list.`)
        })
        .then(async () => {
            allCharacters = await Character.find()
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `${character.name} has been removed from favorites list.`,
                characters: allCharacters
            })
        }
    } else {
        const newChar = new Character({
            id: character.id,
            name: character.name,
            games: character.games,
            description: character.description,
            akas: character.akas,
            mugShot: character.mugShot,
            favorite: true
        })

        const result = await newChar.save()
            .then(doc => {
                console.log(`Added ${character.name} to favorites.`)
            })
            .then(async () => {
                allCharacters = await Character.find()
            })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Added ${character.name} to favorites.`,
                characters: allCharacters
            })
        }
    }
}