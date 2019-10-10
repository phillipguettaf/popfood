const AWS = require('aws-sdk');

exports.handler = async (event) => {
    
    AWS.config.update({
      region: "ap-southeast-2",
      accessKeyId: "AKIAZMEZFZSHI62RZTX5",
      secretAccessKey: "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" 
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var table = "rest";
    
    
    var params = {
        TableName:table,
        ScanIndexForward: false,
    };
    
    console.log("Getting restaurants...");
    return new Promise((resolve, reject) => {
        docClient.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
                resolve(err);
            } else {
                console.log("Got items:", JSON.stringify(data, null, 2));
                data.Items.sort((a, b) => {
                    if (a.aveRating > b.aveRating) {return -1}
                    else if (a.aveRating < b.aveRating) {return 1}
                    else return 0
                });
                var results = data.Items.slice(0,4);
                
                resolve(results);
            }
        });
    });
};
