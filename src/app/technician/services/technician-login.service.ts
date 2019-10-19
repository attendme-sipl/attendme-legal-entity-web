import { Injectable } from '@angular/core';
//import { UtilServicesService } from 'src/app/util-services.service';
import { TehnicianUtilService } from '../services/tehnician-util.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IUserLoginStruct{
  emailId: string,
  userPassword: string,
  userActiveStatus: boolean,
  deviceIpAddress: string,
  loginActivity: string
};

export interface IUserLoginResponseStruct{
  currentLoginDateTime: string,
  lastUpdateDateTime: string,
  legalEntityId: number,
  passwordChange: boolean,
  userActiveStatus: boolean,
  userEmailId: string,
  userFullName: string,
  userId: number
  userMobileNumer:string,
  userRole: string
};

export interface IforgotPasswordOtpResponse{
  errorOccured: boolean,
  userId: number,
  otpSend: boolean,
  invalidEmail: boolean
};

export interface IverifyOtpReq{
   userId: number,
   verfiedOTP: string,
   newPwd: string,
   reenterNewPwd: string
};

export interface IverifyOtpResponse{
   errorOccured: boolean,
   invalidOtp: boolean,
   otpValidityExpired: boolean,
   newPasswordSet: boolean
};


@Injectable({
  providedIn: 'root'
})
export class TechnicianLoginService {

  constructor(
    private util: TehnicianUtilService,
    private httpclient: HttpClient
  ) { }

  checkTechnicianLogin(userDetails: IUserLoginStruct):Observable<IUserLoginResponseStruct>{
    return this.httpclient.post<IUserLoginResponseStruct>(this.util.legalEntityAPI_URL + "/checkLoginPortal", userDetails);
  }

  requestOTP(emailId: string, userRole: string):Observable<IforgotPasswordOtpResponse>{
    return this.httpclient.post<IforgotPasswordOtpResponse>(this.util.legalEntityAPI_URL + "/forgotPassword", {
      emailId: emailId,
      userRole: userRole
    });
  }

  verifyOTP(verifyOtpReqObj: IverifyOtpReq):Observable<IverifyOtpResponse>{
    return this.httpclient.post<IverifyOtpResponse>(this.util.legalEntityAPI_URL + "/setNewPassword", verifyOtpReqObj);
  }
}
