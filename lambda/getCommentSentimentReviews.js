const fetch = require('https');
const gApiKey = "AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4";

exports.handler = async (event) => {
	var contentText;
	if (event.text) {
		contentText = event.text;
	} else {
		contentText = "a";
	}

	var postData = {
		"document": {
			"type": "PLAIN_TEXT",
			"language": "en",
			"content": contentText
		},
		"encodingType": "UTF16"
	};

	
	var url = 'language.googleapis.com';
    var path = '/v1/documents:analyzeSentiment?fields=documentSentiment&key=' + gApiKey;
    postData = JSON.stringify(postData);
    
    var options = {
        "host": url,
        "path": path,
        "headers": {'Content-Type': 'application/json'},
        "method": 'POST'
    };
    
	return new Promise((resolve, reject) => {
    	var req = fetch.request(options, (res) => {
    	    var data = '';
    	    res.on('data', (chunk) => {
    	        data += chunk;
    	    });
    	    res.on('end', () => {
    	        data = JSON.parse(data);
    	        resolve(data);
    	    });
    	    res.on('error', (err) => {
    	        console.error(err);
    	    });
    	});
    	
    	req.on('error', (err) => {
    	    resolve(JSON.parse(err));
    	});
    	req.write(postData);
    	req.end();
	});
};
