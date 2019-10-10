const AWS = require('aws-sdk');

exports.handler = async (event) => {
    console.log(JSON.stringify(event, null, 2));
    AWS.config.update({
      region: "ap-southeast-2",
      accessKeyId: "AKIAZMEZFZSHI62RZTX5",
      secretAccessKey: "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" 
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var table = "rest";
    
    var item = {
        "zomatoID": "placeholder",
        "aveRating": 0,
        "info": {"googleRestaurant" : "as"}
    }
    
    item.zomatoID = event.zomatoID.toString();
    item.aveRating = event.aveRating;
    item.info = JSON.stringify(event.info, null, 2);
    
    var params = {
        TableName:table,
        Item: item
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                resolve(err);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
};
