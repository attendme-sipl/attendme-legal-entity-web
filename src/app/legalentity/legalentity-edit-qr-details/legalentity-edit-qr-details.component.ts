import { Component, OnInit, Input, Inject } from '@angular/core';
import { LegalentityUtilService, IcountryCallingCodeResponse } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { IequptFormFieldPrefResponse, LegalentityEquipmentService, IaddQrIdResponseStruct, IbranchWiseQrIdListReqStruct, IbranchWiseQrIdListResStruct, IqrIdIndivDetailsResponse, IupdateQrIdDetailsReqStruct } from '../services/legalentity-equipment.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityCommons } from '../model/legalentity-commons';
import {LegalentityEquipment} from '../model/legalentity-equipment'
import { LegalentityContactsService, IcontactResponseStruct, IcontactRptReqStruct } from '../services/legalentity-contacts.service';
import { IaddContactReqUpdatedStruct } from '../legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { IalottedQRIDList, equptFormfieldTitleDataStruct, IcontactEquptMappingReqStruct, IqrIdFormFieldObjStruct } from '../legalentity-equipment/legalentity-equipment.component';
import { MatDialog } from '@angular/material';
import { LegalentityAddContactComponent } from '../legalentity-add-contact/legalentity-add-contact.component';


export interface IupdateFormFieldDatatStruct{
  formFieldId: number,
  formFieldIndexId: number,  
  formFieldTitle: string,
  formFieldValue: string
};

export interface IupdateContactDetailsStruct{
   contactId: number,
   contactToBeDisplayed: boolean,
   smsRequired: boolean,
   emailRequired: boolean
};

@Component({
  selector: 'app-legalentity-edit-qr-details',
  templateUrl: './legalentity-edit-qr-details.component.html',
  styleUrls: ['./legalentity-edit-qr-details.component.css']
})
export class LegalentityEditQrDetailsComponent implements OnInit {

  legalEntityId: number;
 
  branchId: number;

  userId: number;

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

  qrCodeId: number;

  enableContactProgressBar:boolean;

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
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private contactServiceAPI: LegalentityContactsService
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
    return this.equptForm.get('formFieldData') as FormArray;
  }

  addEqutpFromFieldFormArray(formFieldId: number, formFieldTitleName: string, formFieldValue: string, characterLength: number){
    
    this.equptFormFieldArray.push(this.equptFormFieldBuider.group({
      formFieldId: formFieldId,
      formFiledTitleName: formFieldTitleName,
      formFieldValue: ['', Validators.maxLength(characterLength)] //formFieldValue
    }))
  }

  removeEqutpFormFiledArray(indexValue: number){
    this.equptFormFieldArray.removeAt(indexValue);
  }

  getEquptFormfieldPref():void{

    
    this.addEquptProgressBar=true;
    
   
   this.equptService.getEquptFormFieldPref(this.legalEntityId,true)
   .subscribe((data:IequptFormFieldPrefResponse) => {
     if (data.errorOccured)
     {
       this.addEquptProgressBar=false;
       this.toastService.error("Something whent wrong while loading form details");
       return false;
     }
     

     //let formFieldArray: FormArray;

     let recordCount: number = 1;

     if (data.equptFormFieldTitles.length > 0){
      this.equptFormFiledDataObj = data.equptFormFieldTitles
    
      this.equptFormFiledDataObj.forEach(result => {
      // this.addEqutpFromFieldFormArray(result.formFieldId,result.formFiledTitleName,'')

      if (recordCount == 1 || recordCount == 2){
        let updatedFormFieldTitle: string = result.formFiledTitleName + " (Allowed upto 256 character)";
        this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,'',256);
      }
      else{
        let updatedFormFieldTitle: string = result.formFiledTitleName + " (Allowed upto 40 character)";
        this.addEqutpFromFieldFormArray(result.formFieldId,updatedFormFieldTitle,'',40);
      }

      recordCount = recordCount+1;
       });

      // this.commonModel.enableProgressbar=false;
      
     }
     else
     {
       
     }

     this.popQrIdFormFieldDetails();

     this.addEquptProgressBar=false;
   }, error =>{
     this.addEquptProgressBar=false;
     this.toastService.error("Something whent wrong while loading form details");
   });
 }

 popQrIdDrp():void{
    
  if(this.headOffice){
    this.utilService.getLegalEntityAlottedQRIdList(this.legalEntityId,true,true,false)
    .subscribe(data => {
      this.qrIdListObj = data;
    }, error => {
      this.toastService.error("Something went wrong while load QR ID list");
    })
  }
  else{

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
  }
}

