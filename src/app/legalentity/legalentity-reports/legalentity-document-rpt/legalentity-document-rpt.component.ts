import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-legalentity-document-rpt',
  templateUrl: './legalentity-document-rpt.component.html',
  styleUrls: ['./legalentity-document-rpt.component.css']
})
export class LegalentityDocumentRptComponent implements OnInit {

  private file: File | null = null;

  

  fileToUpload: File = null;
  uploadDocForm: FormGroup;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private host: ElementRef<HTMLInputElement>,
    private httpClient: HttpClient
  ) { }

  onSubmitClick(){

    //console.log(this.fileToUpload);
   
    /*this.httpClient.post("http://192.168.0.99:8080/uploadFile",{
      file: this.fileToUpload
    })
    .subscribe(data =>{
      console.log(data);
    });*/
  
    this.postFile(this.fileToUpload)
    .subscribe(data => {
      console.log(data);
    },error => {console.log(error);});
  }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = 'http://192.168.0.99:8080/uploadFile';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData);
      //.map(() => { return true; })
      //.catch((e) => this.handleError(e));
}


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}




  ngOnInit() {
    //console.log(this.f.type);

    this.uploadDocForm=this.fb.group({
      docFile:['']
    });

  }

}
