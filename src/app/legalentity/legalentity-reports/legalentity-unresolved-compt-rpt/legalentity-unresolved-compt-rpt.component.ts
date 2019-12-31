import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, Sort, MatDialog } from '@angular/material';
import { _MatMenuItemMixinBase } from '@angular/material/menu/typings/menu-item';
import { LegalentityComplaintRptService, IunresolvedComplaintReqStruct, IunresolvedComplaintResponseStruct, IcomplaintIndivReqStruct } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityBranchService, IbranchListReportResponse, IbranchRptReqStruct, IbranchListDetailsResponse } from '../../services/legalentity-branch.service';
import { LegalentityBranch } from '../../model/legalentity-branch';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityDashboardService } from '../../services/legalentity-dashboard.service';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-unresolved-compt-rpt',
  templateUrl: './legalentity-unresolved-compt-rpt.component.html',
  styleUrls: ['./legalentity-unresolved-compt-rpt.component.css']
})
export class LegalentityUnresolvedComptRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userBranchId: number;
  userId: number;
  userRole: string;

  branchHeadOffice: boolean;

  equptMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  unresolvedComplaintProgressBar: boolean;

  private moreThanUptoFlag: boolean;

  branchListArr: IbranchListDetailsResponse[];

  totalRecordCount: number = 0;
  searchKey;

  moreThanUptoPhrase: string;

  moreThanUptoDays: number;

  complaintStatusListArr: string[] = ['all','open','assigned','inprogress'];

  complaintStatus: string = "all"

  dataSource;
  unresolvedComplaintRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "openDateTime",
    "assignedDateTime",
    "inprogressDateTime",
    "assignedTechnicianName",
    "currentComplaintStatus"
    //"action"
  ];

  constructor(
    private router: Router,
    private userModel: LegalentityUser,
    private menuModel: LegalentityMenuPrefNames,
    private utilServiceAPI: LegalentityUtilService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private complaintRptServiceAPI: LegalentityComplaintRptService,
    private branchServiceAPI: LegalentityBranchService,
    private branchData: LegalentityBranchDataService,
    private activateRoute: ActivatedRoute,
    private toastService: ToastrService,
    private dashboardServiceAPI: LegalentityDashboardService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { 
    iconRegistry.addSvgIcon(
      'refreshIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }

  popUnresolvedComplaint(exportToExcel: boolean){
    
    this.unresolvedComplaintProgressBar=true;
    this.searchKey='';

    try {
      this.dashboardServiceAPI.getUnresolvedDaysRuleBook(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole
        )
      .subscribe(data => {
        /*if (data['errorOccured']){
          this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
          this.unresolvedComplaintProgressBar=false;
          return false;
        }*/
        
        this.moreThanUptoDays=parseInt(data['unresolvedDaysCount']);
        this.unresolvedComplaintProgressBar=false;

        const unresolvedComplaintReqObj: IunresolvedComplaintReqStruct = {
          allBranch: false,
          branchId: this.branchId,
          branchMenuName: this.branchMenuName,
          complaintMenuName: this.complaintMenuName,
          complaintTrash: false,
          equptMenuName: this.equptMenuName,
          exportToExcel: exportToExcel,
          legalEntityId: this.legalEntityId,
          technicianMenuName: this.technicianMenuName,
          unresolvedDayCount: this.moreThanUptoDays,
          unresolvedMoreThanUpToDays: this.moreThanUptoFlag
        };
        //console.log(exportToExcel);
        if (exportToExcel){
  
          try {
  
            let fileName: string = "Un-Resolved-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
          this.complaintRptServiceAPI.exportToExcelUnresolvedComplaintRpt(unresolvedComplaintReqObj)
          .subscribe(data => {
           // console.log(data);
           
            saveAs(data, fileName);
          }, error => {
           // console.log(error);
            //this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
            this.unresolvedComplaintProgressBar=false;
          });
  
          } catch (error) {
            this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
            this.unresolvedComplaintProgressBar=false;  
          }
  
          
        }
        else{
  
          try {
            this.complaintRptServiceAPI.getUnresolvedComplaintRpt(unresolvedComplaintReqObj)
        .subscribe((data: IunresolvedComplaintResponseStruct) => {
  
          /*if (data.errorOccurred){
            this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
            this.unresolvedComplaintProgressBar=false;
            return false;
          }*/
  
          const filteredComplaintList = data.complaintList.map((value,index) => value ? {
            complaintId: value['complaintId'],
            complaintNumber: value['complaintNumber'],
            qrCodeId: value['qrCodeId'],
            qrId: value['qrId'],
            regsiteredByName: value['regsiteredByName'],
            registeredByMobileNumber: value['registeredByMobileNumber'],
            assignedTechnicianName: value['assignedTechnicianName'],
            asignedTechnicianMobile: value['asignedTechnicianMobile'], 
            openDateTime: value['openDateTime'],
            assignedDateTime: value['assignedDateTime'],
            inprogressDateTime: value['inprogressDateTime'],
            currentComplaintStatus: value['currentComplaintStatus'],
            complaintTrash: value['complaintTrash']
          } : null)
          .filter(value => value.complaintTrash == false);
  
        this.totalRecordCount=filteredComplaintList.length;
  
        this.unresolvedComplaintRecordCount = filteredComplaintList.length; //data.complaintList.length;
        this.dataSource = new MatTableDataSource(filteredComplaintList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        const sortState: Sort = {active: 'openDateTime', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
  
        this.unresolvedComplaintProgressBar=false;
  
        }, error => {
          //this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
          this.unresolvedComplaintProgressBar=false;
        });
          } catch (error) {
            this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
            this.unresolvedComplaintProgressBar=false;
          }
  
          
        }
  
        
  
      }, error => {
        //this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
        this.unresolvedComplaintProgressBar=false;
      });
    } catch (error) {
      this.toastService.error("Something went wrong while loading unresolved " + this.complaintMenuName.toLowerCase() + " list.");
      this.unresolvedComplaintProgressBar=false;
    }

    
  } 


  openComplaintDetailsDialog(complaintId: number):void{
    try {
      const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
        complaintId: complaintId,
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        userId: this.userId,
        userRole: this.userRole
      };
      
      const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
        data: IndivComplaintReqObj
      });  
    } catch (error) {
      this.toastService.error("Something went wrong while displaying " + this.complaintMenuName + " details");
    }      
    

  }


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
     this.userBranchId=tokenModel.branchId;
     this.userRole=tokenModel.userRole;

     this.branchHeadOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userBranchId=this.userModel.legalEntityBranchDetails.branchId;
      
      this.branchHeadOffice = this.userModel.legalEntityBranchDetails.branchHeadOffice;

    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    if (this.branchData.branchDetails != null){
      console.log(this.branchData.branchDetails['branchId']);
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
      //this.branchId=this.userBranchId
      this.branchId=tokenModel.branchId;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle("Legalentity - Unresolved " + this.complaintMenuName + " Report | Attendme");

    this.activateRoute.params.subscribe(params => {

      let suppliedMoreThanUpToFlag: string = params['moreThanUpto'];
      
      if (suppliedMoreThanUpToFlag == 'moreThanCount'){
        this.moreThanUptoFlag=true;
        this.moreThanUptoPhrase="More than";
      }

      if (suppliedMoreThanUpToFlag == 'upToCount'){
        this.moreThanUptoFlag=false;
        this.moreThanUptoPhrase="Up to";
      }

     
      if (this.branchHeadOffice){
        this.popBranchList();
      }
    

     this.popUnresolvedComplaint(false);

    });
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
