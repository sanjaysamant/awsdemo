import { Component, OnInit, Input } from '@angular/core';
// import {Message} from 'primeng/primeng';
import { Message } from '../../../constants/message';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import {
  UserLoginService, IUserLogin, UserState, CognitoUtil,LocalStorage
} from '../../../services/auth/account.service';
import {Config} from '../../../config/config'
import { KraService } from '../../../services/kra/kra.service';
import 'rxjs/add/operator/map';
import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';


declare const AWS: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css'] ,
  providers:[KraService]
})

export class DashboardComponent implements OnInit {

  

    droppedItems:Array<any> = [];
  
    droppedKra:Array<any> = [];

    emp_id:any;
                  
    onItemDrop(event) {
          
      console.log(JSON.stringify(event.dragData));
      this.droppedItems.push(event.dragData)
      return false;
    }

    onKraDrop(event) {
          
          console.log("111"+JSON.stringify(event.dragData));
          this.droppedKra.push(event.dragData)
          
          return false;
    }


    constructor(private slimLoadingBarService: SlimLoadingBarService,private kraService: KraService,private http: Http,private router:Router){

      this.addKraData=new FormGroup({

        "KRA_Name":new FormControl('', [Validators.required]),
        "KRA_Description":new FormControl('', [Validators.required]),
        "KRA_img":new FormControl('')
      });

      this.addGroupData=new FormGroup({

        "Group_Name":new FormControl('', [Validators.required]),
        "Group_Description":new FormControl('', [Validators.required]),
        "Group_Link":new FormControl('', [Validators.required]),
        "GROUP_img":new FormControl('')
      });

      this.addEmployeeData=new FormGroup({
        "Employee_First_Name":new FormControl('',[Validators.required]),
        "Employee_Last_Name":new FormControl('',[Validators.required]),
        "Employee_Email":new FormControl('',[Validators.required, Validators.email]),
        "Employee_Mobile":new FormControl('',[Validators.required]),
        "Employee_Status":new FormControl('',[Validators.required]),
        "Employee_Designation":new FormControl('',[Validators.required]),
        "Employee_img":new FormControl(''),
        // "Employee_KRA":new FormControl('',)
      });

      this.assignKRAData=new FormGroup({
        "Assign_KRA":new FormControl('',[Validators.required])
      });
    }
    imageUploadEventListenerAttached = false;
    profileImageURI : any;
    profileImageDisplay = false;
    submitted: boolean = false;
    myfile:any;
    file:any;
    // file upload
    uploadedFiles: any[] = [];
    addKraData:FormGroup;
    addEmployeeData:FormGroup;

    addGroupData:FormGroup;

    assignKRAData:FormGroup;

    insertedkradata : any;
  //Add KRA
    showKraDialog: boolean = false;
    showEmployeeDialog: boolean = false;
    showGroupDialog: boolean = false;
    showAssignKraDialog: boolean = false;

    // msgs: Message[] = [];
      
    public kra_list:any = {} ;

    public emp_list:any = {} ;

    public group_list:any = {} ;

