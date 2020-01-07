import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import {OrderByPipe} from 'ngx-pipes'
import { Router } from '@angular/router';
import { LegalentityCommons } from '../model/legalentity-commons';
import { LegalentityVersionFeatureListComponent } from '../legalentity-version-feature-list/legalentity-version-feature-list.component';
import { LegalentityAppVersionFeatureService, IversionFeatureResponseStruct, IversionUserCheckHistoryReqStruct, IversionUserCheckHistoryResponseStruct } from '../services/legalentity-app-version-feature.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import *as jwt_token from 'jwt-decode';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-main',
  templateUrl: './legalentity-main.component.html',
  styleUrls: ['./legalentity-main.component.css'],
  inputs:['enableProgressObject']
})
export class LegalentityMainComponent implements OnInit {

  legalEntityName: string;
  userFullName: string;

  legalEntityMenuPrefObj:LegalentityMenuPref[];

  updatedLegalEntityMenuPrefObj:LegalentityMenuPref[];

  enableProgressBar: boolean;
  
  headOffice: boolean;

  branchName: string;
  userId: number;

  constructor(
    private utilAPI: LegalentityUtilService,
    private legalEntityUserModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router:Router,
    public commonModel: LegalentityCommons,
    private versionFeatureServiceAPI: LegalentityAppVersionFeatureService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private cookieService: CookieService
  ) { 
    iconRegistry.addSvgIcon(
      "attendme-logo",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );

    iconRegistry.addSvgIcon(
      'contact-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-perm_contact_calendar-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'home-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-home-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'input-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-input-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'document-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/document-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'new-release-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/new_releases-24px.svg')
    );

    this.commonModel.enableProgressbar =false;
  }

  /*displayNewVersionData(){
    this.versionFeatureServiceAPI.getActiveVersionDetails(true)
    .subscribe((data: IversionFeatureResponseStruct) => {
      if (data.errorOccured){
        this.toastService.error("Soemthing went wrong while getting latest version list");
        return false;
      }

      if (data.versionFeatureList.length > 0){
        let versionId: number = data.versionFeatureList[0].featureId;
        
        const userVersionCheckHistoryReq: IversionUserCheckHistoryReqStruct = {
          allCheckHistory: false,
          featureActiveStatus: true,
          userId: this.userId
        };

        this.versionFeatureServiceAPI.getUserVersionCheckHistory(userVersionCheckHistoryReq)
        .subscribe((data: IversionUserCheckHistoryResponseStruct) => {
          
          if (data.errorOccured){
            this.toastService.error("Something went wrong while showing What's New feature");
            return false;
          }

          //console.log(data.userCheckHistoryList.length > 0 );

          if (data.userCheckHistoryList == null){}

        });
      }
    }, error => {this.toastService.error("Soemthing went wrong while getting latest version list");});
  } */

  ngOnInit() {

    const jwtToken = jwt_token(this.cookieService.get(this.utilAPI.authCookieName));

    let tokenModel: TokenModel=jwtToken;

    this.legalEntityName = tokenModel.legalEntityName;
    this.userFullName = tokenModel.userFullName;
    this.headOffice = tokenModel.branchHeadOffice;
    this.branchName = tokenModel.branchName;
    this.userId = tokenModel.userId;

    if (this.cookieService.get(this.utilAPI.userDefMenuCookieName) != ''){
      const menuModel: LegalentityMenuPref[] = JSON.parse(this.cookieService.get(this.utilAPI.userDefMenuCookieName));

      if (this.headOffice){
        this.updatedLegalEntityMenuPrefObj = menuModel;
      }
      else{
        this.updatedLegalEntityMenuPrefObj=menuModel.map((value,index) => value? {
          enableToBranch: value['enableToBranch'],
          legalEntityId: value['legalEntityId'],
          legalEntityMenuId: value['legalEntityMenuId'],
          menuName: value['menuName'],
          menuParamId: value['menuParamId'],
          menuParameterName: value['menuParameterName'],
          menuParameterPath: value['menuParameterPath'],
          menuPlaceholder: value['menuPlaceholder'],
          ngModelPropName: value['ngModelPropName'],
          ngmodelProp: value['ngmodelProp']
        }:null)
        .filter(value => value.enableToBranch == true)
      }
      

    }

    //console.log(!tokenModel.passwordChange);

    if (!tokenModel.passwordChange){
      this.router.navigate(['legalentity','reset-password']);
      return false;
    }

    if (tokenModel.userRole == 'admin'){

      if (tokenModel.branchId == 0){
        this.router.navigate(['legalentity','add-head-office']);
        return false;
      }

    }

    /*if (localStorage.getItem('legalEntityUserDetails') != null)
    {
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityName = this.legalEntityUserModel.legalEntityUserDetails.legalEntityName;
      this.userFullName = this.legalEntityUserModel.legalEntityUserDetails.userFullName;

      this.headOffice=this.legalEntityUserModel.legalEntityBranchDetails.branchHeadOffice;

      this.branchName=this.legalEntityUserModel.legalEntityBranchDetails.branchName;

      this.userId=this.legalEntityUserModel.legalEntityUserDetails.userId;
     
    

      if (localStorage.getItem('legalEntityMenuPref') != null)
      {
        this.legalEntityMenuPrefObj = JSON.parse(localStorage.getItem('legalEntityMenuPref'));

        if (this.headOffice){
         this.updatedLegalEntityMenuPrefObj=this.legalEntityMenuPrefObj;
        }
        else{
          this.updatedLegalEntityMenuPrefObj=this.legalEntityMenuPrefObj.map((value,index) => value? {
            enableToBranch: value['enableToBranch'],
            legalEntityId: value['legalEntityId'],
            legalEntityMenuId: value['legalEntityMenuId'],
            menuName: value['menuName'],
            menuParamId: value['menuParamId'],
            menuParameterName: value['menuParameterName'],
            menuParameterPath: value['menuParameterPath'],
            menuPlaceholder: value['menuPlaceholder'],
            ngModelPropName: value['ngModelPropName'],
            ngmodelProp: value['ngmodelProp']
          }:null)
          .filter(value => value.enableToBranch == true)
        }
        
        //this.displayNewVersionData(); 
      }

      

       if (this.legalEntityUserModel.legalEntityUserDetails.passwordChange == false){
          this.router.navigate(['legalentity','reset-password']);
          return false;
       }

       if (this.legalEntityUserModel.legalEntityUserDetails.userRole == 'admin'){
       
        if (this.legalEntityUserModel.legalEntityBranchDetails.branchId == null || this.legalEntityUserModel.legalEntityBranchDetails.branchId == 0 || this.legalEntityUserModel.legalEntityBranchDetails.branchId == undefined)
        {
          this.router.navigate(['legalentity','add-head-office']);
          return false;
        }

       }

    }
    else
    {
     // this.router.navigate(['legalentity','login']);
      //return false;
    } */

   

  }

  legalEntityLogout():void{
   /// localStorage.removeItem('legalEntityUserDetails');
    //localStorage.removeItem('legalEntityMenuPref');

    this.cookieService.delete(this.utilAPI.authCookieName);
    this.cookieService.delete(this.utilAPI.userDefMenuCookieName);

    this.router.navigate(['legalentity','login']);
  }

}
