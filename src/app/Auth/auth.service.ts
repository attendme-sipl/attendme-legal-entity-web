import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityUtilService } from '../legalentity/services/legalentity-util.service';
import {AuthUserModel} from '../Common_Model/auth-user-model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { TokenModel } from '../Common_Model/token-model';
import *as jwt_token from 'jwt-decode';

export interface IauthUserLoginReqStruct{
  username: string,
  password: string,
  deviceIpAddress: string,
  loginActivity: string
};

export interface IrefreshTokenResponseStruct{
  userNotFound: boolean,
  token: string,
  isSessionTokenExpired: boolean
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private utilServiceAPI: LegalentityUtilService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  authUser(authUserReqObj: IauthUserLoginReqStruct): Observable<AuthUserModel>{

    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(this.utilServiceAPI.basicAuthUserName + ":" + this.utilServiceAPI.basicAuthPassword)});

    return this.httpClient.post<AuthUserModel>( this.utilServiceAPI.legalEntityAPIURLWoApi + "/userLogin", authUserReqObj, {headers});
  }

  isLoggedIn(){
    return (this.cookieService.get(this.utilServiceAPI.authCookieName) != '' && this.cookieService.get(this.utilServiceAPI.authCookieName) != null)
  }

  getTokenDetails(): TokenModel{
    const tokenModel: TokenModel = jwt_token(this.cookieService.get(this.utilServiceAPI.authCookieName));

    return tokenModel;
  }

  getBaseAuthHeaderDetails(): HttpHeaders{
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(this.utilServiceAPI.basicAuthUserName + ":" + this.utilServiceAPI.basicAuthPassword)});
    return headers;
  }

  getSessionToken(): string{
    return this.cookieService.get(this.utilServiceAPI.sessionAuthCookieName);
  }

  refreshToken(sessionToken: string): Observable<IrefreshTokenResponseStruct>{
    return this.httpClient.post<IrefreshTokenResponseStruct>(this.utilServiceAPI.legalEntityAPIURLWoApi + "/refreshToken", {
      sessionToken: sessionToken
    });
  }

  deleteCookies(){
    this.cookieService.delete(this.utilServiceAPI.authCookieName, this.utilServiceAPI.authCookiePath, this.utilServiceAPI.authCookieDomain);
    this.cookieService.delete(this.utilServiceAPI.userDefMenuCookieName, this.utilServiceAPI.userDefMenuCookiePath, this.utilServiceAPI.userDefMenuCookieDomain);
    this.cookieService.delete(this.utilServiceAPI.sessionAuthCookieName, this.utilServiceAPI.sessionAuthCookiePath, this.utilServiceAPI.sessionAuthCookieDomain);
  }

}
