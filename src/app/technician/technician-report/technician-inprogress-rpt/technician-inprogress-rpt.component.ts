import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TechnicianComplaintService, IcomplaintIndivReqStruct, IcomplaintRptReqStruct, IinprogressComplaintListRptResponse, IinprogressComplaintDetailsResponse, ItechnicianChangeStatusReponse } from '../../services/technician-complaint.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';

import { Router } from '@angular/router';
import { TechnicianIndivComplaintDetailsComponent } from '../technician-indiv-complaint-details/technician-indiv-complaint-details.component';
import { IUserLoginResponseStruct } from '../../services/technician-login.service';
import { ItechnicianDetailsReponse } from '../../services/tehnician-util.service';
import { IchangeComplaintStatusReqStruct } from '../technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import { TechnicianChangeStatusComponent } from '../../technician-change-status/technician-change-status.component';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from 'src/app/legalentity/legalentity-confirm-alert/legalentity-confirm-alert.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { TechnicianMenuDataStruct } from '../../model/technician-menu-data-struct';
import { TechnicianMenuModel } from '../../model/technician-menu-model';
import {TehnicianUtilService} from '../../services/tehnician-util.service';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { LegalentityMenuPrefNames } from 'src/app/legalentity/model/legalentity-menu-pref-names';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';

