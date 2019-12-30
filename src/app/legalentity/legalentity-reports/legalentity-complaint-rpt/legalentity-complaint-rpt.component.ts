import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource, Sort } from '@angular/material';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IComplaintBodyStruct, IqrIdAllcomplaintDetailsResponse, IqrIdAllcomplaintRptResponse, IComplaintBodyStructForExcelRpt, IcomplaintIndivReqStruct } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import { IbranchRptReqStruct, IbranchListReportResponse, IbranchListDetailsResponse, LegalentityBranchService } from '../../services/legalentity-branch.service';

@Component({
  selector: 'app-legalentity-complaint-rpt',
  templateUrl: './legalentity-complaint-rpt.component.html',
  styleUrls: ['./legalentity-complaint-rpt.component.css']
})
export class LegalentityComplaintRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;

  complaintMenuName: string;
  technicianMenuName: string; 
  branchMenuName: string;
  equptMenuName: string;

  enableProgressBar: boolean;

  dataSource;
  qrIdAllComptListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "openDateTime",
    "assignedDateTime",
    "inProgressDateTime",
    "closedDateTime",
    "assignedTechnicianName",
    "actionTaken",
    "failureReason",
    "currentComplaintStatus"
  ];

  qrIdCAllomplaintListDetailsObj:IqrIdAllcomplaintDetailsResponse[];
  searchKey;
  totalRecordCount: number =0;
  complaintFilterType;
  
  branchHeadOffice: boolean;

  branchListArr: IbranchListDetailsResponse[];

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
    private branchServiceAPI: LegalentityBranchService
  ) { 
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }

  // to be done after jwt implementation

  /*popQrIdAllComplaintRpt(exportToExcel: boolean):void{
    this.enableProgressBar=true;
    this.searchKey='';

    const qrIdComplaintArrRptReqObj:IComplaintBodyStruct={
      allBranch: false,
      branchId: this.branchId,
      complaintStatus: '',
      fromDate:null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName,
      complaintTrash: false
    };

    //console.log(qrIdComplaintArrRptReqObj);

    if (exportToExcel){
      this.complaintRtpServiceAPI.getQrIdAllComplaintsExportToExcel(qrIdComplaintArrRptReqObj)
      .subscribe(data => {
        let fileName: string = "All-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
        saveAs(data, fileName + ".xls");
        this.enableProgressBar=false;
      }, error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      });
    }
    else{
      this.complaintRtpServiceAPI.getQrIdAllComplaintsRpt(qrIdComplaintArrRptReqObj)
    .subscribe((data: IqrIdAllcomplaintRptResponse) => {
    
        if (data.errorOccurred){
          this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details report");
          this.enableProgressBar=false;
          return false;
        }

    
       

        this.qrIdCAllomplaintListDetailsObj=data.complaintList;

        let filteredComplaintObj: IqrIdAllcomplaintDetailsResponse[];

        if (this.complaintFilterType == '0'){
          filteredComplaintObj=this.getFilteredComplaintObj(data.complaintList, false);
        }

        if (this.complaintFilterType == '1'){
          filteredComplaintObj=this.getFilteredComplaintObj(data.complaintList, true); 
        }

        if (this.complaintFilterType == '2'){
          filteredComplaintObj = data.complaintList;
        }

        this.totalRecordCount=filteredComplaintObj.length;
        
        this.dataSource=new MatTableDataSource(filteredComplaintObj);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort

        const sortState: Sort = {active: 'openDateTime', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
        
        this.enableProgressBar=false;
    }, error => {
        this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details report");
        this.enableProgressBar=false;
    });
    }

    
  }*/

  onFilterItemChange(){
    
    let filteredComplaintObj: IqrIdAllcomplaintDetailsResponse[];

    if (this.complaintFilterType == 0){
      filteredComplaintObj = this.getFilteredComplaintObj(this.qrIdCAllomplaintListDetailsObj, false);
    }

    if (this.complaintFilterType == 1){
      filteredComplaintObj = this.getFilteredComplaintObj(this.qrIdCAllomplaintListDetailsObj, true);
    }

    if (this.complaintFilterType == 2){
      filteredComplaintObj = this.qrIdCAllomplaintListDetailsObj;
    }

    this.totalRecordCount=filteredComplaintObj.length;
        
    this.dataSource=new MatTableDataSource(filteredComplaintObj);
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort

    const sortState: Sort = {active: 'openDateTime', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

  }

getFilteredComplaintObj(allComplaintsObj: IqrIdAllcomplaintDetailsResponse[], complaintTrash: boolean){

  const allComplaintsFilterObj = allComplaintsObj.map((value,index) => value ? {
    complaintId: value['complaintId'],
    complaintNumber: value['complaintNumber'],
    qrCodeId: value['qrCodeId'],
    qrId: value['qrId'],
    regsiteredByName: value['regsiteredByName'],
    registeredByMobileNumber: value['registeredByMobileNumber'],
    assignedTechnicianName: value['asignedTechnicianMobile'],
    asignedTechnicianMobile: value['assignedTechnicianName'], 
    openDateTime: value['openDateTime'],
    assignedDateTime: value['assignedDateTime'],
    inProgressDateTime: value['inProgressDateTime'],
    closedDateTime: value['closedDateTime'],
    actionTaken: value['actionTaken'],
    failureReason: value['failureReason'],
    currentComplaintStatus: value['currentComplaintStatus'],
    complaintTrash: value['complaintTrash']
  } : null)
  .filter(value => value.complaintTrash == complaintTrash);

  return allComplaintsFilterObj;
}

//to be added after jwt implementation

/*openComplaintDetailsDialog(complaintId: number):void{

  const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
    complaintId: complaintId
  };
  
  const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
    data: IndivComplaintReqObj
  });

}*/

 // to be added after jwt implmenetation

/*popBranchList(){

  //this.openComplaintProgressBar=true;

  const branchListReqObj: IbranchRptReqStruct = {
    branchMenuName: this.branchMenuName,
    complaintMenuName: this.complaintMenuName,
    equptMenuName: this.equptMenuName,
    exportToExcel: false,
    legalEntityId: this.legalEntityId,
    technicianMenuName: this.technicianMenuName
  };

  this.branchServiceAPI.getBranchListReport(branchListReqObj)
  .subscribe((data: IbranchListReportResponse) => {
    //console.log(data);
    if (data.errorOccured){
      this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
      return false;
    }

    this.branchListArr=data.branchDetailsList;

  }, error => {
    this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
  });
}*/

  ngOnInit() {

    if(localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;

      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.equptMenuName=this.menuModel.equipmentMenuName;

    this.utilServiceAPI.setTitle("Legalentity - " + this.complaintMenuName + " Report | Attendme");

    this.complaintFilterType="0";

     // to be added after jwt implmenetation

    /*if (this.branchHeadOffice){
      this.popBranchList();
    }*/

// to be done after jwt implementation

    ///this.popQrIdAllComplaintRpt(false);
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  /*dowloadExcel(){

    this.enableProgressBar=true;

    const qrIdComplaintArrRptReqObj:IComplaintBodyStructForExcelRpt={
      allBranch: false,
      branchId: this.branchId,
      complaintStatus: '',
      fromDate:null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      complaintMenuName: this.complaintMenuName,
      technicianMenuName: this.technicianMenuName
    };

    let fileName: string = this.complaintMenuName + "-report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

   this.complaintRtpServiceAPI.exportToExcelQrIdAllComptRpt(qrIdComplaintArrRptReqObj)
   .subscribe(data => {
    saveAs(data, fileName);
    this.enableProgressBar=false;
   }, error => {
     this.toastService.error("Something went wrong while exporting data to excel");
     this.enableProgressBar=false;
   });

  }*/

  

}
