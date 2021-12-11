(function (window) {

    const clientID = 'm0wt6yc28s2jcn0xgw5jdehpgipc2t'
    let searchField = document.querySelector('#gameSearchField')
    let searchBtn = document.querySelector('#gameSearchBtn')
    let accessToken // initialize but don't assign until it has been generated or found
    let searchResults
    let searchResultsDiv = document.querySelector('#searchResults')
    let resultsNumDiv = document.querySelector('#resultsNum')
    let searchType = 'Games' // games is the default search
    let searchTypeBtn = document.querySelector('#searchType')
    let loadingSpinner = document.querySelector('#loadingSpinner')
    let games
    let currentView = 'search' // initialize current view for rendering 
    let playlistViewBtn = document.querySelector('#playlistView')
    let completedListViewBtn = document.querySelector('#completedView')

    // event listener for search type toggle
    searchTypeBtn.addEventListener('click', () => {
        if (searchType === 'Games') {
            searchType = 'Characters'
        } else if (searchType === 'Characters') {
            searchType = 'Games'
        }
        searchTypeBtn.innerHTML = `Search by ${searchType}`
        searchField.placeholder = `Search for ${searchType}!`
    })

    // event listener for view changing buttons
    playlistViewBtn.addEventListener('click', () => currentView = 'playlist')
    completedListViewBtn.addEventListener('click', () => currentView = 'completed')

    // call function to generate access token for IGDB
    function generateAccessToken() {
        fetch('/.netlify/functions/generateToken')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                accessToken = data.token
            })
    }

    // call function to retrieve access token from Mongo for IGDB
    function getAccessToken() {
        fetch('/.netlify/functions/getToken')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message === 'token expired') {
                    generateAccessToken()
                } else {
                    accessToken = data.token
                }
            })
    }
    getAccessToken()

    // search function
    function search() {
        currentView = 'search'
        resultsNumDiv.innerHTML = ''
        searchResultsDiv.innerHTML = ''
        let searchURI

        let searchObj = {
            keyword: searchField.value,
            token: accessToken
        }

        if (searchType === 'Games') {
            searchURI = '/.netlify/functions/searchGames'
        } else if (searchType === 'Characters') {
            searchURI = '/.netlify/functions/searchCharacters'
        }


        loadingSpinner.classList.remove('visually-hidden')

        fetch(searchURI, {
            method: 'POST',
            body: JSON.stringify(searchObj)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.result)
                searchResults = data.result
                if (searchType === 'Games') {
                    appendGameSearchResults()
                } else {
                    appendCharacterSearchResults()
                }
                loadingSpinner.classList.add('visually-hidden')
            })
    }

    // event listeners for search function
    searchBtn.addEventListener('click', search)
    searchField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            search()
        }
    })

    // game result card
    function appendGameSearchResults() {

        resultsNum = `Results Found: ${searchResults.length}`
        resultsNumDiv.innerHTML = resultsNum
        searchResultsDiv.innerHTML = ''
        searchResults.forEach(async (game, index) => {

            searchResultsDiv.innerHTML +=
                `
                <div class="card my-2">
                    <div class="card-body">
                    <img src="${game.cover === undefined ? 'https://via.placeholder.com/300?text=No+Image+Found' : game.cover}" class="card-img-top my-1 w-25" alt="${game.name} cover">
                        <div class="d-flex flex-column float-end w-25">
                            <button id="${game.id}" buttonFunc="handlePlaylist" class="btn btn-secondary float-end mb-2">${game.onPlaylist ? 'On List <i class="fas fa-check"></i>' : 'Add to My List'}</button>
                            <button id="${game.id}" buttonFunc="handleComplete" class="btn btn-secondary float-end mb-2">${game.completed ? 'Completed <i class="fas fa-check"></i>' : 'I Have Played This'}</button>
                            <button id="${game.id}" class="btn btn-secondary float-end" data-bs-toggle="modal" data-bs-target="#rateModal${game.id}">More Info</button>
                        </div>
                        <h5 class="card-title mt-2">${game.name}</h5>
                        <h6 class="card-subtitle mt-2">Developed by: ${game.companies.join(', ')}</h6>
                        <h6 class="card-subtitle my-3 text-muted">${game.summary ?? 'No Description Available'}</h6>
                        <div class="d-flex justify-content-between">
                            <p class="card-text">First published: ${game.releaseDate ? game.releaseDate : 'Unknown'}</p>
                            <p class="card-text text-end">${game.esrbRating !== '' ? 'ESRB Rating: ' + game.esrbRating : "No ESRB Rating Available"}</p>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="rateModal${game.id}" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${game.name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${game.gameCollection ?
                                    `<p class="card-subtitle mb-3">Belongs to the <b>${game.gameCollection}</b> series</p>`
                                    : ''
                                }
                                ${game.genre ?
                                    `<p>Genre(s): ${game.genre.join(', ')}</p>`
                                    : ''
                                }
                                ${game.wikia !== '' ?
                                    `<p class="mt-3">Wikia Page: <a href="${game.wikia}" target="_blank">Click Here</a></p>`
                                    : ''
                                }
                                ${game.aggregatedRating ?
                                    `<p class="mt-3">Average User Rating: ${game.aggregatedRating.toFixed(2)}</a></p>`
                                    : ''
                                }
                                ${game.completed || game.onPlaylist ?
                                    `<p>How would you rate ${game.name} out of 10 stars?</p>
                                                <select id="rate${game.id}">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                </select>`
                                    : ''
                                }
                                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                ${game.completed || game.onPlaylist ?
                                    `<button id="${game.id}" type="button" class="btn btn-primary" buttonFunc="rateGame" data-bs-dismiss="modal">Save Rating</button>`
                                    : ''
                                }
                            </div>
                            </div>
                        </div>
                    </div>
            `
        })
    }

    // character result card
    function appendCharacterSearchResults() {

        resultsNum = `Results Found: ${searchResults.length}`
        resultsNumDiv.innerHTML = resultsNum
        searchResultsDiv.innerHTML = ''
        searchResults.forEach((character) => {
            let games = []
            character.games.forEach((game) => games.push(game.name))

            // get bigger cover
            if (character.mug_shot) {
                getBiggerImageURL(character, character.mug_shot.url, type = 'character')
            }

            searchResultsDiv.innerHTML +=
                `
                <div class="card my-2">
                    <div class="card-body">
                    <img src="${character.mug_shot === undefined ? 'https://via.placeholder.com/300?text=No+Image+Found' : character.mug_shot.url}" class="card-img-top my-1 w-25" alt="${character.name} mug shot">
                        <div class="d-flex flex-column float-end w-25">
                            <button id="${character.id}" buttonFunc="" class="btn btn-secondary float-end mb-2">Add to Favorites</button>
                        </div>
                        <h5 class="card-title mt-1">${character.name}</h5>
                        <h6 class="card-subtitle my-3 text-muted">Appears in: ${games.join(',   ')}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">${character.description ?? 'No Description Available'}</h6>
                        <p class="card-text">AKA: ${character.akas ? character.akas.join(', ') : 'N/A'}</p>
                    </div>
                </div>
            `
        })
    }

    // handle add to list or remove from playlist or completed list
    function handleListUpdate(event, type, url) {
        let gameID = event.target.id
        let game = searchResults.find(game => game.id == gameID)

        if (type == 'onPlaylist') {
            if (!game.onPlaylist) {
                game.onPlaylist = true
            } else {
                game.onPlaylist = false
            }
        } else {
            if (!game.completed) {
                game.completed = true
            } else {
                game.completed = false
            }
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(game),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => res.json())
            .then(data => {
                games = data.games
                console.log(games)

                if (currentView === 'completed') {

                } else if (currentView === 'playlist') {

                } else {
                    appendGameSearchResults()
                }
            })
    }

    // request for rating a game
    function handleRateGame(event) {
        let gameID = event.target.id
        let game = searchResults.find(game => game.id == gameID)
        let rating = document.querySelector('#rate' + gameID).value
        game.userRating = rating
        console.log(gameID)
        console.log('#rate' + gameID)
        console.log(rating)

        fetch('/.netlify/functions/rateGame', {
            method: 'PUT',
            body: JSON.stringify(game),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then(res => res.json())
            .then(data => {
                games = data.games
                console.log(data)
                // displayCompletedList() need to create this function
            })
    }

    document.addEventListener('click', (e) => {
        let attribute = e.target.attributes.buttonFunc
        if (attribute && attribute.value === 'handlePlaylist') {
            let url = '/.netlify/functions/handlePlaylist'
            handleListUpdate(e, 'onPlaylist', url)
        } else if (attribute && attribute.value === 'handleComplete') {
            let url = '/.netlify/functions/handleComplete'
            handleListUpdate(e, 'onComplete', url)
        } else if (attribute && attribute.value === 'rateGame') {
            handleRateGame(e)
        }
    })

})(window)