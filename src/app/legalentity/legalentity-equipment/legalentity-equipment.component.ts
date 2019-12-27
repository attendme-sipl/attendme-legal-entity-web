import { Component, OnInit, Input, Inject } from '@angular/core';
import { LegalentityUtilService, IcountryCallingCodeResponse } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { IequptFormFieldPrefResponse, LegalentityEquipmentService, IaddQrIdResponseStruct, IbranchWiseQrIdListReqStruct, IbranchWiseQrIdListResStruct } from '../services/legalentity-equipment.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityCommons } from '../model/legalentity-commons';
import {LegalentityEquipment} from '../model/legalentity-equipment'
import { LegalentityContactsService, IcontactResponseStruct, IcontactRptReqStruct } from '../services/legalentity-contacts.service';
import { IaddContactReqUpdatedStruct } from '../legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { MatDialog } from '@angular/material';
import { LegalentityAddContactComponent } from '../legalentity-add-contact/legalentity-add-contact.component';
import { stringify } from '@angular/compiler/src/util';
import { LegalentityQrService, IavailbleQrIdCountReqStruct } from '../services/legalentity-qr.service';
import { Observable } from 'rxjs';
import { startWith, map, filter, distinctUntilChanged } from 'rxjs/operators';
import {RequireMatch as RequireMatch} from '../requireMatch';
import { LegalentityDocumentServiceService, IlegalEntityDocumentRptResponse, IlegalEntityDocumentRptDetails, IlegalEntityDocumentRptWithSelect } from '../services/legalentity-document-service.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';


export interface IalottedQRIDList{
  qrCodeId: number,
  qrId: string
};

export interface equptFormfieldTitleDataStruct{
   formFieldId: number,
   formFiledTitleName: string
};

export interface IqrIdFormFieldObjStruct{
  formFieldId: number, 
  formFieldValue: string
};

export interface IqrIdContactObjStrut{
   contactPersonName: string,
   contactMobileNumber: string,
   contactEmailId: string,
   contactToBeDisplayed: boolean,
   countryCallingCode: number;
};

export interface IcontactEquptMappingReqStruct{
  contactId: number,
  contactToBeDisplayed: boolean,
  contactPersonName: string,
  contactMobileNumber: string,
  contactEmailId: string,
  contactSelected: boolean,
  smsRequired: boolean,
  emailRequired: boolean,
  specificToQrId: boolean
};

export interface ISpecQrIdcontactEquptMappingReqStruct{
  contactId: number,
  contactToBeDisplayed: boolean,
  contactPersonName: string,
  contactMobileNumber: string,
  contactEmailId: string,
  contactSelected: boolean,
  smsRequired: boolean,
  emailRequired: boolean,
  contactCountryCallingCode: number,
  specificToQrId: boolean
};


@Component({
  selector: 'app-legalentity-equipment',
  templateUrl: './legalentity-equipment.component.html',
  styleUrls: ['./legalentity-equipment.component.css']
})
export class LegalentityEquipmentComponent implements OnInit {

 
  legalEntityId: number;
 
  branchId: number;

  userId: number;

  userRole: string;

  qrIdListObj: IalottedQRIDList[];

  equptFormFiledDataObj: equptFormfieldTitleDataStruct[];

  equptFormFieldTitleGroup: FormGroup;

  equptForm: FormGroup;

  defaultCountryCode: number;

  countryCallingCodeResponseObj: IcountryCallingCodeResponse;

  equptFormSubmitted: boolean;

  equtpFormFieldFormarray: FormArray;

  checked: boolean;

  addEquipmentFormObj: LegalentityEquipment;
  addEquptProgressBar: boolean;
  headOffice: boolean;

  makeAllPublic: boolean;
  selectAllContacts: boolean;
  smsSelectall: boolean;
  emailSelectAll: boolean;

  contactArr: IcontactEquptMappingReqStruct[];

  defaultSMSEnable: boolean;
  defaultEmailEnable: boolean;

  enableContactProgressBar:boolean ;

  countryCallingCodeListObj: IcountryCallingCodeResponse[];

  myControl = new FormControl();
  filterOptions: Observable<IalottedQRIDList[]>;

  //options: string[] = ['One', 'Two', 'Three'];

  spcificQrIdContactCount: number;

  errorMessageEnable: boolean;
  errorMessageTxt: string;

  documentRptResponseObj: IlegalEntityDocumentRptResponse;
  documentRptDetailsObj: IlegalEntityDocumentRptDetails[];

  panelOpenState: boolean;

  mobileNumberPattern: string = "^[0-9]*$";
  
