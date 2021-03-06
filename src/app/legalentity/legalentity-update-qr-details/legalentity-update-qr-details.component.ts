import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalentityUtilService, IcountryCallingCodeResponse } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { Route } from '@angular/compiler/src/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IalottedQRIDList, equptFormfieldTitleDataStruct, IcontactEquptMappingReqStruct, IqrIdFormFieldObjStruct, ISpecQrIdcontactEquptMappingReqStruct } from '../legalentity-equipment/legalentity-equipment.component';
import { LegalentityEquipmentService, IequptFormFieldPrefResponse, IqrIdIndivDetailsResponse } from '../services/legalentity-equipment.service';
import { LegalentityContactsService, IcontactResponseStruct, IcontactRptReqStruct } from '../services/legalentity-contacts.service';
import { LegalentityEquipment } from '../model/legalentity-equipment';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { LegalentityDocumentServiceService, IlegalEntityDocumentRptResponse, IlegalEntityDocumentRptDetails, IlegalEntityDocumentRptWithSelect } from '../services/legalentity-document-service.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { IbranchListDetailsResponse, IbranchRptReqStruct, LegalentityBranchService, IbranchListReportResponse } from '../services/legalentity-branch.service';


@Component({
  selector: 'app-legalentity-update-qr-details',
  templateUrl: './legalentity-update-qr-details.component.html',
  styleUrls: ['./legalentity-update-qr-details.component.css']
})
export class LegalentityUpdateQrDetailsComponent implements OnInit {

  legalEntityId: number;
  userId: number;
  branchId: number;
  userRole: string;
  qrCodeId: number;

  equptMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  qrCodeArrayObj: string[];

  editEquptProgressBar: boolean;

  editEquptForm: FormGroup;

  defaultCountryCode:number;
  defaultSMSEnable: boolean;
  defaultEmailEnable: boolean;
  defaultDispToPublic: boolean;

  equptFormFiledDataObj: equptFormfieldTitleDataStruct[];

  spcificQrIdContactCount: number;

  equptFormSubmitted: boolean;

  countryCallingCodeResponseObj: IcountryCallingCodeResponse;

  contactArr: IcontactEquptMappingReqStruct[];

  addEquipmentFormObj: LegalentityEquipment;

  headOffice: boolean;

  makeAllPublic: boolean;
  selectAllContacts: boolean;
  smsSelectall: boolean;
  emailSelectAll: boolean;

  documentRptDetailsObj: IlegalEntityDocumentRptDetails[];

  qrIdAttachedDocList: any[];

  expandContactSection: boolean;
  expandAttachDocSection: boolean;

  panelOpenState: boolean;

  branchListObj: IbranchListDetailsResponse[];
  requestedBranchId: number;

