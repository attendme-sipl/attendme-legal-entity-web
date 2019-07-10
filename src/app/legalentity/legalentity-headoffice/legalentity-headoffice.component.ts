import { Component, OnInit } from '@angular/core';
//import { UtilServicesService } from '../../util-services.service';
//import { LegalentityBranch } from '../model/legalentity-branch';
import { Router } from '@angular/router';
//import { LegalentityLogin } from '../model/legalentity-login';
//import { CountryCallingCode } from '../../model/country-calling-code';
//import {UniquePipe} from './node_modules/ngx-pipes'
//import { forEach } from './node_modules/@angular/router/src/utils/collection';
import {NgForm,Validator} from '@angular/forms';
import { LegalentityUser } from '../model/legalentity-user';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityBranch } from '../model/legalentity-branch';
import { LegalentityBranchService } from '../services/legalentity-branch.service';
//import { stringify } from '@angular/core/src/render3/util';
//import { LegalentityBranchService } from '../services/legalentity-branch.service';
//import { first } from './node_modules/rxjs/operators';


@Component({
  selector: 'app-legalentity-headoffice',
  templateUrl: './legalentity-headoffice.component.html',
  styleUrls: ['./legalentity-headoffice.component.css']
 // providers: [UniquePipe]
})
export class LegalentityHeadofficeComponent implements OnInit {

  legalEntityId:number;
  userId:number
  userNm:string;
  userRole:string;

  countryCode:number;

  errorBit:boolean;
  errorMsg:string;

  userFullName:string;
  userMobileNumber:string;
  userEmaild:string;
 
  constructor(
   // private util:UtilServicesService,
    public branchOfficeModel:LegalentityBranch,
    private router:Router,
   // private legalEntityLoginModel:LegalentityLogin,
   // private  unique:UniquePipe,
   private branchApi:LegalentityBranchService,
   private userModel: LegalentityUser,
   private iconRegistry: MatIconRegistry,
   sanitizer: DomSanitizer,
   private utilServiceAPI:LegalentityUtilService
    
  ) { 
    
    iconRegistry.addSvgIcon(
      "attendme-logo",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );

 /*   if (localStorage.getItem('legalEntityUser') != null)
    {
      legalEntityLoginModel = JSON.parse(localStorage.getItem('legalEntityUser'));
      this.legalEntityId = legalEntityLoginModel.legalEntityId;
      this.userNm= legalEntityLoginModel.userFullName;
      this.userId=legalEntityLoginModel.userId;
      this.userRole=legalEntityLoginModel.userRole;

      this.userFullName = legalEntityLoginModel.userFullName;
      this.userMobileNumber = legalEntityLoginModel.userMobileNumer;
      this.userEmaild = legalEntityLoginModel.userEmailId;

    util.setTitle("Legal Entity - Reset Password | Attendme")
    
    }
    else
    {
      //console.log("in blank");
      this.router.navigate(['/legalentity/login'])
    }  */

  }

  
  countryCodeArr:number[];
   


     popCountryCallingCode()
     {
      
        this.utilServiceAPI.countryCallingCode()
        .subscribe((data:any) => {
        
        this.countryCodeArr = data;
        //console.log(this.countryCodeArr);
         
        },
      error => {
        console.log(error);
      })  
     }

   addHeadOffice(branchOfficeModel:LegalentityBranch)
     {

     
      this.branchApi.addAndGetBranchHeadOffice(branchOfficeModel)
      .subscribe((data => {

      // console.log(data);
        branchOfficeModel.branchId = data.branchId;

        
        if (branchOfficeModel.branchId == 0)
        {
          //console.log("Error");
    
          this.errorBit = true;
          this.errorMsg = 'There was an error, Please contact administrator !!!';

        }
        else
        {
          //console.log(data);

          this.userModel.legalEntityBranchDetails ={
            branchHeadOffice: true,
            branchId: branchOfficeModel.branchId,
            branchName: branchOfficeModel.branchName,
            complaintStageCount: branchOfficeModel.complaintStageCount
          }   
         
          localStorage.removeItem('legalEntityUserDetails');
          localStorage.setItem('legalEntityUserDetails', JSON.stringify(this.userModel));
          
          this.router.navigate(['legalentity/portal/dashboard']);
        }

      }),
    error => {
     // console.log(error);
     this.errorBit = true;
          this.errorMsg = 'There was an error, Please contact administrator !!!';
    })
     } 

     addBranch(legalEntityHeadOffice:NgForm)
     {

      
    
       if (legalEntityHeadOffice.valid)
       {

       this.errorBit = false;
       this.errorMsg = '';

       this.branchOfficeModel.legalEntityId = this.legalEntityId;
       this.branchOfficeModel.branchHeadOffice = true;
       this.branchOfficeModel.adminApprove =true;
       this.branchOfficeModel.branchActiveStatus =true;
       this.branchOfficeModel.addedByUserId = this.userId;
       
       if (this.branchOfficeModel.contactMobile != undefined || this.branchOfficeModel.contactMobile != null)
       {
        this.branchOfficeModel.contactMobile = this.countryCode + "-" + this.branchOfficeModel.contactMobile;
       } 
      
       
       this.addHeadOffice(this.branchOfficeModel);

       }

       

       //this.reset(legalEntityHeadOffice);
       
     }

     
     reset(legalEntityBranch:NgForm)
     {

       legalEntityBranch.reset({
         countryCode:91
       });  
     }

     

  logout()
  {
    localStorage.removeItem('legalEntityUserDetails');
    localStorage.removeItem('legalEntityMenuPref');
    this.router.navigate(['/legalentity/login']);
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){

      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      if (this.userModel.legalEntityBranchDetails.branchId != 0 || this.userModel.legalEntityBranchDetails.branchId != null || this.userModel.legalEntityBranchDetails.branchId != undefined){

        if (this.userModel.legalEntityBranchDetails.branchHeadOffice){
          this.router.navigate(['/legalentity/portal/dashboard']);
        }

       this.utilServiceAPI.setTitle("Legal Entity - Add Head Office | Attendme");

      }

    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.errorBit = false;
    this.errorMsg = '';

    this.userNm=this.userModel.legalEntityUserDetails.userFullName;
    this.userId=this.userModel.legalEntityUserDetails.userId;
    this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;

    this.popCountryCallingCode();

    this.branchOfficeModel.contactPersonName = this.userModel.legalEntityUserDetails.userFullName;

    let userMobileNumberArr:string[];

     userMobileNumberArr = this.userModel.legalEntityUserDetails.userMobileNumer.split('-');

    this.countryCode = parseInt(userMobileNumberArr[0]);
    
    this.branchOfficeModel.contactMobile = userMobileNumberArr[1];

    this.branchOfficeModel.contactEmail  =  this.userModel.legalEntityUserDetails.userEmailId;

  }

}
