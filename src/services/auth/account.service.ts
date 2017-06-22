/*
 * This file is for authentication service.
 *
 * @author    RAJASEKAR SANKAR<rajasekar.sankar@osscube.com>
 *
 * Create some services for the authencation flow
 */

import {Injectable} from '@angular/core';
import {Config} from '../../config/config'
import {Logger} from './logger.service';
import * as sjcl from 'sjcl';

declare const AWS: any;
declare const AWSCognito: any;

/**
 * @UserState : Assign the login status
 * @default
 * 
 */

export enum UserState {
  SignedOut = 0,
  SignedIn = 1,
  InvalidCredentials = 2
}
/**
 * @IUserLogin : initiate the varaible for login
 *  
 */
export interface IUserLogin {
  username?: string;
  password?: string;
  errorusername?:string;
  errorpassword?:string;
}

interface IUserAttribute {
  Name: string;
  Value: string;
}
/**
 * CognitoUtil : Class to get the confugaration value and 
 *               assigned some local storage valuess
 *
 * 
 */
@Injectable()
export class CognitoUtil {

  private static _USER_POOL_ID = Config['USER_POOL_ID'];
  private static _CLIENT_ID: string = Config['CLIENT_ID'];
  private static _IDENTITY_POOL_ID: string = Config['IDENTITY_POOL_ID'];
  private static _REGION: string = Config['REGION'];
  private static _AWS_KEY : string = Config['AWS_KEY'];
  private static _SECRET_ACCESS :string = Config['SECRET_ACCESS'];


  public static getRegion(): string {
    return CognitoUtil._REGION;
  }

  public static getClientId(): string {
    return CognitoUtil._CLIENT_ID;
  }

  public static getIdentityPoolId(): string {
    return CognitoUtil._IDENTITY_POOL_ID;
  }

  public static getUserPoolId(): string {
    return CognitoUtil._USER_POOL_ID;
  }

  public static getCognitoIdentityId(): string {
    return AWS.config.credentials.identityId;
  }

  public static getUsername(): string {
    // Retrieve username from local storage. Return null if it does not exist
    return LocalStorage.get('userName');
  }

  public static setUsername(username: string) {
      // set Username in local storage
    LocalStorage.set('userName', username);
  }

  public static getUserId(): string {
    // Retrieve user ID from local storage. Return null if it does not exist
    return LocalStorage.get('userId');
  }

  public static getUserProfile(): Object {
    // Retrieve user profile attributes from local storage
    return LocalStorage.getObject('userProfile');
  }

  public static getUserGroup(): string {
    // Retrieve the user group from the local storage
    return LocalStorage.get("userGroup");
  }
  public static getUserLoginState() : string {
        // Retrieve user state from local storage. Return null if it does not exist
    return LocalStorage.get("userState");
  }
  public static getUserState(): UserState {
    // Retrieve user state from local storage. Return null if it does not exist
    switch (parseInt(LocalStorage.get('userState'))) {
      case 0:
        return UserState.SignedOut;
      case 1:
        return UserState.SignedIn;
      case 2:
        return UserState.InvalidCredentials;
      default:
        return null;
    }
  };

  public static setUserState(userState: UserState) {
      // Set user state in the local storage
    LocalStorage.set('userState', JSON.stringify(userState));
  }


  public static getUserPool() {
    // Initialize Cognito User Pool
    let poolData: Object = {
      UserPoolId: CognitoUtil._USER_POOL_ID,
      ClientId: CognitoUtil._CLIENT_ID
    };
    AWSCognito.config.region = CognitoUtil._REGION;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID
    });

    // Set Cognito Identity Pool details
    AWS.config.region = CognitoUtil._REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID
    });

    // Initialize AWS config object with dummy keys - required if unauthenticated access is not enabled for identity pool
    AWSCognito.config.update({accessKeyId: CognitoUtil._AWS_KEY, secretAccessKey: CognitoUtil._SECRET_ACCESS});    
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  }

  public static getCognitoUser() {
      // Intiate the Cognito User
    let username = LocalStorage.get('userName');

    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
    };
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  }

  public static getCurrentUser() {
    return CognitoUtil.getUserPool().getCurrentUser();
  }
}
/**
 * UserLoginService : Class for login functionalites
 * 
 * 
 */
