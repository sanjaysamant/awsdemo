'use strict';

const uuid = require('uuid');
const dynamodb = require('./dynamodb');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  //console.log(JSON.stringify(event));
  let eventData = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      KRA_name: eventData.KRA_name,
      Id: uuid.v1(),
      created_by: eventData.created_by,
      description: eventData.desc,
      image: eventData.image,
      createdAt: timestamp
    },
  };

  // write the todo to the database
  dynamodb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Some error occurred,while inserting kra.'));
      return;
    }
    else {
      // create a response
      const response = {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin" : "*", 
        "Access-Control-Allow-Credentials" : true
      },
        body: JSON.stringify(params.Item),
      };
      callback(null, response);
    }
  });
};
