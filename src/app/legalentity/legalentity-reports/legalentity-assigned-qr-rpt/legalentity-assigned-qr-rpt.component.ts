import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityQrService, IassignedQrIdRptReq, IassignedQrIdRptResponse } from '../../services/legalentity-qr.service';
import { ToastrService } from 'ngx-toastr';

export interface IassingedQrIdDetailsResponseStruct{
   qrCodeId: number,
   qrId: string,
   qrActiveStatus: boolean,
   qrAssignDateTime: string,
   assignedByBranchName: string
};

@Component({
  selector: 'app-legalentity-assigned-qr-rpt',
  templateUrl: './legalentity-assigned-qr-rpt.component.html',
  styleUrls: ['./legalentity-assigned-qr-rpt.component.css']
})
export class LegalentityAssignedQrRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userId: number;
  headOffice: boolean;
  enableProgressBar: boolean;

  branchMenuName: string;

  assignedQrIdDetailsArray: IassingedQrIdDetailsResponseStruct[];

  dataSource;
  assignedQrIdListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "qrId",
    "assignedByBranchName",
    "qrAssignDateTime",
    "editQrIdDetails",
    "deleteQrId"
  ];

  constructor(
    private userModel: LegalentityUser,
    private menuPrefNameModel: LegalentityMenuPrefNames,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer ,
    private qrServiceAPI: LegalentityQrService,
    private toastService: ToastrService
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

   popAssignedQrIdListRpt(){
     this.enableProgressBar=true;

     const assignQrIdRptReqObj: IassignedQrIdRptReq = {
       branchId:this.branchId,
       headOffice: this.headOffice,
       legalEntityId: this.legalEntityId
     }

     this.qrServiceAPI.getAssignedQrIdListRpt(assignQrIdRptReqObj)
     .subscribe((data:IassignedQrIdRptResponse) => {
       console.log(data);

       if (data.errorOccurred){
         this.toastService.error("Something went wrong while loading assinged QR Id List");
         this.enableProgressBar=false;
         return false;
       }

       this.assignedQrIdDetailsArray=data.qrIdList;

       this.assignedQrIdListCount=data.qrIdList.length;
      this.dataSource=new MatTableDataSource(data.qrIdList);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

       this.enableProgressBar=false;

     }, error => {
      this.toastService.error("Something went wrong while loading assinged QR Id List");
      this.enableProgressBar=false;
      return false;
     });
   }

   onEditClick(qrCodeId: number){
     this.router.navigate(['legalentity','portal','edit','qr-details',qrCodeId]);
   }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
     
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
      
      this.menuPrefNameModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.headOffice= false;//this.userModel.legalEntityBranchDetails.branchHeadOffice;

    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.utilServiceAPI.setTitle("Legalentity - Assigned QR ID List | Attendme");

    this.menuPrefNameModel = this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuPrefNameModel.branchMenuName;

    this.popAssignedQrIdListRpt();

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
