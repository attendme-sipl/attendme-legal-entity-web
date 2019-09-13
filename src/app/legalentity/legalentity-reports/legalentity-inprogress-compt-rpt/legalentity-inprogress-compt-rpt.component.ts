import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, MatDialog, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IComplaintBodyStruct, IinprogressComptListResponse, IinprogressComptRptResponse, IcomplaintIndivReqStruct } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';

@Component({
  selector: 'app-legalentity-inprogress-compt-rpt',
  templateUrl: './legalentity-inprogress-compt-rpt.component.html',
  styleUrls: ['./legalentity-inprogress-compt-rpt.component.css']
})
export class LegalentityInprogressComptRptComponent implements OnInit {

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
  inprogressComptListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "inprogressDateTime"
  ];

  inprogressComptListObj:IinprogressComptListResponse[];

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

  popInprogressComplaintsRpt(exportToExcel: boolean):void{
    
    this.enableProgressBar=true;

    const inprogressComplaintRtpReqObj: IComplaintBodyStruct={
      allBranch: false,
      branchId: this.branchId,
      complaintStatus: 'inprogress',
      fromDate: null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName
    };

    if (exportToExcel){

      let fileName: string = "In-Progress-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.complaintRtpServiceAPI.getIprogressComptListExportToExcel(inprogressComplaintRtpReqObj)
      .subscribe(data => {
        saveAs(data, fileName);
        this.enableProgressBar=false;
      }, error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      });
    }
    else{
      this.complaintRtpServiceAPI.getIprogressComptListRpt(inprogressComplaintRtpReqObj)
    .subscribe((data: IinprogressComptRptResponse) => {

      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading inprogress " + this.complaintMenuName);
        this.enableProgressBar=false;
        return false;  
      }

      this.inprogressComptListObj=data.complaintList;

      this.inprogressComptListCount=data.complaintList.length;
      this.dataSource=new MatTableDataSource(data.complaintList);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

      const sortState: Sort = {active: 'inprogressDateTime', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      this.enableProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading inprogress " + this.complaintMenuName);
      this.enableProgressBar=false;
    });
    }
    
    
  }

  openComplaintDetailsDialog(complaintId: number):void{

    const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: complaintId
    };
    
    const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
      data: IndivComplaintReqObj
    });

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
    this.branchMenuName=this.menuModel.branchMenuName;
    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

    this.utilServiceAPI.setTitle("Legalentity - In Progress " + this.complaintMenuName + " Report | Attendme");

    this.popInprogressComplaintsRpt(false);
    

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  

}
