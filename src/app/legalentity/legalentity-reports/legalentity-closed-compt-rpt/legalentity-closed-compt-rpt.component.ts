import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource } from '@angular/material';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IcomplaintIndivReqStruct, IComplaintIdStruct, IComplaintBodyStruct, IclosedComplaintListRptResponse, IclosedComplaintListDetailsResponse } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { IbranchListDetailsResponse, LegalentityBranchService, IbranchRptReqStruct, IbranchListReportResponse } from '../../services/legalentity-branch.service';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-closed-compt-rpt',
  templateUrl: './legalentity-closed-compt-rpt.component.html',
  styleUrls: ['./legalentity-closed-compt-rpt.component.css']
})
export class LegalentityClosedComptRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;


  complaintMenuName: string;
  technicianMenuName: string;
  branchMenuName: string;
  equptMenuName: string;

  enableProgressBar: boolean;

  dataSource;
  closedComptListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "closedDateTime",
    "actionTaken",
    "failureReason"
  ];

  closedComplaintListDetailsObj: IclosedComplaintListDetailsResponse[];

  searchKey;
  totalRecordCount: number=0;

  branchListArr: IbranchListDetailsResponse[];
  userBranchId: number;
  branchHeadOffice: boolean;
  
  constructor(
    private userModel: LegalentityUser,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintRtpServiceAPI: LegalentityComplaintRptService,
    private menuModel: LegalentityMenuPrefNames,
    private dialog:MatDialog,
    private branchData: LegalentityBranchDataService,
    private branchServiceAPI: LegalentityBranchService,
    private authService: AuthService
  ) { 
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }

  openComplaintDetailsDialog(complaintId: number):void{

    const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: complaintId
    };
    
    const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
      data: IndivComplaintReqObj
    });

  }

 
  popClosedComplaintRpt(exportToExcel: boolean):void{

    this.enableProgressBar=true;
    this.searchKey='';

    const closedComplaintsReqObj:IComplaintBodyStruct={
      allBranch: false,
      branchId: this.branchId,
      complaintStatus: 'closed',
      fromDate: null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName,
      complaintTrash: false,
      userId: this.userId,
      userRole: this.userRole
    };

    if (exportToExcel){

      try {
        let fileName: string = "Closed-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
      this.complaintRtpServiceAPI.getClosedComplaintListExportToExcel(closedComplaintsReqObj)
      .subscribe(data => {
        saveAs(data, fileName + ".xls");
        this.enableProgressBar=false;
      }, error => {
       // this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      });
      } catch (error) {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      }

      
    }
    else{

      try {

        this.complaintRtpServiceAPI.getClosedComplaintListRpt(closedComplaintsReqObj)
      .subscribe((data: IclosedComplaintListRptResponse) => {
        /*if (data.errorOccurred){
          this.toastService.error("Something went wrong while loading closed " + this.complaintMenuName + " list report");
          this.enableProgressBar=false;
          return false;
        }*/
  
        //console.log(data);

        const filteredClosedComplaintObj = data.complaintList.map((value,index) => value ? {
          complaintId: value['complaintId'],
          complaintNumber: value['complaintNumber'],
          qrCodeId: value['qrCodeId'],
          qrId: value['qrId'],
          regsiteredByName: value['regsiteredByName'],
          registeredByMobileNumber: value['registeredByMobileNumber'],
          closedDateTime: value['closedDateTime'],
          actionTaken: value['actionTaken'],
          failureReason: value['failureReason'],
          complaintTrash: value['complaintTrash']
        } : null)
        .filter(value => value.complaintTrash == false);

        this.totalRecordCount=filteredClosedComplaintObj.length;
  
        this.closedComplaintListDetailsObj=filteredClosedComplaintObj;
  
        this.closedComptListCount=filteredClosedComplaintObj.length;
        this.dataSource=new MatTableDataSource(filteredClosedComplaintObj);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort; 
  
        this.enableProgressBar=false;
      }, error => {
        //this.toastService.error("Something went wrong while loading closed " + this.complaintMenuName + " list report");
        this.enableProgressBar=false;
      });
        
      } catch (error) {
        this.toastService.error("Something went wrong while loading closed " + this.complaintMenuName + " list report");
        this.enableProgressBar=false;
      }
      
      
    }

    
  }

   // to be added after jwt implmenetation

  popBranchList(){

    //this.openComplaintProgressBar=true;

    const branchListReqObj: IbranchRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: false,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };

    try {
      this.branchServiceAPI.getBranchListReport(branchListReqObj)
    .subscribe((data: IbranchListReportResponse) => {
      //console.log(data);
      /*if (data.errorOccured){
        this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
        return false;
      }*/

      this.branchListArr=data.branchDetailsList;

    }, error => {
      //this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    });
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    }

    
  }

  ngOnInit() {

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;
    this.branchHeadOffice=tokenModel.branchHeadOffice;

    /*if(localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.userBranchId=this.userModel.legalEntityBranchDetails.branchId;
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      
      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    } */

    if (this.branchData.branchDetails != null){
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
      //this.branchId=this.userBranchId
      this.branchId=tokenModel.branchId;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

    this.utilServiceAPI.setTitle("Legalentity - Closed " + this.complaintMenuName + " Report | Attendme");
    
    
    if (this.branchHeadOffice){
      this.popBranchList();
    }

   this.popClosedComplaintRpt(false);
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
