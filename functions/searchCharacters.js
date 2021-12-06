const clientID = process.env.TWITCH_CLIENT
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    let searchObj = JSON.parse(event.body)
    let search = searchObj.keyword
    let accessToken = searchObj.token
    let result

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
            result = data
        })

    return {
        statusCode: 200,
        body: JSON.stringify({ result })
    }
}