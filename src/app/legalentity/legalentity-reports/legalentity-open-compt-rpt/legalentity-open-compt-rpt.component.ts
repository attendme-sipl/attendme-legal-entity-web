import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityComplaintRptService, IopenComplaintRptResponseStruct, IcomplaintIndivReqStruct, IcomplaintIndivResponseStruct, IactionTakenReqData } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityCommons } from '../../model/legalentity-commons';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import { LegalentityAssignTechnicianComponent } from '../../legalentity-assign-technician/legalentity-assign-technician.component';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';
import { LegalentityQrDetailsComponent } from '../../legalentity-qr-details/legalentity-qr-details.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { LegalentityBranchService, IbranchRptReqStruct, IbranchListReportResponse, IbranchListDetailsResponse } from '../../services/legalentity-branch.service';
import { LegalentityBranch } from '../../model/legalentity-branch';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { LegalentityComplaintActionComponent } from '../../legalentity-complaint-action/legalentity-complaint-action.component';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

export interface IAssingTechnicianDialogData{
  complaintId: number,
  complaintStatus: string,
  complaintAssignStatus: boolean,
  complaintMenuName: string,
  technicianMenuName: string,
  equipmentMenuName: string,
  complaintNumber: string,
  technicianId:number,
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string
 };

export interface IopenComplaintRtpReqStruct{
   allBranch: boolean,
   branchId: number,
   legalEntityId: number,
   userId: number,
   userRole: string,
   complaintStatus: string,
   fromDate: string,
   toDate: string,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string,
   complaintTrash: boolean
};

export interface IopenComplaintListStruct{
   complaintId: number,
   complaintNumber: string,
   complaintOpenDateTime: string,
   qrId: string,
   qrCodeId: number,
   deviceUserName: string,
   deviceUserMobileNumber: string,
   complaintTrash: boolean
};


