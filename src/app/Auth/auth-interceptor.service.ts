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

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toastService: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
//console.log(HttpHandler);
    if (this.authService.isLoggedIn()){

      const jwtToken = jwt_token(this.cookieService.get('auth'));

      let tokenModel: TokenModel=jwtToken;

  
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('auth') + "chandan"}`
        }
      })
    }

    return next.handle(request).do((Event: HttpEvent<any>) =>{

    }, (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
        if (error.status == 401){
          this.router.navigate(['legalentity', 'login']);
        }
        else{
          this.toastService.error(this.errorHandlerService.getErrorStatusMessage(error.status),"");
        }
      }
    });
  }
}
