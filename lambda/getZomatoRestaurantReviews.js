const fetch = require('https');
const zApiKey = "d436351503c1a24f2215626e78067a16";

exports.handler = async (event) => {
    
	var urlReviewBase = "developers.zomato.com";
	
	var restID = "/api/v2.1/reviews?res_id=" + event.zRest.id;

	var reviewURL = urlReviewBase + restID;
	
	var options = {
	    "host": urlReviewBase,
	    "path": restID,
	    "headers": {'Accept': 'application/json', 'user-key': zApiKey}
	};
    return new Promise((resolve, reject) => {
    	fetch.get(options, (resp) => {
    	    var data = '';
    	    
    	    resp.on('data', (chunk) => {
    	        data += chunk;
    	    });
    	    
    	    resp.on('end', () => {
    	        data = JSON.parse(data);
        		var requestData = event;
        		var responseData = {requestData, data};
        		resolve(responseData);
    	    });
    	    
    	    resp.on('error', (err) => {
    	        console.error(err);
    	    });
    	});
    });
};
