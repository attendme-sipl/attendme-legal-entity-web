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
import { IbranchListDetailsResponse, IbranchRptReqStruct, LegalentityBranchService, IbranchListReportResponse } from '../../services/legalentity-branch.service';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

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
  userId: number;
  userRole: string;

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
  totalRecordCount: number = 0;
  searchKey;

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

  popInprogressComplaintsRpt(exportToExcel: boolean):void{
    
    this.enableProgressBar=true;
    this.searchKey='';

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
      technicianMenuName: this.technicianMenuName,
      complaintTrash: false,
      userId: this.userId,
      userRole: this.userRole
    };

    if (exportToExcel){

      try {

        let fileName: string = "In-Progress-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

        this.complaintRtpServiceAPI.getIprogressComptListExportToExcel(inprogressComplaintRtpReqObj)
        .subscribe(data => {
          saveAs(data, fileName + ".xls");
          this.enableProgressBar=false;
        }, error => {
          //this.toastService.error("Something went wrong while downloading excel");
          this.enableProgressBar=false;
        });
        
      } catch (error) {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      }

     
    }
    else{

      try {

        this.complaintRtpServiceAPI.getIprogressComptListRpt(inprogressComplaintRtpReqObj)
    .subscribe((data: IinprogressComptRptResponse) => {

      /*if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading inprogress " + this.complaintMenuName);
        this.enableProgressBar=false;
        return false;  
      }*/

      this.inprogressComptListObj=data.complaintList.map((value,index) => value ? {
        complaintId: value['complaintId'],
        complaintNumber: value['complaintNumber'],
        qrCodeId: value['qrCodeId'],
        qrId: value['qrId'],
        regsiteredByName: value['regsiteredByName'],
        registeredByMobileNumber: value['registeredByMobileNumber'],
        inprogressDateTime: value['inprogressDateTime'],
        complaintTrash: value['complaintTrash']
      } : null)
      .filter(value => value.complaintTrash == false);

      this.totalRecordCount=this.inprogressComptListObj.length;

      this.inprogressComptListCount=this.inprogressComptListObj.length;
      this.dataSource=new MatTableDataSource(this.inprogressComptListObj);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

      const sortState: Sort = {active: 'inprogressDateTime', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      this.enableProgressBar=false;

    }, error => {
      //this.toastService.error("Something went wrong while loading inprogress " + this.complaintMenuName);
      this.enableProgressBar=false;
    });
        
      } catch (error) {
        this.toastService.error("Something went wrong while loading inprogress " + this.complaintMenuName);
        this.enableProgressBar=false;
      }

      
    }
    
    
  }

  //to be added after jwt implementation

  /*openComplaintDetailsDialog(complaintId: number):void{

    try {
      const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
        complaintId: complaintId
      };
      
      const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
        data: IndivComplaintReqObj
      });
    } catch (error) {
      this.toastService.error("Something went wrong while showing " + this.complaintMenuName + " details.");
    }

    

  }*/

   // to be added after jwt implementation

  popBranchList(){

   

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
    this.branchHeadOffice=tokenModel.branchHeadOffice;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    /*if(localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.userBranchId=this.userModel.legalEntityBranchDetails.branchId;
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;

      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

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

    this.utilServiceAPI.setTitle("Legalentity - In Progress " + this.complaintMenuName + " Report | Attendme");

    if (this.branchHeadOffice){
     this.popBranchList();
    }

    this.popInprogressComplaintsRpt(false);
    

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  

}