@Injectable()
export class UserLoginService {
  private static _userTokens = {
    accessToken: undefined,
    idToken: undefined,
    refreshToken: undefined
  };

  public static getAccessToken() {
    let accessToken: string = UserLoginService._userTokens.accessToken;
    if (!accessToken) {
      // retrieve from Local Storage if it exists
      accessToken = LocalStorage.get('userTokens.accessToken');
      UserLoginService._userTokens.accessToken = accessToken;
    }
    return accessToken;
  };

  public static getIdToken() {
    let idToken: string = UserLoginService._userTokens.idToken;
    if (!idToken) {
      // retrieve from Local Storage if it exists
      idToken = LocalStorage.get('userTokens.idToken');
      UserLoginService._userTokens.idToken = idToken;
    }
    return idToken;
  };

  public static getRefreshToken() {
    let refreshToken: string = UserLoginService._userTokens.refreshToken;
    if (!refreshToken) {
      // retrieve from Local Storage if it exists
      refreshToken = LocalStorage.get('userTokens.refreshToken');
      UserLoginService._userTokens.refreshToken = refreshToken;
    }
    return refreshToken;
  }

  public static getAwsAccessKey() {
    if (AWS.config.credentials == null) {
      return LocalStorage.get('userTokens.awsAccessKeyId');
    }
    return AWS.config.credentials.accessKeyId || LocalStorage.get('userTokens.awsAccessKeyId');
  }

  public static getAwsSecretAccessKey() {
    return AWS.config.credentials.secretAccessKey || LocalStorage.get('userTokens.awsSecretAccessKey');
  }

  public static getAwsSessionToken() {
    return AWS.config.credentials.sessionToken || LocalStorage.get('userTokens.awsSessionToken');
  }

  private static clearUserState() {
    // Clear user tokens
    UserLoginService._userTokens = {
      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined
    };

    LocalStorage.set('userTokens.accessToken', null);
    LocalStorage.set('userTokens.idToken', null);
    LocalStorage.set('userTokens.refreshToken', null);
    LocalStorage.set('userTokens.awsAccessKeyId', null);
    LocalStorage.set('userTokens.awsSecretAccessKey', null);
    LocalStorage.set('userTokens.awsSessionToken', null);

    // Clear user state
    CognitoUtil.setUserState(UserState.SignedOut);

    // Clear user profile attributes
    LocalStorage.set('userProfile', null);

    // Clear username and user ID attributes
    LocalStorage.set('userId', null);
    LocalStorage.set('userName', null);
  };


/**
 * 
 * @param userLogin 
 * Call the default function authenticateUser
 */
  public static signIn(userLogin: IUserLogin): Promise<void> {
    let authenticationData = {
      Username: userLogin.username,
      Password: userLogin.password
    };
    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    // Set user name
    CognitoUtil.setUsername(userLogin.username);
    console.log('Authenticating user ' + userLogin.username);

    let cognitoUser = CognitoUtil.getCognitoUser();
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {authenticationDetails
          console.debug(result);
          // Save user tokens to local state
          UserLoginService._userTokens.accessToken = result.getAccessToken().getJwtToken();
          UserLoginService._userTokens.idToken = result.getIdToken().getJwtToken();
          UserLoginService._userTokens.refreshToken = result.getRefreshToken().getToken();


          LocalStorage.set('userTokens.idToken', UserLoginService._userTokens.idToken);
          console.log('%cCognito User Pools Identity Token: ', Logger.LeadInStyle, UserLoginService.getIdToken());
          LocalStorage.set('userTokens.accessToken', UserLoginService._userTokens.accessToken);
          console.log('%cCognito User Pools Access Token: ', Logger.LeadInStyle, UserLoginService.getAccessToken());
          LocalStorage.set('userTokens.refreshToken', UserLoginService._userTokens.refreshToken);
          console.log('%cCognito User Pools Refresh Token: ', Logger.LeadInStyle, UserLoginService.getRefreshToken());

          /*
           Extract the user group from the identity token.
           First, get the identity token payload and then perform a Base64 decoding
           so you can later extract the user group.
           */
          let idTokenPayload = UserLoginService._userTokens.idToken.split('.')[1];
          let payload = JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.base64url.toBits(idTokenPayload)));
          let userGroup = payload["cognito:groups"];
          if (userGroup && userGroup.length > 0) {
            LocalStorage.set('userGroup', userGroup);
          } else {
            /*
              The user group is set only for the pre-defined users. By default
              we assign them to client group.
             */
            userGroup = 'clientGroup';
            LocalStorage.set('userGroup', userGroup);
          }
          console.log('%cCognito User Pools User Groups :' + '%c%s belongs to group %s', Logger.LeadInStyle, "black",
            userLogin.username, userGroup);

