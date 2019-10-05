import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { MatIconRegistry, MatTableDataSource, MatPaginator, MatSort, Sort, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IComplaintBodyStruct, IopenComplaintRptResponseStruct, IcomplaintIndivReqStruct } from '../../services/legalentity-complaint-rpt.service';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { IopenComplaintListStruct } from '../legalentity-open-compt-rpt/legalentity-open-compt-rpt.component';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { IbranchListDetailsResponse, LegalentityBranchService, IbranchRptReqStruct, IbranchListReportResponse } from '../../services/legalentity-branch.service';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';

@Component({
  selector: 'app-legalentity-trash-compt-rpt',
  templateUrl: './legalentity-trash-compt-rpt.component.html',
  styleUrls: ['./legalentity-trash-compt-rpt.component.css']
})
export class LegalentityTrashComptRptComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  legalEntityId: number;
  branchId: number;

  equptMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  trashComplaintProgressBar: boolean;
  totalRecordCount: number =0;
  searchKey;
  dataSource;

  trashComplaintCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "registerBy",
    "complaintOpenDateTime"
  ];

  branchListArr: IbranchListDetailsResponse[];
  userBranchId: number;
  branchHeadOffice: boolean;


  constructor(
    private userModel: LegalentityUser,
    private toastService: ToastrService,
    private utilServiceAPI: LegalentityUtilService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintServiceAPI: LegalentityComplaintRptService,
    private router: Router,
    private menuModel: LegalentityMenuPrefNames,
    private dialog: MatDialog,
    private branchData: LegalentityBranchDataService,
    private branchServiceAPI: LegalentityBranchService
  ) {
    iconRegistry.addSvgIcon(
      'refreshIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }

   popTrashComplaintRpt(exportToExcel: boolean){
     this.trashComplaintProgressBar=true;
     this.searchKey='';

     const complaintReqObj: IComplaintBodyStruct = {
       allBranch: false,
       branchId: this.branchId,
       branchMenuName: this.branchMenuName,
       complaintMenuName: this.complaintMenuName,
       complaintStatus: 'open',
       complaintTrash: true,
       equptMenuName: this.equptMenuName,
       exportToExcel: exportToExcel,
       fromDate: null,
       legalEntityId: this.legalEntityId,
       technicianMenuName: this.technicianMenuName,
       toDate: null
     };

     if (exportToExcel){
      let fileName: string = "Trash-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
      this.complaintServiceAPI.getOpenComplaintRtpToExcel(complaintReqObj)
      .subscribe(data => {
        saveAs(data, fileName);
        this.trashComplaintProgressBar=false;
      }, error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.trashComplaintProgressBar=false;
      });
     }
     else{
      this.complaintServiceAPI.getOpenComplaintRtp(complaintReqObj)
     
      .subscribe((data: IopenComplaintRptResponseStruct ) => {
 
      //console.log(data.complaintList);
 
        if (data.errorOccured){
          this.toastService.error("Something went wrong while loading trash " + this.complaintMenuName);
          this.trashComplaintProgressBar=false;
          return false;
        }
 
       const trashComplaintFilteredObj = data.complaintList.map((value,index) => value ? {
         complaintId: value['complaintId'],
         complaintNumber: value['complaintNumber'],
         complaintOpenDateTime: value['complaintOpenDateTime'],
         qrId: value['qrId'],
         qrCodeId: value['qrCodeId'],
         deviceUserName: value['deviceUserName'],
         deviceUserMobileNumber: value['deviceUserMobileNumber'],
         complaintTrash: value['complaintTrash']
       } : null)
       .filter(value => value.complaintTrash == true); 
 
       this.totalRecordCount=trashComplaintFilteredObj.length;
 
       this.trashComplaintCount=trashComplaintFilteredObj.length;
 
       this.dataSource = new MatTableDataSource(trashComplaintFilteredObj);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;  
     
       const sortState: Sort = {active: 'complaintOpenDateTime', direction: 'desc'};
       this.sort.active = sortState.active;
       this.sort.direction = sortState.direction;
       this.sort.sortChange.emit(sortState);
 
        this.trashComplaintProgressBar=false;
      }, error => {
       this.toastService.error("Something went wrong while loading trash " + this.complaintMenuName);
       this.trashComplaintProgressBar=false;
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

  popBranchList(){

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
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){

      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userBranchId=this.userModel.legalEntityBranchDetails.branchId;

      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
  
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    if (this.branchData.branchDetails != null){
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
      this.branchId=this.userBranchId
    }    

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.branchMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle('Legalentity - Trash ' + this.complaintMenuName + " Report | Attendme");

    if (this.branchHeadOffice){
      this.popBranchList();
    }

    this.popTrashComplaintRpt(false);

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
