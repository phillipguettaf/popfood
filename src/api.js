function apiGET(action, callback) {
    // URL Of the API server, needs to be changed on deployment
    //fetch('http://localhost:8080/' + action, {
    fetch('https://popfood-api.ap-southeast-2.elasticbeanstalk.com:80/' + action, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).then(data => {
        callback(data);
    }).catch(err => {
        console.error(err);
    });
}

function apiPOST(action, data, callback) {
    // URL Of the API server, needs to be changed on deployment
    //fetch('http://localhost:8080/' + action, {
    console.log("sending: " + action + " to api server")
    fetch('https://popfood-api.ap-southeast-2.elasticbeanstalk.com:80/' + action, {
        method: 'POST',
        body: JSON.stringify(data, null, 2), // Prettify the JSON output
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).then(data => {
        callback(data);
    }).catch(err => {
        console.error(err);
    });
}



export {apiGET, apiPOST}
