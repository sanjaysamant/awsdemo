const dynamodb = require('./dynamodb');

module.exports.list = function(event,context,callback){
    const params = {
        TableName : process.env.DYNAMODB_TABLE
    }
    dynamodb.scan(params,(error,result)=>{
        if(error){
            console.error(error);
            callback(new Error('Can not fetch the kra list.'));
        }
        else{
            const Response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify(result)
            };
            callback(null,Response);
        }
    });
}