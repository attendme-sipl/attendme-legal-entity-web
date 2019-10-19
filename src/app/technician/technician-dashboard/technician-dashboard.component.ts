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

export interface ItechConciseComplaintReqStruct{
   technicianId: number
   leadTimeDaysLimit: number,
   currentLoginDateTime: string,
   lastLoginDateTime: string
};

@Component({
  selector: 'app-technician-dashboard',
  templateUrl: './technician-dashboard.component.html',
  styleUrls: ['./technician-dashboard.component.css']
})
export class TechnicianDashboardComponent implements OnInit {

  technicianId: number;
  legalEntityId: number;
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
    private technicianComplaintServiceApi: TechnicianComplaintService
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
      technicianId: this.technicianId
    };

    this.technicianComplaintServiceApi.getTechnicianComplaintConciseRpt(conciseComplaintReqObj)
    .subscribe((data: ItechnicianConciseComplaintResponse) => {

      if (data.errorOccurred)
      {
        
        this.toastService.error("Something when worg while loading " + this.complaintMenuName + " details");
        this.complaintsProgressBar = false;
        return false;
      }

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

  }

  popTechnicianUnResolvedComptRpt(): void{
    this.unresolvedComplaintProgressBar=true;

    this.technicianComplaintServiceApi.getUnresolvedDaysRuleBook(this.legalEntityId)
    .subscribe(unresolvedComptDayCountData => {
      if (unresolvedComptDayCountData['errorOccured']){
        this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
        this.unresolvedComplaintProgressBar=false;
      }

      this.unresolvedComptDayCount=unresolvedComptDayCountData['unresolvedDaysCount'];

      this.technicianComplaintServiceApi.getTechnicianUnResolvedConciseRpt(this.technicianId,this.unresolvedComptDayCount, false)
    .subscribe((data:ItechnicianUnResolvedComptConciseResponse) => {

     if (data.errorOccurred){
       this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
       this.unresolvedComplaintProgressBar=false;
       return false;
     }

     this.unreslovedComptUptoDaysCount=data.unresolvedUptoCount != null ? data.unresolvedUptoCount : 0 ;
     this.unreslovedComptMoreThanDaysCount=data.unresolvedMoreCount != null ? data.unresolvedMoreCount : 0;

     this.unresolvedComplaintProgressBar=false

    }, error => {
      this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
      this.unresolvedComplaintProgressBar=false;
    });
    },error =>{
      this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName + " details");
      this.unresolvedComplaintProgressBar=false;
    });
  
    
  }

  ngOnInit() {


    if (localStorage.getItem('technicianUserDetails') != null)
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
    }

    const legalEntityMenuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));


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

    this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];
    
    this.util.setTitle(this.technicianMenuName + " - Dashboard | Attendme");

    let technicianDetailsObj: ItechnicianDetailsReponse = JSON.parse(localStorage.getItem('technicianDetails'));

    this.technicianId = technicianDetailsObj.technicianId;

    let technicianUserDetailsObj: ItechnicianLoginDetailsStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

     this.userCurrentLoginDateTime = technicianUserDetailsObj.currentLoginDateTime;
     this.userLastLoginDateTime = technicianUserDetailsObj.lastUpdateDateTime;

     this.leadDaysLimit = 8;

     this.popConciseComplaintRpt();

     this.unresolvedComptDayCount=0;
     this.popTechnicianUnResolvedComptRpt();
   

  }

}
