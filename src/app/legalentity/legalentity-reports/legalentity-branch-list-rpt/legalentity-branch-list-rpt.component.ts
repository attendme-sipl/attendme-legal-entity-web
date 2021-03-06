import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { Router } from '@angular/router';
import { LegalentityBranchService, IbranchListDetailsResponse, IbranchListReportResponse, IbranchRptReqStruct } from '../../services/legalentity-branch.service';
//import { IbranchListReportResponse, IbranchListDetailsResponse } from 'attendme-legal-entity-web/src/app/legalentity/services/legalentity-branch.service';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-branch-list-rpt',
  templateUrl: './legalentity-branch-list-rpt.component.html',
  styleUrls: ['./legalentity-branch-list-rpt.component.css']
})
export class LegalentityBranchListRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;
  equptMenuName: string;

  branchDetailsArray: IbranchListDetailsResponse[];

  dataSource;
  branchRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  enableProgressBar: boolean;

  displayedColumns: string[]=[
    "srNo",
    "branchName",
    "branchAddress",
    "branchContactPersonName",
    "branchContactMobile",
    "branchEmail"
  ];

  totalRecordCount: number = 0;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private router: Router,
    private branchServiceAPI: LegalentityBranchService,
    private authService: AuthService
  ) { 
    iconRegistry.addSvgIcon(
      'edit-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-edit-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'delete-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }


  popBranchList(exportToExcel: boolean):void{
    this.enableProgressBar=true;

    const branchRptReqObj: IbranchRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };

    if (exportToExcel){

      try {
        let fileName: string = this.branchMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.branchServiceAPI.getBranchListExportToExcel(branchRptReqObj)
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
        this.branchServiceAPI.getBranchListReport(branchRptReqObj)
        .subscribe((data:IbranchListReportResponse) => {
    
          /*if (data.errorOccured){
            this.toastService.error("Something went wrong while loading " + this.branchMenuName + " details");
            this.enableProgressBar=false;
            return false;
          }*/
    
          this.branchDetailsArray=data.branchDetailsList.map((value,index) => value?{
            branchId: value['branchId'],
            branchHeadOffice: value['branchHeadOffice'],
            branchName: value['branchName'],
            branchContactPersonName: value['branchContactPersonName'],
            branchContactMobile: value['branchContactMobile'],
            branchEmail: value['branchEmail'],
            branchAddress: value['branchAddress'],
            allotedQRIdCount: value['allotedQRIdCount'],
            branchActiveStatus: value['branchActiveStatus']
          }:null)
          .filter(value => value.branchHeadOffice == false);
    
          this.totalRecordCount=this.branchDetailsArray.length;
    
          this.branchRecordCount = this.branchDetailsArray.length;
          this.dataSource=new MatTableDataSource(this.branchDetailsArray);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
    
          this.enableProgressBar=false;
    
        }, error => {
          //this.toastService.error("Something went wrong while loading " + this.branchMenuName + " details");
          this.enableProgressBar=false;
        });  
      } catch (error) {
        this.toastService.error("Something went wrong while loading " + this.branchMenuName + " details");
        this.enableProgressBar=false;
      }

      
    }
    

    
  }

  addBranchClick():void{
    try {
      this.router.navigate(['legalentity','portal','add-branch']);  
    } catch (error) {
      this.toastService.error("Something went wrong while redirecting to add " + this.branchMenuName + " page.","");
    }
    
  }

  ngOnInit() {

    try {
      const tokenModel:TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
       
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuModel.branchMenuName;
    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle("Legalentity - " + this.branchMenuName + " List | Attendme");

    this.popBranchList(false);
    } catch (error) {
      this.toastService.error("Something went wrong while loading page.","");
    }

    
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
