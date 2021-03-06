import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';

import { DomSanitizer } from '@angular/platform-browser';
import { TechnicianComplaintService, IcomplaintIndivReqStruct, IcomplaintRptReqStruct, IclosedComplaintListRptResponse, IclosedComplaintRptDetails } from '../../services/technician-complaint.service';
import { ToastrService } from 'ngx-toastr';
import { TechnicianIndivComplaintDetailsComponent } from '../technician-indiv-complaint-details/technician-indiv-complaint-details.component';
import { IUserLoginResponseStruct } from '../../services/technician-login.service';
import { ItechnicianDetailsReponse, TehnicianUtilService } from '../../services/tehnician-util.service';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { TechnicianMenuModel } from '../../model/technician-menu-model';
import { HttpClient } from '@angular/common/http';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';
import { LegalentityMenuPrefNames } from 'src/app/legalentity/model/legalentity-menu-pref-names';

@Component({
  selector: 'app-technician-closed-compt-rpt',
  templateUrl: './technician-closed-compt-rpt.component.html',
  styleUrls: ['./technician-closed-compt-rpt.component.css']
})
export class TechnicianClosedComptRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  technicianId: number;
  branchId: number;
  userId: number;
  userRole: string;

  technicianMenuName: string;
  equipmentMenuName: string;
  complaintMenuName: string;
  branchMenuName: string;

  enableProgressBar:boolean;

  dataSource;

  complaintRecords: IclosedComplaintRptDetails[];

  complaintRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumn:string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "complaintOpenDateTime",
    "complaintClosedDateTime",
    "complaintRegisterByName"
  ];

  totalRecordCount: number=0;
  searchKey;

  constructor(
    private router: Router,
    private util: TehnicianUtilService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintServiceAPI: TechnicianComplaintService,
    private toastService: ToastrService,
    private dialog: MatDialog,
    private menuModel: LegalentityMenuPrefNames,
    private technicianUtilAPI: TehnicianUtilService,
    private httpClient: HttpClient,
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

    try {
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
    } catch (error) {
      this.toastService.error("Something went wrong while displaying " + this.complaintMenuName + " dialog.");
    }

  }

  popClosedComplaintRpt(exportToExcel: boolean):void{

   /*this.httpClient.get("http://192.168.0.99:8080/download")
   .subscribe(data => {
     saveAs(data,"abc");
   });*/
    
   this.enableProgressBar=true;
   this.searchKey='';

    const complaintRptReqObj: IcomplaintRptReqStruct={
      complaintStatus:'closed',
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
        let fileName: string = "Assigned-" + this.complaintMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

        this.complaintServiceAPI.getClosedComplaintListExportToExcel(complaintRptReqObj)
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
        this.complaintServiceAPI.getClosedComplaintListRpt(complaintRptReqObj)
        .subscribe((data:IclosedComplaintListRptResponse) => {
    
          /*if (data.errorOccured){
            this.enableProgressBar=false;
            this.toastService.error("Something went wrong while loading in closed " + this.complaintMenuName + " list");
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
          //this.toastService.error("Something went wrong while loading in closed " + this.complaintMenuName + " list");
    
        });        
      } catch (error) {
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading in closed " + this.complaintMenuName + " list");
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

    this.technicianId = tokenModel.technicianId;

    this.menuModel=this.legalEntityUtilAPI.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.equipmentMenuName=this.menuModel.equipmentMenuName;
    
    this.util.setTitle(this.technicianMenuName + " - Closed " + this.complaintMenuName + " Report | Attendme");

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

      this.menuModel=this.technicianUtilAPI.getMenuDetails();

      this.branchMenuName=this.menuModel.branchMenuName;
      this.technicianMenuName=this.menuModel.technicianMenuName;
      this.complaintMenuName=this.menuModel.complaintMenuName;
      this.equipmentMenuName=this.menuModel.equipmentMenuName;
    
      this.util.setTitle(this.technicianMenuName + " - Closed " + this.complaintMenuName + " Report | Attendme");
    }
    else{
      //this.router.navigateByUrl('[technician/login]');
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    this.popClosedComplaintRpt(false);
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page","");
    }

    
  }

  applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
