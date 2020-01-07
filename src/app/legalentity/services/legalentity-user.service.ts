import { Injectable } from '@angular/core';
import { LegalentityUtilService } from './legalentity-util.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityUser } from '../model/legalentity-user';
import { AuthService } from 'src/app/Auth/auth.service';


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

export interface ItechnicianDetailsReponse{
  errorOccured: boolean,
  technicianId: number,
  technicianName: string,
  technicianCreationDateTime: string,
  technicianActiveStatus: boolean
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityUserService {


  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  getLegalEntityUserDetails(userReqObj: IuserLoginReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/checkLoginPortal", userReqObj);
  }

  getUserBranchDetails(userBranchReqObj: IbranchReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/getUserBranchDetail", userBranchReqObj);
  }
  

  requestOTP(emailId: string, userRole: string):Observable<IforgotPasswordOtpResponse>{
    //console.log(userRole);

    const headers = this.authService.getBaseAuthHeaderDetails();
    
    return this.httpClient.post<IforgotPasswordOtpResponse>(
      this.utilServiceAPI.legalEntityAPIURLWoApi + "/forgotPassword", 
      {
      emailId: emailId,
      userRole: userRole
    }, 
    {headers}
    );
  }

  verifyOTP(verifyOtpReqObj: IverifyOtpReq):Observable<IverifyOtpResponse>{
    const headers = this.authService.getBaseAuthHeaderDetails();
    return this.httpClient.post<IverifyOtpResponse>(
      this.utilServiceAPI.legalEntityAPIURLWoApi + "/setNewPassword", 
      verifyOtpReqObj,
      {headers}
      );
  }

  resetPassword(userId:number,userPassword:string,passwordChange:boolean):Observable<any>
    {
      return this.httpClient.patch(this.utilServiceAPI.legalEntityAPIURLWoApi + "/resetPassword",{
        userId:userId,
        userPassword:userPassword,
        passwordChange:passwordChange
      })
    }

}
