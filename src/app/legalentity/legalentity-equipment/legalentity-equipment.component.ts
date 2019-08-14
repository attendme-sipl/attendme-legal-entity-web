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
import { LegalentityQrService, IavailbleQrIdCountReqStruct } from '../services/legalentity-qr.service';
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import {RequireMatch as RequireMatch} from '../requireMatch';


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
      characterLimit: characterLength,
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

      this.addEquptProgressBar=false;
    }, error =>{
      this.addEquptProgressBar=false;
      this.toastService.error("Something whent wrong while loading form details");
    });
  }

  popQrIdDrp():void{
    
    //if(this.headOffice){

    if (this.headOffice){

      this.addEquptProgressBar=true;

      const availableQrIdCountReqObj: IavailbleQrIdCountReqStruct = {
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        qrActiveStatus: true,
        qrAssignStatus: true
      }

      this.qrIdServiceAPI.getNumOfQrIdAvailableHeadOffice(availableQrIdCountReqObj)
      .subscribe(data => {
//console.log(data);
        if (data['errorOccurred']){
           this.addEquptProgressBar=false;
           this.toastService.error("Something went wrong while loading QR IDs");
           return false;
        }

        let availableQrIdCount: number = parseInt(data['availabledQrIdAllotCount']);

        if (availableQrIdCount == 0){
          this.addEquptProgressBar=false;
          this.errorMessageEnable=true;
          this.errorMessageTxt="QR IDs not availabled. Please contact administrator";
          return false
        }

        this.utilService.getLegalEntityAlottedQRIdList(this.legalEntityId,false,true,false)
      .subscribe(data => {
        this.qrIdListObj = data;

        this.addEquptProgressBar=false;
        
      }, error => {
        this.toastService.error("Something went wrong while load QR ID list");
      })

      }, error => {
        this.addEquptProgressBar=false;
        this.toastService.error("Something went wrong while loading QR IDs");
      });

    

    }
    else {

      this.addEquptProgressBar=true;

      const availableQrIdCountReqObj: IavailbleQrIdCountReqStruct = {
        branchId: this.branchId,
        legalEntityId: this.legalEntityId,
        qrActiveStatus: true,
        qrAssignStatus: true
      }

      this.qrIdServiceAPI.getNumOfQrIdAvailableBranchOffice(availableQrIdCountReqObj)
      .subscribe(data => {

        if (data['errorOccurred']){
          this.addEquptProgressBar=false;
          this.toastService.error("Something went wrong while loading QR IDs");
          return false;
       }

       let availableQrIdCount: number = parseInt(data['availabledQrIdAllotCount']);

       if (availableQrIdCount == 0){
         this.addEquptProgressBar=false;
         this.errorMessageEnable=true;
         this.errorMessageTxt="QR IDs not availabled. Please contact administrator";
         return false
       }

       this.utilService.getLegalEntityAlottedQRIdList(this.legalEntityId,false,true,false)
       .subscribe(data => {
         this.qrIdListObj = data;
 
         this.addEquptProgressBar=false;
         
       }, error => {
         this.toastService.error("Something went wrong while load QR ID list");
       })

      }, error => {
        this.addEquptProgressBar=false;
        this.toastService.error("Something went wrong while loading QR IDs");
      });

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

  getSpcificQrIdContactFromGroup(): FormGroup{
    return this.equptFormFieldBuider.group({
      contactId: 0,
      contactPersonName: [''],
      contactEmailId: ['', Validators.email],
      contactCountryCallingCode:91,
      //contactMobileNumber: ['', Validators.compose([
        //Validators.minLength(10),
        //Validators.maxLength(10)
      //])
      contactMobileNumber: [''],
      contactToBeDisplayed: false,
      smsRequired:false,
      emailRequired: false,
      specificToQrId: true
    });
  }

  get specificQrIdContactFormArray(){
    return this.equptForm.get('specificToQrContact') as FormArray;
  }

  addSpecificQrIdContactToFormArray(){
    this.specificQrIdContactFormArray.push(this.getSpcificQrIdContactFromGroup());
    this.spcificQrIdContactCount=this.spcificQrIdContactCount+1;
  }

  removeSpecificQrIdContactFromFormArray(index: number){
    this.specificQrIdContactFormArray.removeAt(index);
    this.spcificQrIdContactCount=this.spcificQrIdContactCount-1;
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
          specificToQrId: spcificQrIdIndivContact.specificToQrId
        });

      }
    });
      
    
      this.addEquipmentFormObj = {
        addedByUserId: this.equptForm.value['addedByUserId'],
        adminApprove: true,
        branchId: this.branchId,
        equptActiveStatus: true,
        formFieldData: newQrIdFormFieldDataObj,
        qrCodeId: this.equptForm.get('qrCodeData').value['qrCodeId'],
        qrContactData: qrIdContactArrUpdated,
        headOffice: this.headOffice,
        legalEntityId: this.legalEntityId
      };


    //console.log(this.addEquipmentFormObj);

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

        if (data.qrAllotedLimitOver){
          this.addEquptProgressBar=false;
          this.toastService.error("Selected QR ID cannot cannot be assinged as the QR Id is already assinged or QR Ids not available");
          return false;
        }

        this.addEquptProgressBar=false;
        this.toastService.success("QR ID details added successfully");

        this.onResetClick();
        
      }, error => {
        this.toastService.error("Something went wrong while add QR ID details");
      });
      
        
    }   



  }

  setCustomValidators(){

    this.specificQrIdContactFormArray.controls.forEach((indivControl) => {
      indivControl['controls']['contactPersonName'].valueChanges
      .subscribe(contactPersonNameTxt => {
        if (contactPersonNameTxt != ''){
          
          if (indivControl['controls']['contactMobileNumber'].value == '' && indivControl['controls']['contactEmailId'].value == ''){
            
            //indivControl['controls']['contactMobileNumber'].setValidators([Validators.required]);

            //const indivMobileFormControl: FormControl = indivControl['controls']['contactMobileNumber'];

            //indivMobileFormControl.setValidators([Validators.required]);

            //indivControl.get('contactMobileNumber').setValidators([Validators.required]);
            

            console.log(indivControl.get('contactMobileNumber'));

            //indivControl['controls']['contactMobileNumber'].clearValidators();

          }

        }
      });

    });
    
  }

  onResetClick(){
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

    this.makeAllPublic=false;
    this.selectAllContacts=false;
    this.smsSelectall=false;
    this.emailSelectAll=false;
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
      qrCodeData: ['', [Validators.required, RequireMatch]]
  
    });

    this.spcificQrIdContactCount=1;

    //this.popCountryCallingCode();

     //this.equptForm.controls['specificToQrContact']['controls'][0].controls['contactMobileNumber'].setValidators([Validators.required]);

     //console.log(this.equptForm.controls['specificToQrContact']['controls'][0].controls['contactMobileNumber']);

   // this.equptForm.controls['specificToQrContact'][0].controls['contactMobileNumber'].setValidators([Validators.required]);

    this.popCountryCallingCode();
    this.popNotificationContactList();

    //this.setCustomValidators();
   
    this.filterOptions = this.equptForm.get('qrCodeData').valueChanges
    .pipe(
      startWith(''),
      map(value => value != null ?  ((value.length) > 0 ? this._filter(value): []):[])
    );
  

  }

  displayFn(qrIdData: IalottedQRIDList) {
    //console.log(qrIdData.qrCodeId);
    
    if (qrIdData) {
      
      return qrIdData.qrId; 
    }
  }

}