  constructor(
    private utilService: LegalentityUtilService,
    private userModel: LegalentityUser,
    private router: Router,
    public menuPrefNameModel: LegalentityMenuPrefNames,
    private equptService: LegalentityEquipmentService,
    private toastService: ToastrService,
    private equptFormFieldBuider: FormBuilder,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public commonModel: LegalentityCommons,
    private contatServiceAPI: LegalentityContactsService,
    private dialog:MatDialog,
    private contactServiceAPI: LegalentityContactsService,
    private qrIdServiceAPI: LegalentityQrService,
    private documentServiceAPI: LegalentityDocumentServiceService,
    private authService: AuthService
  ) { 
    iconRegistry.addSvgIcon(
      "addRecordIcon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-add_circle-24px.svg'),
    );

    iconRegistry.addSvgIcon(
      "deleteRecordIcon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
    );

    iconRegistry.addSvgIcon(
      "refresh-icon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    
  }

  

  get equptFormFieldArray(){
    try {
      return this.equptForm.get('formFieldData') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while loading " + this.menuPrefNameModel.equipmentMenuName + " form field heads.","");
    }
    
  }


  addEqutpFromFieldFormArray(formFieldId: number, formFieldTitleName: string, formFieldValue: string, characterLength: number){
  try {
    this.equptFormFieldArray.push(this.equptFormFieldBuider.group({
      formFieldId: formFieldId,
      formFiledTitleName: formFieldTitleName,
      characterLimit: characterLength,
      formFieldValue:['', Validators.maxLength(characterLength)]  //formFieldValue
    }));
  } catch (error) {
    this.toastService.error("Something went wrong while adding " + this.menuPrefNameModel.equipmentMenuName + " form field heads to the page.","");
  }
   
  }

  removeEqutpFormFiledArray(indexValue: number){
    try {
      this.equptFormFieldArray.removeAt(indexValue);      
    } catch (error) {
      this.toastService.error("Something went wrong while removing " + this.menuPrefNameModel.equipmentMenuName + " form field head from the page.","");
    }

  }

  getEquptFormfieldPref():void{

    
     this.addEquptProgressBar=true;

     try {
      this.equptService.getEquptFormFieldPref(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole,
        true
        )
        
      .subscribe((data:IequptFormFieldPrefResponse) => {
        /*if (data.errorOccured)
        {
          this.addEquptProgressBar=false;
          this.toastService.error("Something whent wrong while loading form details");
          return false;
        }*/
        
  
        //let formFieldArray: FormArray;
  
        if (data.equptFormFieldTitles.length > 0){
         this.equptFormFiledDataObj = data.equptFormFieldTitles
  
         let recordCount: number = 1;
       
         this.equptFormFiledDataObj.forEach(result => {
  
          if (recordCount == 1 || recordCount == 2){
            let updatedFormFieldTitle: string = result.formFiledTitleName;
            this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,'',256);
          }
          else{
            let updatedFormFieldTitle: string = result.formFiledTitleName;
            this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,'',40);
          }
  
          recordCount = recordCount+1;
  
          });
  
         // this.commonModel.enableProgressbar=false;
         
        }
        //else
       // {
          
        //}
  
        this.addEquptProgressBar=false;
      }, error =>{
        this.addEquptProgressBar=false;
        //this.toastService.error("Something whent wrong while loading form details");
      });
     } catch (error) {
      this.addEquptProgressBar=false;
      this.toastService.error("Something whent wrong while loading form details");
     }
    
    
  }

  popQrIdDrp():void{
    
    //if(this.headOffice){

    if (this.headOffice){

      this.addEquptProgressBar=true;

      const availableQrIdCountReqObj: IavailbleQrIdCountReqStruct = {
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        qrActiveStatus: true,
        qrAssignStatus: true,
        userId: this.userId,
        userRole: this.userRole
      }

      try {
        this.qrIdServiceAPI.getNumOfQrIdAvailableHeadOffice(availableQrIdCountReqObj)
        .subscribe(data => {
  //console.log(data);
          /*if (data['errorOccurred']){
             this.addEquptProgressBar=false;
             this.toastService.error("Something went wrong while loading QR IDs");
             return false;
          }*/
  
          let availableQrIdCount: number = parseInt(data['availabledQrIdAllotCount']);
  
          if (availableQrIdCount == 0){
            this.addEquptProgressBar=false;
            this.errorMessageEnable=true;
            this.errorMessageTxt="QR IDs not availabled. Please contact administrator";
            return false
          }
          
          try {
            this.utilService.getLegalEntityAlottedQRIdList(
              this.legalEntityId,
              this.branchId,
              this.userId,
              this.userRole,
              false,
              true,
              false)
          .subscribe(data => {
            this.qrIdListObj = data;
    
            this.addEquptProgressBar=false;
            
          }, error => {
            //this.toastService.error("Something went wrong while load QR ID list");
          });
          } catch (error) {
            this.toastService.error("Something went wrong while load QR ID list");
          }
  
  
        }, error => {
          this.addEquptProgressBar=false;
          //this.toastService.error("Something went wrong while loading QR IDs");
        });        
      } catch (error) {
        this.toastService.error("Something went wrong while loading QR IDs");
      }

    

    }
    else {

      this.addEquptProgressBar=true;

      const availableQrIdCountReqObj: IavailbleQrIdCountReqStruct = {
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        qrActiveStatus: true,
        qrAssignStatus: true,
        userId: this.userId,
        userRole: this.userRole
      }

      try {
        this.qrIdServiceAPI.getNumOfQrIdAvailableBranchOffice(availableQrIdCountReqObj)
        .subscribe(data => {
  
          /*if (data['errorOccurred']){
            this.addEquptProgressBar=false;
            this.toastService.error("Something went wrong while loading QR IDs");
            return false;
         }*/
  
         let availableQrIdCount: number = parseInt(data['availabledQrIdAllotCount']);
  
         if (availableQrIdCount == 0){
           this.addEquptProgressBar=false;
           this.errorMessageEnable=true;
           this.errorMessageTxt="QR IDs not availabled. Please contact administrator";
           return false
         }
  
         try {
          this.utilService.getLegalEntityAlottedQRIdList(
            this.legalEntityId,
            this.branchId,
            this.userId,
            this.userRole,
            false,
            true,
            false)
          .subscribe(data => {
            this.qrIdListObj = data;
    
            this.addEquptProgressBar=false;
            
          }, error => {
            //this.toastService.error("Something went wrong while load QR ID list");
          }); 
         } catch (error) {
          this.toastService.error("Something went wrong while load QR ID list");
         }
  
        }, error => {
          this.addEquptProgressBar=false;
          //this.toastService.error("Something went wrong while loading QR IDs");
        });  
      } catch (error) {
        this.toastService.error("Something went wrong while loading QR IDs");
      }

      

    }

      


   // }
    /*else{

      const branchWiseQrIdListReqObj: IbranchWiseQrIdListReqStruct = {
        branchId: this.branchId,
        qrActiveStatus: true,
        qrStatus: false
      }

      this.equptService.getBranchWiseQrId(branchWiseQrIdListReqObj)
      .subscribe((data:IbranchWiseQrIdListResStruct) => {

        if(data.errorOccured){
          this.toastService.error("Something went wrong while load QR ID list");
          return false;
        }

        this.qrIdListObj=data.qrIdList;

        //console.log(this.qrIdListObj.length);


      }, error =>{
        this.toastService.error("Something went wrong while load QR ID list");
      });
    } */
  }

  popCountryCallingCode():void{
    try {
      this.utilService.countryCallingCode()
    .subscribe((data:IcountryCallingCodeResponse) =>{
     
      this.countryCallingCodeResponseObj = data;
      
    }, error => {
      //this.toastService.error("Something went wrong while loading country calling code");
    });
    } catch (error) {
      this.toastService.error("Something went wrong while loading country calling code");
    }
    
  }
  
  get qrContactDetailsFormArray()
  {
    try {
      return this.equptForm.get('qrContactData') as FormArray   
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details","");
    }
    
  } 

  getQrIdContactFormGroup(): FormGroup{
    try {
      return this.equptFormFieldBuider.group({
        contactPersonName: [''],
        countryCallingCode: this.defaultCountryCode,
        contactMobileNumber: ['',Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10)
        ])],
        contactEmailId: ['', Validators.email],
        contactToBeDisplayed: this.checked,
        contactId:[''],
        smsRequired: this.defaultSMSEnable ,
        emailRequired: this.defaultEmailEnable
      })  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details","");
    }
    
  }

  
  addQrIdContact()
  {
    try {
      this.qrContactDetailsFormArray.push(this.getQrIdContactFormGroup())  
    } catch (error) {
      this.toastService.error("Something went wrong while adding contact details","");
    }
    
  }

  removeQrIdContact(indexId: number){
    try {
      this.qrContactDetailsFormArray.removeAt(indexId);  
    } catch (error) {
      this.toastService.error("Something went wrong while removing contact details","");
    }
    
  }


  // Logic to populate contact list

  popNotificationContactList():void{

    try {

      this.enableContactProgressBar=true;

    while(this.qrIdContactFormArray.length){
      this.qrIdContactFormArray.removeAt(0);
    }

    const contactRptReqObj: IcontactRptReqStruct={
      branchMenuName: this.menuPrefNameModel.branchMenuName,
      complaintMenuName: this.menuPrefNameModel.complaintMenuName,
      contactActiveStatus: true,
      equptMenuName: this.menuPrefNameModel.equipmentMenuName,
      exportToExcel: false,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.menuPrefNameModel.technicianMenuName,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole
    };
    
    this.contatServiceAPI.getLegalEntityContactListRpt(contactRptReqObj)
    .subscribe((data:IcontactResponseStruct) => {
      /*if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading contacts list");
        this.enableContactProgressBar=false;
        return false;
      }*/

      this.contactArr=data.contactList.map((value,index) => value ? {
        contactId: value['contactId'],
        contactToBeDisplayed: value['contactToBeDisplayed'],
        contactPersonName: value['contactPersonName'],
        contactMobileNumber: value['contactMobileNumber'],
        contactEmailId: value['contactEmailId'],
        contactSelected: value['contactSelected'],
        smsRequired: value['smsRequired'],
        emailRequired: value['emailRequired'],
        specificToQrId: value['specificToQrId']
      } : null)
      .filter(value => value.specificToQrId == false);

      this.contactArr.forEach((indivContactObj: IcontactEquptMappingReqStruct) => {
        //indivContactObj.contactSelected=false;
        indivContactObj.contactToBeDisplayed=false;
        indivContactObj.smsRequired=false;
        indivContactObj.emailRequired=false;
        this.addQrIdContactDetailsToFormArray(indivContactObj);
      });

      this.enableContactProgressBar=false;

    }, error => {
      //this.toastService.error("Something went wrong while loading contacts list");
      this.enableContactProgressBar=false;
    });
      
    } catch (error) {
      this.toastService.error("Something went wrong while loading contacts list");
      this.enableContactProgressBar=false;
    }

    
  }

  get qrIdContactFormArray()
  {
    try {
      return this.equptForm.get('qrContactData') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while loading contacts list");
    }
    
  }

  addQrIdContactDetailsToFormArray(qrIdContactObj: IcontactEquptMappingReqStruct){
    try {
      this.qrIdContactFormArray.push(this.equptFormFieldBuider.group(qrIdContactObj));  
    } catch (error) {
      this.toastService.error("Something went wrong while loading contacts list");
    }
    
    
  }



  smsRequiredAll(event):void{
    try {
      let contactListObj: IcontactEquptMappingReqStruct[] = this.equptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];

    let selectAllSMSRequired: boolean = event.checked;

    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      if (indivContact.contactMobileNumber != ''){
        indivContact.smsRequired= selectAllSMSRequired;
        contactListObjNew.push(indivContact);
      } 
    });

    this.equptForm.patchValue({
      qrContactData: contactListObj
    });
    } catch (error) {
      this.toastService.error("Something went wrong in SMS check list in contact list");
    }
    
  }

  emailRequiredAll(event):void{

    try {
      let contactListObj: IcontactEquptMappingReqStruct[] = this.equptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];

    let selectAllSMSRequired: boolean = event.checked;

    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      if (indivContact.contactEmailId != ''){
        indivContact.emailRequired= selectAllSMSRequired;
        contactListObjNew.push(indivContact); 
      }
      
    });

    this.equptForm.patchValue({
      qrContactData: contactListObj
    });
    } catch (error) {
      this.toastService.error("Something went wrong in Email check list in contact list");
    }

    
  }

  contactMakeAllPublic(event):void{

    try {
      let contactListObj: IcontactEquptMappingReqStruct[] = this.equptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];

    let makeAllPublicChecked: boolean = event.checked;

    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      indivContact.contactToBeDisplayed= makeAllPublicChecked;
      contactListObjNew.push(indivContact); 
    });

    this.equptForm.patchValue({
      qrContactData: contactListObj
    });
    } catch (error) {
      this.toastService.error("Something went wrong in contaxt make public check list in contact list");
    }

    

  }

  /*openAddContactdialog():void{

    let addContatReqDataObj: IaddContactReqUpdatedStruct = {
      contactList: [{
        contactActiveStatus: null,
        contactMobileNumber: null,
        contactEmailId: null,
        contactPersonName: null,
        countryCallingCode: null
      }],
      legalEntityId: this.legalEntityId,
      cancelClick: null
    };

    const dialogRef = this.dialog.open(LegalentityAddContactComponent,{
      panelClass: 'custom-dialog-container',
      width: '800px',
      data: addContatReqDataObj
    });


    dialogRef.afterClosed()
    .subscribe((result:IaddContactReqUpdatedStruct) => {

      console.log(addContatReqDataObj);
      
      if (!addContatReqDataObj.cancelClick){

        this.enableContactProgressBar=true;
  

    this.contactServiceAPI.addContacts(addContatReqDataObj)
    .subscribe(data => {

      //console.log(data);

      if (data['errorOccurred'])
      {
        this.enableContactProgressBar=false;
        this.toastService.error("Something went wrong adding saving contacts");
        return false; 
      } 

      this.enableContactProgressBar=false;
      //this.toastService.success("Contacts added successfully");
      this.popNotificationContactList();

    }, error => {
      this.enableContactProgressBar=false;
      this.toastService.error("Something went wrong while adding contacts");
    });
        
      }
    });
  }*/

  getSpcificQrIdContactFromGroup(): FormGroup{
    try {
      return this.equptFormFieldBuider.group({
        contactId: 0,
        contactPersonName: [''],
        contactEmailId: ['', Validators.email],
        contactCountryCallingCode:91,
        //contactMobileNumber: ['', Validators.compose([
          //Validators.minLength(10),
          //Validators.maxLength(10)
        //])
        contactMobileNumber: ['',[Validators.pattern(this.mobileNumberPattern)]],
        contactToBeDisplayed: false,
        smsRequired:false,
        emailRequired: false,
        specificToQrId: true
      });  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details");
    }
    
  }

  get specificQrIdContactFormArray(){
    try {
      return this.equptForm.get('specificToQrContact') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details");
    }
    
  }

  addSpecificQrIdContactToFormArray(){
    try {
      this.specificQrIdContactFormArray.push(this.getSpcificQrIdContactFromGroup());
      this.spcificQrIdContactCount=this.spcificQrIdContactCount+1;
      this.setCustomValidators();  
    } catch (error) {
      this.toastService.error("Something went wrong while adding contact details");
    }
    
  }

  removeSpecificQrIdContactFromFormArray(index: number){
    try {
      this.specificQrIdContactFormArray.removeAt(index);
      this.spcificQrIdContactCount=this.spcificQrIdContactCount-1;  
    } catch (error) {
      this.toastService.error("Something went wrong while deleting contact details");
    }
    
  }

  onSubmitClick()
  {

    this.equptFormSubmitted = true;

    this.addEquptProgressBar=true;

    try {
      if (this.equptForm.valid){

        let qrIdFormFieldDataObj: IqrIdFormFieldObjStruct[] = this.equptForm.value['formFieldData'];
  
        let newQrIdFormFieldDataObj: IqrIdFormFieldObjStruct[] = [];
  
      qrIdFormFieldDataObj.forEach(indivFormField => {
        if (indivFormField.formFieldValue != ''){
            newQrIdFormFieldDataObj.push({
              formFieldId: indivFormField.formFieldId,
              formFieldValue: indivFormField.formFieldValue
            });
            }
        
      });
  
      const qrIdContactArr: IcontactEquptMappingReqStruct[] = this.equptForm.get('qrContactData').value;
  
      let qrIdContactArrUpdated: IcontactEquptMappingReqStruct[] = [];
  
  
      qrIdContactArr.forEach((indivConatactObj: IcontactEquptMappingReqStruct) => {
        if (indivConatactObj.smsRequired || indivConatactObj.emailRequired || indivConatactObj.contactToBeDisplayed){
          qrIdContactArrUpdated.push(indivConatactObj);
        }
      });
  
  
      let specificQrIdContactArray: ISpecQrIdcontactEquptMappingReqStruct[] = this.equptForm.get('specificToQrContact').value;
  
      specificQrIdContactArray.forEach(spcificQrIdIndivContact => {
        if (spcificQrIdIndivContact.contactPersonName != '' ||
        spcificQrIdIndivContact.contactEmailId != '' ||
        spcificQrIdIndivContact.contactMobileNumber != ''){
  
          if (spcificQrIdIndivContact.contactMobileNumber != ''){
            spcificQrIdIndivContact.contactMobileNumber = spcificQrIdIndivContact.contactCountryCallingCode + "-" + spcificQrIdIndivContact.contactMobileNumber;
          }
          else
          {
            spcificQrIdIndivContact.smsRequired=false;
          }
  
          if (spcificQrIdIndivContact.contactEmailId == ''){
            spcificQrIdIndivContact.emailRequired=false;
          }
  
          
  
          qrIdContactArrUpdated.push({
            contactEmailId: spcificQrIdIndivContact.contactEmailId,
            contactId: spcificQrIdIndivContact.contactId,
            contactMobileNumber: spcificQrIdIndivContact.contactMobileNumber,
            contactPersonName: spcificQrIdIndivContact.contactPersonName,
            contactSelected: true,
            contactToBeDisplayed: spcificQrIdIndivContact.contactToBeDisplayed,
            emailRequired: spcificQrIdIndivContact.emailRequired,
            smsRequired: spcificQrIdIndivContact.smsRequired,
            specificToQrId: spcificQrIdIndivContact.specificToQrId,
  
          });
  
        }
      });
  
      let documentListObj: IlegalEntityDocumentRptWithSelect[] = this.equptForm.get('equptDocList').value;
  
          const documentListObjFiltered = documentListObj.map((value,index) => value ? {
            equptDocId: value['equptDocId'],
            equptDocActiveStatus: value['equptDocActiveStatus'],
            docSelected: value['docSelected']
          } : null)
          .filter(value => value.docSelected == true);
        
      //console.log(this.equptForm.value);
      
        this.addEquipmentFormObj = {
          addedByUserId: this.equptForm.value['addedByUserId'],
          adminApprove: true,
          branchId: this.branchId,
          equptActiveStatus: true,
          formFieldData: newQrIdFormFieldDataObj,
          qrCodeId: this.equptForm.get('qrCodeData').value['qrCodeId'],
          qrContactData: qrIdContactArrUpdated,
          headOffice: this.headOffice,
          legalEntityId: this.legalEntityId,
          equptDocList: documentListObjFiltered,
          userId: this.userId,
          userRole: this.userRole
        };
  
  //console.log(this.addEquipmentFormObj);
      try {
        this.equptService.getAddQrIdDetails(this.addEquipmentFormObj)
        .subscribe((data:IaddQrIdResponseStruct) => {
  
        //console.log(data);
          /*if (data.errorOccured){
            this.addEquptProgressBar=false;
            this.toastService.error("Something went wrong while add QR ID details");
            return false;
          }*/
  
          if (data.qrCodeAlreadyAssigned){
            this.addEquptProgressBar=false;
            this.toastService.error("Selected QR ID already assinged, Please selext another QR ID");
            return false;
          }
  
          if (data.qrAllotedLimitOver){
            this.addEquptProgressBar=false;
            this.toastService.error("Selected QR ID cannot cannot be assinged as the QR Id is already assinged or QR Ids not available");
            return false;
          }
  
          this.addEquptProgressBar=false;
          this.toastService.success("QR ID details added successfully");
  
          this.onResetClick();
          
        }, error => {
          this.addEquptProgressBar=false;
          //this.toastService.error("Something went wrong while add QR ID details");
        }); 
      } catch (error) {
        this.addEquptProgressBar=false;
        this.toastService.error("Something went wrong while add QR ID details");
      }
  
      
        
          
      }   
      else{
        this.toastService.error("Please check validation errors","");
        this.addEquptProgressBar=false;
        return false;
      }
    } catch (error) {
      this.addEquptProgressBar=false;
      this.toastService.error("Something went wrong while add QR ID details", "");
    }
    
    


  }




  setCustomValidators(){

    try {
      this.specificQrIdContactFormArray.controls.forEach(indivFormControl => {

     
        const contactPersonControlChange$ = indivFormControl['controls']['contactPersonName'].valueChanges;
  
        contactPersonControlChange$.subscribe(contactPersonNameTxt => {
          
          if (contactPersonNameTxt != ''){
  
            let contactMobileNumber: string = indivFormControl['controls']['contactMobileNumber'].value;
            let contactEmailId: string = indivFormControl['controls']['contactEmailId'].value;
  
            if (contactMobileNumber == '' && contactEmailId == ''){
  
              indivFormControl['controls']['contactMobileNumber'].setValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].setValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
            }
  
             
          }
          else {
  
            let contactMobileNumber: string = indivFormControl['controls']['contactMobileNumber'].value;
            let contactEmailId: string = indivFormControl['controls']['contactEmailId'].value;
  
            if (contactMobileNumber == '' && contactEmailId == ''){
  
              indivFormControl['controls']['contactMobileNumber'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactPersonName'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactPersonName'].updateValueAndValidity({emitEvent: false});
  
            }
          
          }
        });
  
       
        const contactMobileControlsChange$ = indivFormControl['controls']['contactMobileNumber'].valueChanges;
  
        contactMobileControlsChange$
        .subscribe(mobileNumTxt => {
  
          if (mobileNumTxt != ''){
  
            indivFormControl['controls']['contactMobileNumber'].setValidators([Validators.pattern(new RegExp(this.mobileNumberPattern))]);
            indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
            let contactPeronName: string = indivFormControl['controls']['contactPersonName'].value;
            let contactEmailId: string = indivFormControl['controls']['contactEmailId'].value;
  
            if (contactPeronName == ''){
              indivFormControl['controls']['contactPersonName'].setValidators([Validators.required]);
              indivFormControl['controls']['contactPersonName'].updateValueAndValidity({emitEvent: false});
            }
  
            if (contactEmailId == ''){
              indivFormControl['controls']['contactEmailId'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
            }
  
            indivFormControl.patchValue({
              smsRequired: true
            });
  
          }
          else{
            let contactPeronName: string = indivFormControl['controls']['contactPersonName'].value;
            let contactEmailId: string = indivFormControl['controls']['contactEmailId'].value;
  
            if (contactPeronName == '' && contactEmailId == ''){
              indivFormControl['controls']['contactMobileNumber'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactPersonName'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactPersonName'].updateValueAndValidity({emitEvent: false});
            }
  
            if (contactPeronName !='' && contactEmailId ==''){
              indivFormControl['controls']['contactMobileNumber'].setValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].setValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
            }
  
            indivFormControl.patchValue({
              smsRequired: false
            });
          }
  
        });
  
  
        const contactEmailControlsChange$ = indivFormControl['controls']['contactEmailId'].valueChanges;
  
        contactEmailControlsChange$
        .subscribe(emailTxt => {
  
          if (emailTxt != ''){
  
            indivFormControl['controls']['contactEmailId'].setValidators([Validators.email]);
            indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false}); 
  
            let contactPeronName: string = indivFormControl['controls']['contactPersonName'].value;
            let contactMobileNumber: string = indivFormControl['controls']['contactMobileNumber'].value;
  
            if (contactPeronName == ''){
              indivFormControl['controls']['contactPersonName'].setValidators([Validators.required]);
              indivFormControl['controls']['contactPersonName'].updateValueAndValidity({emitEvent: false});
            }
  
            if (contactMobileNumber == ''){
              indivFormControl['controls']['contactMobileNumber'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
            }
  
            indivFormControl.patchValue({
              emailRequired: true
            });
  
          }
          else{
            let contactPeronName: string = indivFormControl['controls']['contactPersonName'].value;
            let contactMobileNumber: string = indivFormControl['controls']['contactMobileNumber'].value;
  
            if (contactPeronName == '' && contactMobileNumber == ''){
              indivFormControl['controls']['contactMobileNumber'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactPersonName'].clearValidators([Validators.required]);
              indivFormControl['controls']['contactPersonName'].updateValueAndValidity({emitEvent: false});
            }
  
            if (contactPeronName !='' && contactMobileNumber ==''){
              indivFormControl['controls']['contactMobileNumber'].setValidators([Validators.required]);
              indivFormControl['controls']['contactMobileNumber'].updateValueAndValidity({emitEvent: false});
  
              indivFormControl['controls']['contactEmailId'].setValidators([Validators.required]);
              indivFormControl['controls']['contactEmailId'].updateValueAndValidity({emitEvent: false});
            }
  
            indivFormControl.patchValue({
              emailRequired: false
            });
          }
  
        });
  
      }); 
    } catch (error) {
      this.toastService.error("Something went wrong while validating form details","");
    }
    
    
  }

  get qrIdDocumentListFormArray()
  {
    try {
      return this.equptForm.get('equptDocList') as FormArray; 
    } catch (error) {
      this.toastService.error("Something went wrong while loading dcoument details");
    }
  }

  popDocumentList(){

    try {
      this.addEquptProgressBar=true;

      while(this.qrIdDocumentListFormArray.length){
       this.qrIdDocumentListFormArray.removeAt(0);
     }
   
     //console.log(this.qrIdDocumentListFormArray.length);
   
     try {
       this.documentServiceAPI.getLegalEntityDocumentsRpt(
         this.legalEntityId,
         this.branchId,
         this.userId,
         this.userRole
         )
       .subscribe((data: IlegalEntityDocumentRptResponse) => {
         /*if (data.errorOccurred){
           this.addEquptProgressBar=false;
           this.toastService.error("Something went wrong while loading document list");
           return false;
         }*/
    
         //while(this.qrIdDocumentListFormArray.length){
          //this.qrIdDocumentListFormArray.removeAt(0);
        //}
    
         this.documentRptDetailsObj=data.documentList.map((value,index) => value ? {
          docId: value['docId'],
          docPath: value['docPath'],
          docName: value['docName'],
          docFileType: value['docFileType'],
          docFileSize: value['docFileSize'],
          docDesc: value['docDesc'],
          docCreationDate: value['docCreationDate'],
          docActiveStatus: value['docActiveStatus']
         } : null)
         .filter(value => value.docActiveStatus == true);
    
         //this.qrIdDocumentListFormArray.push(this.equptFormFieldBuider.group(this.documentRptDetailsObj))
    
         let updatedDocumentListObj: IlegalEntityDocumentRptWithSelect;
    
         this.documentRptDetailsObj.forEach(indivDocObj => {
    
          updatedDocumentListObj = {
            docCreationDate: indivDocObj.docCreationDate,
            docDesc: indivDocObj.docDesc,
            docFileSize: indivDocObj.docFileSize,
            docFileType: indivDocObj.docFileType,
            docName: indivDocObj.docName,
            docPath: indivDocObj.docPath,
            equptDocActiveStatus: indivDocObj.docActiveStatus,
            equptDocId: indivDocObj.docId,
            docSelected: false
          }
           
           this.qrIdDocumentListFormArray.push(this.equptFormFieldBuider.group(updatedDocumentListObj))
         });
    
         //console.log(this.qrIdContactFormArray);     
    
         this.addEquptProgressBar=false;
       }, error => {
        this.addEquptProgressBar=false;
        //this.toastService.error("Something went wrong while loading document list");
       });
     } catch (error) {
       this.addEquptProgressBar=false;
       this.toastService.error("Something went wrong while loading document list");
     }   
    } catch (error) {
      this.addEquptProgressBar=false;
      this.toastService.error("Something went wrong while loading document list");
    }

   

   
  }

  onResetClick(){
    try {
      this.equptForm.reset();

    this.errorMessageTxt="";
    this.errorMessageEnable=false;
   
    this.equptFormSubmitted = false;
     while (this.equptFormFieldArray.length !== 0){
       this.equptFormFieldArray.removeAt(0);
     }

     while(this.specificQrIdContactFormArray.controls.length){
       this.removeSpecificQrIdContactFromFormArray(0)
     }

     this.addSpecificQrIdContactToFormArray();
     
     this.equptForm.patchValue({
      branchId: this.branchId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId
     });



     this.getEquptFormfieldPref();


    this.popQrIdDrp();
    this.popNotificationContactList();

    this.popDocumentList();

    this.makeAllPublic=false;
    this.selectAllContacts=false;
    this.smsSelectall=false;
    this.emailSelectAll=false;
    } catch (error) {
      this.toastService.error("Something went wrong while form reset functionality");
    }
    
  }

  /*addContactToList():void{
    console.log(this.equptForm.get('specificToQrContact').value);
  }*/

  private _filter(value: string): IalottedQRIDList[] {
    const filterValue = value.toLowerCase();
    
    if (this.qrIdListObj != undefined){
      
      return this.qrIdListObj.filter(option => option.qrId.toLocaleLowerCase().includes(filterValue));
   }

   
    //return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.headOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem("legalEntityUserDetails") != null)
    {
     this.userModel = JSON.parse(localStorage.getItem("legalEntityUserDetails"));

     this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
     this.branchId = this.userModel.legalEntityBranchDetails.branchId;
     this.userId = this.userModel.legalEntityUserDetails.userId;
     this.headOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    
    }
    else{
      this.router.navigate(['legalentity','login']);
    }*/

    this.checked = true;
    

    this.menuPrefNameModel = this.utilService.getLegalEntityMenuPrefNames();
    this.utilService.setTitle("Legalentity - " + this.menuPrefNameModel.equipmentMenuName + " | Attendme");

    this.getEquptFormfieldPref();
    this.popQrIdDrp();

    this.defaultCountryCode = 91;



    this.equptForm = this.equptFormFieldBuider.group({
      //qrCodeId: ['', Validators.required],
      branchId: this.branchId,
      legalEntityId: this.legalEntityId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId,
      formFieldData: this.equptFormFieldBuider.array([]),
      //qrContactData: this.equptFormFieldBuider.array([
      //  this.getQrIdContactFormGroup()
      //]),
      qrContactData: this.equptFormFieldBuider.array([]),
      specificToQrContact: this.equptFormFieldBuider.array([
        this.getSpcificQrIdContactFromGroup()
      ]),
      qrCodeId: [''],
      qrCodeData: ['', [Validators.required, RequireMatch]],
      equptDocList: this.equptFormFieldBuider.array([])
  
    });

    this.spcificQrIdContactCount=1;

    //this.popCountryCallingCode();

     //this.equptForm.controls['specificToQrContact']['controls'][0].controls['contactMobileNumber'].setValidators([Validators.required]);

     //console.log(this.equptForm.controls['specificToQrContact']['controls'][0].controls['contactMobileNumber']);

   // this.equptForm.controls['specificToQrContact'][0].controls['contactMobileNumber'].setValidators([Validators.required]);

    this.popCountryCallingCode();
    this.popNotificationContactList();

    this.setCustomValidators();

    this.popDocumentList();
   
    this.filterOptions = this.equptForm.get('qrCodeData').valueChanges
    .pipe(
      startWith(''),
      map(value => value != null ?  ((value.length) > 0 ? this._filter(value): []):[])
    );
    } catch (error) {
      this.toastService.error("Something went wrong while loading form");
    }

    
  

  }

  displayFn(qrIdData: IalottedQRIDList) {
    //console.log(qrIdData.qrCodeId);
    
    if (qrIdData) {
      
      return qrIdData.qrId; 
    }
  }

}