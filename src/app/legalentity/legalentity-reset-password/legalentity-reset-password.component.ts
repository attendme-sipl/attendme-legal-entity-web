import { Component, OnInit } from '@angular/core';
//import { LegalentityBranch } from '../model/legalentity-branch';
//import { UtilServicesService } from 'src/app/util-services.service';
//import { LegalentityLogin } from '../model/legalentity-login';
import { Router } from '@angular/router';
import {NgForm} from "@angular/forms"
import {ToastrService} from 'ngx-toastr'
//import { LegalentityMainService } from '../services/legalentity-main.service';
import { first } from 'rxjs/operators';
import * as md5 from 'md5';
import { LegalentityUser } from '../model/legalentity-user';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUserService } from '../services/legalentity-user.service';
import { LegalentityUtilService } from '../services/legalentity-util.service';

@Component({
  selector: 'app-legalentity-reset-password',
  templateUrl: './legalentity-reset-password.component.html',
  styleUrls: ['./legalentity-reset-password.component.css']
})
export class LegalentityResetPasswordComponent implements OnInit {

  legalEntityId:number;
  userName:string;
  userId:number;
  userRole:string;

  newPassword:string;
  reenterNewPassword:string;
  btnDisable:boolean;
  progressBarBit:boolean;

  newMd5Password:string;

  constructor(
    //private util:UtilServicesService,
   // private legalEntityBranchModel:LegalentityBranch,
   // private legalEntityLoginModel:LegalentityLogin,
    private router:Router,
    private toastService:ToastrService,
    //private legalEntityMainServiceAPI:LegalentityMainService,
    private legalEntityUserModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private userServiceAPI: LegalentityUserService,
    private utilServiceAPI: LegalentityUtilService
  ) {

      iconRegistry.addSvgIcon(
        'attendme-logo',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
      );

   /* if (localStorage.getItem('legalEntityUser') != null)
    {
      legalEntityLoginModel = JSON.parse(localStorage.getItem('legalEntityUser'));

      this.userId = legalEntityLoginModel.userId;
      this.userName = legalEntityLoginModel.userFullName;

      util.setTitle("Legal Entity - Add Head Office | Attendme")

    }
    else{
      this.router.navigate(['/legalentity/login']);
    }  */

   
   }

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

         this.userServiceAPI.resetPassword(this.userId,this.newMd5Password,true)
         .pipe(first())
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
          this.toastService.error("There was an error while resetting password");
         })
       }
     }

      
   }

   logout()
  {
    localStorage.removeItem('legalEntityUserDetails');
    localStorage.removeItem('legalEntityMenuPref');
    this.router.navigate(['/legalentity/login']);
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){

      this.legalEntityUserModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      if (this.legalEntityUserModel.legalEntityUserDetails.passwordChange){
        this.router.navigate(['legalentity','login']);  
      }
      
      this.userName=this.legalEntityUserModel.legalEntityUserDetails.userFullName;
      this.userId=this.legalEntityUserModel.legalEntityUserDetails.userId;

      this.utilServiceAPI.setTitle("Forgot Password Reset | Attendme");
    }
    else{
      this.router.navigate(['legalentity','login']);
    }

  }

}
