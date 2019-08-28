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
import { IassignComplaintStructure, LegalentityComplaintRptService, IComplaintBodyStruct, IAssingnComplaintResponse, IComplaintIdStruct } from '../../services/legalentity-complaint-rpt.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LegalentityUserService } from '../../services/legalentity-user.service';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';

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

  equipmentMenuName:string;
  technicianMenuName:string;
  complaintMenuName:string;

  enableProgressBar: boolean;

  complaintResponseData: IassignComplaintStructure[];

  dataSource;

  displayedColumn: string[] = [
    "srNo",
    "complaintNumber",
    "qrId",
    "complaintOpenDateTime",
    "complaintAssignedDateTime",
    "assingedToTechncianName"
  ]
  
  complaintRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

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
    private menuModel: LegalentityMenuPrefNames
  ) { 

    iconRegistry.addSvgIcon(
      "refresh-panel",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
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

  popComplaintAssingRptGrid(): void{

   let assignComplaintReqObj: IComplaintBodyStruct = {
     allBranch: false,
     branchId: this.branchId,
     complaintStatus: 'assigned',
     fromDate: null,
     legalEntityId: this.legalEntityId,
     toDate: null
   };

   this.enableProgressBar = true;

   this.complaintServiceAPI.getAssingedComplaintsListRpt(assignComplaintReqObj)
   .subscribe((data: IAssingnComplaintResponse) => {
  
    if (data.errorOccurred)
    {
      this.toastService.error("Something went wrong while loading assinged " + this.complaintMenuName + " reprot");
      this.enableProgressBar = false;
      return false;
    }

     this.complaintRecordCount = data.complaintList.length;
     this.dataSource = new MatTableDataSource(data.complaintList);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;

     const sortState: Sort = {active: 'complaintAssignedDateTime', direction: 'desc'};
     this.sort.active = sortState.active;
     this.sort.direction = sortState.direction;
     this.sort.sortChange.emit(sortState);
 
     this.complaintResponseData = data.complaintList;
    
     this.enableProgressBar = false;
    
   },error => {
    this.toastService.error("Something went wrong while loading assinged " + this.complaintMenuName + " reprot");
    this.enableProgressBar = false;
   });

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  openComplaintDetails(complaintId: number):void {

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
        this.toastService.error("Something when worg while loading " + this.complaintMenuName + " details");
      }
    })

  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.userId-this.userModel.legalEntityUserDetails.userId;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }
    
    this.menuModel = this.util.getLegalEntityMenuPrefNames();

    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

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

    this.popComplaintAssingRptGrid();

    this.util.setTitle("Legal Entity - Assinged " + this.complaintMenuName + " Report | Attendme");

  }

}
