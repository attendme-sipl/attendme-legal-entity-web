import { Component, OnInit, ViewChild, enableProdMode } from '@angular/core';
import { Router } from '@angular/router';
import { IUserLoginStruct, IUserLoginResponseStruct } from '../../services/technician-login.service';
import { ItechnicianDetailsReponse } from '../../services/tehnician-util.service';
//import { IlegalEntityMenuPref, UtilServicesService } from 'src/app/util-services.service';
import { TehnicianUtilService } from '../../services/tehnician-util.service';
import { parse } from 'path';
import { utils } from 'protractor';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ItechnicianAssingedComptRptReqStruct, TechnicianComplaintService, ItechnicianAssingedComptRptResponse, IcomplaintResponseStruct, ItechnicianChangeStatusReponse, IcomplaintIndivReqStruct } from '../../services/technician-complaint.service';
import { ToastrService } from 'ngx-toastr';
//import { IComplaintReportStruct } from 'src/app/legalentity/services/legalentity-complaints.service';
import {IComplaintReportStruct} from '../../../legalentity/services/legalentity-complaint-rpt.service';
import { TechnicianChangeStatusComponent } from '../../technician-change-status/technician-change-status.component';
import { LegalentityConfirmAlertComponent, IConfirmAlertStruct } from 'src/app/legalentity/legalentity-confirm-alert/legalentity-confirm-alert.component';
import { TechnicianIndivComplaintDetailsComponent } from '../technician-indiv-complaint-details/technician-indiv-complaint-details.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { LegalentityMenuPrefNames } from 'src/app/legalentity/model/legalentity-menu-pref-names';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';

export interface IchangeComplaintStatusReqStruct{
  complaintId: number,
  technicianId: number,
  complaintStatus: string,
  complaintMenuName: string,
  technicianMenuName: string,
  equipmentMenuName: string,
  failureReason: string,
  actionTaken: string,
  complaintStatusDocument: File[],
  userId: number,
  branchId: number,
  userRole: string,
  legalEntityId: number,
  complaintNumber: string,
  statusRemark: string
}

@Component({
  selector: 'app-technician-assigned-complaint-rpt',
  templateUrl: './technician-assigned-complaint-rpt.component.html',
  styleUrls: ['./technician-assigned-complaint-rpt.component.css']
})
export class TechnicianAssignedComplaintRptComponent implements OnInit {

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

  complaintRecords: IcomplaintResponseStruct[];

  complaintRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumn:string[] = [
    "SrNo",
    "complaintNumber",
    "qrId",
    //"equipmentName",
    //"equipmentModel",
    //"equipmentSerial",
    "complaintOpenDate",
    "complaintAssignedDate",
    "changeStatus"
  ];

  totalRecordCount: number = 0;
  searchKey;

  constructor(
    private router: Router,
    private util: TehnicianUtilService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintServiceAPI: TechnicianComplaintService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService,
    private menuModel: LegalentityMenuPrefNames,
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

    const branchMenuNameObj = menuPrefObj.map((value,index) => value ? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    } : null)
    .filter(value => value.ngModelPropMenuName == 'branch');

    if (branchMenuNameObj.length >0){
      this.branchMenuName=branchMenuNameObj[0]['userDefMenuName'];
    }
  }*/

  popAssingedComplaintRptGrid(exportToExcel: boolean):void{

    this.enableProgressBar = true;
    this.searchKey='';

    const assingedComplaintRepObj: ItechnicianAssingedComptRptReqStruct = {
      complaintAssignedStatus: true,
      complaintStatus: 'assigned',
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

    //console.log(assingedComplaintRepObj);

    if (exportToExcel){
      try {
        let fileName: string = "Assigned-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
      this.complaintServiceAPI.getTechnicianAssingnedComptExportToExcel(assingedComplaintRepObj)
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
        this.complaintServiceAPI.getTechnicianAssingnedComptRpt(assingedComplaintRepObj)
        .subscribe((data:ItechnicianAssingedComptRptResponse) => {
          /*if (data.errorOccured)
          {
            this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " report");
            this.enableProgressBar = false;
            return false;
          }*/
    
          this.totalRecordCount=data.complaintList.length;
          
          this.complaintRecords = data.complaintList;
          this.complaintRecordCount = data.complaintList.length;
          this.dataSource = new MatTableDataSource(data.complaintList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
    
          this.enableProgressBar = false;
          
          
        }, error => {
          //this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " report");
          this.enableProgressBar = false;
        });  
      } catch (error) {
        this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " report");
        this.enableProgressBar = false;
      }
      
    }

    
    
  }

  openComplaintDetailsDialog(complaintId: number):void{

    try {
      const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
        complaintId: complaintId,
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        userId:  this.userId,
        userRole: this.userRole
      };
      
      const indivComplaintDialog = this.dialog.open(TechnicianIndivComplaintDetailsComponent,{
        data: IndivComplaintReqObj
      }); 
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details dialog.","");
    }

  }

  openChangeStatusDialog(complaintId: number):void{

    try {
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
        //complaintNumber: complaintNumber,
        branchId: this.branchId,
        userId: this.userId,
        userRole: this.userRole,
        complaintStatusDocument: null,
        legalEntityId: this.legalEntityId,
        complaintNumber: complaintNumber,
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
  
              try {
                this.complaintServiceAPI.setComplaintStatusChange(changeComplaintReqObj)
                .subscribe((data: ItechnicianChangeStatusReponse) => {
                  /*if (data.errorOccured == true || data.complaintStatusExisits == true)
                  {
                    this.enableProgressBar = false;
                    this.toastService.error("Something went wrong while changing " + this.complaintMenuName + " status");
                    this.popAssingedComplaintRptGrid(false);
                    return false;
                  }*/
    
                  this.enableProgressBar = false;
                  this.toastService.success(this.complaintMenuName + " status changes successfully");
                  this.popAssingedComplaintRptGrid(false);
    
                }, error => {
                  this.enableProgressBar = false;
                  //this.toastService.error("Something went wrong while changing " + this.complaintMenuName + " status");
                }); 
              } catch (error) {
                console.log(error);
                this.enableProgressBar = false;
                this.toastService.error("Something went wrong while changing " + this.complaintMenuName + " status");
              }
              
            }
          });
        }
  
      });      
    } catch (error) {
      this.toastService.error("Something went wrong while processions " + this.complaintMenuName + " status change functionlaity","");
    }

  }

  applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnInit() {

    try {
      const tokenModle: TokenModel = this.authService.getTokenDetails();

      this.legalEntityId=tokenModle.legalEntityId;
      this.branchId=tokenModle.branchId;
      this.userId=tokenModle.userId;
      this.userRole=tokenModle.userRole;
  
      this.technicianId=tokenModle.technicianId;
  
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
      }
      else{
        //this.router.navigateByUrl('[technician/login]');
        this.router.navigate(['legalentity','login']);
        return false;
      }*/
  
      //this.setLegalEntityMenuPref();
  
      this.menuModel=this.legalEntityUtilAPI.getLegalEntityMenuPrefNames();
  
      this.equipmentMenuName=this.menuModel.equipmentMenuName;
      this.branchMenuName=this.menuModel.branchMenuName;
      this.complaintMenuName=this.menuModel.complaintMenuName;
      this.technicianMenuName=this.menuModel.technicianMenuName;
      
      this.util.setTitle("Technician - Assigned " + this.complaintMenuName + " Report | Attendme");
  
      this.popAssingedComplaintRptGrid(false);      
    } catch (error) {
      this.toastService.error("Something went wrong while loading page","");
    }

  }

}
