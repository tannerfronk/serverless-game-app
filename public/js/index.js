(function (window) {

    const clientID = 'm0wt6yc28s2jcn0xgw5jdehpgipc2t'
    let searchField = document.querySelector('#gameSearchField')
    let searchBtn = document.querySelector('#gameSearchBtn')
    let accessToken // initialize but don't assign until it has been generated or found

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
            })
    }

    // event listeners for search function
    searchBtn.addEventListener('click', search)
    searchField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            search()
        }
    })

})(window)