  constructor(
    private router: Router,
    private utilServiceAPI: LegalentityUtilService,
    private userModel: LegalentityUser,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private equptEditFb: FormBuilder,
    private equptService: LegalentityEquipmentService,
    private contatServiceAPI: LegalentityContactsService,
    private documentServiceAPI: LegalentityDocumentServiceService,
    private authService: AuthService,
    private branchServiceAPI: LegalentityBranchService
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


  popQrIdList(){

    try {
      this.editEquptProgressBar=true;

     this.utilServiceAPI.getLegalEntityAlottedQRIdList(
       this.legalEntityId,
       this.branchId,
       this.userId,
       this.userRole,
       true,
       true,
       false
     )
     .subscribe(data => {
       
       this.qrCodeArrayObj = data;

       const qrCodeIdFilteredObj = this.qrCodeArrayObj.map((value,index) => value ? {
        qrCodeId: value['qrCodeId'],
        qrId: value['qrId']
       } : null)
       .filter(value => value.qrCodeId == this.qrCodeId);

       this.editEquptForm.patchValue({
        qrCodeData: qrCodeIdFilteredObj[0]['qrId']
       });

       this.editEquptProgressBar=false;
     }, error => {
       this.editEquptProgressBar=false;
       //this.toastService.error("Something went wrong while loading QR Id");
     });
    } catch (error) {
      this.editEquptProgressBar=false;
      this.toastService.error("Something went wrong while loading QR Id");
    }

  }

  popCountryCallingCode():void{
    try {
      this.utilServiceAPI.countryCallingCode()
      .subscribe((data:IcountryCallingCodeResponse) =>{
        this.countryCallingCodeResponseObj = data;
        
      }, error => {
        //this.toastService.error("Something went wrong while loading country calling code");
      });  
    } catch (error) {
      this.toastService.error("Something went wrong while loading country calling code");
    }
    
  }

  get equptFormFieldArray(){
    try {
      return this.editEquptForm.get('formFieldData') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while getting form field details","");
    }
    
  }

  addEqutpFromFieldFormArray(formFieldId: number, formFieldTitleName: string, formFieldValue: string, characterLength: number){
    try {
      this.equptFormFieldArray.push(this.equptEditFb.group({
        formFieldId: formFieldId,
        formFiledTitleName: formFieldTitleName,
        characterLimit: characterLength,
        formFieldValue:[formFieldValue, Validators.maxLength(characterLength)]  //formFieldValue
      })); 
    } catch (error) {
      this.toastService.error("Something went wrong while adding form field details to page","");
    }
  }

  removeEqutpFormFiledArray(indexValue: number){
    try {
      this.equptFormFieldArray.removeAt(indexValue); 
    } catch (error) {
      this.toastService.error("Something went wrong while removing form field details","");
    }
  }


  get qrContactDetailsFormArray()
  {
    try {
      return this.editEquptForm.get('qrContactData') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details","");
    }
     
  } 

  getQrIdContactFormGroup(): FormGroup{

    try {
      return this.equptEditFb.group({
        contactPersonName: [''],
        countryCallingCode: this.defaultCountryCode,
        contactMobileNumber: ['',Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10)
        ])],
        contactEmailId: ['', Validators.email],
        contactToBeDisplayed: this.defaultDispToPublic,
        contactId:[''],
        smsRequired: this.defaultSMSEnable ,
        emailRequired: this.defaultEmailEnable
      });  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details","");
    }

    
  }

  
  get qrIdContactFormArray()
  {
    try {
      return this.editEquptForm.get('qrContactData') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while getting contact details","");
    }
    
  }

  addQrIdContactDetailsToFormArray(qrIdContactObj: IcontactEquptMappingReqStruct){
   
    try {
      this.qrIdContactFormArray.push(this.equptEditFb.group(qrIdContactObj));      
    } catch (error) {
      this.toastService.error("Something went wrong while adding contact details","");
    }

    
  }

  addQrIdContact()
  {
    try {
      this.qrContactDetailsFormArray.push(this.getQrIdContactFormGroup());
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


  getEquptFormfieldPref():void{

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
          this.editEquptProgressBar=false;
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
        else
        {
          
        }
       
   
        this.editEquptProgressBar=false;
      }, error =>{
        this.editEquptProgressBar=false;
        //this.toastService.error("Something whent wrong while loading form details");
      });
    } catch (error) {
      this.editEquptProgressBar=false;
      this.toastService.error("Something whent wrong while loading form details");
    }
    
    this.editEquptProgressBar=true;
   
   
 }


 getQrIdDetails(){

  try {

    this.editEquptProgressBar = true;

   this.equptService.getQrIdIndivDetails(
     this.qrCodeId,
     this.legalEntityId,
     this.branchId,
     this.userId,
     this.userRole
     )
   .subscribe((data:IqrIdIndivDetailsResponse) => {
    
     /*if (data.errorOccurred){
       this.editEquptProgressBar=false;
       this.toastService.error("Something went wrong while loading " + this.equptMenuName + " details");
       return false;
     }*/

     if (data.qrContactData.length > 0){
       this.expandContactSection=true;
     }

     if (data.equptDocList.length > 0){
       this.expandAttachDocSection=true;
     }

     this.qrIdAttachedDocList=data.equptDocList;

     this.popDocumentList();
     

     let qrIdFormFieldDataObj: any[] = data.qrIdData;

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
        this.editEquptProgressBar=false;
        this.toastService.error("Something whent wrong while loading form details");
        return false;
      }*/
      
      //let formFieldArray: FormArray;
 
      if (data.equptFormFieldTitles.length > 0){
       this.equptFormFiledDataObj = data.equptFormFieldTitles
 
       let recordCount: number = 1;
     
       this.equptFormFiledDataObj.forEach(result => {
 
         let formFieldData: string = '';
 
         let formFieldDataObj = qrIdFormFieldDataObj.map((value,index) => value ? {
           formFieldId: value['formFieldId'],
           formFieldValue: value['formFieldValue']
         } : null)
         .filter(value => value.formFieldId == result.formFieldId);
 
         if(formFieldDataObj.length > 0){
           formFieldData = formFieldDataObj[0]['formFieldValue'];
           //console.log(formFieldData);
         }
 
        if (recordCount == 1 || recordCount == 2){
          let updatedFormFieldTitle: string = result.formFiledTitleName;
          this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,formFieldData,256);
        }
        else{
          let updatedFormFieldTitle: string = result.formFiledTitleName;
          this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,formFieldData,40);
        }
 
        recordCount = recordCount+1;
 
        });
 
       // this.commonModel.enableProgressbar=false;
       
      }
      
     
 
      this.editEquptProgressBar=false;
    }, error =>{
      this.editEquptProgressBar=false;
      //this.toastService.error("Something whent wrong while loading form details");
    });
     } catch (error) {
      this.editEquptProgressBar=false;
      this.toastService.error("Something whent wrong while loading form details");
     }

     

   let qrIdPrimaryContactObj: any[] = data.qrContactData;
 
   while(this.qrIdContactFormArray.length){
    this.qrIdContactFormArray.removeAt(0);
  }

  while (this.specificQrIdContactFormArray.length){
    this.specificQrIdContactFormArray.removeAt(0);
  }

  this.spcificQrIdContactCount=0;


  let specificToQrIdContactObj: any[] = data.qrContactData;
  
  specificToQrIdContactObj.forEach(indivSpecificToQrContact => {


    if (indivSpecificToQrContact.specificToQrId){

      this.spcificQrIdContactCount=this.spcificQrIdContactCount+1;

      let contactCountrycallingCode: number;
      let contactMobile: string;

      let completeMobileNumberObj: string[];


      if (indivSpecificToQrContact.contactMobileNumber !=''){
        completeMobileNumberObj = indivSpecificToQrContact.contactMobileNumber.split('-');

        contactCountrycallingCode = parseInt(completeMobileNumberObj[0]);
        contactMobile = completeMobileNumberObj[1];
      }
      else{
        contactCountrycallingCode = this.defaultCountryCode;
        contactMobile = ''
      }

      let updatedContactFormGroup: FormGroup = this.equptEditFb.group({
        contactId: 0,
        contactPersonName: [indivSpecificToQrContact.contactPersonName, Validators.required],
        contactEmailId: [indivSpecificToQrContact.contactEmailId, Validators.email],
        contactCountryCallingCode:contactCountrycallingCode,
        contactMobileNumber: [contactMobile, Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10)
        ])
      ],
      contactToBeDisplayed: indivSpecificToQrContact.contactToBeDisplayed,
      smsRequired: indivSpecificToQrContact.smsRequired,
      emailRequired: indivSpecificToQrContact.emailRequired,
      specificToQrId: true
    });
    this.specificQrIdContactFormArray.push(updatedContactFormGroup);
  }

  

  });

  if (this.specificQrIdContactFormArray.length == 0){
    this.addSpecificQrIdContactToFormArray();
  }

  const contactRptReqObj: IcontactRptReqStruct={
    branchMenuName: this.menuModel.branchMenuName,
    complaintMenuName: this.menuModel.complaintMenuName,
    contactActiveStatus: true,
    equptMenuName: this.menuModel.equipmentMenuName,
    exportToExcel: false,
    legalEntityId: this.legalEntityId,
    technicianMenuName: this.menuModel.technicianMenuName,
    branchId: this.branchId,
    userId: this.userId,
    userRole: this.userRole
  };
  
  try {
    this.contatServiceAPI.getLegalEntityContactListRpt(contactRptReqObj)
  .subscribe((data:IcontactResponseStruct) => {
    /*if (data.errorOccurred){
      this.toastService.error("Something went wrong while loading contacts list");
      this.editEquptProgressBar=false;
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

      let existingSMSReq:boolean = false;
      let existingEmailReq: boolean = false;
      let existingMakePublic: boolean = false;

      let qrIdPrimaryContactFiltered = qrIdPrimaryContactObj.map((value,index) => value ? {
        contactId: value['contactId'],
        contactToBeDisplayed: value['contactToBeDisplayed'],
        emailRequired: value['emailRequired'],
        smsRequired: value['smsRequired']
      } : null)
      .filter(value => value.contactId == indivContactObj.contactId);

      if (qrIdPrimaryContactFiltered.length > 0){
        existingSMSReq = qrIdPrimaryContactFiltered[0]['smsRequired'];
        existingEmailReq = qrIdPrimaryContactFiltered[0]['emailRequired'];
        existingMakePublic = qrIdPrimaryContactFiltered[0]['contactToBeDisplayed'];
      }

     
      //indivContactObj.contactSelected=false;
      indivContactObj.contactToBeDisplayed=existingMakePublic;
      indivContactObj.smsRequired=existingSMSReq;
      indivContactObj.emailRequired=existingEmailReq;
      this.addQrIdContactDetailsToFormArray(indivContactObj);
    });

    

    this.editEquptProgressBar=false;

  }, error => {
    //this.toastService.error("Something went wrong while loading contacts list");
    this.editEquptProgressBar=false;
  });
  } catch (error) {
    this.toastService.error("Something went wrong while loading contacts list");
    this.editEquptProgressBar=false;
  }
  
  


  //this.removeSpecificQrIdContactFromFormArray(0);
  

  //console.log(this.specificQrIdContactFormArray.controls.);
  
   

   }, error => {
    this.editEquptProgressBar=false;
    //this.toastService.error("Something went wrong while loading " + this.equptMenuName + " details");
   });
    
  } catch (error) {
    this.editEquptProgressBar=false;
    this.toastService.error("Something went wrong while loading " + this.equptMenuName + " details");
  }

   
 }


 getSpcificQrIdContactFromGroup(): FormGroup{
   try {
    return this.equptEditFb.group({
      contactId: 0,
      contactPersonName: [''],
      contactEmailId: ['', Validators.email],
      contactCountryCallingCode:91,
      contactMobileNumber: [''],
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
    return this.editEquptForm.get('specificToQrContact') as FormArray;  
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
    this.toastService.error("Something went wrong while adding contact details to page");
  }
 
}

removeSpecificQrIdContactFromFormArray(index: number){
  try {
    this.specificQrIdContactFormArray.removeAt(index);
    this.spcificQrIdContactCount=this.spcificQrIdContactCount-1;  
  } catch (error) {
    this.toastService.error("Something went wrong while removing contact details from page");
  }
  
}


smsRequiredAll(event):void{
  try {
    let contactListObj: IcontactEquptMappingReqStruct[] = this.editEquptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];
  
    let selectAllSMSRequired: boolean = event.checked;
  
    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      if (indivContact.contactMobileNumber != ''){
        indivContact.smsRequired= selectAllSMSRequired;
        contactListObjNew.push(indivContact);
      } 
    });
  
    this.editEquptForm.patchValue({
      qrContactData: contactListObj
    });  
  } catch (error) {
    this.toastService.error("Something went wrong in SMS required functionality");
  }
  
}

emailRequiredAll(event):void{
  try {
    let contactListObj: IcontactEquptMappingReqStruct[] = this.editEquptForm.get('qrContactData').value;
  let contactListObjNew: IcontactEquptMappingReqStruct[] = [];

  let selectAllSMSRequired: boolean = event.checked;

  contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
    if (indivContact.contactEmailId != ''){
      indivContact.emailRequired= selectAllSMSRequired;
      contactListObjNew.push(indivContact); 
    }
    
  });

  this.editEquptForm.patchValue({
    qrContactData: contactListObj
  });
  } catch (error) {
    this.toastService.error("Something went wrong in Email required functionality");
  }
  
}

contactMakeAllPublic(event):void{
  try {
    let contactListObj: IcontactEquptMappingReqStruct[] = this.editEquptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];
  
    let makeAllPublicChecked: boolean = event.checked;
  
    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      indivContact.contactToBeDisplayed= makeAllPublicChecked;
      contactListObjNew.push(indivContact); 
    });
  
    this.editEquptForm.patchValue({
      qrContactData: contactListObj
    });  
  } catch (error) {
    this.toastService.error("Something went wrong in contact make public functionality");
  }
  

}

cancelClick(){
  try {
    this.router.navigate(['legalentity','portal','equipment']);  
  } catch (error) {
    this.toastService.error("Something went while redirecting to previous page");
  }
  
}


onSubmit(){

  try {
    this.equptFormSubmitted = true;

  this.editEquptProgressBar=true;

  if (this.editEquptForm.valid){


    let qrIdFormFieldDataObj: IqrIdFormFieldObjStruct[] = this.editEquptForm.value['formFieldData'];

      let newQrIdFormFieldDataObj: IqrIdFormFieldObjStruct[] = [];

    qrIdFormFieldDataObj.forEach(indivFormField => {
      if (indivFormField.formFieldValue != ''){
          newQrIdFormFieldDataObj.push({
            formFieldId: indivFormField.formFieldId,
            formFieldValue: indivFormField.formFieldValue
          });
          }
      
    });

    const qrIdContactArr: IcontactEquptMappingReqStruct[] = this.editEquptForm.get('qrContactData').value;

    let qrIdContactArrUpdated: IcontactEquptMappingReqStruct[] = [];


    qrIdContactArr.forEach((indivConatactObj: IcontactEquptMappingReqStruct) => {
      if (indivConatactObj.smsRequired || indivConatactObj.emailRequired || indivConatactObj.contactToBeDisplayed){
        qrIdContactArrUpdated.push(indivConatactObj);
      }
    });


    let specificQrIdContactArray: ISpecQrIdcontactEquptMappingReqStruct[] = this.editEquptForm.get('specificToQrContact').value;

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
          specificToQrId: spcificQrIdIndivContact.specificToQrId
        });

      }
    });

    let documentListObj: IlegalEntityDocumentRptWithSelect[] = this.editEquptForm.get('equptDocList').value;

        const documentListObjFiltered = documentListObj.map((value,index) => value ? {
          equptDocId: value['equptDocId'],
          equptDocActiveStatus: value['equptDocActiveStatus'],
          docSelected: value['docSelected']
        } : null)
        .filter(value => value.docSelected == true);
      
    
      this.addEquipmentFormObj = {
        addedByUserId: this.editEquptForm.value['addedByUserId'],
        adminApprove: true,
        branchId: this.branchId,
        equptActiveStatus: true,
        formFieldData: newQrIdFormFieldDataObj,
        qrCodeId: this.qrCodeId, //this.editEquptForm.get('qrCodeData').value['qrCodeId'],
        qrContactData: qrIdContactArrUpdated,
        headOffice: this.headOffice,
        legalEntityId: this.legalEntityId,
        equptDocList: documentListObjFiltered,
        userId: this.userId,
        userRole: this.userRole
      };

      //console.log(this.addEquipmentFormObj);

      try {
        this.equptService.updateQrIdDetailsNew(this.addEquipmentFormObj)
      .subscribe(data => {
        console.log(data);
        /*if (data['errorOccurred']){
          this.editEquptProgressBar=false;
          this.toastService.error("Something went wrong while updating "+ this.equptMenuName + " details.");
          return false;
        }*/

        this.editEquptProgressBar=false;
        this.toastService.success(this.equptMenuName + " details updated successfully");
        this.router.navigate(['legalentity','portal','equipment']);
      }, error => {
        this.editEquptProgressBar=false;
        //this.toastService.error("Something went wrong while updating "+ this.equptMenuName + " details.");
        //return false;
      });
      } catch (error) {
        this.editEquptProgressBar=false;
        this.toastService.error("Something went wrong while updating "+ this.equptMenuName + " details.");
      }

      

  }
  else{
      this.toastService.error("Please check validation errors","");
      this.editEquptProgressBar=false;
      return false;
    }
  } catch (error) {
    this.toastService.error("Something went wrong while updating "+ this.equptMenuName + " details.");
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
        }
  
      });
  
  
      const contactEmailControlsChange$ = indivFormControl['controls']['contactEmailId'].valueChanges;
  
      contactEmailControlsChange$
      .subscribe(emailTxt => {
  
        if (emailTxt != ''){
  
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
        }
  
      });
  
    });
  } catch (error) {
    this.toastService.error("Something went wrong while validating form");
  }
  
}

