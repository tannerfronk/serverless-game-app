const clientID = process.env.TWITCH_CLIENT
const clientSecret = process.env.TWITCH_SECRET
const fetch = require('node-fetch')

exports.handler = async function (event, context) {

    await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: "POST",
    })
    .then(res => res.json())
    .then(data => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Generated Token",
                token: data.access_token,
                expires: data.expires_in
            })
        }
    })
}