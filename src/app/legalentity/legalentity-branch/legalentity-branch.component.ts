import { Component, OnInit } from '@angular/core';
//import { UtilServicesService } from './node_modules/src/app/util-services.service';
import { LegalentityBranch } from '../model/legalentity-branch';
//import { Router, ActivatedRoute } from './node_modules/@angular/router';
import { LegalentityEquipmentService } from '../services/legalentity-equipment.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LegalentityAddBranch } from '../model/legalentity-add-branch';
import { LegalentityBranchService } from '../services/legalentity-branch.service';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityBranchRulebook } from '../model/legalentity-branch-rulebook';
import { LegalentityUser } from '../model/legalentity-user';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { ToastrService } from 'ngx-toastr';
//import { LegalEntity } from './node_modules/src/app/superadmin/model/legal-entity';
//import { LegalentityLogin } from '../model/legalentity-login';
//import {first,subscribeOn} from './node_modules/rxjs/operators';
//import { pipe } from './node_modules/rxjs';
//import { LegalentityBranchRulebook } from '../model/legalentity-branch-rulebook';
//import { LegalentityBranchService } from '../services/legalentity-branch.service';
//import {NgForm} from './node_modules/@angular/forms'
//import { LegalentityAddBranch } from '../model/legalentity-add-branch';
//import * as moment from './node_modules/moment';

@Component({
  selector: 'app-legalentity-branch',
  templateUrl: './legalentity-branch.component.html',
  styleUrls: ['./legalentity-branch.component.css']
})
export class LegalentityBranchComponent implements OnInit {

  legalEntityMenuId:number;
  branchMenuName:string;
  legalEntityId:number;
  branchId: number;
  userRole: string;
  branchRuleBookExceed:boolean;
  errorBit:boolean;
 // dateDisp:string;
 contactCountryCode:number;
 userCountryCode:number;
 loading:boolean;
btnDisabled:boolean;
userId:number;
cssClass:string;
userMessage:string;
dispMessageBit:boolean;

  constructor(
    private util: LegalentityUtilService,
    private branchModel:LegalentityBranch,
    private router:Router,
  //  private activeRoute:ActivatedRoute,
    private equipmentServiceAPI:LegalentityEquipmentService,
    //private legalEntityLoginModel:LegalentityLogin,
    private branchRuleBookModel:LegalentityBranchRulebook,
    private branchervice:LegalentityBranchService,
    public addBranchModel:LegalentityAddBranch,
    private userModel: LegalentityUser,
    private menuModel: LegalentityMenuPrefNames,
    private authService: AuthService,
    private toastService: ToastrService
  ) {

    //this.dateDisp = moment().format('MMM DD YYYY HH:mm:ss');
/*
    if (localStorage.getItem('legalEntityUser') != null)
    {

      legalEntityLoginModel = JSON.parse(localStorage.getItem('legalEntityUser'));

      this.legalEntityId = legalEntityLoginModel.legalEntityId;
      this.userId = legalEntityLoginModel.userId;

      if (localStorage.getItem('legalEntityBranch') == null)
      {
        this.router.navigate(['/legalentity/login']);
      }

    }
    else
    {
      this.router.navigate(['/legalentity/login']);
    }
      */
   }

   callingCodeArr:number[];
   


    popCountryCallingCode()
     {
       try {
        this.util.countryCallingCode()
        .subscribe((data:any) => {
       
        this.callingCodeArr = data;

        // console.log(data);
         
        },
      error => {
        //.log(error);
      });
       } catch (error) {
         this.toastService.error("Something went wrong while loading country calling codes");
       }
      
        
     } 

