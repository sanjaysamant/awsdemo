import { Component, OnInit } from '@angular/core';
import {
   UserLoginService, IUserLogin, UserState, CognitoUtil,LocalStorage
} from '../../../../services/auth/account.service';
import {Router} from '@angular/router';
import { KraService } from '../../../../services/kra/kra.service';
import 'rxjs/add/operator/map';
import {Http, Response} from '@angular/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
 providers:[KraService]
})
export class SidebarComponent implements OnInit {
 public user_list:any = {} ;
   isActive = false;
    showMenu = '';
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
    Logout(){
        UserLoginService.signOut();
        this.router.navigate(['/login']);
    }
  constructor(private router: Router,private kraService: KraService) { }

  ngOnInit() {
    //    this.kraService.getGroup().then(data => this.user_list = data);
       this.kraService.getUserInfo().then(data => this.user_list = data);
      // console.log("asdaddsadas----------",JSON.stringify( this.user_list) );
  }

}



