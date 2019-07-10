import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUserService, IuserLoginReqStruct, IbranchReqStruct } from '../services/legalentity-user.service';
import *as md5 from "md5";
import { LegalentityUser } from '../model/legalentity-user';
//import { stringify } from '@angular/core/src/util';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';

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

  constructor(
    private router: Router,
    private icontRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private utilServiceAPI: LegalentityUtilService,
    private userLoginServiceAPI: LegalentityUserService,
    private userLoginModel: LegalentityUser
  ) {
    icontRegistry.addSvgIcon(
      "attendme-logo",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );
   }

  onLoginSubmit(loginFormModel:NgForm):void{

    
    if(loginFormModel.valid)
    {
     this.enableProgressBar = true;

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

        if (this.userLoginModel.legalEntityUserDetails.userRole=='technician'){
          this.enableProgressBar = false;
          this.errorOccured = true;
          this.errorText = "Please enter valid user email id or password.";
          return false;
        }

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

            localStorage.setItem("legalEntityUserDetails", JSON.stringify(this.userLoginModel));

            // code to set legal entity menu preference trans

            this.utilServiceAPI.getLegalEntityMenuPreference(legalEntityId)
            .subscribe((data:LegalentityMenuPref) => {
              
              localStorage.setItem("legalEntityMenuPref",JSON.stringify(data));

              this.enableProgressBar = false;

              
              this.router.navigate(['legalentity/portal/dashboard']);

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
     })

    }

  }

  ngOnInit() {

    this.utilServiceAPI.setTitle("Legalentity - Login | Attendme");

    if (localStorage.getItem('legalEntityUserDetails') != null)
    {
      this.router.navigate(['legalentity/portal/dashboard']);
    }
   
  }

}
