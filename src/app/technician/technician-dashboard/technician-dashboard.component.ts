import { Component, OnInit } from '@angular/core';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';
import { TehnicianUtilService } from '../services/tehnician-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItechnicianLoginDetailsStruct, ItechnicianDetailsReponse } from '../services/tehnician-util.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TechnicianComplaintService, ItechnicianConciseComplaintResponse, ItechnicianUnResolvedComptConciseResponse } from '../services/technician-complaint.service';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { LegalentityMenuPrefNames } from 'src/app/legalentity/model/legalentity-menu-pref-names';

export interface ItechConciseComplaintReqStruct{
   technicianId: number
   leadTimeDaysLimit: number,
   currentLoginDateTime: string,
   lastLoginDateTime: string,
   legalEntityId: number,
   branchId: number,
   userId: number,
   userRole: string
};

@Component({
  selector: 'app-technician-dashboard',
  templateUrl: './technician-dashboard.component.html',
  styleUrls: ['./technician-dashboard.component.css']
})
export class TechnicianDashboardComponent implements OnInit {

  technicianId: number;
  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  complaintsProgressBar: boolean;

  complaintMenuName: string;
  technicianMenuName: string;

  freshComplaintCount: number;
  assignedComplaintCount: number;
  inProgressComplaintCount: number;
  closedComplaintCount: number;
  leadtimeComplaintCount: number;

  userCurrentLoginDateTime: string;
  userLastLoginDateTime: string;

  leadDaysLimit: number;

  unresolvedComplaintProgressBar: boolean;
  unresolvedComptDayCount: number;

  unreslovedComptUptoDaysCount: number;
  unreslovedComptMoreThanDaysCount: number;

  constructor(
    private util: TehnicianUtilService,
    private router: Router,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private technicianComplaintServiceApi: TechnicianComplaintService,
    private legalEntityUtilServiceAPI: LegalentityUtilService,
    private authService: AuthService,
    private menuModel: LegalentityMenuPrefNames
  ) { 

    iconRegistry.addSvgIcon(
      "refresh-panel",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

  }

  
  popConciseComplaintRpt(): void {
    this.complaintsProgressBar = true;

    const conciseComplaintReqObj: ItechConciseComplaintReqStruct = {
      currentLoginDateTime: this.userCurrentLoginDateTime,
      lastLoginDateTime: this.userLastLoginDateTime,
      leadTimeDaysLimit: this.leadDaysLimit,
      technicianId: this.technicianId,
      legalEntityId: this.legalEntityId,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };

    try {
      this.technicianComplaintServiceApi.getTechnicianComplaintConciseRpt(conciseComplaintReqObj)
    .subscribe((data: ItechnicianConciseComplaintResponse) => {

      /*if (data.errorOccurred)
      {
        
        this.toastService.error("Something when worg while loading " + this.complaintMenuName + " details");
        this.complaintsProgressBar = false;
        return false;
      }*/

       this.freshComplaintCount = data.freshComplaintCount != null? data.freshComplaintCount: 0;
       this.assignedComplaintCount = data.assignedComplaintCount != null? data.assignedComplaintCount: 0;
       this.closedComplaintCount = data.closedComplaintCount != null? data.closedComplaintCount: 0;;
       this.leadtimeComplaintCount = data.leadTimeComplaintCount != null? data.leadTimeComplaintCount: 0;
       this.inProgressComplaintCount=data.inprogressComplaintCount != null? data.inprogressComplaintCount: 0;

      this.complaintsProgressBar = false;

    }, error => {
      
        this.toastService.error("Something when worg while loading " + this.complaintMenuName + " details");
        this.complaintsProgressBar = false;
        return false;
    });
    } catch (error) {
      this.complaintsProgressBar = false;
    }

  }

  popTechnicianUnResolvedComptRpt(): void{
    this.unresolvedComplaintProgressBar=true;

    try {
      this.technicianComplaintServiceApi.getUnresolvedDaysRuleBook(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole
        )
      .subscribe(unresolvedComptDayCountData => {
        /*if (unresolvedComptDayCountData['errorOccured']){
          this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
          this.unresolvedComplaintProgressBar=false;
        }*/
  
        this.unresolvedComptDayCount=unresolvedComptDayCountData['unresolvedDaysCount'];
  
        try {
          this.technicianComplaintServiceApi.getTechnicianUnResolvedConciseRpt(
            this.technicianId,
            this.unresolvedComptDayCount, 
            false,
            this.legalEntityId,
            this.branchId,
            this.userId,
            this.userRole)
        .subscribe((data:ItechnicianUnResolvedComptConciseResponse) => {
    
         /*if (data.errorOccurred){
           this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
           this.unresolvedComplaintProgressBar=false;
           return false;
         }*/
    
         this.unreslovedComptUptoDaysCount=data.unresolvedUptoCount != null ? data.unresolvedUptoCount : 0 ;
         this.unreslovedComptMoreThanDaysCount=data.unresolvedMoreCount != null ? data.unresolvedMoreCount : 0;
    
         this.unresolvedComplaintProgressBar=false
    
        }, error => {
          //this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
          this.unresolvedComplaintProgressBar=false;
        });
        } catch (error) {
          this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
          this.unresolvedComplaintProgressBar=false;
        }
  
  
      },error =>{
        //this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
        this.unresolvedComplaintProgressBar=false;
      }); 
    } catch (error) {
      this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
      this.unresolvedComplaintProgressBar=false;
    }
  
    
  }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    /*if (localStorage.getItem('technicianUserDetails') != null)
    {
      let technicianUserObj:ItechnicianLoginDetailsStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

      this.legalEntityId=technicianUserObj.legalEntityId;
      //this.technicianId = technicianUserObj.
    }
    else
    {
     //this.router.navigate(['technician/login']);
     this.router.navigate(['legalentity','login']);
     return false;
    }*/

    this.menuModel = this.legalEntityUtilServiceAPI.getLegalEntityMenuPrefNames();

    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

   /* const legalEntityMenuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));


    let complaintMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value? {
      legalEntityDefMenuName: value['menuName'],
      ngModelPropManueName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropManueName == 'complaints');

    this.complaintMenuName = complaintMenuNameObj[0]['legalEntityDefMenuName'];

    const technicianMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value?{
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }:null)
    .filter(value => value.ngModelPropMenuName == 'technician');

    this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];*/
    
    this.util.setTitle(this.technicianMenuName + " - Dashboard | Attendme");

   // let technicianDetailsObj: ItechnicianDetailsReponse = JSON.parse(localStorage.getItem('technicianDetails'));

    this.technicianId = tokenModel.technicianId; //technicianDetailsObj.technicianId;

    //let technicianUserDetailsObj: ItechnicianLoginDetailsStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

     //this.userCurrentLoginDateTime = technicianUserDetailsObj.currentLoginDateTime;
     //this.userLastLoginDateTime = technicianUserDetailsObj.lastUpdateDateTime;

     //this.leadDaysLimit = 8;

     this.popConciseComplaintRpt();

     this.unresolvedComptDayCount=0;
     this.popTechnicianUnResolvedComptRpt();
   
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page","");
    }

  }

}
