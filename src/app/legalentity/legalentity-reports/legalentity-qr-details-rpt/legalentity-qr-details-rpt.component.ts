import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityQrService, IqrIdRptReqStruct, IqrIdRptResponseStruct } from '../../services/legalentity-qr.service';
import { DatePipe } from '@angular/common';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { IbranchRptReqStruct, IbranchListReportResponse, IbranchListDetailsResponse, LegalentityBranchService } from '../../services/legalentity-branch.service';
import { LegalentityBranchDataService } from '../../services/legalentity-branch-data.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

export interface IHashMap{
  [key:string]: string;
}

@Component({
  selector: 'app-legalentity-qr-details-rpt',
  templateUrl: './legalentity-qr-details-rpt.component.html',
  styleUrls: ['./legalentity-qr-details-rpt.component.css']
})
export class LegalentityQrDetailsRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  enableProgressBar: boolean;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  equipmentMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintManueName: string;

  displayedColumns: string[] = [];

  contactSearch: string;

  dataSource;
  qrRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  updatedColumnDef: string[] = [];

  columnsTobeExcluded: string[] = ['srNo','QR ID','Edit'];

  totalRecordCount: number=0;

  branchHeadOffice: boolean;
  userBranchId: number;
  branchListArr: IbranchListDetailsResponse[];

  complaintCountColName: string;

  constructor(
    private utileServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private qrIdServiceAPI: LegalentityQrService,
    private datePipe: DatePipe,
    private branchData: LegalentityBranchDataService,
    private branchServiceAPI: LegalentityBranchService,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      "refresh-icon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }

   popQrIdDetailsRpt(lastRecordCount: number, exportToExcel: boolean):void{
  
     this.enableProgressBar=true;
     this.contactSearch='';
     const qrIdDetailsRptReqObj: IqrIdRptReqStruct = {
       allBranch: false,
       branchId: this.branchId,
       endDateTime: null,
       lastRecordCount: lastRecordCount,
       legalEntityId: this.legalEntityId,
       qrActiveStatus: true,
       startDateTime: null,
       branchMenuName: this.branchMenuName,
       complaintMenuName: this.complaintManueName,
       equptMenuName: this.equipmentMenuName,
       exportToExcel: exportToExcel,
       technicianMenuName: this.technicianMenuName,
       userId: this.userId,
       userRole: this.userRole
     };

     if (exportToExcel){

      try {
        let fileName: string = this.equipmentMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");

      this.qrIdServiceAPI.getQrIdDetailsExportToExcel(qrIdDetailsRptReqObj)
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
        this.qrIdServiceAPI.getQrIdDetailsRpt(qrIdDetailsRptReqObj)
      .subscribe((data:IqrIdRptResponseStruct) => {
 
       /*if (data.errorOccured){
         this.enableProgressBar=false;
         this.toastService.error("Something went wrong while loading QR ID details list");
         return false;
       }*/
 
       //console.log(this.complaintCountColName);
        this.displayedColumns = [];
 
        this.displayedColumns = [
          "srNo",
          "QR ID",
          "Edit",
          this.complaintCountColName,
          "Assigned Date"
         ];
        
        let dynamicFormHeadsArr: any[] = data.formHeads;
 
        dynamicFormHeadsArr.forEach(indivFormField => {
          this.displayedColumns.push(indivFormField['formFiledTitleName'])
 
        });
 
        this.updatedColumnDef = this.displayedColumns;
 
        this.displayedColumns.forEach(indivColumn => {
          if (indivColumn == 'srNo'){}
        })
 
   
        this.updatedColumnDef=[];
 
 
        let myMap: IHashMap = {};
        
        let qrRptUpdatedObj: any[] = [];
 
        let srNo:number = 1;
 
        data.qrIdDetailsList.forEach(indivQrDetails => {
 
          //this.displayedColumns.forEach(indivColumnName => {
            
            //myMap[indivColumnName] = ''
          //});
         
          myMap = {};
 
          // myMap['Sr No.']= srNo.toString();
           myMap['QR ID'] = indivQrDetails.qrId;
           myMap[this.branchMenuName] = indivQrDetails.branchName;
           myMap['qrCodeFileLink']=indivQrDetails.qrCodeFileLink;
           myMap['qrCodeId']=indivQrDetails.qrCodeId;
           let assignDate:string = this.datePipe.transform(indivQrDetails.qrAssignDateTime, 'yyyy-MM-dd hh:mm:ss');
           
           myMap['Assigned Date'] = assignDate;
           
           myMap[this.complaintCountColName] = indivQrDetails.complaintCount;

           let qrIdFieldsObj: any[] = indivQrDetails.formFieldDetails;
 
           qrIdFieldsObj.forEach(indivFormFieldObj => {
 
             let formFieldId: number = indivFormFieldObj['formFieldId'];
 
             let formFiledValue: string = indivFormFieldObj['formFieldValue'];
 
             const formFiledNameObj = data.formHeads.map((value,index) => value?{
               formFieldId: value['formFieldId'],
               formFiledTitleName: value['formFiledTitleName']
             }:null)
             .filter(value => value.formFieldId == formFieldId);
 
             myMap[formFiledNameObj[0]['formFiledTitleName']] = formFiledValue;
 
           })
         
           qrRptUpdatedObj.push(myMap);
 
           srNo=srNo+1;
         
           
   
 
        });
 
      
        this.totalRecordCount=qrRptUpdatedObj.length;
 
        this.qrRecordCount = qrRptUpdatedObj.length; //data.contactList.length;
           this.dataSource = new MatTableDataSource(qrRptUpdatedObj);
           
           this.dataSource.paginator = this.paginator;
         //console.log(qrRptUpdatedObj);
           this.dataSource.sort = this.sort;
 
 
 
           const sortState: Sort = {active: 'Assigned Date', direction: 'desc'};
           this.sort.active = sortState.active;
           this.sort.direction = sortState.direction;
           this.sort.sortChange.emit(sortState);
 
           
          
 
        this.enableProgressBar=false;
 
      }, error => {
       this.enableProgressBar=false;
       //this.toastService.error("Something went wrong while loading QR ID details list");
      });
      } catch (error) {
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading QR ID details list");
      }

      
     }

     


   }


   popBranchList(){

    //this.openComplaintProgressBar=true;

    const branchListReqObj: IbranchRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintManueName,
      equptMenuName: this.equipmentMenuName,
      exportToExcel: false,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };

    try {

      this.branchServiceAPI.getBranchListReport(branchListReqObj)
    .subscribe((data: IbranchListReportResponse) => {
      //console.log(data);
      /*if (data.errorOccured){
        this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
        return false;
      }*/

      this.branchListArr=data.branchDetailsList;

    }, error => {
      //this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    });
      
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
    }

    
  }

  openQrIdComplaints(qrId: number){
    try {
      this.router.navigate(['legalentity/portal/rpt/complaints/qr/' + qrId]);  
    } catch (error) {
      this.toastService.error("Something went wrong while redirecting to add" + this.equipmentMenuName + " page","");
    }
    
  }

  ngOnInit() {

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.branchId;
    this.branchHeadOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

        this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
        this.branchId=this.userModel.legalEntityBranchDetails.branchId;

        this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/


    this.menuModel=this.utileServiceAPI.getLegalEntityMenuPrefNames();

    this.equipmentMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.complaintManueName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

    this.complaintCountColName = this.complaintManueName + " Count"

    this.columnsTobeExcluded.push(this.complaintCountColName);

    this.displayedColumns.push(this.branchMenuName);

    this.utileServiceAPI.setTitle("Legalentity - " + this.equipmentMenuName + " | Attendme" );

    if (this.branchHeadOffice){
      this.popBranchList();
    }

    this.popQrIdDetailsRpt(5, false);
  }
  
  openEquipmentFrom(){
    this.router.navigate(['legalentity','portal','add-equipment']);
  }

  applyFilter(filterValue: string):void{
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  editLinkClick(qrCodeId: number){

    this.router.navigate(['legalentity','portal','edit','qr-details',qrCodeId]);
  }


}
