import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItechnicianLoginDetailsStruct } from '../services/tehnician-util.service';
//import { IlegalEntityMenuPref } from 'src/app/util-services.service';
import { ToastrService } from 'ngx-toastr';
//import { LegalentityMainService } from 'src/app/legalentity/services/legalentity-main.service';

import { NgForm } from '@angular/forms';
import * as md5 from 'md5';
import { LegalentityUserService } from '../../legalentity/services/legalentity-user.service';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { CookieService } from 'ngx-cookie-service';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';

@Component({
  selector: 'app-technician-reset-password',
  templateUrl: './technician-reset-password.component.html',
  styleUrls: ['./technician-reset-password.component.css']
})
export class TechnicianResetPasswordComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  technicianMenuName: string;
  userName: string;

  newPassword:string;
  reenterNewPassword:string;
  btnDisable:boolean;
  progressBarBit:boolean;

  newMd5Password:string;

  equptMenuName: string;
  branchMenuName: string;
  complaintMenuName: string;

  constructor(
    private router: Router,
    private toastService:ToastrService,
    private legalEntityMainServiceAPI: LegalentityUserService,
    private authService: AuthService,
    private cookieService: CookieService,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  resetPassword(resetPasswordForm:NgForm)
   {
     if (resetPasswordForm.invalid)
     {
       return;
     }
     else
     {
       if (this.newPassword != this.reenterNewPassword)
       {
         this.toastService.error("Password does not match the confirm password","");
       }
       else
       {

        this.btnDisable=true;
        this.progressBarBit=true;

        this.newMd5Password = md5(this.newPassword);

        try {
          this.legalEntityMainServiceAPI.resetPassword(this.userId,this.newMd5Password,true)
          //.pipe(first())
          .subscribe((data => {
            
            if (data.passwordReset == true)
            {
             this.btnDisable=false;
             this.progressBarBit=false;
             this.logout();
            }
            else
            {
              this.btnDisable=false;
              this.progressBarBit=false;
              
              this.toastService.error("There was an error while resetting password");
            }
          }),
          error => {
            this.btnDisable=false;
            this.progressBarBit=false;
            //this.toastService.error("There was an error while resetting password");
          });
        } catch (error) {
            this.btnDisable=false;
            this.progressBarBit=false;
            this.toastService.error("There was an error while resetting password");
        }

       }
     }

  
   }

  ngOnInit() {

    try {
      this.btnDisable=false;
      this.progressBarBit=false;

      if (this.cookieService.get(this.utilServiceAPI.authCookieName) == ''){
        this.router.navigate(['legalentity','login']);
        return false;
      }
  
      const tokenModel: TokenModel = this.authService.getTokenDetails();
  
      this.legalEntityId=tokenModel.legalEntityId;
      this.branchId=tokenModel.branchId;
      this.userId=tokenModel.userId;
      this.userRole=tokenModel.userRole;

      this.userName=tokenModel.userFullName;
  
      if (tokenModel.passwordChange){
        this.router.navigate(['technician','portal','dashboard']);
        return false; 
      }

    } catch (error) {
      this.btnDisable=false;
      this.progressBarBit=false;
      this.toastService.error("There was an error while resetting password"); 
    }

    

    /*if (localStorage.getItem('technicianUserDetails') != null){

      let technicianUserDetails: ItechnicianLoginDetailsStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

      if (technicianUserDetails.passwordChange){
         this.router.navigate(['technician','portal','dashboard']);
         return false;
      }

      this.userId=technicianUserDetails.userId;
      this.userName=technicianUserDetails.userFullName;

      let legalEntityMenuPrefObj:LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));

      const technicianMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value? {
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }: null)
      .filter(value => value.ngModelPropMenuName == 'technician');

      this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];

    }else
    {
      //this.router.navigate(['technician','login']);
      this.router.navigate(['legalentity','login']);
      return false;
    }*/


  }

  logout(){
   // localStorage.removeItem('technicianUserDetails');
    //localStorage.removeItem('legalEntityMenuPref');
    //localStorage.removeItem('technicianDetails');

    this.authService.deleteCookies();
 
    this.router.navigate(['legalentity','login']);
    //this.router.navigate(['technician','login']);
  }

}
