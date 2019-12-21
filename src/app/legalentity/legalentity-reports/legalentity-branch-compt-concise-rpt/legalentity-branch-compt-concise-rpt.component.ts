import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router, NavigationExtras } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityComplaintRptService, IbranchComplaintConciseReqStruct, IbranchComplaintConciseResponse } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityDashboardService } from '../../services/legalentity-dashboard.service';
import { LegalentityBranch } from '../../model/legalentity-branch';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-legalentity-branch-compt-concise-rpt',
  templateUrl: './legalentity-branch-compt-concise-rpt.component.html',
  styleUrls: ['./legalentity-branch-compt-concise-rpt.component.css']
})
export class LegalentityBranchComptConciseRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  branchHeadOffice: boolean;

  userId: number;
  userRole: string;

  branchMenuName: string;
  complaintMenuName: string;

  totalRecordCount: number=0;
  enableProgressBar: boolean;

  unreslovedDayCount: number;

  searchKey: string;

  dataSource;

  displayedColumn: string[] = [
    "srNo",
    "branchName",
    "openComplaintCount",
    "assignedComplaintCount",
    "inprogressComplaintCount",
    "closedComplaintCount",
    "unreslovedMoreThanCount",
    "unresolvedUptoCount",
    "complaintTrashCount"
  ];

  branchRecordCount: number;
  pageSize:number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];
  
  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private userModel: LegalentityUser,
    private router: Router,
    private menuModel: LegalentityMenuPrefNames,
    private dashboardService: LegalentityDashboardService,
    private complaintRptService: LegalentityComplaintRptService,
    private branchModel: LegalentityBranch,
    private branchData: LegalentityBranchDataService,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      "refresh-panel",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }

   popBranchComplaintConciseRpt(){

    this.enableProgressBar=true;
    this.searchKey='';

    try {

      this.dashboardService.getUnresolvedDaysRuleBook(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole
        )
      .subscribe(data => {
  
        /*if (data['errorOccured'] == true){
          this.enableProgressBar=false;
          this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
          return false;
        }*/
  
        this.unreslovedDayCount = parseInt(data['unresolvedDaysCount']);
  
        const branchComptConciseReqObj: IbranchComplaintConciseReqStruct = {
          branchActiveStatus: true,
          complaintTrash: false,
          legalEntityId: this.legalEntityId,
          unresolvedComptDaysCount: this.unreslovedDayCount,
          branchId: this.branchId,
          userId: this.userId,
          userRole: this.userRole
        };
  
        try {
  
          this.complaintRptService.getBranchComplaintConciseRpt(branchComptConciseReqObj)
        .subscribe((data: IbranchComplaintConciseResponse) => {
  
          /*if (data.errorOccurred)
          {
            this.enableProgressBar=false;
            this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
            return false;
          }*/
  
          this.totalRecordCount=data.branchComptDetails.length;
  
          this.branchRecordCount = data.branchComptDetails.length;
          this.dataSource = new MatTableDataSource(data.branchComptDetails);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
     
          //const sortState: Sort = {active: 'complaintAssignedDateTime', direction: 'desc'};
          //this.sort.active = sortState.active;
          //this.sort.direction = sortState.direction;
          //this.sort.sortChange.emit(sortState);
  
          this.enableProgressBar=false;
  
        }, error => {
          this.enableProgressBar=false;
          //this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
        });
          
        } catch (error) {
          this.enableProgressBar=false;
          this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
        }
  
        
  
      }, error => {
        //this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
      });
      
    } catch (error) {
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading " + this.complaintMenuName + " details.");
    }

    

  

   }

  ngOnInit() {

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    const tokenModel: TokenModel = this.authService.getTokenDetails();


    this.userId=tokenModel.userId;
    this.branchId=tokenModel.branchId;
    this.legalEntityId=tokenModel.legalEntityId;
    this.userRole=tokenModel.userRole;

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuModel.branchMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.popBranchComplaintConciseRpt();


  }

  openComplaintSection(branchId: number){
  
    //this.branchModel.branchId=branchId;
    //let navigationDetails: NavigationExtras={
    //  state: this.branchModel
    //};

    //this.router.navigate(
    //  [
     //   '/legalentity','portal','rpt','open'
     // ], navigationDetails);

     this.branchData.branchDetails = {
       branchId: branchId
      }

     this.router.navigate(['/legalentity','portal','rpt','open']);

  }

  assignedComplaintSection(branchId: number){
    this.branchData.branchDetails = {
      branchId: branchId
     }

    this.router.navigate(['/legalentity','portal','rpt','assigned']);
  }

  inprogressComplaintSection(branchId: number){
    this.branchData.branchDetails = {
      branchId: branchId
     }

    this.router.navigate(['/legalentity','portal','rpt','inprogress']);
  }

  closedComplaintSection(branchId: number){
    this.branchData.branchDetails = {
      branchId: branchId
     }

    this.router.navigate(['/legalentity','portal','rpt','closed']);
  }

  trashComplaintSection(branchId: number){
    this.branchData.branchDetails = {
      branchId: branchId
     }

    this.router.navigate(['/legalentity','portal','rpt','trash','complaint']);
  }

  onResolvedComplaintClick(moreThanUptoFlag: string, branchId: number){
    this.branchData.branchDetails={
      branchId: branchId
    };

    this.router.navigate(['/legalentity','portal','rpt','complaints','unresolved',moreThanUptoFlag]);
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