@Component({
  selector: 'app-technician-inprogress-rpt',
  templateUrl: './technician-inprogress-rpt.component.html',
  styleUrls: ['./technician-inprogress-rpt.component.css']
})
export class TechnicianInprogressRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  technicianId: number;
  userId: number;
  userRole: string;

  technicianMenuName: string;
  equipmentMenuName: string;
  complaintMenuName: string;
  branchMenuName: string;

  enableProgressBar:boolean;

  dataSource;

  complaintRecords: IinprogressComplaintDetailsResponse[];

  complaintRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumn:string[] = [
    "srNo",
    "complaintNumber",
    "qrId", 
    "complaintOpenDateTime",
    "complaintInprogressDateTime",
    "complaintRegisterByName",
    "changeStatus"
  ];

  totalRecordCount: number=0;
  searchKey;

  constructor(
    private router: Router,
    private util: TehnicianUtilService ,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintServiceAPI: TechnicianComplaintService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private menuModel: LegalentityMenuPrefNames,
    private techUtil: TehnicianUtilService,
    private authService: AuthService,
    private legalEntityUtilAPI: LegalentityUtilService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-panel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }


   /*setLegalEntityMenuPref():void{
    let menuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));

    const complaintMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'complaints');

    this.complaintMenuName = complaintMenuNameObj[0]['userDefMenuName'];

    const technicianMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'technician');

    this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];

    const equipmentMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'equipment');

    this.equipmentMenuName = equipmentMenuNameObj[0]['userDefMenuName'];
  }*/

  openComplaintDetailsDialog(complaintId: number):void{

    const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: complaintId,
      branchId: this.branchId,
      legalEntityId: this.legalEntityId,
      userId: this.userId,
      userRole: this.userRole
    };
    
    const indivComplaintDialog = this.dialog.open(TechnicianIndivComplaintDetailsComponent,{
      data: IndivComplaintReqObj
    });

  }

  openChangeStatusDialog(complaintId: number):void{

    const complaintNumberObj = this.complaintRecords.map((value,index) => value?{
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber']
    }:null)
    .filter(value => value.complaintId == complaintId);

    let complaintNumber: string = complaintNumberObj[0]['complaintNumber'];

    let changeComplaintReqObj: IchangeComplaintStatusReqStruct = {
      actionTaken: null,
      //androidPortalKey: false,
      complaintId: complaintId,
      complaintMenuName: this.complaintMenuName,
      //complaintStageCount: 4,
      complaintStatus: null,
      equipmentMenuName: this.equipmentMenuName,
      failureReason: null,
      //legalEntityUserId: this.legalEntityId,
      technicianId: this.technicianId,
      technicianMenuName: this.technicianMenuName,
      complaintNumber: complaintNumber,
      branchId: this.branchId,
      complaintStatusDocument: null,
      legalEntityId: this.legalEntityId,
      userId: this.userId,
      userRole: this.userRole,
      statusRemark: null
    };

    const changeStatusDialogRef = this.dialog.open(TechnicianChangeStatusComponent,{
      panelClass: 'custom-dialog-container',
      data: changeComplaintReqObj
    });

    changeStatusDialogRef.afterClosed().subscribe(result => {
      
      if (changeComplaintReqObj.complaintStatus != null || changeComplaintReqObj.complaintStatus != undefined)
      {
        let confirmAlertDialogReqObj: IConfirmAlertStruct = {
          alertMessage: 'Are you sure you want to change ' + this.complaintMenuName + " status",
          confirmBit: false
        }

        const confirmAlertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent, {
          data: confirmAlertDialogReqObj,
          panelClass: 'custom-dialog-container'
        });

        confirmAlertDialogRef.afterClosed().subscribe(result => {
          if (confirmAlertDialogReqObj.confirmBit == true)
          {
            this.enableProgressBar = true;

            this.complaintServiceAPI.setComplaintStatusChange(changeComplaintReqObj)
            .subscribe((data: ItechnicianChangeStatusReponse) => {
              if (data.complaintStatusExisits == true)
              {
                this.enableProgressBar = false;
                this.toastService.error("Something went wrong while changing " + this.complaintMenuName + " status");
                this.popInprogressComplaintList(false);
                return false;
              }

              this.enableProgressBar = false;
              this.toastService.success(this.complaintMenuName + " status changes successfully");
              this.popInprogressComplaintList(false);

            }, error => {
              this.enableProgressBar = false;
              //this.toastService.error("Something went wrong while changing " + this.complaintMenuName + " status");
            });
            
          }
        })
      }

    })

  }

  popInprogressComplaintList(exportToExcel: boolean):void{
    this.enableProgressBar=true;
    this.searchKey='';

    const complaintRptReqObj: IcomplaintRptReqStruct={
      complaintStatus:'inprogress',
      fromDate: null,
      technicianId: this.technicianId,
      toDate: null,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equipmentMenuName,
      exportToExcel: exportToExcel,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName,
      complaintTrash: false,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };

    if (exportToExcel){

      try {
        let fileName: string = "In-Progress-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
        this.complaintServiceAPI.getInprogressComplaintsListExportToExcel(complaintRptReqObj)
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
      this.complaintServiceAPI.getInprogressComplaintsListRtp(complaintRptReqObj)
      .subscribe((data:IinprogressComplaintListRptResponse) => {
        
        /*if (data.errorOccured){
          this.enableProgressBar=false;
          this.toastService.error("Something went wrong while loading in progress " + this.complaintMenuName + " list");
          return false;
        }*/
  
        this.totalRecordCount=data.complaintList.length;
  
        this.complaintRecords = data.complaintList;
        this.complaintRecordCount = data.complaintList.length;
        this.dataSource = new MatTableDataSource(data.complaintList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        this.enableProgressBar=false;
  
      }, error => {
        this.enableProgressBar=false;
        //this.toastService.error("Something went wrong while loading in progress " + this.complaintMenuName + " list");
      });  
    } catch (error) {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while loading in progress " + this.complaintMenuName + " list");
    }  

    }

    
  }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.technicianId=tokenModel.technicianId;

    this.menuModel = this.legalEntityUtilAPI.getLegalEntityMenuPrefNames();

    this.equipmentMenuName = this.menuModel.equipmentMenuName;
    this.complaintMenuName = this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

    this.util.setTitle(this.technicianMenuName + " - In progress " + this.complaintMenuName + " Report | Attendme");

    /*if (localStorage.getItem('technicianUserDetails') != null){

      let technicianUserObj: IUserLoginResponseStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));
      
      this.userId = technicianUserObj.userId;
      this.legalEntityId = technicianUserObj.legalEntityId;

      if (localStorage.getItem('technicianDetails') != null){
        let technicianDetailsObj: ItechnicianDetailsReponse = JSON.parse(localStorage.getItem('technicianDetails'));
        this.technicianId = technicianDetailsObj.technicianId;
      }
      else{
        //this.router.navigateByUrl('[technician/login]');
        this.router.navigate(['legalentity','login']);
        return false;
      }

      //this.setLegalEntityMenuPref();
      
      this.menuModel=this.techUtil.getMenuDetails();

      this.complaintMenuName=this.menuModel.complaintMenuName;
      this.technicianMenuName=this.menuModel.technicianMenuName;
      this.equipmentMenuName=this.menuModel.equipmentMenuName;
      this.branchMenuName=this.menuModel.branchMenuName;
      
    
      this.util.setTitle(this.technicianMenuName + " - In progress " + this.complaintMenuName + " Report | Attendme");
    }
    else{
      //this.router.navigateByUrl('[technician/login]');
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    this.popInprogressComplaintList(false);
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page");
    }

    
  }

  applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
