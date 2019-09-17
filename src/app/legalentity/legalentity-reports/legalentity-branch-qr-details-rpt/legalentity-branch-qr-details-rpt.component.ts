import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { LegalentityUser } from '../../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry, MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityEquipmentService } from '../../services/legalentity-equipment.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { IqrIdRptReqStruct, LegalentityQrService, IqrIdRptResponseStruct } from '../../services/legalentity-qr.service';
import { IHashMap } from '../legalentity-qr-details-rpt/legalentity-qr-details-rpt.component';
import { DatePipe } from '@angular/common';
import { LegalentityBranchService, IbranchListDetailsResponse, IbranchListReportResponse, IbranchRptReqStruct } from '../../services/legalentity-branch.service';
import {saveAs} from 'file-saver';
import *as moment from 'moment';

@Component({
  selector: 'app-legalentity-branch-qr-details-rpt',
  templateUrl: './legalentity-branch-qr-details-rpt.component.html',
  styleUrls: ['./legalentity-branch-qr-details-rpt.component.css']
})
export class LegalentityBranchQrDetailsRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;

  enableProgressBar: boolean;

  equipmentMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  displayedColumns: string[] = [];

  contactSearch: string;

  dataSource;
  qrRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  updatedColumnDef: string[] = [];

  columnsTobeExcluded: string[] = ['srNo','QR ID','Edit'];

  branchName: string;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private userModel: LegalentityUser,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private qrIdServiceAPI: LegalentityQrService,
    private menuModel: LegalentityMenuPrefNames,
    private router: Router,
    private datePipe: DatePipe,
    private route:ActivatedRoute,
    private branchServiceAPI: LegalentityBranchService
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
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equipmentMenuName,
      exportToExcel: exportToExcel,
      technicianMenuName: this.technicianMenuName
    };

    //console.log(qrIdDetailsRptReqObj);

    if (exportToExcel){
      let fileName: string = this.equipmentMenuName + "-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
      this.qrIdServiceAPI.getQrIdDetailsExportToExcel(qrIdDetailsRptReqObj)
      .subscribe(data => {
        saveAs(data, fileName + ".xls")
        this.enableProgressBar=false;
      }, error => {
        this.toastService.error("Something went wrong while downloading excel");
        this.enableProgressBar=false;
      });
    }
    else{
      this.qrIdServiceAPI.getQrIdDetailsRpt(qrIdDetailsRptReqObj)
    .subscribe((data:IqrIdRptResponseStruct) => {
//console.log(data);
     if (data.errorOccured){
       this.enableProgressBar=false;
       this.toastService.error("Something went wrong while loading QR ID details list");
       return false;
     }

      this.displayedColumns = [];

      this.displayedColumns = [
        "srNo",
        "QR ID",
        "Edit",
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
     this.toastService.error("Something went wrong while loading QR ID details list");
    });
    }

  }

  editLinkClick(qrCodeId: number){

    this.router.navigate(['legalentity','portal','edit','qr-details',qrCodeId]);
  }

  applyFilter(filterValue: string):void{
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  setBranchName(exportToExcel: boolean){

    const branchRptReqObj: IbranchRptReqStruct = {
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equipmentMenuName,
      exportToExcel: exportToExcel,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName
    };

    this.branchServiceAPI.getBranchListReport(branchRptReqObj)
    .subscribe((data:IbranchListReportResponse) =>{
      
      let branchListObjFiltered = data.branchDetailsList.map((value,index) => value?{
        branchId: value['branchId'],
        branchName: value['branchName']
      }:null)
      .filter(value => value.branchId == this.branchId);

      if (branchListObjFiltered.length != 0){
        this.branchName=branchListObjFiltered[0]['branchName'];
      }

    });
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      
      this.menuModel= this.utilServiceAPI.getLegalEntityMenuPrefNames();

      this.equipmentMenuName=this.menuModel.equipmentMenuName;
      this.technicianMenuName=this.menuModel.technicianMenuName;
      this.branchMenuName=this.menuModel.branchMenuName;
      this.complaintMenuName=this.menuModel.complaintMenuName;
      
      //this.branchId=this.userModel.legalEntityBranchDetails.branchId;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.equipmentMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle("" + this.branchMenuName + " QR ID assigned report | Attendme");

    this.branchId=parseInt(this.route.snapshot.paramMap.get('branchId'));

    this.popQrIdDetailsRpt(0, false);

    this.setBranchName(false);
  }

}
