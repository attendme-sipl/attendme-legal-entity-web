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

  equipmentMenuName: string;
  branchMenuName: string;

  displayedColumns: string[] = [
    "Sr No.",
    "QR ID",
    "Assigned Date"
  ];

  dataSource;
  qrRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  constructor(
    private utileServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private qrIdServiceAPI: LegalentityQrService,
    private datePipe: DatePipe
  ) {
    iconRegistry.addSvgIcon(
      "refresh-icon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }

   popQrIdDetailsRpt(lastRecordCount: number):void{
  
    this.enableProgressBar=true;

     const qrIdDetailsRptReqObj: IqrIdRptReqStruct = {
       allBranch: false,
       branchId: this.branchId,
       endDateTime: null,
       lastRecordCount: lastRecordCount,
       legalEntityId: this.legalEntityId,
       qrActiveStatus: true,
       startDateTime: null
     };

     this.qrIdServiceAPI.getQrIdDetailsRpt(qrIdDetailsRptReqObj)
     .subscribe((data:IqrIdRptResponseStruct) => {

      if (data.errorOccured){
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading QR ID details list");
        return false;
      }
       
       let dynamicFormHeadsArr: any[] = data.formHeads;
console.log(dynamicFormHeadsArr);
       dynamicFormHeadsArr.forEach(indivFormField => {
         this.displayedColumns.push(indivFormField['formFiledTitleName'])
       });

       let myMap: IHashMap = {};
       
       let qrRptUpdatedObj: any[] = [];

       let srNo:number = 1;

       data.qrIdDetailsList.forEach(indivQrDetails => {

         //this.displayedColumns.forEach(indivColumnName => {
           
           //myMap[indivColumnName] = ''
         //});
        
         myMap = {};

          myMap['Sr No.']= srNo.toString();
          myMap['QR ID'] = indivQrDetails.qrId;
          myMap[this.branchMenuName] = indivQrDetails.branchName;

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

          this.qrRecordCount = qrRptUpdatedObj.length; //data.contactList.length;
          this.dataSource = new MatTableDataSource(qrRptUpdatedObj);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          const sortState: Sort = {active: 'Assigned Date', direction: 'desc'};
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
  

       })

       this.enableProgressBar=false;

     }, error => {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while loading QR ID details list");
     });


   }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

        this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
        this.branchId=this.userModel.legalEntityBranchDetails.branchId;

    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utileServiceAPI.getLegalEntityMenuPrefNames();

    this.equipmentMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;

    this.displayedColumns.push(this.branchMenuName);

    this.popQrIdDetailsRpt(5);
  }
  
  openEquipmentFrom(){
    this.router.navigate(['legalentity','portal','add-equipment']);
  }

  applyFilter(filterValue: string):void{
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


}
