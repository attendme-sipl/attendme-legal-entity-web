import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityUtilService } from '../legalentity/services/legalentity-util.service';
import {AuthUserModel} from '../Common_Model/auth-user-model';

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
    private utilServiceAPI: LegalentityUtilService
  ) { }

  authUser(authUserReqObj: IauthUserLoginReqStruct): Observable<AuthUserModel>{

    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa('attendme:jo%&d!gv')});

    return this.httpClient.post<AuthUserModel>( this.utilServiceAPI.legalEntityRestApuURL + "/userLogin", authUserReqObj, {headers});
  }

}
