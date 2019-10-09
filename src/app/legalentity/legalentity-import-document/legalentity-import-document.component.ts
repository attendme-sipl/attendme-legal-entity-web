import { Component, OnInit } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { LegalentityDocumentServiceService } from '../services/legalentity-document-service.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver';
import *as moment from 'moment';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-legalentity-import-document',
  templateUrl: './legalentity-import-document.component.html',
  styleUrls: ['./legalentity-import-document.component.css']
})
export class LegalentityImportDocumentComponent implements OnInit {

  legalEntityId: number;
  branchHeadOffice: boolean;

  equptMenuName: string;
  enableDownloadProgressBar: boolean;

  downloadButtonEnableDisable: boolean;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private userModel: LegalentityUser,
    private documenServiceAPI: LegalentityDocumentServiceService,
    private menuModel: LegalentityMenuPrefNames,
    private toastService: ToastrService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'back-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/keyboard_backspace-24px.svg')
    );
   }

  ngOnInit() {
    if (localStorage.getItem('legalEntityUserDetails') != null){
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
    }

    this.utilServiceAPI.setTitle('Legalentity - Import Document | Attendme');

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equptMenuName=this.menuModel.equipmentMenuName;
  }

  downloadEquptDocTemplate(){
    this.enableDownloadProgressBar=true;
    this.downloadButtonEnableDisable=true;
    let fileName: string = this.equptMenuName + "-Document-List" + moment().format("YYYY-MM-DD-HH-mm-SSS");

    this.documenServiceAPI.downloadEquptDocTemplate(this.legalEntityId)
    .subscribe(data => {
      saveAs(data, fileName + ".xls");
      this.enableDownloadProgressBar=false;
      this.downloadButtonEnableDisable=false;
    }, error => {
      
      this.toastService.error("Something went wrong while downloading excel file");
      this.enableDownloadProgressBar=false;
      this.downloadButtonEnableDisable=false;
    });
  }

}
