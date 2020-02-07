import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { LegalentityUser } from '../../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LegalentityAddContactComponent } from '../../legalentity-add-contact/legalentity-add-contact.component';
import { LegalentityContactsService, IcontactResponseStruct, IdeactivateContactReqStruct, IcontactRptReqStruct } from '../../services/legalentity-contacts.service';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { AuthService } from 'src/app/Auth/auth.service';

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
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string,
  contactList: {
    contactPersonName: string,
    contactMobileNumber: string,
    contactEmailId: string,
    contactActiveStatus: boolean,
    countryCallingCode: number
  }[],
  cancelClick: boolean,
  contactId: number,
  contactInsertOption: boolean
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
  userRole: string;
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

  technicianMenuName: string;
  branchMenuName: string;
  complaintMenuName: string;
  equptMenuName: string;

  totalRecordCount: number = 0;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private legalEntityUserModel: LegalentityUser,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private contactServiceAPI: LegalentityContactsService,
    private menuModel: LegalentityMenuPrefNames,
    private authService: AuthService
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


  popLegalEntityContactRpt(exportToExcel: boolean):void{

    this.enableProgressBar=true;

    this.contactSearch='';

    const contactRptReqObj: IcontactRptReqStruct={
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      contactActiveStatus: true,
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
        let fileName: string = "Contacts-Report-" + moment().format("YYYY-MM-DD-HH-mm-SSS");
        this.contactServiceAPI.getLegalEntityContactListExportToExcel(contactRptReqObj)
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
        this.contactServiceAPI.getLegalEntityContactListRpt(contactRptReqObj)
    .subscribe((data:IcontactResponseStruct) => {

      /*if (data.errorOccurred){
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading contact list report");
        return false;
      }*/

      this.contactListObj = data.contactList.map((value,index) => value ? {
        contactId: value['contactId'],
        contactPersonName: value['contactPersonName'],
        contactMobileNumber: value['contactMobileNumber'],
        contactEmailId: value['contactEmailId'],
        specificToQrId: value['specificToQrId']
      } : null)
      .filter(value => value.specificToQrId == false);

      this.totalRecordCount=this.contactListObj.length;

      this.contactRecordCount = this.contactListObj.length; //data.contactList.length;
      this.dataSource = new MatTableDataSource(this.contactListObj);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.enableProgressBar=false;

     
    }, error => {
      this.enableProgressBar=false;
      //this.toastService.error("Something went wrong while loading contact list report");
    });
      } catch (error) {
        this.enableProgressBar=false;
        this.toastService.error("Something went wrong while loading contact list report");
      }

      
    }

    
  }

  openAddContactDialog(){

    try {
      let addContatReqDataObj: IaddContactReqUpdatedStruct = {
        contactList: [{
          contactActiveStatus: null,
          contactMobileNumber: null,
          contactEmailId: null,
          contactPersonName: null,
          countryCallingCode: null
        }],
        legalEntityId: this.legalEntityId,
        branchId: this.branchId,
        userId: this.userId,
        userRole: this.userRole,
        cancelClick: false,
        contactInsertOption: true,
        contactId: 0
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
      
          try {
            this.contactServiceAPI.addContacts(addContatReqDataObj)
      .subscribe(data => {
  
        //console.log(data);
  
        /*if (data['errorOccurred'])
        {
          this.enableProgressBar=false;
          this.toastService.error("Something went wrong while saving contacts");
          return false; 
        }*/
  
        this.enableProgressBar=false;
        this.toastService.success("Contacts added successfully");
  
        this.popLegalEntityContactRpt(false);
  
      }, error => {
        this.enableProgressBar=false;
        //this.toastService.error("Something went wrong while saving contacts");
      });
          } catch (error) {
            this.enableProgressBar=false;
            this.toastService.error("Something went wrong while saving contacts");
          }
          
        }

      }); 
    } catch (error) {
      this.toastService.error("Something went wrong while opening add contacts dialog","");
    }

  }

  removeContact(contactId: number):void{
    
    try {
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
            contactId: contactId,
            branchId: this.branchId,
            legalEntityId: this.legalEntityId,
            userId: this.userId,
            userRole: this.userRole
          };
  
          try {
            this.contactServiceAPI.deactiveContact(deactiveContactReqObj)
          .subscribe(data => {
            /*if (data['errorOccurred']) {
              this.enableProgressBar=false;
              this.toastService.error("Something went wrong while removing contact, please try again later");
              return false;
            }*/
            
            this.enableProgressBar = false;
            this.toastService.success("Contact removed successfully");
  
            this.popLegalEntityContactRpt(false);
          }, error => {
            this.enableProgressBar = false;
            //this.toastService.error("Something went wrong while removing contact, please try again later");
          });
          } catch (error) {
            this.enableProgressBar = false;
            this.toastService.error("Something went wrong while removing contact, please try again later"); 
          }
  
          
        }
  
      });
  
    } catch (error) {
      this.toastService.error("Something went wrong while deleting contact from the list","");
    }

  }

  onEditClick(
    contactId: number, 
    contactPersonName: string, 
    contactMobNumber: string, 
    contactEmailId: string,
    countryCallingCode: number
    ){

      let mobileNumber: string ='';
      let countryCode: number = null; 
      
     if (contactMobNumber != '' || contactMobNumber != null){
      
      let contactMobileObj: string[] = contactMobNumber.split("-");

      mobileNumber=contactMobileObj[1];
      countryCode= parseInt(contactMobileObj[0]);
      
     }

    let addContatReqDataObj: IaddContactReqUpdatedStruct = {
      contactList: [{
        contactActiveStatus: true,
        contactMobileNumber: mobileNumber != ''? mobileNumber : null,
        contactEmailId: contactEmailId,
        contactPersonName: contactPersonName,
        countryCallingCode: countryCode
      }],
      legalEntityId: this.legalEntityId,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole,
      cancelClick: false,
      contactInsertOption: false,
      contactId: contactId
    };


    const dialogRef = this.dialog.open(LegalentityAddContactComponent,{
      panelClass: 'custom-dialog-container',
      width: '800px',
      data: addContatReqDataObj
    });

  }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.headOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
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
      return false;
    }*/

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;

    this.utilServiceAPI.setTitle("Legalentity - Contacts | Attendme");

    this.popLegalEntityContactRpt(false);

   // console.log(this.displayedColumns[5]);      
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page","");
    }

  }

  applyFilter(filterValue: string):void{
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
