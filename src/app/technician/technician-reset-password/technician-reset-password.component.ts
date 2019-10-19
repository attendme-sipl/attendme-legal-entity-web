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

@Component({
  selector: 'app-technician-reset-password',
  templateUrl: './technician-reset-password.component.html',
  styleUrls: ['./technician-reset-password.component.css']
})
export class TechnicianResetPasswordComponent implements OnInit {

  userId: number;
  technicianMenuName: string;
  userName: string;

  newPassword:string;
  reenterNewPassword:string;
  btnDisable:boolean;
  progressBarBit:boolean;

  newMd5Password:string;

  constructor(
    private router: Router,
    private toastService:ToastrService,
    private legalEntityMainServiceAPI: LegalentityUserService
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
          this.toastService.error("There was an error while resetting password");
         })
       }
     }

  
   }

  ngOnInit() {

    if (localStorage.getItem('technicianUserDetails') != null){

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
    }
  }

  logout(){
    localStorage.removeItem('technicianUserDetails');
    localStorage.removeItem('legalEntityMenuPref');
    localStorage.removeItem('technicianDetails');
    this.router.navigate(['technician','login']);
  }

}
