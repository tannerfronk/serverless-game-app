(function (window) {
    let searchField = document.querySelector('#gameSearchField')
    let searchBtn = document.querySelector('#gameSearchBtn')
    let accessToken // initialize but don't assign until it has been generated

    function getAccessToken() {
        fetch('/.netlify/functions/generateToken')
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }

    function search() {

    }

    console.log('public script running')

    fetch('/.netlify/functions/helloWorld')
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
})(window)