get qrIdDocumentListFormArray()
  {
    try {
      return this.editEquptForm.get('equptDocList') as FormArray;  
    } catch (error) {
      this.toastService.error("Something went wrong while loading document list");
    }
    
  }

  popDocumentList(){

    try {
      this.editEquptProgressBar=true;

   while(this.qrIdDocumentListFormArray.length){
    this.qrIdDocumentListFormArray.removeAt(0);
  }

  //console.log(this.qrIdAttachedDocList);

   this.documentServiceAPI.getLegalEntityDocumentsRpt(
     this.legalEntityId,
     this.branchId,
     this.userId,
     this.userRole
     )
   .subscribe((data: IlegalEntityDocumentRptResponse) => {
     /*if (data.errorOccurred){
       this.editEquptProgressBar=false;
       this.toastService.error("Something went wrong while loading document list");
       return false;
     }*/

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

      let docSelectValue: boolean;

      this.qrIdAttachedDocList.forEach(indivDocObject => {
        if (indivDocObject['equptDocId'] == indivDocObj.docId){
          docSelectValue=true;
        }
      })

      updatedDocumentListObj = {
        docCreationDate: indivDocObj.docCreationDate,
        docDesc: indivDocObj.docDesc,
        docFileSize: indivDocObj.docFileSize,
        docFileType: indivDocObj.docFileType,
        docName: indivDocObj.docName,
        docPath: indivDocObj.docPath,
        equptDocActiveStatus: indivDocObj.docActiveStatus,
        equptDocId: indivDocObj.docId,
        docSelected: docSelectValue
      }
       
       this.qrIdDocumentListFormArray.push(this.equptEditFb.group(updatedDocumentListObj))
     });

     //console.log(this.qrIdContactFormArray);     

     this.editEquptProgressBar=false;
   }, error => {
    this.editEquptProgressBar=false;
    //this.toastService.error("Something went wrong while loading document list");
   });
    } catch (error) {
      this.editEquptProgressBar=false;
      this.toastService.error("Something went wrong while loading document list");
    }
    
   
  }

  popBranch(){
    const branchListReqObj: IbranchRptReqStruct = {
      branchId: this.branchId,
      branchMenuName: this.branchMenuName,
      complaintMenuName: this.complaintMenuName,
      equptMenuName: this.equptMenuName,
      exportToExcel: false,
      legalEntityId: this.legalEntityId,
      technicianMenuName: this.technicianMenuName,
      userId: this.userId,
      userRole: this.userRole
    };
     
    this.branchServiceAPI.getBranchListReport(branchListReqObj)
    .subscribe((data: IbranchListReportResponse) => {
      this.branchListObj = data.branchDetailsList;
      //console.log(this.branchListObj);
    });
    
  }

  ngOnInit() {

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.headOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
       
      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.userModel.legalEntityBranchDetails.branchId;
      this.userId = this.userModel.legalEntityUserDetails.userId;
      
      this.headOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    this.qrCodeId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.requestedBranchId=parseInt(this.route.snapshot.paramMap.get('branchId'));

    this.defaultCountryCode = 91;
    this.defaultSMSEnable =  true;
    this.defaultEmailEnable = true;
  
    this.menuModel = this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equptMenuName = this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle('Legalentity - Edit ' + this.equptMenuName + ' Details | Attendme');

    this.editEquptForm = this.equptEditFb.group({
      branchId: this.requestedBranchId,
      legalEntityId: this.legalEntityId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId,
      formFieldData: this.equptEditFb.array([]),
      qrContactData: this.equptEditFb.array([]),
      specificToQrContact: this.equptEditFb.array([
        this.getSpcificQrIdContactFromGroup()
      ]),
      qrCodeId: this.qrCodeId,
      qrCodeData: [''],
      equptDocList: this.equptEditFb.array([])
    })

    this.editEquptForm.controls['qrCodeData'].disable();

    this.getQrIdDetails();
    this.popBranch();
    this.popQrIdList();

    this.spcificQrIdContactCount=1;

    this.popCountryCallingCode();

    this.setCustomValidators();

    //this.popDocumentList();

    //this.popNotificationContactList();

    // this.getEquptFormfieldPref();

  }

  

}
