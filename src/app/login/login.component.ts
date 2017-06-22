import { Component, OnInit } from '@angular/core';
import {
  UserLoginService, IUserLogin, UserState, CognitoUtil, LocalStorage
} from '../../services/auth/account.service';
import { Config } from '../../config/config';
import { Message } from '../../constants/message';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {TranslateService} from '../../services/translate';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_error_message:Array<string> = [];

  //username = Message.USERNAME_REQUIRED;
  public userData: IUserLogin = {
    username: '',
    password: ''
    };
  public errorData:IUserLogin = {
    errorusername : Message.USERNAME_REQUIRED,
    errorpassword : Message.PASSWORD_REQUIRED
  };
  signInButtonClicked: boolean = false;

  public translatedText: string;
  public supportedLanguages: any[];



  onSignIn(form) {
    this.signInButtonClicked = true;
    //console.log(form);
    if (form && form.valid) {
      this.slimLoadingBarService.start(() => {
            console.log('Loading complete');
        });
        
      this.login();
    }
   
  }
  login(): void {
    // prevent multiple clicks
    UserLoginService.signIn(this.userData)
    .then(() => {
      //console.log(userProfile)
      LocalStorage.get('userProfile');
      // Login was successful
        this.router.navigate(['/dashboard']);
    }).catch((err: Error): void => {
      // Login was unsuccessful
      this.displayAlertError(err);

    });
  }
  displayAlertError(err: Error) {
    switch (CognitoUtil.getUserState()) {
    case UserState.InvalidCredentials:
      console.log('Sign-in failed: ' + err);
      let errorMessage = `${err}`;
      this.showLoginFailureAlert(this.userData.username, errorMessage);
      break;
    default:
      console.log('Sign-in failed: ' + err);
      errorMessage = `The login failed: ${err}`;
      this.showLoginFailureAlert(this.userData.username, errorMessage);
      break;
    }
  }
  

  showLoginFailureAlert(username: String, message: String): any {
    this.login_error_message = message.split(":") ;
    this.slimLoadingBarService.complete();
    
  }

  constructor(private _translate: TranslateService, private router: Router,private slimLoadingBarService: SlimLoadingBarService) {}


  ngOnInit() {
    
    this.supportedLanguages = [
      
      {'display': 'English', 'value': 'en'},
      {'display': '日本語', 'value': 'ja'},
    ];
    this.selectLang('en');

    this.slimLoadingBarService.stop();
  }

  isCurrentLang(lang: string){

    return lang === this._translate.currentLang;
  }

  selectLang(lang: string){

    this._translate.use(lang);
    this.refreshText();
  }

  refreshText() {

    this.translatedText = this._translate.instant('hello world');
  }
}
