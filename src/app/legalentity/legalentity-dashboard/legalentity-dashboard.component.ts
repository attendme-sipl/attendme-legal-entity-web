import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { Router } from '@angular/router';
import { LegalentityUser } from '../model/legalentity-user';
import { LegalentityCommons } from '../model/legalentity-commons';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityQridUsage } from '../model/legalentity-qrid-usage';
import { LegalentityDashboardService, IcomplaintConciseReqObj, IbranchWiseQrIdConciseReponseStruct, IallottedBranchQrIdListRptResponse, IallottedBranchQrIdListDetailsExtract } from '../services/legalentity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { LegalentityComplaintConcise } from '../model/legalentity-complaint-concise';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LegalentityBranchDataService } from '../services/legalentity-branch-data.service';
import *as jwt_token from 'jwt-decode';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-legalentity-dashboard',
  templateUrl: './legalentity-dashboard.component.html',
  styleUrls: ['./legalentity-dashboard.component.css']
})
export class LegalentityDashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  complaintLeadTimeDays: number;
  enableQrIdUsageRptProgressBar: boolean;
  enableComptConciseRptProgressBar: boolean; 
  enableBranchConciseRtpProgressBar: boolean;

  userLastLoginDateTime: string;
  userCurrentLoginDateTime: string;

  totalBranchCount: number;
  headOffice: boolean;

  branchMenuName: string;

  enableBranchQrIdRtpProgressBar: boolean;

  branchName: string;

  dataSource;
  allottedQrIdBranchListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "branchName",
    "qrIdAllottedCount",
    "qrIdAssignedCount",
    "qrIdPendingCount"
  ];

  allottedBranchQrIdDetailsObj: IallottedBranchQrIdListDetailsExtract[];

  enableUnresolvedRptProgressBar:boolean;

  unreslovedComptDayLimit: number;
  unresolvedMoreCount: number = 0;
  unresolvedUptoCount: number = 0;

  userId: number;
  userRole: string;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private router:Router,
    private legalEntityUserModel: LegalentityUser,
    public commonModel: LegalentityCommons,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public qrIdUsageModel: LegalentityQridUsage,
    private dashboardServiceAPI: LegalentityDashboardService,
    private toastService: ToastrService,
    public legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    public complaintConciseRptModel: LegalentityComplaintConcise,
    private branchData: LegalentityBranchDataService,
    private cookieService: CookieService,
    private authService: AuthService
  ) { 
    commonModel.enableProgressbar=false;
    
    iconRegistry.addSvgIcon(
      "refreshIcon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/images/svg_icons/baseline-refresh-24px.svg")
    );
  }

  
  popQrIdConciseUsageRpt():void{
    this.enableQrIdUsageRptProgressBar = true;

    if(this.userRole=='admin'){

      try {

        this.dashboardServiceAPI.getQrIdUsageRpt(
          this.legalEntityId,
          this.branchId,
          this.userId,
          this.userRole
          )
    .subscribe((data:LegalentityQridUsage) => {
      
      this.qrIdUsageModel = data; 
      this.enableQrIdUsageRptProgressBar=false;

      this.popBranchWiseAllottedQrIdRpt();

    }, (error: any) => {
      //console.log(error);
      //this.toastService.error("Something went wrong while loading QR ID usage details");
      this.enableQrIdUsageRptProgressBar=false;
    });
        
      } catch (error) {
       this.toastService.error("Something went worng while loading QR ID usage details");
       this.enableQrIdUsageRptProgressBar=false;
      }

      
      
    }
    else{

      try {

        this.dashboardServiceAPI.getBrachwiseQRIdConciseRpt(
          this.legalEntityId,
          this.branchId,
          this.userId,
          this.userRole
          )
    .subscribe((data:IbranchWiseQrIdConciseReponseStruct) => {
       if (data.errorOccured)
       {
        this.toastService.error("Something went wrong while loading QR ID usage details");
        this.enableQrIdUsageRptProgressBar=false;
        return false;
       }

       this.qrIdUsageModel.totalQRIdAlloted = data.qrIdIssuedCount;
       this.qrIdUsageModel.totalQRIdAssigned = data.qrIdAssignedCount;
       this.qrIdUsageModel.totalPendingQRId = data.qrIdRemaining;

       this.enableQrIdUsageRptProgressBar=false;

    }, error=>{
      //this.toastService.error("Something went wrong while loading QR ID usage details");
      this.enableQrIdUsageRptProgressBar=false; 
    }); 
        
      } catch (error) {
        this.toastService.error("Something went wrong while loading QR ID usage details");
        this.enableQrIdUsageRptProgressBar=false; 
        
      }

      

    }
  }

  popComplaintConciseRtp():void{
    this.enableComptConciseRptProgressBar = true;

    try {

      let complaintConciseReqObj: IcomplaintConciseReqObj = {
        allBranch: false, //true,
        branchId: this.branchId,
        userId: this.userId,
        userRole: this.userRole,
        legalEntityId: this.legalEntityId,
        legalTimeDays: this.complaintLeadTimeDays,
        userLastLoginDateTime: this.userLastLoginDateTime,
        userLoginDateTime: this.userCurrentLoginDateTime
      };
  
      this.dashboardServiceAPI.getComplaintConciseRtp(complaintConciseReqObj)
      .subscribe((data: LegalentityComplaintConcise) => {
       // console.log(data);
        if (data.errorOccured){
          
          this.enableComptConciseRptProgressBar=false;
          this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
          return false;
        }
  
       
        this.complaintConciseRptModel = data;
        this.enableComptConciseRptProgressBar=false;  
       
  
      }, error => {
        this.enableComptConciseRptProgressBar=false;
        //this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
      });
      
    } catch (error) {
      this.enableComptConciseRptProgressBar=false;
      this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
    }

    
  }

  popBranchConciseRpt():void{
    this.enableBranchConciseRtpProgressBar=true;

    try {
      this.dashboardServiceAPI.getLegalEntityBranchConciseRpt(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole,
        true
        )
      .subscribe(data => {
       // if (data['errorOccured'])
        //{
         // this.enableBranchConciseRtpProgressBar=false;
          //this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.branchMenuName + " details");
          //return false;
        //}
  
        this.totalBranchCount = data['branchTotalCount'];
        this.enableBranchConciseRtpProgressBar=false;
  
      }, error => {
        this.enableBranchConciseRtpProgressBar=false;
      });
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.branchMenuName + " details");
      this.enableBranchConciseRtpProgressBar=false;
    }

    
  }

  popBranchWiseAllottedQrIdRpt():void{

    this.enableBranchQrIdRtpProgressBar=true;

    try {
      this.dashboardServiceAPI.getAllottedBranchQrIdListRpt(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole
        )
      .subscribe((data:IallottedBranchQrIdListRptResponse) => {

        /*if (data.errorOccurred){
          this.toastService.error("Something went wrong while loading QR ID details");
          this.enableBranchQrIdRtpProgressBar=false;
          return false;  
        }*/
  
        this.allottedQrIdBranchListCount - data.qrIdBranchList.length;
        this.allottedBranchQrIdDetailsObj=data.qrIdBranchList;
        this.dataSource=new MatTableDataSource(data.qrIdBranchList);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
  
        this.enableBranchQrIdRtpProgressBar=false;
        
      }, error => {
        //this.toastService.error("Something went wrong while loading QR ID details");
        this.enableBranchQrIdRtpProgressBar=false;
      });
    } catch (error) {
        this.toastService.error("Something went wrong while loading QR ID details");
        this.enableBranchQrIdRtpProgressBar=false;
    }

    
  }

  popUnreslovedComptRpt():void{
    this.enableUnresolvedRptProgressBar=true;

    this.dashboardServiceAPI.getUnresolvedDaysRuleBook(
      this.legalEntityId,
      this.branchId,
      this.userId,
      this.userRole
      )
    .subscribe(unresolvedComptDaysData => {
     
      /*if (unresolvedComptDaysData['errorOccured']){
        this.toastService.error("Something went wrong while loading unresloved " + this.legalEntityMenuPrefModel.complaintMenuName);
        this.enableUnresolvedRptProgressBar=false;
        return false;
      }*/

      this.unreslovedComptDayLimit = parseInt(unresolvedComptDaysData['unresolvedDaysCount']);
//console.log(this.branchId);
      this.dashboardServiceAPI.getBranchUnreslovedComptRpt(
        this.legalEntityId,
        this.branchId,
        this.userId,this.userRole,
        this.unreslovedComptDayLimit, 
        false)
    .subscribe(data => {
      if (data['errorOccurred']){
        this.toastService.error("Something went wrong while loading unresloved " + this.legalEntityMenuPrefModel.complaintMenuName);
        this.enableUnresolvedRptProgressBar=false;
        return false;
      }
      //console.log(data);

      this.unresolvedMoreCount=data['unresolvedMoreCount'];
      this.unresolvedUptoCount=data['unresolvedUptoCount'];

      this.enableUnresolvedRptProgressBar=false;
      
    }, error => {
      //this.toastService.error("Something went wrong while loading unresloved " + this.legalEntityMenuPrefModel.complaintMenuName);
        this.enableUnresolvedRptProgressBar=false;
    });
    },error => {
      console.log(error);
      //this.toastService.error("Something went wrong while loading unresloved " + this.legalEntityMenuPrefModel.complaintMenuName);
      this.enableUnresolvedRptProgressBar=false;
    });

    
  }

  onOpenComplaintClick(){

    this.branchData.branchDetails = {
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','open']);
  }

  onAssignedComplaintClick(){
    this.branchData.branchDetails = {
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','assigned']);
  }

  onInprogressComplaintClick(){
    this.branchData.branchDetails = {
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','inprogress']);
  }

  onClosedComplaintClick(){
    this.branchData.branchDetails = {
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','closed']);
  }

  onTrashComplaintClick(){
    this.branchData.branchDetails = {
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','trash','complaint']);
  }

  onResolvedComplaintClick(moreThanUptoFlag: string){
    this.branchData.branchDetails={
      branchId: this.branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','complaints','unresolved',moreThanUptoFlag]);
  }

  ngOnInit() {

   // const jwtToken = jwt_token(this.cookieService.get('auth'));

    let tokenModel: TokenModel=this.authService.getTokenDetails();

    this.headOffice=tokenModel.branchHeadOffice;
    this.legalEntityId=tokenModel.legalEntityId;

    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.branchId=tokenModel.branchId;

    /*if (localStorage.getItem('legalEntityUserDetails') != null)
    {
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId = this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.legalEntityUserModel.legalEntityBranchDetails.branchId;

      this.userLastLoginDateTime = this.legalEntityUserModel.legalEntityUserDetails.lastUpdateDateTime;
      this.userCurrentLoginDateTime = this.legalEntityUserModel.legalEntityUserDetails.currentLoginDateTime;

      this.headOffice=this.legalEntityUserModel.legalEntityBranchDetails.branchHeadOffice;

      this.branchName=this.legalEntityUserModel.legalEntityBranchDetails.branchName;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    } */

    this.complaintLeadTimeDays=7;

    this.utilServiceAPI.setTitle("Legalentity - Dashboard | Attendme");

    this.legalEntityMenuPrefModel = this.utilServiceAPI.getLegalEntityMenuPrefNames()

    this.branchMenuName=this.legalEntityMenuPrefModel.branchMenuName;

    this.popQrIdConciseUsageRpt();
    this.popComplaintConciseRtp();
    this.popBranchConciseRpt();

    //this.popBranchWiseAllottedQrIdRpt();

    this.unreslovedComptDayLimit=0;

    this.popUnreslovedComptRpt();

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
