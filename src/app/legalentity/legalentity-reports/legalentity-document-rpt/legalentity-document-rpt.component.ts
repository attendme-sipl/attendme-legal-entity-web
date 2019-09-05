import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router } from '@angular/router';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityDocumentServiceService, IlegalEntityDocumentRptResponse, IuploadDocumentReq, IlegalEntityDocumentRptDetails } from '../../services/legalentity-document-service.service';

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
    private documentServiceAPI: LegalentityDocumentServiceService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    )
   }

   uploadDocument(){
     this.router.navigate(['legalentity','portal','upload','document']);
   }

   popLegalEntityDocument(){

    this.enableProgressBar=true;

     this.documentServiceAPI.getLegalEntityDocumentsRpt(this.legalEntityId)
     .subscribe((data: IlegalEntityDocumentRptResponse) => {
       console.log(data);

       if (data.errorOccurred){
         this.enableProgressBar=false;
         this.toastService.error("Something went wrong while loading document details");
         return false;
       }

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
      this.documentRecordCount=this.legalEntityDocumentRptDetailsArr.length;

      this.dataSource=new MatTableDataSource(this.legalEntityDocumentRptDetailsArr);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
       
      this.enableProgressBar=false;

     },error => {
      this.enableProgressBar=false;
      this.toastService.error("Something went wrong while loading document details");
     });
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

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


  ngOnInit() {
    
    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.utilServiceAPI.setTitle("Legalentity - Documents | Attendme");

    this.popLegalEntityDocument();

  }

}
