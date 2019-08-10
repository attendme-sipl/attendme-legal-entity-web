import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { Route } from '@angular/compiler/src/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IalottedQRIDList, equptFormfieldTitleDataStruct } from '../legalentity-equipment/legalentity-equipment.component';
import { LegalentityEquipmentService, IequptFormFieldPrefResponse } from '../services/legalentity-equipment.service';

@Component({
  selector: 'app-legalentity-update-qr-details',
  templateUrl: './legalentity-update-qr-details.component.html',
  styleUrls: ['./legalentity-update-qr-details.component.css']
})
export class LegalentityUpdateQrDetailsComponent implements OnInit {

  legalEntityId: number;
  userId: number;
  branchId: number;

  qrCodeId: string;

  equptMenuName: string;

  qrCodeArrayObj: string[];

  editEquptProgressBar: boolean;

  editEquptForm: FormGroup;

  equptFormFiledDataObj: equptFormfieldTitleDataStruct[];

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
    private equptService: LegalentityEquipmentService
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

     this.editEquptProgressBar=true;

     this.utilServiceAPI.getLegalEntityAlottedQRIdList(
       this.legalEntityId,
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
       this.toastService.error("Something went wrong while loading QR Id");
     })
  }

  get equptFormFieldArray(){
    return this.editEquptForm.get('formFieldData') as FormArray;
  }

  addEqutpFromFieldFormArray(formFieldId: number, formFieldTitleName: string, formFieldValue: string, characterLength: number){
    
    this.equptFormFieldArray.push(this.equptEditFb.group({
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

    
    this.editEquptProgressBar=true;
   
   this.equptService.getEquptFormFieldPref(this.legalEntityId,true)
   .subscribe((data:IequptFormFieldPrefResponse) => {
     if (data.errorOccured)
     {
       this.editEquptProgressBar=false;
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

     this.editEquptProgressBar=false;
   }, error =>{
     this.editEquptProgressBar=false;
     this.toastService.error("Something whent wrong while loading form details");
   });
 }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
       
      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.userModel.legalEntityBranchDetails.branchId;
      this.userId = this.userModel.legalEntityUserDetails.userId;
      
      
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.qrCodeId = this.route.snapshot.paramMap.get('id');
  
    this.menuModel = this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equptMenuName = this.menuModel.equipmentMenuName;

    this.utilServiceAPI.setTitle('Edit ' + this.equptMenuName + ' Details | Attendme');

    this.editEquptForm = this.equptEditFb.group({
      branchId: this.branchId,
      legalEntityId: this.legalEntityId,
      adminApprove: true,
      equptActiveStatus: true,
      addedByUserId: this.userId,
      formFieldData: this.equptEditFb.array([]),
      //qrContactData: this.equptFormFieldBuider.array([]),
      //specificToQrContact: this.equptFormFieldBuider.array([
        //this.getSpcificQrIdContactFromGroup()
      //]),
      qrCodeId: [''],
      qrCodeData: ['']
    })

    this.editEquptForm.controls['qrCodeData'].disable();

    this.popQrIdList();

    this.getEquptFormfieldPref();

  }

  

}
