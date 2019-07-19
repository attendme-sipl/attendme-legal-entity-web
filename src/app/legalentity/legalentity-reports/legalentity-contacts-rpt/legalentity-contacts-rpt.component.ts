import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { LegalentityUser } from '../../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LegalentityAddContactComponent } from '../../legalentity-add-contact/legalentity-add-contact.component';
import { LegalentityContactsService, IcontactResponseStruct, IdeactivateContactReqStruct } from '../../services/legalentity-contacts.service';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';

export interface IaddContactReqStruct{
  legalEntityId: number,
  contactActiveStatus: boolean
};

export interface IcontactListDetailsStruct{
   contactId: number,
   contactPersonName: string,
   contactMobileNumber: string,
   contactEmailId: string,
   specificToQrId: boolean
};

export interface IaddContactReqUpdatedStruct{
  legalEntityId: number;
  contactList: {
    contactPersonName: string,
    contactMobileNumber: string,
    contactEmailId: string,
    contactActiveStatus: boolean,
    countryCallingCode: number
  }[],
  cancelClick: boolean;
};

@Component({
  selector: 'app-legalentity-contacts-rpt',
  templateUrl: './legalentity-contacts-rpt.component.html',
  styleUrls: ['./legalentity-contacts-rpt.component.css']
})
export class LegalentityContactsRptComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  legalEntityId: number;
  branchId: number;
  userId: number;
  headOffice: boolean;

  contactSearch: string;

  enableProgressBar: boolean;

  dataSource;
  contactRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  contactListObj: IcontactListDetailsStruct[];

  displayedColumns: string[] = [
  "srNo",
  "contactPersonName",
  "contactMobileNumber",
  "contactEmailId",
  "updateContact",
  "deleteContact"
  ];

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private legalEntityUserModel: LegalentityUser,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private contactServiceAPI: LegalentityContactsService
  ) { 
    iconRegistry.addSvgIcon(
      'contact-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-perm_contact_calendar-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'edit-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-edit-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'delete-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );

   
  }

  popLegalEntityContactRpt():void{

    this.enableProgressBar=true;

    this.contactSearch='';

    this.contactServiceAPI.getLegalEntityContactListRpt(this.legalEntityId,true)
    .subscribe((data:IcontactResponseStruct) => {

      if (data.errorOccurred){
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading contact list report");
        return false;
      }

  

      this.contactRecordCount = data.contactList.length;
      this.dataSource = new MatTableDataSource(data.contactList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.enableProgressBar=false;

     
    }, error => {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while loading contact list report");
    });
  }

  openAddContactDialog(){

    let addContatReqDataObj: IaddContactReqUpdatedStruct = {
      contactList: [{
        contactActiveStatus: null,
        contactMobileNumber: null,
        contactEmailId: null,
        contactPersonName: null,
        countryCallingCode: null
      }],
      legalEntityId: this.legalEntityId,
      cancelClick: false
    };

    const dialogRef = this.dialog.open(LegalentityAddContactComponent,{
      panelClass: 'custom-dialog-container',
      width: '800px',
      data: addContatReqDataObj
    });

    dialogRef.afterClosed()
    .subscribe((result:IaddContactReqUpdatedStruct) => {
      
      if (!addContatReqDataObj.cancelClick){

        this.enableProgressBar=true;
  

    this.contactServiceAPI.addContacts(addContatReqDataObj)
    .subscribe(data => {

      //console.log(data);

      if (data['errorOccurred'])
      {
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while saving contacts");
        return false; 
      } 

      this.enableProgressBar=false;
      this.toastService.success("Contacts added successfully");
      this.popLegalEntityContactRpt();

    }, error => {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while saving contacts");
    });
        
      }

    
      
    });

  }

  removeContact(contactId: number):void{
    
    const confirmAlertDialogObj: IConfirmAlertStruct = {
      alertMessage: "Are you sure you want to remove contact",
      confirmBit: false
    };

    let alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent, {
      data: confirmAlertDialogObj,
      panelClass: 'custom-dialog-container'
    });

    alertDialogRef.afterClosed().subscribe(result => {
      
      if (confirmAlertDialogObj.confirmBit){
        this.enableProgressBar=true;

        const deactiveContactReqObj: IdeactivateContactReqStruct = {
          contactActiveStatus: false,
          contactId: contactId
        };

        this.contactServiceAPI.deactiveContact(deactiveContactReqObj)
        .subscribe(data => {
          if (data['errorOccurred']) {
            this.enableProgressBar=false;
            this.toastService.error("Something went wrong while removing contact, please try again later");
            return false;
          }
          
          this.enableProgressBar = false;
          this.toastService.success("Contact removed successfully");

          this.popLegalEntityContactRpt();
        }, error => {
          this.toastService.error("Something went wrong while removing contact, please try again later");
        })
      }

    })

  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.legalEntityUserModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
      this.branchId=this.legalEntityUserModel.legalEntityBranchDetails.branchId;
      this.userId=this.legalEntityUserModel.legalEntityUserDetails.userId;
      this.headOffice=this.legalEntityUserModel.legalEntityBranchDetails.branchHeadOffice;

      if(this.headOffice=false){
        this.router.navigate(['legalentity','login','portal','dashboard']);
      }

    }
    else{
      this.router.navigate(['legalentity','login']); 
    }

    this.utilServiceAPI.setTitle("Legalentity - Contacts | Attendme");

    this.popLegalEntityContactRpt();

   // console.log(this.displayedColumns[5]);
  }

  applyFilter(filterValue: string):void{
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