popCountryCallingCode():void{
  this.utilService.countryCallingCode()
  .subscribe((data:IcountryCallingCodeResponse) =>{
    this.countryCallingCodeResponseObj = data;
    
  }, error => {
    this.toastService.error("Something went wrong while loading country calling code");
  });
}

get qrContactDetailsFormArray()
  {
    return this.equptForm.get('qrContactData') as FormArray 
  } 

  getQrIdContactFormGroup(): FormGroup{
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
  }

  
  addQrIdContact()
  {
    this.qrContactDetailsFormArray.push(this.getQrIdContactFormGroup())
  }

  removeQrIdContact(indexId: number){
    this.qrContactDetailsFormArray.removeAt(indexId);
  }


  // Logic to populate contact list

  popNotificationContactList():void{

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
      technicianMenuName: this.menuPrefNameModel.technicianMenuName
    };

    this.contatServiceAPI.getLegalEntityContactListRpt(contactRptReqObj)
    .subscribe((data:IcontactResponseStruct) => {
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading contacts list");
        return false;
      }

      this.contactArr=data.contactList;

      this.contactArr.forEach((indivContactObj: IcontactEquptMappingReqStruct) => {
        //indivContactObj.contactSelected=false;
        indivContactObj.contactToBeDisplayed=false;
        indivContactObj.smsRequired=false;
        indivContactObj.emailRequired=false;
        this.addQrIdContactDetailsToFormArray(indivContactObj);
      });

      this.popQrIdContactDetails();
  

    }, error => {
      this.toastService.error("Something went wrong while loading contacts list");
    });
  }

  get qrIdContactFormArray()
  {
    return this.equptForm.get('qrContactData') as FormArray;
  }

  addQrIdContactDetailsToFormArray(qrIdContactObj: IcontactEquptMappingReqStruct){
   
    this.qrIdContactFormArray.push(this.equptFormFieldBuider.group(qrIdContactObj));
    
  }

  /*contactSelectAll(event):void{
    
    let contactListObj: IcontactEquptMappingReqStruct[] = this.equptForm.get('qrContactData').value;
    let contactListObjNew: IcontactEquptMappingReqStruct[] = [];

    let selectAllChecked: boolean = event.checked;

    contactListObj.forEach((indivContact: IcontactEquptMappingReqStruct) => {
      indivContact.contactSelected= selectAllChecked;
      contactListObjNew.push(indivContact); 
    });

    this.equptForm.patchValue({
      qrContactData: contactListObj
    });
  
  }*/

  smsRequiredAll(event):void{
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
  }

  emailRequiredAll(event):void{
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
  }

  contactMakeAllPublic(event):void{

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

  }

  popQrIdFormFieldDetails():void{
   
    this.addEquptProgressBar=true;
    
    this.equptService.getQrIdIndivDetails(this.qrCodeId)
    .subscribe((data:IqrIdIndivDetailsResponse) => {
      
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading QR ID details");
        this.addEquptProgressBar=false;
        return false;
      }

      let formFieldDataObj: IupdateFormFieldDatatStruct[] = data.qrIdData;

      formFieldDataObj.forEach(indivFormFieldObj => {

        let formFieldId: number = indivFormFieldObj.formFieldId;

        for(let i:number=0;i < this.equptFormFieldArray.controls.length; i++){

          let suppliedFormFieldId: number = this.equptFormFieldArray.controls[i].value['formFieldId'];

          if (suppliedFormFieldId==formFieldId){
            
            let formFieldValue: string = indivFormFieldObj.formFieldValue;

            this.equptFormFieldArray.controls[i].patchValue({
              formFieldValue: formFieldValue
            });

          }

        }

      });

    

      this.equptForm.patchValue({
        qrCodeId: this.qrCodeId,
      })


     this.addEquptProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading QR ID details");
      this.addEquptProgressBar=false;
    });
    
  }

  popQrIdContactDetails():void{

    this.addEquptProgressBar=true;

    this.equptService.getQrIdIndivDetails(this.qrCodeId)
    .subscribe((data:IqrIdIndivDetailsResponse) => {
      
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading QR ID details");
        this.addEquptProgressBar=false;
        return false;
      }


      let contactDetailsObj:IupdateContactDetailsStruct[] = data.qrContactData;

      contactDetailsObj.forEach(indivContactObj => {

        let contactId:number = indivContactObj.contactId;

        for(let i:number=0; i < this.qrIdContactFormArray.controls.length; i++){
          
          let suppliedContactId: number = this.qrIdContactFormArray.controls[i].value['contactId'];

          if (suppliedContactId == contactId)
          {
            
            let contactToBeDisplayed: boolean = indivContactObj.contactToBeDisplayed;
            let smsRequired: boolean = indivContactObj.smsRequired;
            let emailRequired: boolean = indivContactObj.emailRequired;
            let contactSelected: boolean = true; //this.qrIdContactFormArray.controls[i].value['contactSelected'];

            this.qrIdContactFormArray.controls[i].patchValue({
              //contactSelected: contactSelected,
              contactToBeDisplayed: contactToBeDisplayed,
              smsRequired: smsRequired,
              emailRequired:emailRequired
            });
          }

        }

      });

     // this.equptForm.patchValue({
     //   qrCodeId: this.qrCodeId,
     // })

     this.addEquptProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading QR ID details");
      this.addEquptProgressBar=false;
    });

  }

 /* popQrIdDetails():void{

    this.addEquptProgressBar=true;

    this.equptService.getQrIdIndivDetails(this.qrCodeId)
    .subscribe((data:IqrIdIndivDetailsResponse) => {
      
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading QR ID details");
        this.addEquptProgressBar=false;
        return false;
      }

      let formFieldDataObj: IupdateFormFieldDatatStruct[] = data.qrIdData;

      let contactDetailsObj:IupdateContactDetailsStruct[] = data.qrContactData;

      formFieldDataObj.forEach(indivFormFieldObj => {

        let formFieldId: number = indivFormFieldObj.formFieldId;

        for(let i:number=0;i < this.equptFormFieldArray.controls.length; i++){

          let suppliedFormFieldId: number = this.equptFormFieldArray.controls[i].value['formFieldId'];

          if (suppliedFormFieldId==formFieldId){
            
            let formFieldValue: string = indivFormFieldObj.formFieldValue;

            this.equptFormFieldArray.controls[i].patchValue({
              formFieldValue: formFieldValue
            });

          }

        }

      });

      contactDetailsObj.forEach(indivContactObj => {

        let contactId:number = indivContactObj.contactId;

        for(let i:number=0; i < this.qrIdContactFormArray.controls.length; i++){
          
          let suppliedContactId: number = this.qrIdContactFormArray.controls[i].value['contactId'];

          if (suppliedContactId == contactId)
          {

            let contactToBeDisplayed: boolean = contactDetailsObj[i].contactToBeDisplayed;
            let smsRequired: boolean = contactDetailsObj[i].smsRequired;
            let emailRequired: boolean = contactDetailsObj[i].emailRequired;
            let contactSelected: boolean = true; //this.qrIdContactFormArray.controls[i].value['contactSelected'];

            this.qrIdContactFormArray.controls[i].patchValue({
              contactSelected: contactSelected,
              contactToBeDisplayed: contactToBeDisplayed,
              smsRequired: smsRequired,
              emailRequired:emailRequired
            });
          }

        }

      });

      this.equptForm.patchValue({
        qrCodeId: this.qrCodeId,
      })

      //console.log(this.equptFormFieldArray.controls[0].patchValue({
       // formFieldValue: 'chadnan'
      //}));

      //this.qrContactDetailsFormArray.controls[0].patchValue({
     //   contactSelected:true
     // })

     this.addEquptProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading QR ID details");
      this.addEquptProgressBar=false;
    });

  } */

  onUpdateClick(){
    
    this.addEquptProgressBar=true;
   
    let enteredFormFieldListObj: IqrIdFormFieldObjStruct[] = this.equptForm.value['formFieldData'];
    let updatedFormFieldListObj: IqrIdFormFieldObjStruct[]=[];
    
    enteredFormFieldListObj.forEach(indivFormField => {
      if (indivFormField.formFieldValue != ''){
        
        updatedFormFieldListObj.push(indivFormField);
      }
    });

    let enteredContactListObj: IcontactEquptMappingReqStruct[] = this.equptForm.value['qrContactData']
    let updatedContactListObj: IupdateContactDetailsStruct[]=[];
    
    enteredContactListObj.forEach(indivContactObj => {
      if (indivContactObj.smsRequired || indivContactObj.emailRequired || indivContactObj.contactToBeDisplayed){
        updatedContactListObj.push({
          contactId: indivContactObj.contactId,
          contactToBeDisplayed: indivContactObj.contactToBeDisplayed,
          emailRequired: indivContactObj.emailRequired,
          smsRequired: indivContactObj.smsRequired
        });
      }
    });

    let equptFormReqObj: IupdateQrIdDetailsReqStruct ={
      addedByUserId: this.userId,
      adminApprove: true,
      branchId: this.branchId,
      equptActiveStatus: true,
      formFieldData: [null],
      qrCodeId: this.qrCodeId,
      qrContactData:[null]
    };
    
    equptFormReqObj.formFieldData.pop();

    updatedFormFieldListObj.forEach(indivFormField => {
      
      equptFormReqObj.formFieldData.push({
        formFieldId: indivFormField.formFieldId,
        formFieldValue: indivFormField.formFieldValue
      });
    });

    equptFormReqObj.qrContactData.pop();

    updatedContactListObj.forEach(indivContactObj => {
      
      equptFormReqObj.qrContactData.push({
        contactId: indivContactObj.contactId,
        contactToBeDisplayed: indivContactObj.contactToBeDisplayed,
        emailRequired: indivContactObj.emailRequired,
        smsRequired: indivContactObj.smsRequired
      });
    })

    equptFormReqObj.addedByUserId=this.userId;
    equptFormReqObj.adminApprove = true;
    equptFormReqObj.branchId=this.branchId;
    equptFormReqObj.equptActiveStatus=true;
    equptFormReqObj.qrCodeId=this.qrCodeId;

  //  console.log(equptFormReqObj);

    this.equptService.updateQrIdDetails(equptFormReqObj)
    .subscribe(data => {
      if (data['errorOccurred']){
        this.toastService.error("Something went wrong while updating QR ID details");
        this.addEquptProgressBar=false;
        return false;
      }

      this.toastService.success("QR ID details updated successfully");
      this.addEquptProgressBar=false;
      this.router.navigate(['legalentity','portal','qr-assinged','rpt']);

    }, error => {
      this.toastService.error("Something went wrong while updating QR ID details");
      this.addEquptProgressBar=false;
    })
    
    //console.log(equptFormReqObj);
  }

  openAddContactdialog():void{

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
  }


  

  ngOnInit() {     

    if (localStorage.getItem("legalEntityUserDetails") != null)
    {
     this.userModel = JSON.parse(localStorage.getItem("legalEntityUserDetails"));

     this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
     this.branchId = this.userModel.legalEntityBranchDetails.branchId;
     this.userId = this.userModel.legalEntityUserDetails.userId;
     this.headOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    
    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.checked = true;
    

    this.menuPrefNameModel = this.utilService.getLegalEntityMenuPrefNames();
    this.utilService.setTitle("Legalentity - Edit " + this.menuPrefNameModel.equipmentMenuName + " | Attendme");

    this.getEquptFormfieldPref();
    this.popQrIdDrp();

    this.defaultCountryCode = 91;

    let sendQrCodeId = this.route.snapshot.paramMap.get('id');
    this.qrCodeId = parseInt(sendQrCodeId);

    this.equptForm = this.equptFormFieldBuider.group({
      qrCodeId: [this.qrCodeId, Validators.required],
      branchId: this.branchId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId,
      formFieldData: this.equptFormFieldBuider.array([]),
      //qrContactData: this.equptFormFieldBuider.array([
      //  this.getQrIdContactFormGroup()
      //]),
      qrContactData: this.equptFormFieldBuider.array([])
  
    });

    this.popCountryCallingCode();
    this.popNotificationContactList();

   //this.popQrIdDetails();
    

  }

}
