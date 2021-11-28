(function (window) {
    console.log('public script running')

    fetch('/.netlify/functions/helloWorld')
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
})(window)