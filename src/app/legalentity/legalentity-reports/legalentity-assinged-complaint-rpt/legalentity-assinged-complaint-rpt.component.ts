import { Component, OnInit, ViewChild } from '@angular/core';
//import { LegalentityLogin } from '../../model/legalentity-login';
import { LegalentityBranch } from '../../model/legalentity-branch';
//import { UtilServicesService, IlegalEntityMenuPref } from './node_modules/src/app/util-services.service';
//import { ToastrService } from './node_modules/ngx-toastr';
//import { Router } from './node_modules/@angular/router';
//import { MatIconRegistry, MatTableDataSource, MatPaginator, MatSort, MatDialog } from './node_modules/@angular/material';
//import { DomSanitizer } from './node_modules/@angular/platform-browser';
//import { IComplaintBodyStruct, LegalentityComplaintsService, IAssingnComplaintResponse, IassignComplaintStructure } from '../../services/legalentity-complaints.service';
//import { IComplaintIdStruct } from '../legalentity-open-complaint-rpt/legalentity-open-complaint-rpt.component';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import { MatPaginator, MatSort, MatDialog, MatIconRegistry, MatTableDataSource, Sort } from '@angular/material';
import { IassignComplaintStructure, LegalentityComplaintRptService, IComplaintBodyStruct, IAssingnComplaintResponse, IComplaintIdStruct, IactionTakenReqData } from '../../services/legalentity-complaint-rpt.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LegalentityUserService } from '../../services/legalentity-user.service';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { IbranchListDetailsResponse, IbranchRptReqStruct, IbranchListReportResponse, LegalentityBranchService } from '../../services/legalentity-branch.service';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { LegalentityComplaintActionComponent } from '../../legalentity-complaint-action/legalentity-complaint-action.component';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';