          // Set user state to authenticated
          CognitoUtil.setUserState(UserState.SignedIn);

          // Read user attributes and write to console
          UserProfileService.getUserAttributes().then(() => {
            UserLoginService.getAwsCredentials().then(() => {
              LocalStorage.set('userId', CognitoUtil.getCognitoIdentityId());
              console.log('%cCognito Identity ID: ', Logger.LeadInStyle, CognitoUtil.getCognitoIdentityId());
              LocalStorage.set('userTokens.awsAccessKeyId', AWS.config.credentials.accessKeyId);
              console.log('%cAWS Access Key ID: ', Logger.LeadInStyle, AWS.config.credentials.accessKeyId);
              LocalStorage.set('userTokens.awsSecretAccessKey', AWS.config.credentials.secretAccessKey);
              console.log('%cAWS Secret Access Key: ', Logger.LeadInStyle, AWS.config.credentials.secretAccessKey);
              LocalStorage.set('userTokens.awsSessionToken', AWS.config.credentials.sessionToken);
              console.log('%cAWS Session Token: ', Logger.LeadInStyle, AWS.config.credentials.sessionToken);
            });
            resolve();
          }).catch((err) => {
            reject(err);
          });
        },
        onFailure: function (err) {
          // Check for user not confirmed excgetCognitoUsereption
            CognitoUtil.setUserState(UserState.InvalidCredentials);
          reject(err);
        },

        mfaRequired: function(codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this)
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;
            delete userAttributes.phone_number_verified;
            var newPassword = prompt('Please Enter New Password' ,'');
            // Get these details and call
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }
      });
    });
    return promise;
  }
/**
 * sign out from the service and clear the state
 */

  public static signOut() {
    // Clear local user state
    UserLoginService.clearUserState();
    // Logout from Cognito service
    CognitoUtil.getCognitoUser().signOut();
    AWS.config.credentials.clearCachedId();
  }

  public static globalSignOut() {
    // Clear local user state
    UserLoginService.clearUserState();
    // Logout from Cognito service
    CognitoUtil.getCognitoUser().globalSignOut();
    AWS.config.credentials.clearCachedId();
  }
 /**
  * 
  * @param previousPassword 
  * @param proposedPassword 
  */
  public static changePassword(previousPassword: string, proposedPassword: string): Promise<void> {
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // first, load the valid tokens cached in the local store, if they are available
      // see: https://github.com/aws/amazon-cognito-identity-js/issues/71
      let cognitoUser = CognitoUtil.getCognitoUser();
      cognitoUser.getSession((err: Error, session: any) => {
        if (err) {
          reject(err);
          return;
        }
        cognitoUser.changePassword(previousPassword, proposedPassword, (err: Error, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
    return promise;
  }
  /**
   * 
   * @param username 
   */
  public static forgotPassword(username: string): Promise<void> {
    // Set target username
    CognitoUtil.setUsername(username);

    // Get Cognito User with session
    let cognitoUser = CognitoUtil.getCognitoUser();

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          console.log('Initiated reset password for username ' + username);
          resolve(result);
        },
        onFailure: (err) => {
          console.log('Failed to initiate reset password for username ' + username);
          reject(err);
          return;
        }
      });
    });
    return promise;
  }