@Component({
  selector: 'app-legalentity-open-compt-rpt',
  templateUrl: './legalentity-open-compt-rpt.component.html',
  styleUrls: ['./legalentity-open-compt-rpt.component.css']
})
export class LegalentityOpenComptRptComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  userFullName: string;
  complaintStageCount: number;

  openComplaintProgressBar: boolean;

  openComplaintResponseArray: IopenComplaintListStruct[];

  dataSource;
  openComplaintRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "registerBy",
    "complaintOpenDateTime",
    "assginTechnician",
    "trashComplaint"
  ];

  complaintMenuName: string;
  equptMenuName: string;
  technicianMenuName: string;
  branchMenuName: string;
 
  totalRecordCount: number;

  complaintFilterType: string = "0";

  searchKey;

  branchListArr: IbranchListDetailsResponse[];
  userBranchId: number;

  branchHeadOffice: boolean;
  
  constructor(
    private utilService: LegalentityUtilService,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    private legalEntityUserModel: LegalentityUser,
    sanitizer: DomSanitizer,
    private router: Router,
    public legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    private complaintRptServiceAPI: LegalentityComplaintRptService,
    private progressbarObj: LegalentityCommons,
    private dialog: MatDialog,
    private branchServiceAPI: LegalentityBranchService,
    private activatedroute:ActivatedRoute,
    private branchData: LegalentityBranchDataService,
    private authService: AuthService
  ) { 
    iconRegistry.addSvgIcon(
      'refreshIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'deleteIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );

    //this.activatedroute.queryParams.subscribe(param => {
     // if(this.router.getCurrentNavigation().extras.state){

     //   this.branchId=this.router.getCurrentNavigation().extras.state.branchId;
       
    //    this.popOpenComplaintGrid(false);
        //console.log(this.router.getCurrentNavigation().extras.state.branchId);
    //  }

      
    //});

    //console.log(branchData.branchDetails);

  }

  popOpenComplaintGrid(exportToExcel: boolean):void{

    this.openComplaintProgressBar=true;
//console.log(this.branchId);
    this.searchKey='';

   const openComplaintReqObj: IopenComplaintRtpReqStruct ={
      allBranch: false, //true,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole,
      complaintStatus:'open',
      fromDate: null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName,
      complaintTrash: false
    };

    /*this.complaintRptServiceAPI.getOpenComplaintRtpToExcel(openComplaintReqObj)
    .subscribe(data => {
      console.log(data);
      saveAs(data,"abc");
  
    });*/


  
    if (exportToExcel){

      try {

        let fileName: string = "Open-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.complaintRptServiceAPI.getOpenComplaintRtpToExcel(openComplaintReqObj)
      .subscribe(data => {
        saveAs(data,fileName + ".xls");
        this.openComplaintProgressBar=false;
      },error => {
        //this.toastService.error("Something went wrong while downloading excel");
        this.openComplaintProgressBar=false;
      });
        
      } catch (error) {
        this.toastService.error("Something went wrong while downloading excel");
        this.openComplaintProgressBar=false;
      }

      

    }
    else{

      try {

        this.complaintRptServiceAPI.getOpenComplaintRtp(openComplaintReqObj)
    .subscribe((data: IopenComplaintRptResponseStruct) => {
      //console.log(data);
      /*if (data.errorOccured)
      {
        this.openComplaintProgressBar=false;
        this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
        return false;
      }*/

      
      /*const openComplaintFilterData = data.complaintList.map((value,index) => value ? {
        complaintId: value['complaintId'],
        complaintNumber: value['complaintNumber'],
        complaintOpenDateTime: value['complaintOpenDateTime'],
        qrId: value['qrId'],
        qrCodeId: value['qrCodeId'],
        deviceUserName: value['deviceUserName'],
        deviceUserMobileNumber: value['deviceUserMobileNumber'],
        complaintTrash: value['complaintTrash']
      } : null)
      .filter(value => value.complaintTrash == false);*/

      this.openComplaintResponseArray=data.complaintList;

      let openComplaintResponseArrayUpdated: IopenComplaintListStruct[];

      

      /*if (this.complaintFilterType == '0'){
        const filteredComplaintListObj = this.getFilteredComplaintObj(data.complaintList, false);
        openComplaintResponseArrayUpdated=filteredComplaintListObj;
      }

      if (this.complaintFilterType == '1'){
        const filteredComplaintListObj = this.getFilteredComplaintObj(data.complaintList, true);
        openComplaintResponseArrayUpdated=filteredComplaintListObj;
      }

      if (this.complaintFilterType == '2'){
        openComplaintResponseArrayUpdated=data.complaintList;
      }*/

    //  this.openComplaintResponseArray=openComplaintFilterData;

    const filteredComplaint = data.complaintList.map((value,index) => value ? {
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber'],
      complaintOpenDateTime: value['complaintOpenDateTime'],
      qrId: value['qrId'],
      qrCodeId: value['qrCodeId'],
      deviceUserName: value['deviceUserName'],
      deviceUserMobileNumber: value['deviceUserMobileNumber'],
      complaintTrash: value['complaintTrash']
    } : null)
    .filter(value => value.complaintTrash == false);

    openComplaintResponseArrayUpdated=filteredComplaint;

      this.totalRecordCount=openComplaintResponseArrayUpdated.length;

      this.openComplaintRecordCount = openComplaintResponseArrayUpdated.length //data.complaintList.length;
      this.dataSource = new MatTableDataSource(openComplaintResponseArrayUpdated);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      const sortState: Sort = {active: 'complaintOpenDateTime', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      //this.openComplaintResponseArray = data.complaintList;

      this.openComplaintProgressBar=false;
 
    }, error => {
      this.openComplaintProgressBar=false;
      //this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
    })
        
      } catch (error) {
        this.openComplaintProgressBar=false;
        this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
      }

      
    }

    
  }

  /*getFilteredComplaintObj(complaintData: any, trashComplaint: boolean): IopenComplaintListStruct[]{
    const openComplaintFilterData = complaintData.map((value,index) => value ? {
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber'],
      complaintOpenDateTime: value['complaintOpenDateTime'],
      qrId: value['qrId'],
      qrCodeId: value['qrCodeId'],
      deviceUserName: value['deviceUserName'],
      deviceUserMobileNumber: value['deviceUserMobileNumber'],
      complaintTrash: value['complaintTrash']
    } : null)
    .filter(value => value.complaintTrash == trashComplaint);
    
    return openComplaintFilterData;
  }*/



  openComplaintDetailsDialog(complaintId: number):void{

    const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: complaintId,
      branchId: this.branchId,
      legalEntityId: this.legalEntityId,
      userId: this.userId,
      userRole: this.userRole
    };


    try {
      const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
        data: IndivComplaintReqObj
      });

    } catch (error) {
      console.log("Something went wrong while displaying " + this.complaintMenuName + " details.");
    }
    
    
  }

  openAssingTechnicianDialog(complaintId: number):void{

    try {

      const complaintNumberObj = this.openComplaintResponseArray.map((value,index) => value ? {
        complaintId: value['complaintId'],
        complaintNumber: value['complaintNumber']
      } : null)
      .filter(value => value.complaintId == complaintId);
  
      let complaintNumber: string = complaintNumberObj[0]['complaintNumber'];
  
      /*let complaintDetailsData: IAssingTechnicianDialogData = {
        complaintStatus: 'open',
        complaintAssignStatus: true,
        complaintId: complaintId,
        complaintMenuName: this.complaintMenuName,
        equipmentMenuName: this.equptMenuName,
        technicianMenuName: this.technicianMenuName,
        complaintNumber: complaintNumber,
        technicianId:null,
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        userId: this.userId,
        userRole: this.userRole
      };*/

      let complaintDetailsData: IactionTakenReqData={
        actionTaken: null,
        branchId: this.branchId,
        complaintClosedRemark: null,
        complaintId: complaintId,
        complaintMenuName: this.complaintMenuName,
        complaintStageCount: this.complaintStageCount,
        complaintStatus: null,
        complaintStatusDocument: null,
        equipmentMenuName: this.equptMenuName,
        failureReason: null,
        legalEntityId: this.legalEntityId,
        legalEntityUserId: this.userId,
        technicianMenuName: this.technicianMenuName,
        userFullName: this.userFullName,
        userId: this.userId,
        userRole: this.userRole,
        technicianId: null,
        statusRemark: null,
        reqComptStatus: "open"
      }
  
      const dialogRef = this.dialog.open(LegalentityComplaintActionComponent,{
        width: '500px',
        data: complaintDetailsData
      });
  
      /*const dialogRef = this.dialog.open(LegalentityAssignTechnicianComponent, {
        data: complaintDetailsData,
        width: '500px',
        panelClass: 'custom-dialog-container'
      });*/
  
      dialogRef.afterClosed().subscribe(result => {
        if (complaintDetailsData.technicianId  != null)
        {
  
          let confirmAlertData:IConfirmAlertStruct = {
           alertMessage: "Are you sure you want to assign " + this.technicianMenuName + " to a " + this.complaintMenuName,
           confirmBit:false
          };
  
          const alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent,{
            data:confirmAlertData,
            panelClass: 'custom-dialog-container'
          });
  
          alertDialogRef.afterClosed().subscribe(result =>{
           
            /*if (confirmAlertData.confirmBit)
            {
              //console.log(complaintDetailsData);


              this.openComplaintProgressBar = true;
              this.complaintRptServiceAPI.assignTechnicianToComplaint(complaintDetailsData)
              .subscribe(data => {

               
  
                this.popOpenComplaintGrid(false);
                this.toastService.success(this.technicianMenuName + " assigned to a " + this.complaintMenuName + " successfully","");
  
              }, error => {
                //this.toastService.error("Something went wrong while assigning " + this.technicianMenuName + " to " + this.complaintMenuName,"");
                this.openComplaintProgressBar = false;
              }); 
            }*/
  
          });
  
        }
      }); 
      
    } catch (error) {
      this.toastService.error("Something went wrong while assigning " + this.technicianMenuName + " to " + this.complaintMenuName,"");
    }
    
    

  }

  

  opendQrDetailsDialog(qrCodeId: number){
    try {
      const qrIdDialog = this.dialog.open(LegalentityQrDetailsComponent);  
    } catch (error) {
      this.toastService.error("Something went wrong while loading QR Id image file.");
    }
    
  }

  trashComplaint(complaintId: number){

    try {

      const complaintNumberObj = this.openComplaintResponseArray.map((value,index) => value ? {
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
          this.openComplaintProgressBar=true;
  
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
  
            this.openComplaintProgressBar = false;
            this.toastService.success("" + this.complaintMenuName + " added to trash successfully");
            this.popOpenComplaintGrid(false);
          }, error => {
           // this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
            this.openComplaintProgressBar=false;
          });
        }
  
      });
      
    } catch (error) {
      this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
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

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
   // this.branchId=tokenModel.branchId;
    this.userId = tokenModel.userId;
    this.userRole = tokenModel.userRole;
    
    this.userFullName=tokenModel.userFullName;
    this.complaintStageCount=tokenModel.complaintStageCount;

    if (this.branchData.branchDetails != null){
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
     // this.branchId=this.userBranchId
     this.branchId=tokenModel.branchId;
    }

    this.branchHeadOffice=tokenModel.branchHeadOffice;

    this.legalEntityMenuPrefModel = this.utilService.getLegalEntityMenuPrefNames();

    this.equptMenuName=this.legalEntityMenuPrefModel.equipmentMenuName;
    this.complaintMenuName=this.legalEntityMenuPrefModel.complaintMenuName;
    this.technicianMenuName=this.legalEntityMenuPrefModel.technicianMenuName;
    this.complaintMenuName=this.legalEntityMenuPrefModel.complaintMenuName;

    this.utilService.setTitle("Legalentity - Open " + this.legalEntityMenuPrefModel.complaintMenuName + " Report | Attendme");

    this.complaintFilterType="0";

   this.popOpenComplaintGrid(false);

   if (this.branchHeadOffice){
     this.popBranchList();
   }

  /*  if(localStorage.getItem('legalEntityUserDetails') != null){
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId = this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;

      
      this.userBranchId = this.legalEntityUserModel.legalEntityBranchDetails.branchId;
      this.userId = this.legalEntityUserModel.legalEntityUserDetails.userId;  

      this.branchHeadOffice=this.legalEntityUserModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else {
      this.router.navigate(['legalentity','login']);
    }

    this.legalEntityMenuPrefModel = this.utilService.getLegalEntityMenuPrefNames();

  //  console.log(this.branchData.branchDetails['branchId']);

    if (this.branchData.branchDetails != null){
      this.branchId=this.branchData.branchDetails['branchId'];
    }
    else{
      this.branchId=this.userBranchId
    }
    
    this.complaintMenuName = this.legalEntityMenuPrefModel.complaintMenuName;
    this.equptMenuName = this.legalEntityMenuPrefModel.equipmentMenuName;
    this.technicianMenuName = this.legalEntityMenuPrefModel.technicianMenuName;
    this.branchMenuName=this.legalEntityMenuPrefModel.branchMenuName;

    this.utilService.setTitle("Legalentity - Open " + this.legalEntityMenuPrefModel.complaintMenuName + " Report | Attendme");

    this.complaintFilterType="0";

    //this.activatedroute.data.subscribe(res => {
      //console.log(res);
    //});

    

   this.popOpenComplaintGrid(false);

   if (this.branchHeadOffice){
     this.popBranchList();
   }

*/
    
    
  }

  /*onFilterItemChange(){
    
    let filteredObj: IopenComplaintListStruct[];

  
      if (this.complaintFilterType == '0'){
        const filteredComplaintListObj = this.getFilteredComplaintObj(this.openComplaintResponseArray, false);
        filteredObj=filteredComplaintListObj;
      }

      if (this.complaintFilterType == '1'){
        const filteredComplaintListObj = this.getFilteredComplaintObj(this.openComplaintResponseArray, true);
        filteredObj=filteredComplaintListObj;
      }

      if (this.complaintFilterType == '2'){
        filteredObj=this.openComplaintResponseArray;
      }

      this.totalRecordCount=filteredObj.length;

      this.openComplaintRecordCount = filteredObj.length //data.complaintList.length;
      this.dataSource = new MatTableDataSource(filteredObj);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      const sortState: Sort = {active: 'complaintOpenDateTime', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

  }*/

 

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
