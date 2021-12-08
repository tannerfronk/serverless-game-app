const clientID = process.env.TWITCH_CLIENT
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    let searchObj = JSON.parse(event.body)
    let search = searchObj.keyword
    let accessToken = searchObj.token
    let result

    await fetch(`https://api.igdb.com/v4/games?search=${search}&limit=200&fields=age_ratings.rating,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover.url,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres.name,hypes,involved_companies.company.name,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites`,
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