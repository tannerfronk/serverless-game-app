const clientID = process.env.TWITCH_CLIENT
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    let searchObj = JSON.parse(event.body)
    let search = searchObj.keyword
    let accessToken = searchObj.token
    let result

    function getBiggerImageURL(obj, url, type) {
        let imageURL = url.split('/')
        imageURL[6] = 't_cover_big'
        imageURL = imageURL.join('/')
        if (type === 'character') {
            obj.mug_shot.url = imageURL
        } else {
            obj.cover.url = imageURL
        }

        return obj
    }

    await fetch(`https://api.igdb.com/v4/characters?search=${search}&limit=200&fields=akas,checksum,country_name,created_at,description,games.name,gender,mug_shot.url,name,slug,species,updated_at,url`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(JSON.stringify({ data }))
            data.forEach((character, index) => {
                // get bigger cover
                if (character.mug_shot) {
                    getBiggerImageURL(character, character.mug_shot.url, type = 'character')
                }
                return data[index] = character
            });
            result = data
        })

    return {
        statusCode: 200,
        body: JSON.stringify({ result })
    }
}