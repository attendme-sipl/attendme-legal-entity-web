import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource, Sort } from '@angular/material';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IComplaintBodyStruct, IqrIdAllcomplaintDetailsResponse, IqrIdAllcomplaintRptResponse, IComplaintBodyStructForExcelRpt } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import {saveAs} from 'file-saver';
import *as moment from 'moment';

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
  complaintFilterType: string = "0";

  constructor(
    private userModel: LegalentityUser,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintRtpServiceAPI: LegalentityComplaintRptService,
    private menuModel: LegalentityMenuPrefNames,
    private dialog:MatDialog
  ) { 
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }

  popQrIdAllComplaintRpt(exportToExcel: boolean):void{
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
      //console.log(data);
        if (data.errorOccurred){
          this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details report");
          this.enableProgressBar=false;
          return false;
        }

        this.totalRecordCount=data.complaintList.length;

        this.qrIdCAllomplaintListDetailsObj=data.complaintList;
        this.qrIdAllComptListCount=data.complaintList.length;

        this.dataSource=new MatTableDataSource(data.complaintList);
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
    })
    }

    
  }



  ngOnInit() {

    if(localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
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

    this.utilServiceAPI.setTitle("Legalentity - Closed " + this.complaintMenuName + " Report | Attendme");

    this.complaintFilterType="0";

    this.popQrIdAllComplaintRpt(false);
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
