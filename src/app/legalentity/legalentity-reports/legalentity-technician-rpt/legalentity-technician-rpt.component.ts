import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityAddTechnicianService, ItechnicianListRptResponse, ItechnicianRptReqStruct } from '../../services/legalentity-add-technician.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatSort, MatTableDataSource, MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';
import { LegalentityTechnicianService } from '../../services/legalentity-technician.service';
import {saveAs} from 'file-saver';
import *as moment from 'moment';

export interface ItechnicianListDetailsStruct{
   technicianId: number,
   technicianActiveStatus: boolean,
   technicianName: string,
   technicianMobileNumber: string,
   technicianEmailId: string
};

@Component({
  selector: 'app-legalentity-technician-rpt',
  templateUrl: './legalentity-technician-rpt.component.html',
  styleUrls: ['./legalentity-technician-rpt.component.css']
})
export class LegalentityTechnicianRptComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  legalEntityId: number;
  userId: number;

  technicianMenuName: string;
  branchMenuName: string;
  equptMenuName: string;
  complaintMenuName: string;

  enableProgressBar: boolean;

  dataSource;
  technicianRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  technicianDetailsArray: ItechnicianListDetailsStruct[];

  displayedColumns: string[]=[
    "srNo",
    "technicianName",
    "technicianMobileNumber",
    "technicianEmailId",
    "editTechnicianDetails",
    "deleteTechnician"
  ];

  totalRecordCount: number=0;
  searchKey: string;

  constructor(
    private userModel: LegalentityUser,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private menuPrefNameModel: LegalentityMenuPrefNames,
    private technicianServiceAPI: LegalentityAddTechnicianService,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    private technicianUpdateServiceAPI: LegalentityTechnicianService,
    sanitizer: DomSanitizer,
    private dialog:MatDialog
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
      )
  }

  popTechnicianListRpt(exportToExcel: boolean):void{
    this.enableProgressBar=true;

    this.searchKey='';

    const technicianRptReqObj: ItechnicianRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: exportToExcel,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName
    };

    if (exportToExcel){
      let fileName: string = this.technicianMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.technicianServiceAPI.getTechnicianListExportToExcel(technicianRptReqObj)
      .subscribe(data => {
        saveAs(data, fileName + ".xls");
        this.enableProgressBar=false;
      }, error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      });
    }
    else{
      this.technicianServiceAPI.getTechnicianList(technicianRptReqObj)
    .subscribe((data:ItechnicianListRptResponse) => {
      
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading " + this.technicianMenuName + " list");
        this.enableProgressBar=false;
        return false;
      }

      let filteredTechnicianList = data.technicianList.map((value,index) => value ? {
         technicianId: value['technicianId'],
         technicianActiveStatus: value['technicianActiveStatus'],
         technicianName: value['technicianName'],
         technicianMobileNumber: value['technicianMobileNumber'],
         technicianEmailId: value['technicianEmailId']
      }: null)
      .filter(value => value.technicianActiveStatus == true);

      this.totalRecordCount=filteredTechnicianList.length;

      this.technicianRecordCount= filteredTechnicianList.length;//data.technicianList.length;
      this.dataSource=new MatTableDataSource(filteredTechnicianList);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

      this.technicianDetailsArray= filteredTechnicianList;//data.technicianList;

      this.enableProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading " + this.technicianMenuName + " list");
      this.enableProgressBar=false;
    });
    }

    
  }

  addTechnicianClick(){
    
    this.router.navigate(['legalentity','portal','technician-add']);
  }

  onEditClick(technicianId: number){
    this.router.navigate(['legalentity','portal','edit','technician',technicianId]);
  }

  deleteTechnician(technicianId: number){
    const confirmAlertDialogObj: IConfirmAlertStruct = {
      alertMessage: "Are you sure you want to remove " + this.technicianMenuName,
      confirmBit: false
    };

    let alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent, {
      data: confirmAlertDialogObj,
      panelClass: 'custom-dialog-container'
    });

    alertDialogRef.afterClosed().subscribe(result => {
      if (confirmAlertDialogObj.confirmBit){

        this.enableProgressBar=true;

        this.technicianUpdateServiceAPI.deleteTechnicianUser(technicianId)
        .subscribe(data => {

          if (data['errorOccurred'])
          {
            this.enableProgressBar=false;
            this.toastService.error("Something went wrong while deleting " + this.technicianMenuName);
            return false;
          }

          this.enableProgressBar=false;
          this.toastService.success(this.technicianMenuName + " deleted successfully");
          this.popTechnicianListRpt(false);

        },error => {
          this.enableProgressBar=false;
          this.toastService.error("Something went wrong while deleting " + this.technicianMenuName);
        });

      }
    })
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
     
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
      
      this.menuPrefNameModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

      this.technicianMenuName=this.menuPrefNameModel.technicianMenuName;
      this.equptMenuName=this.menuPrefNameModel.equipmentMenuName;
      this.complaintMenuName=this.menuPrefNameModel.complaintMenuName;
      this.branchMenuName=this.menuPrefNameModel.branchMenuName;

    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.popTechnicianListRpt(false);

    this.utilServiceAPI.setTitle("Legalentity - " + this.technicianMenuName + " | Attendme");

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
