import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  canActivate(): boolean{
   // console.log(this.authService.isLoggedIn());
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['legalentity','login']);
      return false;
    }
    else{
      const jwtToken = this.cookieService.get('auth');
      //console.log(jwtToken);
      
      if (this.jwtHelper.isTokenExpired(jwtToken)){
        this.router.navigate(['legalentity','login']);
        return false;
      }
    }

    return true;
  }
}
