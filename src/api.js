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
    const apiKey = "7XYW7gkNuN1yLVR7lDBAd2QNos27OQfIaYLllYiC";

    console.log("sending: " + action + " to api server with data:");
    console.log(data);
    fetch('https://3zwbp6vz98.execute-api.ap-southeast-2.amazonaws.com/charlie/' + action, {
        method: 'POST',
        body: JSON.stringify(data, null, 2), // Prettify the JSON output
        headers: {'Content-Type': 'application/json', 'x-api-key': apiKey}
    }).then(response => {
        return response.json();
    }).then(data => {
        callback(data);
    }).catch(err => {
        console.error(err);
    });
}



export {apiGET, apiPOST}