     addNewBranch(addBranchForm:NgForm)
     {

      try {
        
        if(addBranchForm.invalid)
      {
        return;
      }
     
        this.btnDisabled =true;
      this.loading =true;
      
      this.addBranchModel.legalEntityId = this.legalEntityId;
      this.addBranchModel.branchHeadOffice =false;
      this.addBranchModel.adminApprove =true;
      this.addBranchModel.addedByUserId = this.userId;
      
      this.addBranchModel.branchUserActiveStatus =true;
      this.addBranchModel.branchUserRole = "branch";
     
      this.addBranchModel.branchActiveStatus =true;

      this.addBranchModel.branchUserPasswordChange =false;

      this.addBranchModel.contactMobileNumber = this.contactCountryCode + "-" + this.addBranchModel.branchContactMobileWoCC;
      this.addBranchModel.branchUserMobileNumber = this.userCountryCode + "-" + this.addBranchModel.branchUserMobileWoCC;

      this.addBranchModel.branchMenuName = this.branchMenuName; 

      this.addBranchModel.branchId=this.branchId;
      this.addBranchModel.userId=this.userId;
      this.addBranchModel.userRole=this.userRole;

      try {

        this.branchervice.addNewBranchDetails(this.addBranchModel)
     // .pipe(first())
      .subscribe(data => {
//console.log(data);
        this.addBranchModel.branchId = data.branchId;
        this.addBranchModel.branchAdded = data.branchAdded;
        this.addBranchModel.branchExceed =data.branchExceed;
        this.addBranchModel.userEmailMobileExisits = data.userEmailMobileExisits;

         if(this.addBranchModel.branchExceed)
       {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "Number of branch added has exceeded your rule book limit. To upgrade, please contact administrator";
       }

       else if(this.addBranchModel.userEmailMobileExisits)
       {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "Entered mobile number number already exists with another account. Please enter another email id";
       }

       else if (this.addBranchModel.branchAdded == false)
       {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "There was an error !!!";
       }
       
       
       else
       {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-success";
        this.userMessage = this.branchMenuName + " Added Successfully !!!";

        this.resetBranchForm(addBranchForm);
       
       }

        
        this.btnDisabled=false;
        this.loading=false; 
      }
      , error => {

        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "There was an error !!!";

        this.btnDisabled=false;
        this.loading=false; 

      });
        
      } catch (error) {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "There was an error !!!";

        this.btnDisabled=false;
        this.loading=false; 
      }


      } catch (error) {
        this.dispMessageBit = true;
        this.cssClass ="alert alert-danger";
        this.userMessage = "There was an error !!!";

        this.btnDisabled=false;
        this.loading=false; 
      }
        
     }

     resetBranchForm(addBranchForm:NgForm)
     {
       try {
        this.checkBranchExceed(); 

       addBranchForm.reset({
       contactCountryCode:91,
       userCountryCode:91
       });         
       } catch (error) {
         this.toastService.error("Something went  wrong while " + this.branchMenuName + " form reset operation","");
       }

     }

     checkBranchExceed()
     {

      try {
        this.branchRuleBookModel.legalEntityId = this.legalEntityId;
      this.branchRuleBookModel.branchHeadOffice = false;

      this.branchRuleBookModel.branchId=this.branchId;
      this.branchRuleBookModel.userId=this.userId;
      this.branchRuleBookModel.userRole=this.userRole; 
 
      this.branchervice.getBranchRuleBook(this.branchRuleBookModel)
      //.pipe(first())
      .subscribe(data => {
 
       /*if (data.errorFlag == true)
       {
         this.errorBit = true;
         return;
       }*/
 
        this.branchRuleBookModel = data;
       
        let CurrentBranchCount:number = this.branchRuleBookModel.addedBranchCount;
        let RuleBookBranchCount:number = this.branchRuleBookModel.ruleBookBranchCount;
 
    if (CurrentBranchCount>= RuleBookBranchCount)  {
      this.branchRuleBookExceed =true;
    }
    else
    {
     this.branchRuleBookExceed =false;
     this.popCountryCallingCode();
 
     this.contactCountryCode = 91;
     this.userCountryCode = 91;
    }
 
      },  error => {this.errorBit=true;} );
      } catch (error) {
        this.toastService.error("Something went wrong while setting " + this.branchMenuName + " page details","");
      }

     }
     

  ngOnInit() {

    try {
      
    } catch (error) {
      this.toastService.error("Something went wrong while ")
    }

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;

    }
    else{
      this.router.navigate(['legalentity','login']);
    }*/

    this.menuModel=this.util.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuModel.branchMenuName;

    this.errorBit=false;
    this.btnDisabled =false;
    this.loading=false;
    
    this.dispMessageBit =false;
    
    this.util.setTitle("Legalentity - " + this.branchMenuName + " | Attendme");
    
    //this.legalEntityMenuId = this.activeRoute.snapshot.params['leMenuId'];
 
  /*   this.equipmentServiceAPI.getLegalEntityMenuName(this.legalEntityId,this.legalEntityMenuId)
     //.pipe(first())
     .subscribe((data => {
       this.branchMenuName = data.prefMenuName;
       this.util.setTitle("Legal Entity - Add " + this.branchMenuName + " | Attendme");
     })) */

     this.checkBranchExceed();    
  }

}
