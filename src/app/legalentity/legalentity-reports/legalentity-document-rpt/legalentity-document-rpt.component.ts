import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router } from '@angular/router';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityDocumentServiceService, IlegalEntityDocumentRptResponse, IuploadDocumentReq, IlegalEntityDocumentRptDetails } from '../../services/legalentity-document-service.service';
import {saveAs} from 'file-saver';
import { IConfirmAlertStruct, LegalentityConfirmAlertComponent } from '../../legalentity-confirm-alert/legalentity-confirm-alert.component';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

@Component({
  selector: 'app-legalentity-document-rpt',
  templateUrl: './legalentity-document-rpt.component.html',
  styleUrls: ['./legalentity-document-rpt.component.css']
})
export class LegalentityDocumentRptComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  enableProgressBar: boolean;

  fileToUpload: File = null;
  uploadDocForm: FormGroup;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  branchHeadOffice: boolean;

  dataSource;
  documentRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  documentsDetailsArray: IuploadDocumentReq[];

  legalEntityDocumentRptDetailsArr: IlegalEntityDocumentRptDetails[];

  displayedColumns: string[]=[
    "srNo",
    "docName",
    "docDesc",
    "docDownload",
    "docDelete",
  ];

  totalRecordCount: number=0;
  searchKey;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private host: ElementRef<HTMLInputElement>,
    private httpClient: HttpClient,
    private documentServiceAPI: LegalentityDocumentServiceService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    )
   }

   uploadDocument(){
     try {
      this.router.navigate(['legalentity','portal','upload','document']); 
     } catch (error) {
       this.toastService.error("Something went wrong while redirecting to upload documents page","");
     }
   }


   popLegalEntityDocument(){

    try {
      this.enableProgressBar=true;
    this.searchKey='';
//console.log(this.legalEntityId);
     this.documentServiceAPI.getLegalEntityDocumentsRpt(
       this.legalEntityId,
       this.branchId,
       this.userId,
       this.userRole
       )
     .subscribe((data: IlegalEntityDocumentRptResponse) => {
       //console.log(data);

       /*if (data.errorOccurred){
         this.enableProgressBar=false;
         this.toastService.error("Something went wrong while loading document details");
         return false;
       }*/

      const documentRptFilteredList = data.documentList.map((value,index) => value ? {
        docActiveStatus: value['docActiveStatus'],
        docCreationDate: value['docCreationDate'], 
        docDesc: value['docDesc'],
        docFileSize: value['docFileSize'],
        docFileType: value['docFileType'],
        docId: value['docId'],
        docName: value['docName'],
        docPath: value['docPath']

      } : null)
      .filter(value => value.docActiveStatus == true);
     
      this.legalEntityDocumentRptDetailsArr=documentRptFilteredList;
      this.totalRecordCount=this.legalEntityDocumentRptDetailsArr.length;
      this.documentRecordCount=this.legalEntityDocumentRptDetailsArr.length;

      this.dataSource=new MatTableDataSource(this.legalEntityDocumentRptDetailsArr);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
       
      this.enableProgressBar=false;

     },error => {
      this.enableProgressBar=false;
      //this.toastService.error("Something went wrong while loading document details");
     });
    } catch (error) {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while loading document details");
    }

   }

  /*onSubmitClick(){
  
    this.postFile(this.fileToUpload)
    .subscribe(data => {
      console.log(data);
    },error => {console.log(error);});
  }*/

  /*postFile(fileToUpload: File): Observable<any> {
    const endpoint = 'http://192.168.0.99:4201/api/uploadDocument';
    const formData: FormData = new FormData();
    formData.append('docData', fileToUpload, fileToUpload.name);
    formData.append('legalEntityId',"4");
    formData.append('docDesc',"This is test file");
    formData.append('specificToQr',"false");
    formData.append('docActiveStatus',"true");
    return this.httpClient
      .post(endpoint, formData);
      //.map(() => { return true; })
      //.catch((e) => this.handleError(e));
  }*/


  /*handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }*/

  deleteDocument(documentId: number){
    const confirmAlertDialogObj: IConfirmAlertStruct = {
      alertMessage: "Are you sure you want to delete the document",
      confirmBit: false
    };

    let alertDialogRef = this.dialog.open(LegalentityConfirmAlertComponent, {
      data: confirmAlertDialogObj,
      panelClass: 'custom-dialog-container'
    });
    
    alertDialogRef.afterClosed().subscribe(result => {
      if (confirmAlertDialogObj.confirmBit){
        this.enableProgressBar =true;

        this.documentServiceAPI.deleteDocumentRequest(documentId)
        .subscribe(data => {
          if (data['errorOccured'] == true){
            this.toastService.error("Something went wrong while deleting document");
            this.enableProgressBar=false;
            return false;
          }

          this.enableProgressBar=false;
          this.toastService.success("Document deleted successfully");

          this.popLegalEntityDocument();
        }, error => {
          this.toastService.error("Something went wrong while deleting document");
          this.enableProgressBar=false;
        });
      }
    });
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  downloadDocument(documentId){

    this.enableProgressBar=true;
    
    let documentName: string;

    const filteredDocObj = this.legalEntityDocumentRptDetailsArr.map((value,index) => value ? {
      docId: value['docId'],
      docName: value['docName']
    } : null)
    .filter(value => value.docId == documentId);

    if (filteredDocObj.length > 0){
      documentName = filteredDocObj[0]['docName'];
    }

    this.documentServiceAPI.requestDocDownloadData(documentId)
    .subscribe(data => {
      saveAs(data, documentName);
      this.enableProgressBar=false;
    }, error => {
      this.toastService.error("Something went wrong while downloading the document");
      this.enableProgressBar=false;
    });

  }

  importDocument(){
    this.router.navigate(['legalentity','portal','document','import']);
  }

  ngOnInit() {

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.branchId;
    this.userRole=tokenModel.userRole;
    
    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchHeadOffice=this.userModel.legalEntityBranchDetails.branchHeadOffice;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }*/

    this.utilServiceAPI.setTitle("Legalentity - Documents | Attendme");

    //to be added after jwt implementation
    //this.popLegalEntityDocument();

  }

}
