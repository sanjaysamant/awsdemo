import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from './ak.constants';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AKrestService {

  constructor(private http: Http, private config: Configuration) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', this.config.content_type);
    headers.append('Accept', this.config.accept);
   // headers.append('deviceid', this.config.deviceid);
   // headers.append('sid', localStorage.getItem('sid')); 
   // headers.append('role', this.config.role); 
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.config.server+url, {
      headers: headers
    })
    .toPromise()
    .then(res => res.json().data);
  }

  handleError(err) {
    console.log('Error Occured in Kaushal Kishore');
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.config.server+url, data, {
      headers: headers
    });
  }
}
