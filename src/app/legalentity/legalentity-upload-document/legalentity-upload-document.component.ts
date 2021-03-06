import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../model/legalentity-user';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpResponse} from '@angular/common/http';
//import {Http, ResponseContentType} from '@angular/http';
import {Http, ResponseContentType, ResponseType} from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'; 
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LegalentityDocumentServiceService, IuploadDocumentReq } from '../services/legalentity-document-service.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';



@Component({
  selector: 'app-legalentity-upload-document',
  templateUrl: './legalentity-upload-document.component.html',
  styleUrls: ['./legalentity-upload-document.component.css']
})
export class LegalentityUploadDocumentComponent implements OnInit {
  //@ViewChild('form') form;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  addDocumentFormGroup: FormGroup;
  enableProgressBar: boolean;
  formSubmit: boolean;
  disableSubmitButton:boolean;

  uploadedFileObj:File;
  branchHeadOffice: boolean;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private addDocumentFb: FormBuilder,
    private documentServiceAPI: LegalentityDocumentServiceService,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'back-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/keyboard_backspace-24px.svg')
    );
  }

  uploadDocument(){
    //console.log(this.addDocumentFormGroup.value);

    this.formSubmit=true;

    if (this.addDocumentFormGroup.valid){

      this.enableProgressBar=true;
      this.disableSubmitButton=true;

      const documentUploadObj: IuploadDocumentReq = {
        docActiveStatus: true,
        docData: this.uploadedFileObj,
        docDesc: this.addDocumentFormGroup.get('docDesc').value,
        legalEntityId: this.legalEntityId,
        specificToQr: false,
        branchId: this.branchId,
        userId: this.userId,
        userRole: this.userRole
      };

      try {
        this.documentServiceAPI.uploadLegalEntityDocument(documentUploadObj)
      .subscribe(data => {
        //console.log(data);
        /*if (data['errorOccured']){
          this.toastService.error("Something went wrong while uploading document","");
          this.enableProgressBar=false;
          this.disableSubmitButton=false;
          return false;
        }*/

        this.enableProgressBar=false;
        this.toastService.success("Document upload successful");
        this.resetForm();
      }, error => {
        //console.log(error);
        //this.toastService.error("Something went wrong while uploading document","");
        this.disableSubmitButton=false;
        this.enableProgressBar=false;
      });
      } catch (error) {
        this.toastService.error("Something went wrong while uploading document","");
        this.disableSubmitButton=false;
        this.enableProgressBar=false;
      }

    }

    //let fileUpload:File = this.addDocumentFormGroup.get('docData');

    //console.log(this.addDocumentFormGroup.get('docData'));



  }

  onFileChange(event){

    try {
      //console.log(event.target.files);

    this.uploadedFileObj= event.target.files[0];

    //console.log(this.uploadedFileObj);

    if (this.uploadedFileObj != null){
      if (!(this.uploadedFileObj.type == 'application/pdf' || 
    this.uploadedFileObj.type == 'image/gif' ||
    this.uploadedFileObj.type == 'image/jpeg' ||
    this.uploadedFileObj.type == 'image/png')
    
    ){
      this.addDocumentFormGroup.patchValue({
        docData: ['']
      });

      this.toastService.error("Selected file type not supported");
      return false;
    
    }

    let fileSize:number = this.uploadedFileObj.size;

    if (fileSize > 10485760){
      this.addDocumentFormGroup.patchValue({
        docData: ['']
      });

      this.toastService.error("Selected file size exceeds allowed file size");
      return false;
    }
  }
    } catch (error) {
      this.toastService.error("Something went wrong while attaching document","");
    }
    
  }

  backToDocumentRpt(){
    try {
      this.router.navigate(['legalentity','portal','rpt','document']);
      return false;  
    } catch (error) {
      this.toastService.error("Something went wrong while redirecting to documents report page","");
    }
    
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
        this.router.navigate(['legalentity','portal','dashboard']);
        return false;
      }
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    if (!this.branchHeadOffice){
      this.router.navigate(['legalentity','portal','dashboard']);
      return false;
    }

    this.utilServiceAPI.setTitle("Legalentity - Upload Document | Attendme");

    this.addDocumentFormGroup=this.addDocumentFb.group({
      docData: ['', [Validators.required]],
      docDesc: ['']
    });

   //this.DownloadFile().subscribe(data => {
     // console.log(data);
       //saveAs(data,'excelReport');
   //})
    } catch (error) {
      this.toastService.error("Something went wrong while loading this page","");
    }

  }

  resetForm(){
    try {
      this.enableProgressBar=false;
      this.formSubmit=false;
      //this.form.resetForm();
      this.disableSubmitButton=false;
      this.addDocumentFormGroup.reset();      
    } catch (error) {
      this.toastService.error("Something went wrong in form reset functionality");
    }
  }
 



  /*DownloadFile(): Observable<any>{
    //let fileExtension = fileType;
    //let input = filePath;
    return this.httpClient.post("http://192.168.0.99:4201/api/complaintsExcelReport",{
      "allBranch": false,
      "branchId": 4,
      "legalEntityId": 4,
      "fromDate": null,
      "toDate": null,
      "lastRecordCount": 0,
      "complaintMenuName": 'Complaint',
      "technicianMenuName": 'Technician'
    },{responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
            var blob = new Blob([res], {type: 'application/vnd.ms-excel'} )
            return blob;            
      });
  }*/
   

}
