import { Component, OnInit } from '@angular/core';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';

import {NgForm, EmailValidator} from '@angular/forms';
//import { LegalentityLoginService } from 'src/app/legalentity/services/legalentity-login.service';
import { LegalentityUserService} from '../../legalentity/services/legalentity-user.service';
import { TechnicianLoginService, IUserLoginStruct, IUserLoginResponseStruct } from '../services/technician-login.service';
import *as md5 from 'md5';
import { Router } from '@angular/router';
import { TehnicianUtilService, ItechnicianDetailsReponse } from '../services/tehnician-util.service';
import { utils } from 'protractor';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';

@Component({
  selector: 'app-technician-login',
  templateUrl: './technician-login.component.html',
  styleUrls: ['./technician-login.component.css']
})
export class TechnicianLoginComponent implements OnInit {

  emailId: string;
  userPwd: string;

  invalidUser: boolean;

  loginLoad: boolean;

  ipAddress: string;

  errorMessage: string;

  constructor(
    private util:TehnicianUtilService ,
    private loginAPI: LegalentityUserService,
    private technicianUserLoginService: TechnicianLoginService,
    private router: Router,
    private technicianUtilAPI: TehnicianUtilService,
    private legalEntityUtilServiceAPI: LegalentityUtilService
  ) { }

  submitLogin(loginForm: NgForm){
   
    this.errorMessage = "";
    this.invalidUser = false;

    if (loginForm.invalid)
    {
      return false;
    }

    this.loginLoad = true;

    this.legalEntityUtilServiceAPI.getDeviceIPAddress()
    .subscribe(data => {
 
      this.ipAddress = data['ip'];

      let technicianLoginDetails: IUserLoginStruct ={
        deviceIpAddress: this.ipAddress,
        emailId: this.emailId,
        loginActivity: 'login',
        userActiveStatus: true,
        userPassword: md5(this.userPwd)
      };

     

      this.technicianUserLoginService.checkTechnicianLogin(technicianLoginDetails)
      .subscribe((data:IUserLoginResponseStruct) => {
       /// console.log(data);

        if (data.userId == 0 || data.userId == null || data.userActiveStatus == false || data.userRole != 'technician')
        {
          this.invalidUser = true;
          this.errorMessage = "Incorrect email id or password";
          this.loginLoad = false;
          return false;

        } 

        let legalEntityId: number = data.legalEntityId;
          
        

        if (data.userRole == "technician")
        {

          localStorage.setItem("technicianUserDetails",JSON.stringify(data));

          this.technicianUtilAPI.getTechnicicianDetails(data.userId)
          .subscribe((data:ItechnicianDetailsReponse) => {

            if (data.errorOccured)
            {
             this.invalidUser = true;
             this.errorMessage = "Incorrect email id or password";
             this.loginLoad = false;
             localStorage.removeItem('technicianUserDetails');
             return false;
            }

            
            

            localStorage.setItem('technicianDetails', JSON.stringify(data));

            this.util.getLegalEntityMenuPreference(legalEntityId)
            .subscribe((data: LegalentityMenuPref) => {
              
              localStorage.setItem('legalEntityMenuPref', JSON.stringify(data));

              this.router.navigate(['technician/portal/dashboard']);

            }, error => {
              this.loginLoad = false;
              this.invalidUser = true;
              this.errorMessage = "Something went wrown while login. Plase try later.";
              localStorage.removeItem('technicianUserDetails');
              localStorage.removeItem('technicianDetails');
              return false;  
            })

          }, error => {
            this.loginLoad = false;
            this.invalidUser = true;
            this.errorMessage = "Something went wrown while login. Plase try later.";
            localStorage.removeItem('technicianUserDetails');
            return false;
          });

          //this.router.navigate(['technician/portal/dashboard']);
        }
        

        this.loginLoad = false;
      }, error => {

        this.loginLoad = false;
        this.errorMessage = "Something went wrown while login. Plase try later.";
        return false;
      });
     

    }, error => {
       this.loginLoad = false;
       this.invalidUser = true;
       this.errorMessage = "Something went wrown while login. Plase try later.";
       return false;
    })
 
  }


  ngOnInit() {

    if (localStorage.getItem('technicianUserDetails') != null)
    {
      this.router.navigate(['technician/portal/dashboard']);
    }
    
  

    this.util.setTitle("Technician - Login | Attendme");

   
  }

}