    public errorMessage:string = "";
    public fileType:Array<any> = ["image/jpeg", "image/jpg", "image/png"];
    //---Validation Area
    /**
     * Defile form fields for validation
     */
    formErrors = {
      'Group_Name': '',
      'Group_Description': '',
      'Group_Link': '',
      'GROUP_img': '',
      'Employee_First_Name': '',
      'Employee_Last_Name': '',
      'Employee_Email': '',
      'Employee_Mobile': '',
      'Employee_Status': '',
      'Employee_Designation': '',
      'KRA_Name': '',
      'KRA_Description': '',
      'KRA_img': '',
    };
    /**
     * fields when change the value
     * @param data 
     */
    onValueChange(data?:any)
    {
      
      const form = this.addEmployeeData; // Form data

      for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        console.log(control);
        if (control && control.dirty && !control.valid) {

          const messages = this.empValidationMessages[field];

          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
                      console.log(this.formErrors[field])

          }
        }
      }
    }

    /**
     * Validation messages for required fields
     */
    empValidationMessages = {
    
      'Employee_First_Name':  Message.EMPLOYEE_FIRST_NAME_REQUIRED,
      'Employee_Last_Name':   Message.EMPLOYEE_LAST_NAME_REQUIRED,
      'Employee_Email':       Message.EMPLOYEE_EMAIL_REQUIRED,
      'Employee_Email_Pattern': Message.EMPLOYEE_EMAIL_PATTERN,
      'Employee_Mobile':      Message.EMPLOYEE_MOBILE_REQUIRED,
      'Employee_Status':      Message.EMPLOYEE_STATUS_REQUIRED,
      'Employee_Designation': Message.EMPLOYEE_DESIGNATION_REQUIRED,
    };

    kraValidationMessages = {

        'KRA_Name':             Message.KRA_NAME_REQUIRED,
        'KRA_Description':      Message.KRA_DESCRIPTION_REQUIRED,
        'KRA_img':              Message.KRA_IMAGE_REQUIRED,
    }

    groupValidationMessages = {

      'Group_Name':           Message.GROUP_NAME_REQUIRED,
      'Group_Description':    Message.GROUP_DESCRIPTION_REQUIRED,
      'Group_Link':           Message.GROUP_LINK_REQUIRED,
      'GROUP_img':            Message.GROUP_IMAGE_REQUIRED,
    }
    //---Validation Area ends here
    public group_emp_list:any = [] ;

    public emp_kra:any = [];

    public emp_kra1:any = [] ;

    public emp_kra2:any = {};

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

    onUpload(event) {
      let file = event.files
      this.uploadedFiles.push(file);
      console.log(file);   
    }

    isAdminRole(): boolean {
      return CognitoUtil.getUserGroup() == 'Manager';
    }


    addEmployee(){

      this.showEmployeeDialog=true;
    }
    addKra(){
      this.showKraDialog=true;
    }

    addgroup(){
      this.showGroupDialog=true;
    }

    assignkra(event){
      console.log("event data="+event);
      // this.selectedParam.emit(event);
      this.emp_id = event;
      this.showAssignKraDialog=true;
    }
    
      
    uploadEmployee() {
      
      if(this.addEmployeeData.valid){

      this.slimLoadingBarService.start(() => {
              console.log('Loading complete');
          });
      this.selectEmployeeImageUsingBrowserFileSelector();
      }
    }


    public kradata = {}

    uploadKra() {
      this.slimLoadingBarService.start(() => {
              console.log('Loading complete');
          });
      this.selectImageUsingBrowserFileSelector();
    }

    uploadFileToS3(file, key) {
      console.log("upload file in s3");;
      AWS.config.accessKeyId = Config.AWS_KEY;
      AWS.config.secretAccessKey = Config.SECRET_ACCESS;
      let bucketName = Config.S3_BUCKET;
      let imagePath = Config.S3_BUCKET_IMAGE_PATH + key
      console.log('Attempting image upload to ', `${bucketName}${Config.S3_BUCKET_IMAGE_PATH}${key}`);
      let s3bucket = new AWS.S3({region: Config.REGION, params: {Bucket: bucketName}});
      let params = {Key: imagePath, Body: file, ACL: 'public-read-write'};
      s3bucket.upload(params, (err, data)=> {
        if (err) {
          let errorMessage = `Error uploading image to S3: ${err}`
          console.log(errorMessage);
          console.log(err);
        } else {
          console.log(`Successfully uploaded image to S3.`,data);
          this.profileImageURI = 'https://s3.amazonaws.com/'+bucketName+'/'+imagePath;
          console.log(`Image can be viewed at: ${this.profileImageURI}`);
          LocalStorage.set('image_path', this.profileImageURI);
          let image = LocalStorage.get("image_path");
          // upload the KRA values after the image has been upload
          this.kraService.uploadkra(this.addKraData.value,image)
          .then(() => {
            this.slimLoadingBarService.complete();
            this.addKraData.reset();
            this.showKraDialog=false;
          }).then(() => {
            this.kraService.getKra().then(data => this.kra_list = data);
            LocalStorage.remove("image_path");
          });
          this.profileImageDisplay = true;
        }
      });
    }

    uploadEmployeeFileToS3(file, key) {
      console.log("upload file in s3");;
      AWS.config.accessKeyId = Config.AWS_KEY;
      AWS.config.secretAccessKey = Config.SECRET_ACCESS;
      let bucketName = Config.S3_BUCKET;
      let imagePath = Config.S3_BUCKET_IMAGE_PATH + key
      console.log('Attempting image upload to ', `${bucketName}${Config.S3_BUCKET_IMAGE_PATH}${key}`);
      let s3bucket = new AWS.S3({region: Config.REGION, params: {Bucket: bucketName}});
      let params = {Key: imagePath, Body: file, ACL: 'public-read-write'};
      s3bucket.upload(params, (err, data)=> {
        if (err) {
          let errorMessage = `Error uploading image to S3: ${err}`
          console.log(errorMessage);
          console.log(err);
        } else {
          console.log(`Successfully uploaded image to S3.`,data);
          this.profileImageURI = 'https://s3.amazonaws.com/'+bucketName+'/'+imagePath;
          console.log(`Image can be viewed at: ${this.profileImageURI}`);
          LocalStorage.set('image_path', this.profileImageURI);
          let image = LocalStorage.get("image_path");
          // upload the Employee values after the image has been upload
          this.kraService.uploadEmployee(this.addEmployeeData.value,image)
          .then(() => {
            this.slimLoadingBarService.complete();
            this.addEmployeeData.reset();
            this.showEmployeeDialog=false;
          }).then(() => {
            this.kraService.getEmployee().then(data => this.emp_list = data);
            LocalStorage.remove("image_path");
          });
          this.profileImageDisplay = true;
        }
      });
    }

    uploadGroupFileToS3(file, key) {
      console.log("upload file in s3");;
      AWS.config.accessKeyId = Config.AWS_KEY;
      AWS.config.secretAccessKey = Config.SECRET_ACCESS;
      let bucketName = Config.S3_BUCKET;
      let imagePath = Config.S3_BUCKET_IMAGE_PATH + key
      console.log('Attempting image upload to ', `${bucketName}${Config.S3_BUCKET_IMAGE_PATH}${key}`);
      let s3bucket = new AWS.S3({region: Config.REGION, params: {Bucket: bucketName}});
      let params = {Key: imagePath, Body: file, ACL: 'public-read-write'};
      s3bucket.upload(params, (err, data)=> {
        if (err) {
          let errorMessage = `Error uploading image to S3: ${err}`
          console.log(errorMessage);
          console.log(err);
        } else {
          console.log(`Successfully uploaded image to S3.`,data);
          this.profileImageURI = 'https://s3.amazonaws.com/'+bucketName+'/'+imagePath;
          console.log(`Image can be viewed at: ${this.profileImageURI}`);
          LocalStorage.set('image_path', this.profileImageURI);
          let image = LocalStorage.get("image_path");
          // upload the Group values after the image has been upload
          this.kraService.addgroup(this.addGroupData,image,this.droppedItems)
          .then(() => {
            this.slimLoadingBarService.complete();
            this.addGroupData.reset();
            this.droppedItems.values = null;
            this.showGroupDialog=false;
          }).then(() => {
            this.kraService.getGroup().then(data => this.group_list = data);
            LocalStorage.remove("image_path");
          });
          this.profileImageDisplay = true;
        }
      });
    }

    selectImageUsingBrowserFileSelector() {

      let selectedFiles : any = document.getElementById('imageUpload')
      let files = selectedFiles.files;
      if(files.length){

        if(this.fileType.includes(files[0].type)){//check the uploading file type exists in required array

          if (selectedFiles.value !== '' && files.length > 0) {
            
            let filename = files[0].name;
            this.uploadFileToS3(files[0], filename);
          } else {

            this.errorMessage = 'Please select an image to upload first.';
            return(this.errorMessage);
          }
        }else{

          this.errorMessage = 'Please select ' + this.fileType.join(" or ") + ' format image.';

          return(this.errorMessage);

        }
      }else{

          this.errorMessage = 'Image field is required';

          return this.errorMessage;

      }

    }

    selectEmployeeImageUsingBrowserFileSelector() {

      let selectedFiles : any = document.getElementById('employeeImageUpload')
      let files = selectedFiles.files;
      console.log(files);
      // var extn = files.split(".").pop();
      if(files.length){
        
        if(this.fileType.includes(files[0].type)){ //check the uploading file type exists in required array

          if (selectedFiles.value !== '' && files.length > 0) {
            
            let filename = files[0].name;
            this.uploadEmployeeFileToS3(files[0], filename);
          } else {

            this.errorMessage = 'Please select an image to upload first.';
            return( this.errorMessage);
          }
        }
        else{

          this.errorMessage = 'Please select ' + this.fileType.join(" or ") + ' format image.';

          return(this.errorMessage);
        }
      }else{

          this.errorMessage = 'Image field is required';

          return this.errorMessage;

      }
    }

    selectGroupImageUsingBrowserFileSelector() {
      
      let selectedFiles : any = document.getElementById('groupimageUpload')
      let files = selectedFiles.files;
      if(files.length){

        if(this.fileType.includes(files[0].type)){ //check the uploading file type exists in required array
          
          if (selectedFiles.value !== '' && files.length > 0) {

            let filename = files[0].name;
            this.uploadGroupFileToS3(files[0], filename);
          } else {

            this.errorMessage = 'Please select an image to upload first.';
            console.log(this.errorMessage);
          }
        }
        else{

          this.errorMessage = 'Please select ' + this.fileType.join(" or ") + ' format image.';

          return(this.errorMessage);
        }
      }else{

          this.errorMessage = 'Image field is required';

          return this.errorMessage;

      }

    }

    
    addGrouData(){
      this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
      });
      this.selectGroupImageUsingBrowserFileSelector();
    }
  
    employee:any=[
      {
        "name":"Kumar Gaurav",
        "profile_img":"../../assets/images/profile-pic.jpg",
        "position":"Sr. UI/UX Designer",
        "points":15
      },
      {
        "name":"Pradeep Kumar",
        "profile_img":"../../assets/images/profile-pic.jpg",
        "position":"Team Lead",
        "points":13
      },
      {
        "name":"Mohanish Mishra",
        "profile_img":"../../assets/images/profile-pic.jpg",
        "position":"Sr. UI/UX Designer",
        "points":10
      },
      {
        "name":"Shambhu Nath Pandey",
        "profile_img":"../../assets/images/profile-pic.jpg",
        "position":"Team Lead",
        "points":8
      },
      {
        "name":"Vijay Dhanvai",
        "profile_img":"../../assets/images/profile-pic.jpg",
        "position":"UI/UX Designer",
        "points":8
      }
    ];


    public assignKratoEmployee(){
      this.slimLoadingBarService.start(() => {
                console.log('Loading complete');
            });
            // console.log("000"+JSON.stringify(this.droppedKra));
            // console.log("emp id:::"+this.emp_id);
          this.kraService.updateEmployeeKra(this.droppedKra,this.emp_id).then(() => {
            this.slimLoadingBarService.complete();
            this.showAssignKraDialog=false;
          });
    }
    
  
        

    public edited : any = false;
    ngOnInit() {

    this.edited = true;
    //     let promise: Promise<void> = new Promise<void>((resolve, reject) => {
    //        this.kraService.getKra().then(data => this.kra_list = data)
    //      .then(() => {
    //     this.kraService.getGroup().then(data => this.my_groups.push(data));

    //     // this.kraService.gettabDta().then(kra, employee, group)
    //   });
    //  resolve();
    // });


    this.kraService.getKra().then(data => this.kra_list = data);
    //this.kraService.loadEmployees().then(data => this.emp_list = data);
    this.kraService.getGroup().then(data => this.group_list = data);
    this.kraService.getEmployee().then(data => this.emp_list = data);


    // this.dropdownList = [
    //                             {"id":1,"itemName":"India"},
    //                             {"id":2,"itemName":"Singapore"},
    //                             {"id":3,"itemName":"Australia"},
    //                             {"id":4,"itemName":"Canada"},
    //                             {"id":5,"itemName":"South Korea"},
    //                             {"id":6,"itemName":"Germany"},
    //                             {"id":7,"itemName":"France"},
    //                             {"id":8,"itemName":"Russia"},
    //                             {"id":9,"itemName":"Italy"},
    //                             {"id":10,"itemName":"Sweden"}
    //                           ];
    //       this.selectedItems = [
    //                               {"id":2,"itemName":"Singapore"},
    //                               {"id":3,"itemName":"Australia"},
    //                               {"id":4,"itemName":"Canada"},
    //                               {"id":5,"itemName":"South Korea"}
    //                           ];
    //       this.dropdownSettings = { 
    //                                 singleSelection: false, 
    //                                 text:"Select Countries",
    //                                 selectAllText:'Select All',
    //                                 unSelectAllText:'UnSelect All',
    //                                 enableSearchFilter: true
    //                               };            
    }
    onItemSelect(item){
        console.log('Selected Item:');
        console.log(item);
    }
    
    OnItemDeSelect(item){
        console.log('De-Selected Item:');
        console.log(item);
    }

    getGroupMember (item) {
      this.edited = false;
      this.group_emp_list = item;
    }
    activateGroupTab () {
      this.edited = true;
    }

    getMemberDetails (memberdata) {
      this.emp_kra = memberdata;
      // this.kraService.getEmployeeById(memberdata.id).then(data => this.emp_kra1 = data);
      // console.log("_________SDSDSDS_", this.emp_kra1);
      
      
      let promise: Promise<void> = new Promise<void>((resolve, reject) => {
          this.kraService.getEmployeeById(memberdata.id).then(data => this.emp_kra1 = data.Items[0])
        .then(() => {
    
        });
        resolve();
      });
    }
  }