import { Injectable } from '@angular/core';
import { LegalentityUtilService } from './legalentity-util.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityUser } from '../model/legalentity-user';

export interface IuserLoginReqStruct{
   emailId: string,
   userPassword: string,
   userActiveStatus: boolean,
   deviceIpAddress: string,
   loginActivity: string
};

export interface IbranchReqStruct{
  userId: number,
  branchActive: boolean,
  adminApprove: boolean
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
export class LegalentityUserService {


  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private httpClient: HttpClient
  ) { }

  getLegalEntityUserDetails(userReqObj: IuserLoginReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/checkLoginPortal", userReqObj);
  }

  getUserBranchDetails(userBranchReqObj: IbranchReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/getUserBranchDetail", userBranchReqObj);
  }
  

  requestOTP(emailId: string):Observable<IforgotPasswordOtpResponse>{
    return this.httpClient.post<IforgotPasswordOtpResponse>(this.utilServiceAPI.legalEntityRestApuURL + "/forgotPassword", {
      emailId: emailId
    });
  }

  verifyOTP(verifyOtpReqObj: IverifyOtpReq):Observable<IverifyOtpResponse>{
    return this.httpClient.post<IverifyOtpResponse>(this.utilServiceAPI.legalEntityRestApuURL + "/setNewPassword", verifyOtpReqObj);
  }

  resetPassword(userId:number,userPassword:string,passwordChange:boolean):Observable<any>
    {
      return this.httpClient.patch(this.utilServiceAPI.legalEntityRestApuURL + "/resetPassword",{
        userId:userId,
        userPassword:userPassword,
        passwordChange:passwordChange
      })
    }
}
