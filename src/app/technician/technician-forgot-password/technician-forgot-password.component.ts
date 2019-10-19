import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TechnicianLoginService, IverifyOtpReq, IforgotPasswordOtpResponse, IverifyOtpResponse } from '../services/technician-login.service';
import *as md5 from 'md5';
import { utils } from 'protractor';
//import { UtilServicesService } from 'src/app/util-services.service';
import { TehnicianUtilService } from '../services/tehnician-util.service';

@Component({
  selector: 'app-technician-forgot-password',
  templateUrl: './technician-forgot-password.component.html',
  styleUrls: ['./technician-forgot-password.component.css']
})
export class TechnicianForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  forgorPasswordFormSubmit: boolean;
  forgotPasswordFormProgressBar: boolean;
  forgotPasswordPnl: boolean;

  resetPasswordForm: FormGroup;
  resetPasswordSubmit: boolean;
  resetPasswordFormProgressBar: boolean;
  resetPasswordPnl: boolean;

  resetPasswordSuccessPnl: boolean;

  errorMsgEnableDisplay: boolean;
  errorMsgText: string;

  userId: number;

  dispableSendOtpBtn: boolean;
  disableVerifyOtpBtn: boolean;

  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private forgotPasswordFb: FormBuilder,
    private userServiceAPI: TechnicianLoginService,
    private util: TehnicianUtilService
  ) {
    iconRegistry.addSvgIcon(
      'attendme-logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );
   }

   onSendOTPClick():void{
    //console.log(this.forgotPasswordForm.value);
    this.forgorPasswordFormSubmit=true;

    this.dispableSendOtpBtn=true;

    this.errorMsgEnableDisplay=false;
    this.errorMsgText="";

    if (this.forgotPasswordForm.valid){

      this.forgotPasswordFormProgressBar=true;

      let emailId: string = this.forgotPasswordForm.value['emailId'];

      this.userServiceAPI.requestOTP(emailId,'technician')
      .subscribe((data:IforgotPasswordOtpResponse) => {

        if (data.errorOccured){
          this.errorMsgEnableDisplay = true;
          this.errorMsgText="Something whet wrong. Please try again later.";
          this.forgotPasswordFormProgressBar=false;
          this.dispableSendOtpBtn=false;
          return false;
        }

        if (data.invalidEmail){
          this.errorMsgEnableDisplay = true;
          this.errorMsgText="Entered email id does not exist";
          this.forgotPasswordFormProgressBar=false;
          this.dispableSendOtpBtn=false;
          return false;
        }

        if (data.otpSend){
          
          this.userId=data.userId;
          this.forgotPasswordPnl = false;
          this.resetPasswordPnl=true;
          this.forgotPasswordFormProgressBar=false;
          this.dispableSendOtpBtn=false;
        }
        else
        {
          this.errorMsgEnableDisplay = true;
          this.errorMsgText="Something whet wrong. Please try again later.";
          this.forgotPasswordFormProgressBar=false;
          this.dispableSendOtpBtn=false;
          return false;
        }
      
      }, error => {
          this.errorMsgEnableDisplay = true;
          this.errorMsgText="Something whet wrong. Please try again later.";
          this.forgotPasswordFormProgressBar=false;
          this.dispableSendOtpBtn=false;
      }); 
    }

  }

  resetPasswordFormSubmit(){
    this.resetPasswordSubmit=true;

    this.errorMsgEnableDisplay=false;
    this.errorMsgText='';

    this.disableVerifyOtpBtn=true;

    if (this.resetPasswordForm.valid){

      this.resetPasswordFormProgressBar=true;

      if (this.resetPasswordForm.value['newPwd'] != this.resetPasswordForm.value['reenterNewPwd'])
      {
       this.errorMsgEnableDisplay=true;
       this.errorMsgText="New password and re-enter password mistmatch";
       this.disableVerifyOtpBtn=false;
       return false;
      }

      let resetPasswordReqObj: IverifyOtpReq = this.resetPasswordForm.value;

      resetPasswordReqObj.userId=this.userId;
      resetPasswordReqObj.verfiedOTP= md5(resetPasswordReqObj.verfiedOTP);
      resetPasswordReqObj.newPwd=md5(resetPasswordReqObj.newPwd);
      resetPasswordReqObj.reenterNewPwd=md5(resetPasswordReqObj.reenterNewPwd);

      this.userServiceAPI.verifyOTP(resetPasswordReqObj)
      .subscribe((data: IverifyOtpResponse) => {
    
        if (data.errorOccured){
          this.errorMsgEnableDisplay=true;
          this.errorMsgText='Something went wrong. Please try later.';
          this.resetPasswordFormProgressBar=false;
          this.disableVerifyOtpBtn=false;
          return false;
        }

        if (data.invalidOtp){
          this.errorMsgEnableDisplay=true;
          
          this.errorMsgText='Entered one time password is invalid.';
          this.resetPasswordFormProgressBar=false;
          this.disableVerifyOtpBtn=false;
          return false;
        }

        if (data.otpValidityExpired){
          this.errorMsgEnableDisplay=true;
          this.errorMsgText='One time password expired. Please try later.';
          this.resetPasswordFormProgressBar=false;
          this.disableVerifyOtpBtn=false;
          return false;
        }
        
        if (data.newPasswordSet){

          this.resetPasswordPnl=false;
          this.resetPasswordSuccessPnl=true;
        }
        //else{
       //   this.errorMsgEnableDisplay=true;
       //   this.errorMsgText='Something went wrong. Please try later.';
       //   this.resetPasswordFormProgressBar=false;
       //   return false;
      //  }

       

        this.resetPasswordFormProgressBar=false;


      }, error => {
          this.errorMsgEnableDisplay=true;
          this.errorMsgText='Something went wrong. Please try later.';
          this.resetPasswordFormProgressBar=false;
          this.disableVerifyOtpBtn=false;
      });

     // this.resetPasswordPnl=false;
      //this.resetPasswordSuccessPnl=true;
    }
    
  }

  ngOnInit() {

    this.forgotPasswordForm=this.forgotPasswordFb.group({
      emailId: ['', [Validators.required, Validators.email]]
    });

    this.forgotPasswordPnl=true;

    this.resetPasswordForm=this.forgotPasswordFb.group({
       userId: [''],
       verfiedOTP: ['', Validators.required],
       newPwd: ['', Validators.required],
       reenterNewPwd: ['', Validators.required]
    });

    this.dispableSendOtpBtn= false;
    this.disableVerifyOtpBtn= false;

    this.util.setTitle("Forgot Password Reset | Attendme");

 }

}