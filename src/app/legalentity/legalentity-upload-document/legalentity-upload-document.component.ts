import { Component, OnInit } from '@angular/core';
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



@Component({
  selector: 'app-legalentity-upload-document',
  templateUrl: './legalentity-upload-document.component.html',
  styleUrls: ['./legalentity-upload-document.component.css']
})
export class LegalentityUploadDocumentComponent implements OnInit {

  legalEntityId: number;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    )
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

    this.utilServiceAPI.setTitle("Legalentity - Upload Document | Attendme");



   // this.DownloadFile().subscribe(data => {
     // console.log(data);
     //  saveAs(data,'fileNm');
  //  })

  }

 



  DownloadFile(): Observable<any>{
    //let fileExtension = fileType;
    //let input = filePath;
    return this.httpClient.get("http://192.168.0.99:8080/api/download", {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
            var blob = new Blob([res], {type: 'image/png'} )
            return blob;            
      });
  }
   

}
