import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUserService, IuserLoginReqStruct, IbranchReqStruct, ItechnicianDetailsReponse } from '../services/legalentity-user.service';
import *as md5 from "md5";
import { LegalentityUser } from '../model/legalentity-user';
//import { stringify } from '@angular/core/src/util';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import { HttpClient } from '@angular/common/http';
import {TehnicianUtilService} from '../../technician/services/tehnician-util.service';
import { LegalentityAppVersionFeatureService } from '../services/legalentity-app-version-feature.service';
import { AuthService, IauthUserLoginReqStruct,  } from 'src/app/Auth/auth.service';
import { AuthUserModel } from 'src/app/Common_Model/auth-user-model';

@Component({
  selector: 'app-legalentity-login',
  templateUrl: './legalentity-login.component.html',
  styleUrls: ['./legalentity-login.component.css']
})
export class LegalentityLoginComponent implements OnInit {

  enableProgressBar: boolean;
  errorOccured: boolean;
  errorText: string;

  emailId: string;
  userPassword: string;

  ipAddress: string;

  constructor(
    private router: Router,
    private icontRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private utilServiceAPI: LegalentityUtilService,
    private userLoginServiceAPI: LegalentityUserService,
    private userLoginModel: LegalentityUser,
    private httpClient: HttpClient,
    private technicianUtilAPI: TehnicianUtilService,
    private appVersionFeatureServiceAPI: LegalentityAppVersionFeatureService,
    private authServiceAPI: AuthService
  ) {
    icontRegistry.addSvgIcon(
      "attendme-logo",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );
   }

  onLoginSubmit(loginFormModel:NgForm):void{

    
    if(loginFormModel.valid)
    {

      const userReqObj: IauthUserLoginReqStruct = {
       deviceIpAddress: '192.168.0.1',
       loginActivity: 'login',
       password: md5(loginFormModel.value['txtUserPassword']),
       username: loginFormModel.value['txtEmailId']
      };

      this.authServiceAPI.authUser(userReqObj)
      .subscribe((data: AuthUserModel) => {
        console.log(data);
      }, error => {
        

      });

    /* this.enableProgressBar = true;

     this.errorOccured = false;
     this.errorText ="";

     // code to get client ip address

     this.utilServiceAPI.getDeviceIPAddress()
     .subscribe(data => {
       let clientIPAddress:string = data['ip'];

    // code to check user login and get legal entity user details

  
    const userReqObj: IuserLoginReqStruct = {
      deviceIpAddress: clientIPAddress,
      emailId: loginFormModel.value['txtEmailId'],
      loginActivity: 'login',
      userActiveStatus: true,
      userPassword: md5(loginFormModel.value['txtUserPassword'])
    };

    

      this.userLoginServiceAPI.getLegalEntityUserDetails(userReqObj)
      .subscribe(data => {

        this.userLoginModel.legalEntityUserDetails = data;

        if (this.userLoginModel.legalEntityUserDetails.userId == 0 || this.userLoginModel.legalEntityUserDetails.userId == undefined || this.userLoginModel.legalEntityUserDetails.userId == null)
        {
          this.enableProgressBar = false;
          this.errorOccured = true;
          this.errorText = "Please enter valid user email id or password.";
          return false;
        }

        if (!this.userLoginModel.legalEntityUserDetails.userActiveStatus)
        {
          this.enableProgressBar = false;
          this.errorOccured = true;
          this.errorText = "Your account has been deactive. Please contact administrator";
          return false;
        }

       

       // if (this.userLoginModel.legalEntityUserDetails.userRole=='technician'){

          //localStorage.setItem("technicianUserDetails",JSON.stringify(this.userLoginModel.legalEntityUserDetails));
         // window.location.href = 'http://localhost:4201';
         // return false;

         // this.enableProgressBar = false;
         // this.errorOccured = true;
         // this.errorText = "Please enter valid user email id or password.";
         // return false;
       // }

       // if (this.userLoginModel.legalEntityUserDetails.passwordChange)
     //   {

          // code to get branch details

          let userId: number = this.userLoginModel.legalEntityUserDetails.userId;
          let legalEntityId: number = this.userLoginModel.legalEntityUserDetails.legalEntityId;

          const userBranchReqObj: IbranchReqStruct = {
            adminApprove: true,
            branchActive: true,
            userId: userId
          };

          this.userLoginServiceAPI.getUserBranchDetails(userBranchReqObj)
          .subscribe(data => {

            this.userLoginModel.legalEntityBranchDetails = data;

            if (this.userLoginModel.legalEntityUserDetails.userRole=='technician'){
              localStorage.setItem("technicianUserDetails", JSON.stringify(this.userLoginModel.legalEntityUserDetails));
            }
            else{
              localStorage.setItem("legalEntityUserDetails", JSON.stringify(this.userLoginModel));
            }

            

            // code to set legal entity menu preference trans

            this.utilServiceAPI.getLegalEntityMenuPreference(legalEntityId)
            .subscribe((data:LegalentityMenuPref) => {
              
              localStorage.setItem("legalEntityMenuPref",JSON.stringify(data));

              this.enableProgressBar = false;

              if (this.userLoginModel.legalEntityUserDetails.userRole=='technician'){

                this.technicianUtilAPI.getTechnicicianDetails(this.userLoginModel.legalEntityUserDetails.userId)
                .subscribe((data:ItechnicianDetailsReponse) => {
                  if (data.errorOccured){
                    this.enableProgressBar = false;
                    this.errorOccured = true;
                    this.errorText = "Something went wrong while login to the portal. Please try later.";
                    return false;  
                  }

                  localStorage.setItem('technicianDetails', JSON.stringify(data));
                  this.router.navigate(['technician/portal/dashboard']);

                }, error => {
                  this.enableProgressBar = false;
                    this.errorOccured = true;
                    this.errorText = "Something went wrong while login to the portal. Please try later.";
                });

               
                //return false;
              }
              else{
                this.router.navigate(['legalentity/portal/dashboard']);
                return false;
              }
              
              

            }, error => {
              this.enableProgressBar = false;
              this.errorOccured = true;
              this.errorText = "Something went wrong while login to the portal. Please try later.";  
            })

          },error => {

            this.enableProgressBar = false;
            this.errorOccured = true;
            this.errorText = "Something went wrong while login to the portal. Please try later.";

          });

      //  }
        
      }, error => {
        this.enableProgressBar = false;
        this.errorOccured = true;
        this.errorText = "Something went wrong while login to the portal. Please try later.";  
      })



     }, error => {
      this.enableProgressBar = false;
      this.errorOccured = true;
      this.errorText = "Something went wrong while login to the portal. Please try later.";
     }) */

    }

  }

  

  ngOnInit() {

    

    this.ipAddress="111111";

    this.utilServiceAPI.setTitle("Legalentity - Login | Attendme");

    if (localStorage.getItem('legalEntityUserDetails') != null)
    {
      this.router.navigate(['legalentity/portal/dashboard']);
      return false;
    }

    if (localStorage.getItem('technicianUserDetails') != null){
      this.router.navigate(['technician/portal/dashboard']);
      return false;
    }
   
  }

}
