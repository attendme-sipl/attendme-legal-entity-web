import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry } from '@angular/material';
import { IaddContactReqStruct, IaddContactReqUpdatedStruct } from '../legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUtilService, IcountryCallingCodeResponse } from '../services/legalentity-util.service';
import { LegalentityCountryCallingCode } from '../model/legalentity-country-calling-code';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
//import { containsTree } from '@angular/router/src/url_tree';


export interface IcontactDetailsReqStruct{
  contactPersonName: string,
  contactMobileNumber: string,
  contactEmailId: string,
  contactActiveStatus: boolean,
  countryCallingCode: number
};




@Component({
  selector: 'app-legalentity-add-contact',
  templateUrl: './legalentity-add-contact.component.html',
  styleUrls: ['./legalentity-add-contact.component.css']
})
export class LegalentityAddContactComponent implements OnInit {

  countryCallingCodeListObj: IcountryCallingCodeResponse;

  addContactForm: FormGroup;
  defaultCountryCallingCode: number;

  submitted: boolean;
  showValidationError: boolean;
  validaitonErrorMsg: string;

  legalEntityId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IaddContactReqUpdatedStruct,
    public dialogRef: MatDialogRef<LegalentityAddContactComponent>,
    private legalEntityUserModel: LegalentityUser,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private utilServiceAPI: LegalentityUtilService,
    private addContactFb: FormBuilder
  ) {
    dialogRef.disableClose=true;

    iconRegistry.addSvgIcon(
      "remove-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/images/svg_icons/baseline-delete-24px.svg")
      );

    iconRegistry.addSvgIcon(
      "close-window-icon",
      sanitizer.bypassSecurityTrustResourceUrl("assets/images/svg_icons/baseline-close-24px.svg")
    );  
   }

   popCountryCallingCode():void{
      this.utilServiceAPI.countryCallingCode()
      .subscribe((data: IcountryCallingCodeResponse) => {
        this.countryCallingCodeListObj=data;
      });
   }

   get contactFormArray(){
     return this.addContactForm.get('contactList') as FormArray;
   }

   addContactToFormArray(): void{
     this.contactFormArray.push(this.getContactFormGroup());
   }

   removeContactFromFormArray(contactIndexId: number): void{
     this.contactFormArray.removeAt(contactIndexId);
   }

   getContactFormGroup(): FormGroup{
     return this.addContactFb.group({
      contactPersonName: [''],
      countryCallingCode: this.defaultCountryCallingCode,
      contactMobileNumber: ['', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10)
      ])
    ],
      contactEmailId: ['', Validators.email],
      contactActiveStatus: true
     })
   }

   onSubmitClick(){
     
    if (this.addContactForm.valid){
      
      const contactArr: IcontactDetailsReqStruct[] = this.addContactForm.value['contactList'];

      let updateContactDetailsArr: IcontactDetailsReqStruct[] = [];
      let contactAddedCount: number = 0;

      contactArr.forEach((indivContact: IcontactDetailsReqStruct) =>{

        if (indivContact.contactPersonName != '' ||
        indivContact.contactMobileNumber != '' ||
        indivContact.contactEmailId != '')
        {
          contactAddedCount = contactAddedCount + 1;
        }

      });

      if (contactAddedCount == 0){
        this.showValidationError=true;
        this.validaitonErrorMsg="Please enter contact details";
        return false;
      }

      contactArr.forEach((indivContact:IcontactDetailsReqStruct) => {
      
        let updateContactMobile: string ='';

        if (indivContact.contactMobileNumber != ''){
          updateContactMobile=indivContact.countryCallingCode + "-" + indivContact.contactMobileNumber;
        }

        updateContactDetailsArr.push({
          contactActiveStatus: indivContact.contactActiveStatus,
          contactEmailId: indivContact.contactEmailId.trim(),
          contactMobileNumber: updateContactMobile.trim(),
          contactPersonName: indivContact.contactPersonName.trim(),
          countryCallingCode: indivContact.countryCallingCode
        });

      });

      //const updatedAddContactReqObj: IaddContactReqUpdatedStruct = {
       // contactList: updateContactDetailsArr,
       // legalEntityId: this.legalEntityId
      //};

      //this.data=updatedAddContactReqObj;

        this.data.contactList = updateContactDetailsArr;
        this.data.legalEntityId=this.legalEntityId;
        this.data.cancelClick=false;

     // console.log(this.data)

      this.dialogRef.close();

    }
    

     
   }

  ngOnInit() {

    if(localStorage.getItem('legalEntityUserDetails') == null){
     this.router.navigate(['legalentity','login']);      
    }
    else{
      this.legalEntityUserModel= JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
    }

    this.popCountryCallingCode();

    this.defaultCountryCallingCode=91;

    this.addContactForm=this.addContactFb.group({
      legalEntityId: this.legalEntityId,
      contactList: this.addContactFb.array([
        this.getContactFormGroup()
      ])
    });

  }
  

  onCloseButtonClick():void{
    this.data.cancelClick=true;
    this.dialogRef.close();
    
  }

}
