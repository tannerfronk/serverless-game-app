let token
let expiration
let callData
let now = new Date(Date.now())
const clientID = process.env.TWITCH_CLIENT
const clientSecret = process.env.TWITCH_SECRET
const fetch = require('node-fetch')

exports.handler = async function (event, context) {

    if(expiration === undefined || expiration < Date.now()){

            await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, {
                method: "POST",
            })
            .then(res => res.json())
            .then(data => {
                token = data.access_token
                expiration = now.setSeconds(now.getSeconds() + data.expires_in)
                callData = data
            })

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: callData
                })
            }
            
            
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Token is not expired: ${token}`
            })
        }
    }
}