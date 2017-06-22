
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {
  CognitoUtil
} from '../services/auth/account.service';
import { URLSearchParams } from "@angular/http"



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app works!';
  isAdminRole(): boolean {
    return CognitoUtil.getUserLoginState() == '1';
  }

  constructor(public router: Router) { }

  ngOnInit() {

    if (this.isAdminRole() == true){

      this.router.navigate(['/dashboard']);
    }
    else{
      
        this.router.navigate(['/login']);
    }
}

}