@Component({
  selector: 'app-legalentity-assinged-complaint-rpt',
  templateUrl: './legalentity-assinged-complaint-rpt.component.html',
  styleUrls: ['./legalentity-assinged-complaint-rpt.component.css']
})
export class LegalentityAssingedComplaintRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  userFullName: string;

  complaintStageCount: number;  

  equipmentMenuName:string;
  technicianMenuName:string;
  complaintMenuName:string;
  branchMenuName: string;

  enableProgressBar: boolean;

  complaintResponseData: IassignComplaintStructure[];

  dataSource;

  displayedColumn: string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "complaintOpenDateTime",
    "complaintAssignedDateTime",
    "assingedToTechncianName",
    "actionTaken",
    "trashComplaint"
  ];
  
  complaintRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  totalRecordCount: number = 0;
  searchKey;

  branchHeadOffice: boolean;

  branchListArr: IbranchListDetailsResponse[];
  userBranchId: number;

  

  constructor(
    //private legalEntityModel: LegalentityLogin,
    private branchModel: LegalentityBranch,
    private util: LegalentityUtilService,
    private toastService: ToastrService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintServiceAPI: LegalentityComplaintRptService,
    private dialog: MatDialog,
    private userModel: LegalentityUser,
    private menuModel: LegalentityMenuPrefNames,
    private branchServiceAPI: LegalentityBranchService,
    private branchData: LegalentityBranchDataService,
    private authService: AuthService,
    private complaintRptServiceAPI: LegalentityComplaintRptService
  ) { 

    iconRegistry.addSvgIcon(
      "refresh-panel",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'deleteIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );

  }

 /* setLegalEntityMenuPref():void{
    if (localStorage.getItem('leMenuPreference') != null)
    {
      let menuPrefObj: IlegalEntityMenuPref[] = JSON.parse(localStorage.getItem('leMenuPreference'));

      const equipmentMenuNameObj = menuPrefObj.map((value,index) => value? {
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }: null)
      .filter(value => value.ngModelPropMenuName == 'equipment');

      this.equipmentMenuName = equipmentMenuNameObj[0]['userDefMenuName'];

      const technicianMenuNameObj = menuPrefObj.map((value,index) => value? {
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }: null)
      .filter(value => value.ngModelPropMenuName == 'technician');

      this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];

      const complaintMenuNameObj = menuPrefObj.map((value,index) => value?{
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }:null)
      .filter(value => value.ngModelPropMenuName == 'complaints');

      this.complaintMenuName = complaintMenuNameObj[0]['userDefMenuName'];

     }
  }*/

  popComplaintAssingRptGrid(exportToExcel: boolean): void{

   let assignComplaintReqObj: IComplaintBodyStruct = {
     allBranch: false,
     branchId: this.branchId,
     complaintStatus: 'assigned',
     fromDate: null,
     legalEntityId: this.legalEntityId,
     toDate: null,
     branchMenuName: this.branchMenuName,
     complaintMenuName: this.complaintMenuName,
     equptMenuName: this.equipmentMenuName,
     exportToExcel: exportToExcel,
     technicianMenuName: this.technicianMenuName,
     complaintTrash: false,
     userId: this.userId,
     userRole: this.userRole
   };

   this.enableProgressBar = true;
   this.searchKey="";

   if (exportToExcel){

    try {

      let fileName: string = "Assigned-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

    this.complaintServiceAPI.getAssingedComplaintsListExportToExcel(assignComplaintReqObj)
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
      
      this.complaintServiceAPI.getAssingedComplaintsListRpt(assignComplaintReqObj)
   .subscribe((data: IAssingnComplaintResponse) => {
  
    /*if (data.errorOccurred)
    {
      this.toastService.error("Something went wrong while loading assinged " + this.complaintMenuName + " reprot");
      this.enableProgressBar = false;
      return false;
    }*/

    

    const assignedComplaintFiltered = data.complaintList.map((value,index) => value ? {
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber'],
      complaintOpenDateTime: value['complaintOpenDateTime'],
      complaintAssignedDateTime: value['complaintAssignedDateTime'],
      assingedToTechncianName: value['assingedToTechncianName'],
      equipmentName: value['equipmentName'],
      equipmentModel: value['equipmentModel'],
      equipmentSerial: value['equipmentSerial'],
      qrId: value['qrId'],
      qrCodeId: value['qrCodeId'],
      complaintTrash: value['complaintTrash']
    } : null)
    .filter(value => value.complaintTrash == false);

    this.totalRecordCount=assignedComplaintFiltered.length;

     this.complaintRecordCount = assignedComplaintFiltered.length;
     this.dataSource = new MatTableDataSource(assignedComplaintFiltered);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;

     const sortState: Sort = {active: 'complaintAssignedDateTime', direction: 'desc'};
     this.sort.active = sortState.active;
     this.sort.direction = sortState.direction;
     this.sort.sortChange.emit(sortState);
 
     this.complaintResponseData = assignedComplaintFiltered;
    
     this.enableProgressBar = false;
    
   },error => {
    //this.toastService.error("Something went wrong while loading assinged " + this.complaintMenuName + " reprot");
    this.enableProgressBar = false;
   });
      
    } catch (error) {
      this.toastService.error("Something went wrong while loading assinged " + this.complaintMenuName + " reprot");
      this.enableProgressBar = false;
    }

    

   }

   

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  openComplaintDetails(complaintId: number):void {

    try {

      const complaintNumberObj = this.complaintResponseData.map((value,index) => value? {
        complaintId: value['complaintId'],
        complaintNumber: value['complaintNumber']
      }: null)
      .filter(value => value.complaintId == complaintId);
  
      let complaintNumber: string = complaintNumberObj[0]['complaintNumber']
     
      const complaintDialogReqDataObj: IComplaintIdStruct = {
  
        complaintId: complaintId,
        complaintMenuName: this.complaintMenuName,
        complaintNumber: complaintNumber,
        equipmentMenuName: this.equipmentMenuName,
        errorOccured: false,
        technicianMenuName: this.technicianMenuName   
      };
  
      const complaintDialogRef = this.dialog.open(LegalentityIndivComplaintRptComponent, {
        data: complaintDialogReqDataObj
      });
  
      complaintDialogRef.afterClosed().subscribe(result => {
        if (complaintDialogReqDataObj.errorOccured)
        {
          this.toastService.error("Something when wrong while loading " + this.complaintMenuName + " details");
        }
      })
      
    } catch (error) {
      this.toastService.error("Something when wrong while loading " + this.complaintMenuName + " details");
    }


  }

  

  popBranchList(){

    //this.openComplaintProgressBar=true;

    const branchListReqObj: IbranchRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equipmentMenuName,
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
      if (data.errorOccured){
        this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
        return false;
      }

      this.branchListArr=data.branchDetailsList;

    }, error => {
     // this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    });
      
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    }

    
  }

  openTakeActionDilaog(complaintId: number){
   
    let complaintDetailsData: IactionTakenReqData={
      actionTaken: null,
      branchId: this.branchId,
      complaintClosedRemark: null,
      complaintId: complaintId,
      complaintMenuName: this.complaintMenuName,
      complaintStageCount: this.complaintStageCount,
      complaintStatus: null,
      complaintStatusDocument: null,
      equipmentMenuName: this.equipmentMenuName,
      failureReason: null,
      legalEntityId: this.legalEntityId,
      legalEntityUserId: this.userId,
      technicianMenuName: this.technicianMenuName,
      userFullName: this.userFullName,
      userId: this.userId,
      userRole: this.userRole,
      technicianId: null,
      statusRemark: null,
      reqComptStatus: "assigned",
      complaintAssignStatus: true
    }

    const dialogRef = this.dialog.open(LegalentityComplaintActionComponent,{
      width: '500px',
      data: complaintDetailsData
    }); 

    dialogRef.afterClosed().subscribe(result => {

      if (complaintDetailsData.complaintStatus == "inprogress" || complaintDetailsData.complaintStatus == "closed"){

        let selComplaintStatus: string = '';

        if (complaintDetailsData.complaintStatus == "inprogress"){
          selComplaintStatus="in progress";
        }

        if (complaintDetailsData.complaintStatus == "closed"){
          selComplaintStatus="closed";
        }
        
        let confirmAlertData:IConfirmAlertStruct = {

          alertMessage: "Are you sure you want to change " + this.complaintMenuName + " status to " + selComplaintStatus,
          confirmBit:false
         };
 
         const alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent,{
           data:confirmAlertData,
           panelClass: 'custom-dialog-container'
         });

         alertDialogRef.afterClosed().subscribe(result => {
           if (confirmAlertData.confirmBit){
             this.enableProgressBar=true;
             try {
              this.complaintRptServiceAPI.changeComptStatusLeUser(complaintDetailsData)
              .subscribe(data => {
               
                if (data['complaintStatusExisits']){
                  this.toastService.error("" + this.complaintMenuName + " already closed.");
                  this.enableProgressBar=false;
                  return false;
                }

                if (complaintDetailsData.complaintStatus == "inprogress"){
                  this.toastService.success("" + this.complaintMenuName + " status changed to in progress successfully");
                }
                
                if (complaintDetailsData.complaintStatus == "closed"){
                  this.toastService.success("" + this.complaintMenuName + " closed successfully");
                }

                this.popComplaintAssingRptGrid(false);
                this.enableProgressBar=false;
 
              }, error => {this.enableProgressBar=false;});  
             } catch (error) {
               console.log(error);
               if (complaintDetailsData.complaintStatus == "inprogress"){
                this.toastService.error("Something went wrong while changing " + this.complaintMenuName +" status to in progress");
               }

               if (complaintDetailsData.complaintStatus == "closed"){
                this.toastService.error("Something went wrong while closing "+ this.complaintMenuName);
               }
               
               this.enableProgressBar=false;
             }

           }
         });

      }

    }); 

  }

  trashComplaint(complaintId: number){

    try {

      const complaintNumberObj = this.complaintResponseData.map((value,index) => value ? {
        complaintId: value['complaintId'],
        complaintNumber: value['complaintNumber']
      } : null)
      .filter(value => value.complaintId == complaintId);
  
      let complaintNumber: string = complaintNumberObj[0]['complaintNumber'];
  
      let confirmAlertData:IConfirmAlertStruct = {
        alertMessage: "Are you sure you want to trash the " + this.complaintMenuName + " (" + complaintNumber + ")",
        confirmBit:false
       };
  
       const alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent,{
        data:confirmAlertData,
        panelClass: 'custom-dialog-container'
      });
  
      alertDialogRef.afterClosed().subscribe(result => {
        //console.log(confirmAlertData.confirmBit);
  
        if (confirmAlertData.confirmBit){
          this.enableProgressBar=true;
  
          this.complaintRptServiceAPI.trashComplaint(
            complaintId, 
            true,
            this.legalEntityId,
            this.branchId,
            this.userId,
            this.userRole
            )
          .subscribe(data => {
            /*if (data['errorOccured']){
              this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
              this.openComplaintProgressBar=false;
              return false;
            }*/
  
            this.enableProgressBar = false;
            this.toastService.success("" + this.complaintMenuName + " added to trash successfully");
            this.popComplaintAssingRptGrid(false);
          }, error => {
           // this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
            this.enableProgressBar=false;
          });
        }
  
      });
      
    } catch (error) {
      this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
    }
  }

  ngOnInit() {

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userBranchId=this.userModel.legalEntityBranchDetails.branchId;
      this.userId-this.userModel.legalEntityUserDetails.userId;

      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    const jwtTokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=jwtTokenModel.legalEntityId;
    this.userId=jwtTokenModel.userId;
    this.userRole=jwtTokenModel.userRole;
    this.userFullName=jwtTokenModel.userFullName;

    this.complaintStageCount=jwtTokenModel.complaintStageCount;

    this.branchHeadOffice=jwtTokenModel.branchHeadOffice;
 
    if (this.branchData.branchDetails != null){
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
      //this.branchId=this.userBranchId
      this.branchId=jwtTokenModel.branchId;
    }
    
    this.menuModel = this.util.getLegalEntityMenuPrefNames();

    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.equipmentMenuName=this.menuModel.equipmentMenuName;

    const sortState: Sort = {active: 'complaintOpenDateTime', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

   /* if (localStorage.getItem('legalEntityUser') != null)
    {
      this.legalEntityModel = JSON.parse(localStorage.getItem('legalEntityUser'));

      this.legalEntityId = this.legalEntityModel.legalEntityId;
      this.userId = this.legalEntityModel.userId;

      if (localStorage.getItem('legalEntityBranch') != null)
      {
       this.branchModel = JSON.parse(localStorage.getItem('legalEntityBranch'));

       this.branchId = this.branchModel.branchId;
      }
      else
      {
        this.router.navigate(['/legalentity/login']);  
      }
    }
    else
    {
      this.router.navigate(['/legalentity/login']);
    } */

    //this.setLegalEntityMenuPref();

    if (this.branchHeadOffice){
      this.popBranchList();
    }

    this.popComplaintAssingRptGrid(false);

    this.util.setTitle("Legal Entity - Assinged " + this.complaintMenuName + " Report | Attendme");

  }

}
