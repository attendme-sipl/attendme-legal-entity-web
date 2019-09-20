import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityComplaintRptService, IopenComplaintRptResponseStruct, IcomplaintIndivReqStruct, IcomplaintIndivResponseStruct } from '../../services/legalentity-complaint-rpt.service';
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

export interface IAssingTechnicianDialogData{
  complaintId: number,
  complaintStatus: string,
  complaintAssignStatus: boolean,
  complaintMenuName: string,
  technicianMenuName: string,
  equipmentMenuName: string,
  complaintNumber: string,
  technicianId:number
 };

export interface IopenComplaintRtpReqStruct{
   allBranch: boolean,
   branchId: number,
   legalEntityId: number,
   complaintStatus: string,
   fromDate: string,
   toDate: string,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string
};

export interface IopenComplaintListStruct{
   complaintId: number,
   complaintNumber: string,
   complaintOpenDateTime: string,
   qrId: string,
   qrCodeId: number,
   deviceUserName: string,
   deviceUserMobileNumber: string
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
    private dialog: MatDialog
  ) { 
    iconRegistry.addSvgIcon(
      'refreshIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'deleteIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );
  }

  popOpenComplaintGrid(exportToExcel: boolean):void{

    this.openComplaintProgressBar=true;

    const openComplaintReqObj: IopenComplaintRtpReqStruct ={
      allBranch: false, //true,
      branchId: this.branchId,
      complaintStatus:'open',
      fromDate: null,
      legalEntityId: this.legalEntityId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName
    };

    /*this.complaintRptServiceAPI.getOpenComplaintRtpToExcel(openComplaintReqObj)
    .subscribe(data => {
      console.log(data);
      saveAs(data,"abc");
  
    });*/

    if (exportToExcel){

      let fileName: string = "Open-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.complaintRptServiceAPI.getOpenComplaintRtpToExcel(openComplaintReqObj)
      .subscribe(data => {
        saveAs(data,fileName + ".xls");
        this.openComplaintProgressBar=false;
      },error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.openComplaintProgressBar=false;
      });

    }
    else{
      this.complaintRptServiceAPI.getOpenComplaintRtp(openComplaintReqObj)
    .subscribe((data: IopenComplaintRptResponseStruct) => {
      //console.log(data);
      if (data.errorOccured)
      {
        this.openComplaintProgressBar=false;
        this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
        return false;
      }

      const openComplaintFilterData = data.complaintList.map((value,index) => value ? {
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

      this.totalRecordCount=openComplaintFilterData.length;

      this.openComplaintRecordCount = openComplaintFilterData.length //data.complaintList.length;
      this.dataSource = new MatTableDataSource(openComplaintFilterData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      const sortState: Sort = {active: 'complaintOpenDateTime', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);

      this.openComplaintResponseArray = data.complaintList;

      this.openComplaintProgressBar=false;
 
    }, error => {
      
      this.openComplaintProgressBar=false;
      this.toastService.error("Something went wrong while loading " + this.legalEntityMenuPrefModel.complaintMenuName + " details.");
    })
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

  openAssingTechnicianDialog(complaintId: number):void{
    
    const complaintNumberObj = this.openComplaintResponseArray.map((value,index) => value ? {
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber']
    } : null)
    .filter(value => value.complaintId == complaintId);

    let complaintNumber: string = complaintNumberObj[0]['complaintNumber'];

    let complaintDetailsData: IAssingTechnicianDialogData = {
      complaintStatus: 'assigned',
      complaintAssignStatus: true,
      complaintId: complaintId,
      complaintMenuName: this.complaintMenuName,
      equipmentMenuName: this.equptMenuName,
      technicianMenuName: this.technicianMenuName,
      complaintNumber: complaintNumber,
      technicianId:null
    };

    const dialogRef = this.dialog.open(LegalentityAssignTechnicianComponent, {
      data: complaintDetailsData,
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

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
         
          if (confirmAlertData.confirmBit)
          {
            //console.log(complaintDetailsData);
            this.openComplaintProgressBar = true;
            this.complaintRptServiceAPI.assignTechnicianToComplaint(complaintDetailsData)
            .subscribe(data => {
              if (data['errorOccured'])
              {
                this.toastService.error("Something went wrong while assigning " + this.technicianMenuName + " to " + this.complaintMenuName,"");
                this.openComplaintProgressBar = false;
                return false;
              }

              this.popOpenComplaintGrid(false);
              this.toastService.success(this.technicianMenuName + " assigned to a " + this.complaintMenuName + " successfully","");

            }, error => {
              this.toastService.error("Something went wrong while assigning " + this.technicianMenuName + " to " + this.complaintMenuName,"");
              this.openComplaintProgressBar = false;
            });
          }

        });

      }
    });

  }

  

  opendQrDetailsDialog(qrCodeId: number){
    const qrIdDialog = this.dialog.open(LegalentityQrDetailsComponent);
  }

  trashComplaint(complaintId: number){

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
      console.log(confirmAlertData.confirmBit);

      if (confirmAlertData.confirmBit){
        this.openComplaintProgressBar=true;

        this.complaintRptServiceAPI.trashComplaint(complaintId, true)
        .subscribe(data => {
          if (data['errorOccured']){
            this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
            this.openComplaintProgressBar=false;
            return false;
          }

          this.openComplaintProgressBar = false;
          this.toastService.success("" + this.complaintMenuName + " added to trash successfully");
          this.popOpenComplaintGrid(false);
        }, error => {
          this.toastService.error("Something went wrong while adding " + this.complaintMenuName + " to trash.");
          this.openComplaintProgressBar=false;
        });
      }

    });

  }


  ngOnInit() {

    if(localStorage.getItem('legalEntityUserDetails') != null){
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId = this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.legalEntityUserModel.legalEntityBranchDetails.branchId;
      this.userId = this.legalEntityUserModel.legalEntityUserDetails.userId;  
    }
    else {
      this.router.navigate(['legalentity','login']);
    }

    this.legalEntityMenuPrefModel = this.utilService.getLegalEntityMenuPrefNames();
    
    this.complaintMenuName = this.legalEntityMenuPrefModel.complaintMenuName;
    this.equptMenuName = this.legalEntityMenuPrefModel.equipmentMenuName;
    this.technicianMenuName = this.legalEntityMenuPrefModel.technicianMenuName;
    this.branchMenuName=this.legalEntityMenuPrefModel.branchMenuName;

    this.utilService.setTitle("Legalentity - Open " + this.legalEntityMenuPrefModel.complaintMenuName + " Report | Attendme");

    this.popOpenComplaintGrid(false);
      
    
  }

 

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
