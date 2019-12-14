import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {LegalentityMenuPref} from '../model/legalentity-menu-pref';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { CookieService } from 'ngx-cookie-service';
import { CoreEnvironment } from '@angular/core/src/render3/jit/compiler_facade_interface';

export interface IcountryCallingCodeResponse{
  countryShortName: String,
  countryName: String,
  countryCallingCode: number
};


@Injectable({
  providedIn: 'root'
})
export class LegalentityUtilService {

  superAdminRestApiURL = environment.superAdminAPIURL;
  legalEntityRestApuURL = environment.legalEntityAPIURL;
  mobileRestApiURL = environment.mobileServiceAPIURL;

  superAdminAPIURLWoApi = environment.superAdminAPIURLWoApi;
  legalEntityAPIURLWoApi = environment.legalEntityAPIURLWoApi;
  mobileServiceAPIURLWoApi = environment.mobileServiceAPIURLWoApi;

  authCookieName = environment.authCookieName;
  authCookieExpires = environment.authCookieExpires;
  authCookiePath = environment.authCookiePath;
  authCookieDomain = environment.authCookieDomain;
  authCookieSecure = environment.authCookieSecure;


  userDefMenuCookieName = environment.userDefMenuCookieName;
  userDefMenuCookieExpires = environment.userDefMenuCookieExpires;
  userDefMenuCookiePath = environment.userDefMenuCookiePath;
  userDefMenuCookieDomain = environment.userDefMenuCookieDomain;
  userDefMenuCookieSecure = environment.userDefMenuCookieSecure;
  

  
  constructor(
  private titleService: Title,
  private httpClient: HttpClient,
  private menuPrefNameModel: LegalentityMenuPrefNames,
  private cookieService: CookieService
  ) { }

  setTitle(titleString: string):void{
    this.titleService.setTitle(titleString);
  }

  getDeviceIPAddress():Observable<string>{
    return this.httpClient.get<string>("https://jsonip.com/");
  }

  getLegalEntityMenuPreference(legalEntityId: number):Observable<LegalentityMenuPref>{
    return this.httpClient.post<LegalentityMenuPref>(this.legalEntityRestApuURL + "/getEntityMenuList", {
      legalEntityId: legalEntityId
    });
  }

  getLegalEntityMenuPrefNames():LegalentityMenuPrefNames{
    
   
    if (this.cookieService.get(this.userDefMenuCookieName) != ''){

      const menuPrefObj:LegalentityMenuPref[] = JSON.parse(this.cookieService.get(this.userDefMenuCookieName));

      //console.log(menuPrefObj);

    const equipmentMenuNameObj = menuPrefObj.map((value,index) => value?{
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }:null)
    .filter(value => value.ngModelPropMenuName == 'equipment');

    this.menuPrefNameModel.equipmentMenuName = equipmentMenuNameObj[0]['userDefMenuName'];


     const complaintMenuNamObj = menuPrefObj.map((value,index) => value?{
       userDefMenuName: value['menuName'],
       ngModelPropMenuName: value['ngModelPropName']
     }:null)
     .filter(value => value.ngModelPropMenuName == 'complaints');

     if(complaintMenuNamObj.length != 0){
       this.menuPrefNameModel.complaintMenuName = complaintMenuNamObj[0]['userDefMenuName'];
     }


     const technicianMenuNameObj = menuPrefObj.map((value,index) => value?{
       userDefMenuName: value['menuName'],
       ngModelPropMenuName: value['ngModelPropName']
     }:null)
     .filter(value => value.ngModelPropMenuName == 'technician');

     if (technicianMenuNameObj.length != 0){
      this.menuPrefNameModel.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];
     }

     const branchMenuNameObj = menuPrefObj.map((value,index) => value? {
       userDefMenuName: value['menuName'],
       ngModelPropMenuName: value['ngModelPropName']
     }: null)
     .filter(value => value.ngModelPropMenuName == 'branch');

     if (branchMenuNameObj.length != 0){
      this.menuPrefNameModel.branchMenuName = branchMenuNameObj[0]['userDefMenuName'];
     }

     

    }

    return this.menuPrefNameModel;

  }


  getLegalEntityAlottedQRIdList(
    legalEntityId: number,
    qrIdAssingedStatus:boolean,
    qrIdActiveStatus: boolean,
    assignedToBranch: boolean):Observable<any>{
      return this.httpClient.post(this.legalEntityRestApuURL + "/getQrIdDetails", {
         legalEntityId: legalEntityId,
         qrIdStatus: qrIdAssingedStatus,
         qrIdActiveStatus: qrIdActiveStatus,
         assignedToBranch: assignedToBranch
      });
    }

    countryCallingCode():Observable<IcountryCallingCodeResponse>{
      return this.httpClient.get<IcountryCallingCodeResponse>(this.legalEntityRestApuURL + "/getCountryCallingCode");
    }

    

 
}