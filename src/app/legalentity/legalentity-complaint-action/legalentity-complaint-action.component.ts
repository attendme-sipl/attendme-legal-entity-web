import { Component, OnInit } from '@angular/core';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';

@Component({
  selector: 'app-legalentity-complaint-action',
  templateUrl: './legalentity-complaint-action.component.html',
  styleUrls: ['./legalentity-complaint-action.component.css']
})
export class LegalentityComplaintActionComponent implements OnInit {

  legalEntityId: number;
  userId: number;
  branchId: number;
  technicianMenuName: string;
  complaintMenuName: string;

  constructor(
    private userModel: LegalentityUser,
    private router: Router,
    private menuModel: LegalentityMenuPrefNames,
    private iconRegistry: MatIconRegistry,
    sanitzer: DomSanitizer,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
    }
    else{
      this.router.navigate(['legalentity/login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    
    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;


  }

}
