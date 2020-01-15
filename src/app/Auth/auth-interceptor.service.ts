import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import *as jwt_token from 'jwt-decode';
import { TokenModel } from '../Common_Model/token-model';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from './error-handler.service';
import { LegalentityUtilService } from '../legalentity/services/legalentity-util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toastService: ToastrService,
    private errorHandlerService: ErrorHandlerService,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    if (this.authService.isLoggedIn()){

      //const exceptionalURL: string = this.utilServiceAPI.legalEntityAPIURLWoApi + "/resetPassword";
      
      switch (request.url) {
       /* case this.utilServiceAPI.legalEntityAPIURLWoApi + "/resetPassword":
          
          request=request.clone({
            setHeaders: {
              Authorization: `Basic ${btoa(this.utilServiceAPI.basicAuthUserName + ":" + this.utilServiceAPI.basicAuthPassword)}`
            }});

            break;*/

        case this.utilServiceAPI.legalEntityAPIURLWoApi + "/addHeadOfficeDetails":
          request=request.clone({
            setHeaders: {
              Authorization: `Basic ${btoa(this.utilServiceAPI.basicAuthUserName + ":" + this.utilServiceAPI.basicAuthPassword)}`
            }});

            break;
         
        case this.utilServiceAPI.legalEntityAPIURLWoApi + "/refreshToken":
          request=request.clone({
            setHeaders: {
              Authorization: `Basic ${btoa(this.utilServiceAPI.basicAuthUserName + ":" + this.utilServiceAPI.basicAuthPassword)}`
            }});

            break;
      
        default:
          const jwtToken = jwt_token(this.cookieService.get(this.utilServiceAPI.authCookieName));

          let tokenModel: TokenModel=jwtToken;

          request=request.clone({
            setHeaders: {
            Authorization: `Bearer ${this.cookieService.get(this.utilServiceAPI.authCookieName)}`
          }
        });
      }
      
    }

    return next.handle(request).do((Event: HttpEvent<any>) =>{

    }, (error) => {
      
      if (error instanceof HttpErrorResponse) {
        
        if (error.status == 401){
          this.cookieService.delete(this.utilServiceAPI.authCookieName);
          this.cookieService.delete(this.utilServiceAPI.userDefMenuCookieName);
          this.router.navigate(['legalentity', 'login']);
        }
        else{
          //console.log(error);
          this.toastService.error(this.errorHandlerService.getErrorStatusMessage(error.status),"");
        }
      }
    });
  }
}
