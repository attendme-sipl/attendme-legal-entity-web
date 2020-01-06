import { Component, OnInit } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { LegalentityDocumentServiceService, IimportDocumentQrIdReq } from '../services/legalentity-document-service.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-import-document',
  templateUrl: './legalentity-import-document.component.html',
  styleUrls: ['./legalentity-import-document.component.css']
})
export class LegalentityImportDocumentComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  branchHeadOffice: boolean;

  equptMenuName: string;
  enableDownloadProgressBar: boolean;
  enableImportProgressBar: boolean;

  downloadButtonEnableDisable: boolean;

  importDocumentExcelFormGroup: FormGroup;
  importButtonEnableDisable: boolean;

  formSubmit: boolean;

  uploadedFileObj:File;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private userModel: LegalentityUser,
    private documenServiceAPI: LegalentityDocumentServiceService,
    private menuModel: LegalentityMenuPrefNames,
    private toastService: ToastrService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private importDocExcelFormBuilder: FormBuilder,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      'back-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/keyboard_backspace-24px.svg')
    );
   }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.branchHeadOffice=tokenModel.branchHeadOffice;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;

      if (!this.branchHeadOffice){
        this.router.navigate(['legalentity','portal','rpt','document']);
        return false;
      }
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    if (!this.branchHeadOffice){
      this.router.navigate(['legalentity','portal','rpt','document']);
      return false;
    }

    this.utilServiceAPI.setTitle('Legalentity - Import Document | Attendme');

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equptMenuName=this.menuModel.equipmentMenuName;

    this.importDocumentExcelFormGroup=this.importDocExcelFormBuilder.group({
      legalEntityId: this.legalEntityId,
      docSpecificToQrId: false,
      excelData: ['', [Validators.required]]
    });
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page","");
    }

    
  }

  backToDocumentRpt(){
    try {
      this.router.navigate(['legalentity','portal','rpt','document']);
      return false; 
    } catch (error) {
      this.toastService.error("Something went wrong while redirecting to document report page","");
    }
  }

  downloadEquptDocTemplate(){

    try {
      this.enableDownloadProgressBar=true;
    this.downloadButtonEnableDisable=true;
    let fileName: string = this.equptMenuName + "-Document-List" + moment().format("YYYY-MM-DD-HH-mm-SSS");

    this.documenServiceAPI.downloadEquptDocTemplate(
      this.legalEntityId,
      this.branchId,
      this.userId,
      this.userRole
      )
    .subscribe(data => {
      saveAs(data, fileName + ".xls");
      this.enableDownloadProgressBar=false;
      this.downloadButtonEnableDisable=false;
    }, error => {
      
      //this.toastService.error("Something went wrong while downloading excel file");
      this.enableDownloadProgressBar=false;
      this.downloadButtonEnableDisable=false;
    });
    } catch (error) {
      this.toastService.error("Something went wrong while downloading excel file");
      this.enableDownloadProgressBar=false;
      this.downloadButtonEnableDisable=false;
    }

  }

  onFileChange(event){

    try {
      this.uploadedFileObj=event.target.files[0];

    if (this.uploadedFileObj != null){
     // console.log(this.uploadedFileObj.type);
      if (this.uploadedFileObj.type != 'application/vnd.ms-excel'){

        this.importDocumentExcelFormGroup.patchValue({
          excelData: ['']
        });

        this.toastService.error("Selected file type not supported");
        return false;
      }
    }      
    } catch (error) {
      this.toastService.error("Something went wrong while attaching document","");
    }

  }

  onUploadClick(){
    this.formSubmit=true;

    try {
      if (this.importDocumentExcelFormGroup.valid){

        this.enableImportProgressBar=true;
        this.importButtonEnableDisable=true;
      
       const importDocumentQrIdMapReqObj: IimportDocumentQrIdReq = {
         docSpecificToQrId: this.importDocumentExcelFormGroup.get('docSpecificToQrId').value,
         excelData: this.uploadedFileObj,
         legalEntityId: this.importDocumentExcelFormGroup.get('legalEntityId').value,
         branchId: this.branchId,
         userId: this.userId,
         userRole: this.userRole
       };
  
       try {
        this.documenServiceAPI.importDocumentQrIExcel(importDocumentQrIdMapReqObj)
        .subscribe(data => {
   
         this.toastService.success("Excel sheet import successfull");
         this.enableImportProgressBar=false;
         this.importButtonEnableDisable=false;
   
         this.importDocumentExcelFormGroup.patchValue({
           excelData: ['']
         });
   
        }, error => {
           //this.toastService.error("Something went wrong while importing excel sheet");
           this.enableImportProgressBar=false;
           this.importButtonEnableDisable=false;
        });  
       } catch (error) {
        this.toastService.error("Something went wrong while importing excel sheet");
        this.enableImportProgressBar=false;
        this.importButtonEnableDisable=false;
       }
  
       
      }      
    } catch (error) {
      this.toastService.error("Something went wrong while importing excel sheet");
      this.enableImportProgressBar=false;
      this.importButtonEnableDisable=false;
    }

  }

}
