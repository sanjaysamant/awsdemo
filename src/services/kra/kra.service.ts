import { Injectable } from '@angular/core';
import { Http, Response,Headers,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil, LocalStorage, UserLoginService, IUserLogin, UserState } from '../../services/auth/account.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class KraService {
  public tempData:any= {};

  constructor (
    private http: Http
  ) {}

  public getKra(): Promise<any> {
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get('https://5kvdogzucc.execute-api.us-east-1.amazonaws.com/dev/kra/read')
    .map((res:Response) =>  res.json())
    .catch(this.handleError).toPromise();
  }
  public getEmployee(): Promise<any> {
    var headers = new Headers();
    
    headers.append('Access-Control-Allow-Headers','Content-Type,Authorization')
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let tokenId = LocalStorage.get('userTokens.idToken');
    
    headers.append('Authorization',tokenId);
    const options = new RequestOptions({ headers: headers })
    return this.http.get('https://5kvdogzucc.execute-api.us-east-1.amazonaws.com/dev/employee/read')
    .map((res:Response) =>  res.json())
    .catch(this.handleError).toPromise();
  }
  
  public uploadkra(insertdata,imagurl): any{
    let created_by = CognitoUtil.getUsername();
    console.log(imagurl)
    var json = {KRA_name:insertdata.KRA_Name,created_by:created_by,desc:insertdata.KRA_Description,image:imagurl};
    var params = json;
    return this.http.post('https://h2nzgizz2b.execute-api.us-east-1.amazonaws.com/dev/',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}

public addgroup(insertdatagroup,imagurl,emp_data): any{
    let created_by = CognitoUtil.getUsername();

    var json = {group_name:insertdatagroup.value.Group_Name,group_logo:imagurl,start_date:"12/01/2017",
                created_by:created_by,
                member:emp_data,desc:insertdatagroup.value.Group_Description,
                link:insertdatagroup.value.Group_Link};
    var params = json;
       
    return this.http.post('https://5ixbi3wzg4.execute-api.us-east-1.amazonaws.com/production/addgroup',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}

public uploadEmployee(insertdata,imagurl): any{
    let created_by = CognitoUtil.getUsername();
    insertdata.Employee_img = imagurl;
    //console.log(  insertdata)
    var json = {Employee_First_Name:insertdata.Employee_First_Name,Employee_Last_Name:insertdata.Employee_Last_Name,
      Employee_Email:insertdata.Employee_Email,Employee_Mobile:insertdata.Employee_Mobile,
      Employee_Status:insertdata.Employee_Status,Employee_Designation:insertdata.Employee_Designation,
      Employee_img:insertdata.Employee_img};
    var params = json;
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post('https://5kvdogzucc.execute-api.us-east-1.amazonaws.com/dev/employee/add',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}


public getTabData() : any{
  return this.http.get('tabdata.json')
    .map((res:Response) =>  res.json())
    .catch(this.handleError).toPromise();
}

  public getGroup(): Promise<any> {
      let created_by = CognitoUtil.getUsername();
      var params = {username:created_by};
      return this.http.post('https://6c7tssf82f.execute-api.us-east-1.amazonaws.com/production/resource',JSON.stringify(params))
      .toPromise().then(this.extractData)
      .catch(this.handleError);
  }

getUserInfo () {
  
      let userInfo = CognitoUtil.getUserProfile();
      let userProfileInfo = Object.keys(userInfo).map(function(key){return userInfo[key]});
     
      var params = {email:userProfileInfo[2]};
      return this.http.post('https://9sgxi99vp6.execute-api.us-east-1.amazonaws.com/prod/user-full-information',JSON.stringify(params))
      .toPromise().then(this.extractData)
      .catch(this.handleError);
  }
private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

private handleError (error: Response | any) {
  // In a real world app, you might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}

loadEmployees() {
    return this.http.get('https://dk6yyfxf3i.execute-api.us-east-1.amazonaws.com/production/employee')
    .map((res:Response) =>  res.json())
    .catch(this.handleError).toPromise();
  }

  public updateEmployee(insertdata): any{
    let created_by = CognitoUtil.getUsername();
    // insertdata.Employee_img = imagurl;
    //console.log(  insertdata)
    var json = {Employee_First_Name:insertdata.Employee_First_Name,Employee_Last_Name:insertdata.Employee_Last_Name,
      Employee_Email:insertdata.Employee_Email,Employee_Mobile:insertdata.Employee_Mobile,
      Employee_Status:insertdata.Employee_Status,Employee_Designation:insertdata.Employee_Designation,
      Employee_img:insertdata.Employee_img};
    var params = json;
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post('https://5kvdogzucc.execute-api.us-east-1.amazonaws.com/dev/employee/add',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}

public updateEmployeeKra(insertdata,emp_id):any{
  // let created_by = CognitoUtil.getUsername();
    // insertdata.Employee_img = imagurl;
    // console.log( "---"+ JSON.stringify(insertdata))
    var json = {id:emp_id,kra:insertdata};
    var params = json;
    // console.log( "CHECKING"+ JSON.stringify(params))
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post('https://up6aptyti2.execute-api.us-east-1.amazonaws.com/prod/update',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}

public getEmployeeById(insertdata):any{
  // let created_by = CognitoUtil.getUsername();
    // insertdata.Employee_img = imagurl;
    console.log( "EMploye Id ="+ JSON.stringify(insertdata))
    var json = {id:insertdata};
    var params = json;
    // console.log( "CHECKING"+ JSON.stringify(params))
    // var headers = new Headers();
    // headers.append('Content-Type','application/x-www-form-urlencoded');
    // headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post('https://tup9h67yf3.execute-api.us-east-1.amazonaws.com/production/by-id',JSON.stringify(params)).toPromise()
    .then(this.extractData)
    .catch(this.handleError);
}    

}