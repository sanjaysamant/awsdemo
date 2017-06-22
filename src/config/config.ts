
// DO NOT DELETE THIS FILE!!!

//==============================================
// Default configurations
//==============================================

const Config = {

  USER_POOL_ID:               'us-east-1_lNNKREVoe',
  CLIENT_ID:                  '766uau8tu73is3bdg6cseogl0k',
  IDENTITY_POOL_ID:           'us-east-1:0434db1b-ae3d-4ed9-9a23-fe6bb6673c74',
  REGION:                     'us-east-1',  // Your AWS region where you setup your Cognito User Pool and Federated Identities
  AWS_KEY:                    'AKIAI2AWOTJ2LYP5ED7Q',
  SECRET_ACCESS:              '9yS1JUFjOyYYmZzNL3Mgwr2eK2Trph/gSAGdbu1s',  
 
  S3_BUCKET:                  'coachingcouchapp',
  S3_BUCKET_IMAGE_PATH:       'assets/images/', 

  //  API_ENDPOINT:               'https://6jmlncvx8c.execute-api.us-east-1.amazonaws.com/development',

  DEVELOPER_MODE:             false, // enable to automatically login
  CODE_VERSION:               '1.0.0',
  //  DEFAULT_USERNAMES:          ['user1', 'admin1'] // default users cannot change their passwords
};

//==============================================

export { Config }