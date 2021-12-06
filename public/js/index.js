(function (window) {

    const clientID = 'm0wt6yc28s2jcn0xgw5jdehpgipc2t'
    let searchField = document.querySelector('#gameSearchField')
    let searchBtn = document.querySelector('#gameSearchBtn')
    let accessToken // initialize but don't assign until it has been generated or found
    let searchResults
    let searchResultsDiv = document.querySelector('#searchResults')
    let resultsNumDiv = document.querySelector('#resultsNum')

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
        resultsNumDiv.innerHTML = ''
        searchResultsDiv.innerHTML = ''

        let searchObj = {
            keyword: searchField.value,
            token: accessToken
        }

        fetch('/.netlify/functions/searchGames', {
            method: 'POST',
            body: JSON.stringify(searchObj)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.result)
                searchResults = data.result
                appendSearchResults()
            })
    }

    // event listeners for search function
    searchBtn.addEventListener('click', search)
    searchField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            search()
        }
    })

    function appendSearchResults() {

        resultsNum = `Results Found: ${searchResults.length}`
        console.log(resultsNum)
        resultsNumDiv.innerHTML = resultsNum
        searchResultsDiv.innerHTML = ''
        searchResults.forEach((game) => {
            searchResultsDiv.innerHTML +=
                `
                <div class="card my-2">
                    <div class="card-body">
                    <img src="${game.cover.url}" class="card-img-top my-1 w-25" alt="${game.name} cover">
                        <div class="d-flex flex-column float-end w-25">
                            <button id="${game.id}" buttonFunc="addToReadList" class="btn btn-secondary float-end mb-2">Add to List</button>
                            <button id="${game.id}" buttonFunc="completeBook" class="btn btn-secondary float-end">I have played this</button>
                        </div>
                        <h5 class="card-title">${game.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${game.summary ?? 'No Description'}</h6>
                        <p class="card-text">First published: ${game.year ?? 'Unknown'}</p>
                    </div>
                </div>
            `
        })
    }

})(window)