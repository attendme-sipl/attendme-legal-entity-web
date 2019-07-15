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
import { LegalentityContactsService, IcontactResponseStruct } from '../services/legalentity-contacts.service';
import { IaddContactReqUpdatedStruct } from '../legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { MatDialog } from '@angular/material';
import { LegalentityAddContactComponent } from '../legalentity-add-contact/legalentity-add-contact.component';
import { stringify } from '@angular/compiler/src/util';
import { LegalentityQrService } from '../services/legalentity-qr.service';
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';


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
  emailRequired: boolean
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

  enableContactProgressBar:boolean;

  countryCallingCodeListObj: IcountryCallingCodeResponse[];

  myControl = new FormControl();
  filterOptions: Observable<IalottedQRIDList[]>;

  //options: string[] = ['One', 'Two', 'Three'];
  
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
    private qrIdServiceAPI: LegalentityQrService
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
      formFieldValue:['', Validators.maxLength(characterLength)]  //formFieldValue
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

      if (data.equptFormFieldTitles.length > 0){
       this.equptFormFiledDataObj = data.equptFormFieldTitles

       let recordCount: number = 1;
     
       this.equptFormFiledDataObj.forEach(result => {

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

      this.addEquptProgressBar=false;
    }, error =>{
      this.addEquptProgressBar=false;
      this.toastService.error("Something whent wrong while loading form details");
    });
  }

  popQrIdDrp():void{
    
    if(this.headOffice){
      this.utilService.getLegalEntityAlottedQRIdList(this.legalEntityId,false,true,false)
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

    this.enableContactProgressBar=true;

    while(this.qrIdContactFormArray.length){
      this.qrIdContactFormArray.removeAt(0);
    }
    
    this.contatServiceAPI.getLegalEntityContactListRpt(this.legalEntityId,true)
    .subscribe((data:IcontactResponseStruct) => {
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading contacts list");
        this.enableContactProgressBar=false;
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
  
      this.enableContactProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading contacts list");
      this.enableContactProgressBar=false;
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
  }

  onSubmitClick()
  {

    this.equptFormSubmitted = true;

    this.addEquptProgressBar=true;
    
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

    /*qrIdContactArr.forEach((indivConatactObj: IcontactEquptMappingReqStruct) => {
      if (indivConatactObj.contactSelected){
        qrIdContactArrUpdated.push(indivConatactObj);
      }
    });*/

    qrIdContactArr.forEach((indivConatactObj: IcontactEquptMappingReqStruct) => {
      if (indivConatactObj.smsRequired || indivConatactObj.emailRequired || indivConatactObj.contactToBeDisplayed){
        qrIdContactArrUpdated.push(indivConatactObj);
      }
    });

   /* let qrIdContactDataObj: IqrIdContactObjStrut[] = this.equptForm.value['qrContactData'];
    let newQrIdContactDataObj: IqrIdContactObjStrut[] = [];

    qrIdContactDataObj.forEach(indivContact => {
      if (indivContact.contactEmailId != '' || indivContact.contactMobileNumber != '' || indivContact.contactPersonName != '' ){
        let qrIdContactMobileNumber: string = indivContact.contactMobileNumber;

        if (qrIdContactMobileNumber != ''){
          qrIdContactMobileNumber = indivContact.countryCallingCode + "-" + indivContact.contactMobileNumber;
        }

       newQrIdContactDataObj.push({
         contactEmailId: indivContact.contactEmailId,
         contactMobileNumber: qrIdContactMobileNumber,
         contactPersonName: indivContact.contactPersonName,
         countryCallingCode: indivContact.countryCallingCode,
         contactToBeDisplayed: indivContact.contactToBeDisplayed
       });
      }
    });

   */
      
      this.addEquipmentFormObj = {
        addedByUserId: this.equptForm.value['addedByUserId'],
        adminApprove: true,
        branchId: this.branchId,
        equptActiveStatus: true,
        formFieldData: newQrIdFormFieldDataObj,
        qrCodeId: this.equptForm.value['qrCodeId'],
        qrContactData: qrIdContactArrUpdated
      };

     // console.log(this.addEquipmentFormObj);

      this.equptService.getAddQrIdDetails(this.addEquipmentFormObj)
      .subscribe((data:IaddQrIdResponseStruct) => {
        if (data.errorOccured){
          this.addEquptProgressBar=false;
          this.toastService.error("Something went wrong while add QR ID details");
          return false;
        }

        if (data.qrCodeAlreadyAssigned){
          this.addEquptProgressBar=false;
          this.toastService.error("Selected QR ID already assinged, Please selext another QR ID");
          return false;
        }

        this.addEquptProgressBar=false;
        this.toastService.success("QR ID details added successfully");

        this.onResetClick();
        
      }, error => {
        this.toastService.error("Something went wrong while add QR ID details");
      })
      
        
    }   




  /* if (this.equptForm.valid)
{

      this.commonModel.enableProgressbar= true;

      let equptFieldFlag:number=0;

      let equptFormFiledBlankArrList:number[] = [];

     for (let controls of this.equptFormFieldArray.controls){
      
       if (controls.value['formFieldValue'] == '' || controls.value['formFieldValue'] == null)
       {
         
         equptFormFiledBlankArrList.push(equptFieldFlag);
       }

      equptFieldFlag = equptFieldFlag+ 1;
       
     }

     let equptFieldRemoveCount:number = 0;
    
     equptFormFiledBlankArrList.forEach((result:number) => {
      let equptFieldIndex: number = result - equptFieldRemoveCount;
      
      this.equptFormFieldArray.removeAt(equptFieldIndex);

      equptFieldRemoveCount = equptFieldRemoveCount + 1;
     })
    
     
     // Code to set qr id contact details

     for (let controls of this.qrContactDetailsFormArray.controls){
       if (controls.value['contactMobileNumber'] != ''){
        let countryCallingCode: number = controls.value['countryCallingCode'];
        let contactMobileNumber: string  = controls.value['contactMobileNumber'];
        controls.patchValue({
          contactMobileNumber: countryCallingCode + "-" + contactMobileNumber
         });
       }
     }

     let qrIdContactCount: number =0;

     let qrIdBlankContactArray:number[]=[];

     for (let controls of this.qrContactDetailsFormArray.controls){
       if (
         controls.value['contactPersonName'] == '' &&
         controls.value['contactMobileNumber'] == '' &&
         controls.value['contactEmailId'] == '' 
         ){
           qrIdBlankContactArray.push(qrIdContactCount);
         }

         qrIdContactCount = qrIdContactCount + 1;
         
     }

     let qrIdContactRemoveCount:number =0;

     qrIdBlankContactArray.forEach((result:number) => {
      
      let qrIdContactIndex: number = result - qrIdContactRemoveCount;
      
      this.qrContactDetailsFormArray.removeAt(qrIdContactIndex);

      qrIdContactRemoveCount = qrIdContactRemoveCount + 1;

     });

     console.log(this.equptForm.value);
     
     this.equptService.getAddQrIdDetails(this.equptForm.value)
     .subscribe((data:IaddQrIdResponseStruct) => {
       
       if (data.errorOccured){
        this.commonModel.enableProgressbar = false;
        this.toastService.error("Something went wrong while adding QR details");
        return false;
       }

       if (data.qrCodeAlreadyAssigned){
        this.commonModel.enableProgressbar = false;
        this.toastService.error("QR Id already assigned");
        return false;
       }

       this.commonModel.enableProgressbar = false;
       this.toastService.success("QR Id details added successfully");

       this.onResetClick();

     }, error => {
      this.commonModel.enableProgressbar = false;
      this.toastService.error("Something went wrong while adding QR details");
     })

     

    } */


  }


  onResetClick(){
    this.equptForm.reset();
   
    this.equptFormSubmitted = false;
     while (this.equptFormFieldArray.length !== 0){
       this.equptFormFieldArray.removeAt(0);
     }

     this.equptForm.patchValue({
      branchId: this.branchId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId
     });



     this.getEquptFormfieldPref();

    // while (this.qrContactDetailsFormArray.length !== 0){
      // this.qrContactDetailsFormArray.removeAt(0);
    // }

    //this.addQrIdContact();

   // this.equptForm.patchValue({
     // branchId: this.branchId,
     // adminApprove: true,
     // equptActiveStatus: true,
     // addedByUserId: this.userId,
    //})

    this.popQrIdDrp();
    this.popNotificationContactList();

    this.makeAllPublic=false;
    this.selectAllContacts=false;
    this.smsSelectall=false;
    this.emailSelectAll=false;
  }

  addContactToList():void{
    console.log(this.equptForm.get('specificToQrContact').value);
  }

  private _filter(value: string): IalottedQRIDList[] {
    const filterValue = value.toLowerCase();
    
    if (this.qrIdListObj != undefined){
      return this.qrIdListObj.filter(option => option.qrId.toLocaleLowerCase().includes(filterValue));
   }

   
    //return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
    this.utilService.setTitle("Legalentity - " + this.menuPrefNameModel.equipmentMenuName + " | Attendme");

    this.getEquptFormfieldPref();
    this.popQrIdDrp();

    this.defaultCountryCode = 91;



    this.equptForm = this.equptFormFieldBuider.group({
      qrCodeId: ['', Validators.required],
      branchId: this.branchId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId,
      formFieldData: this.equptFormFieldBuider.array([]),
      //qrContactData: this.equptFormFieldBuider.array([
      //  this.getQrIdContactFormGroup()
      //]),
      qrContactData: this.equptFormFieldBuider.array([]),
      specificToQrContact: this.equptFormFieldBuider.group(
        {
          contactPersonName: [''],
          contactEmailId: [''],
          contactCountryCallingCode:91,
          contactMobileNumber: ['']
        }
      ),
      qrIdData: ['']
    
  
    });

    this.popCountryCallingCode();

    this.popCountryCallingCode();
    this.popNotificationContactList();

   
    this.filterOptions = this.equptForm.get('qrIdData').valueChanges
    .pipe(
      startWith(''),
      map(value => value.length > 0 ? this._filter(value): [])
    );
  

  }

  displayFn(qrIdData: IalottedQRIDList) {
    if (qrIdData) { return qrIdData.qrId; }
  }

}