/**
 * 
 * @param username 
 * @param verificationCode 
 * @param password 
 */
  public static confirmForgotPassword(username: string, verificationCode: string, password: string): Promise<void> {
    // Set target username
    CognitoUtil.setUsername(username);

    // Get Cognito User with session
    let cognitoUser = CognitoUtil.getCognitoUser();

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: (result) => {
          console.log('Password successfully reset for username ' + username);
          resolve(result);
        },
        onFailure: (err) => {
          console.log('Password was not reset for username ' + username);
          console.log(`Error: ${err.name}. ${err.message}`);
          reject(err);
          return;
        }
      });
    });
    return promise;
  }

  public static getAwsCredentials(): Promise<void> {
    // TODO: Integrate this method as needed into the overall module
    let logins = {};

    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      // Check if user session exists
      CognitoUtil.getCognitoUser().getSession((err: Error, result: any) => {
        if (err) {
          reject(err);
          return;
        }


        logins['cognito-idp.' + CognitoUtil.getRegion() + '.amazonaws.com/' + CognitoUtil.getUserPoolId()] = result.getIdToken().getJwtToken();

        // Add the User's Id token to the Cognito credentials login map
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: CognitoUtil.getIdentityPoolId(),
          Logins: logins
        });

        // Call refresh method to authenticate user and get new temp AWS credentials
        if (AWS.config.credentials.needsRefresh()) {
          AWS.config.credentials.clearCachedId();
          AWS.config.credentials.get((err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        } else {
          AWS.config.credentials.get((err) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }
            resolve();
          });
        }
      });
    });
    return promise;
  }
}
export class UserProfileService {
  public static getUserAttributes() {
    let promise: Promise<Object> = new Promise<Object>((resolve, reject) => {
      let cognitoUser = CognitoUtil.getCognitoUser();
      cognitoUser.getSession((err: Error, session: any) => {
        if (err) {
          reject(err);err
          return;
        }
        cognitoUser
        cognitoUser.getUserAttributes((err: Error, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          let userAttributes = {};

          for (var i = 0; i < result.length; i++) {
            userAttributes[result[i].getName()] = result[i].getValue();
          }
          console.log('%cCognito User Pools User Attributes: ', Logger.LeadInStyle, userAttributes);
          // Write user profile attributes to local storage
          LocalStorage.setObject('userProfile', userAttributes);
          resolve(userAttributes);
        });
      })
    });
    return promise;
  }
}
/**
 * Class for Local storage the values
 */
@Injectable()
export class LocalStorage {

  private static getLocalStorage() {
    let storage = window.localStorage || localStorage;
    if (!localStorage) {
      throw new Error('Browser does not support local storage');
    }
    return storage;
  }

  public static set(key: string, value: string): void {
    LocalStorage.getLocalStorage().setItem(key, value);
  }

  public static get(key: string): string {
    return LocalStorage.getLocalStorage().getItem(key);
  }

  public static setObject(key: string, value: any): void {
    LocalStorage.set(key, JSON.stringify(value));
  }

  public static getObject(key: string): any {
    return JSON.parse(LocalStorage.get(key) || '{}');
  }

  public static remove(key: string): any {
    LocalStorage.getLocalStorage().removeItem(key);
  }
}
export const LOCAL_STORAGE_PROVIDERS: any[] = [
  {provide: LocalStorage, useClass: LocalStorage}
];
