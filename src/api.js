function apiGET(action, callback) {
    // URL Of the API server, needs to be changed on deployment
    //fetch('http://localhost:8080/' + action, {
    fetch('popfood-api.pdfmrzm3qn.ap-southeast-2.elasticbeanstalk.com:8080' + action, {
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
    fetch('popfood-api.pdfmrzm3qn.ap-southeast-2.elasticbeanstalk.com:8080' + action, {
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
