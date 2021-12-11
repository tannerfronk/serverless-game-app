const clientID = process.env.TWITCH_CLIENT
const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    let searchObj = JSON.parse(event.body)
    let search = searchObj.keyword
    let accessToken = searchObj.token
    let result
    
    let ratings = {
        6: 'RP',
        7: 'EC',
        8: 'E',
        9: 'E10',
        10: 'T',
        11: 'M'
    }

    function getBiggerImageURL(obj, url) {
        let imageURL = url.split('/')
        imageURL[6] = 't_cover_big'
        imageURL = imageURL.join('/')
        obj.cover.url = imageURL

        return obj
    }

    await fetch(`https://api.igdb.com/v4/games?search=${search}&limit=200&fields=age_ratings.rating,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection.name,cover.url,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres.name,hypes,involved_companies.company.name,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites.category,websites.url`,
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
            
            data.forEach((game, index) => {
        
                // find esrb rating
                let esrbRating = ''
                if (game.age_ratings) {
                    game.age_ratings.forEach(el => {
                        if (ratings.hasOwnProperty(el.rating)) {
                            return esrbRating = ratings[el.rating]
                        }
                    })
                }
        
                // get involved companies
                let companies = []
                if (game.involved_companies) {
                    game.involved_companies.forEach(el => {
                        if (el.company.name) {
                            companies.push(el.company.name)
                        }
                    })
                }
        
                // get genre(s)
                let genres = []
                if (game.genres) {
                    game.genres.forEach(genre => {
                        genres.push(genre.name)
                    })
                }
        
                // get wikia link
                let wikia = ''
                if (game.websites) {
                    game.websites.forEach(website => {
                        if (website.category == 2) {
                            wikia = website.url
                        }
                    })
                }
        
                // get bigger cover
                if (game.cover) {
                    getBiggerImageURL(game, game.cover.url)
                } else {
                    game.cover = { url: '' } // add url key to game.cover if it doesn't exist.
                }
        
                // null collection name if it doesn't exist
                let collection
                if (!game.collection) {
                    collection = null
                } else {
                    collection = game.collection.name
                }
        
                // create date from unix timestamp
                let date
                if(!isNaN(game.first_release_date)){
                    date = new Date(game.first_release_date * 1000).toLocaleDateString("en-US")
                }

                if(!game.aggregatedRating){
                    game.aggregated_rating = 0
                }
        
                game = {
                    aggregatedRating: game.aggregated_rating,
                    companies: companies,
                    cover: game.cover.url,
                    releaseDate: date,
                    esrbRating: esrbRating,
                    gameCollection: collection,
                    genre: genres,
                    wikia: wikia,
                    id: game.id,
                    name: game.name,
                    summary: game.summary,
                    userRating: ''
                }
                return data[index] = game
            })
            result = data
        })

    return {
        statusCode: 200,
        body: JSON.stringify({ result })
    }
}