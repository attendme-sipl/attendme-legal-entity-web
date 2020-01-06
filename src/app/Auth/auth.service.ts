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

}
