import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatIconRegistry, MatDialog, MatTableDataSource } from '@angular/material';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityComplaintRptService, IcomplaintIndivReqStruct, IComplaintIdStruct, IComplaintBodyStruct, IclosedComplaintListRptResponse, IclosedComplaintListDetailsResponse } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityIndivComplaintRptComponent } from '../legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';

@Component({
  selector: 'app-legalentity-closed-compt-rpt',
  templateUrl: './legalentity-closed-compt-rpt.component.html',
  styleUrls: ['./legalentity-closed-compt-rpt.component.css']
})
export class LegalentityClosedComptRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;

  complaintMenuName: string;

  enableProgressBar: boolean;

  dataSource;
  closedComptListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "closedDateTime",
    "actionTaken",
    "failureReason"
  ];

  closedComplaintListDetailsObj: IclosedComplaintListDetailsResponse[];
  
  constructor(
    private userModel: LegalentityUser,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private complaintRtpServiceAPI: LegalentityComplaintRptService,
    private menuModel: LegalentityMenuPrefNames,
    private dialog:MatDialog
  ) { 
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
  }

  openComplaintDetailsDialog(complaintId: number):void{

    const IndivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: complaintId
    };
    
    const indivComplaintDialog = this.dialog.open(LegalentityIndivComplaintRptComponent,{
      data: IndivComplaintReqObj
    });

  }

  popClosedComplaintRpt():void{

    this.enableProgressBar=true;

    const closedComplaintsReqObj:IComplaintBodyStruct={
      allBranch: false,
      branchId: this.branchId,
      complaintStatus: 'closed',
      fromDate: null,
      legalEntityId: this.legalEntityId,
      toDate: null
    };

    this.complaintRtpServiceAPI.getClosedComplaintListRpt(closedComplaintsReqObj)
    .subscribe((data: IclosedComplaintListRptResponse) => {
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading closed " + this.complaintMenuName + " list report");
        this.enableProgressBar=false;
        return false;
      }

      //console.log(data);

      this.closedComplaintListDetailsObj=data.complaintList;

      this.closedComptListCount=data.complaintList.length;
      this.dataSource=new MatTableDataSource(data.complaintList);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort; 

      this.enableProgressBar=false;
    }, error => {
      this.toastService.error("Something went wrong while loading closed " + this.complaintMenuName + " list report");
      this.enableProgressBar=false;
    });
  }

  ngOnInit() {

    if(localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle("Legalentity - Closed " + this.complaintMenuName + " Report | Attendme");
    
    this.popClosedComplaintRpt();
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
