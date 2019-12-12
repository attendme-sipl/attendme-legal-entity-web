import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import *as jwt_token from 'jwt-decode';
import { TokenModel } from '../Common_Model/token-model';
import {PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
console.log(PlatformLocation);
    if (this.authService.isLoggedIn()){

      const jwtToken = jwt_token(this.cookieService.get('auth'));

      let tokenModel: TokenModel=jwtToken;

  
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('auth')}`
        }
      })
    }

    return next.handle(request);
  }
}
