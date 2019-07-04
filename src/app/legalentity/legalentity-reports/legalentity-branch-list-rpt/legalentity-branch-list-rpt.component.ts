import { Component, OnInit } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';

@Component({
  selector: 'app-legalentity-branch-list-rpt',
  templateUrl: './legalentity-branch-list-rpt.component.html',
  styleUrls: ['./legalentity-branch-list-rpt.component.css']
})
export class LegalentityBranchListRptComponent implements OnInit {

  legalEntityId: number;
  branchId: number;

  branchMenuName: string;

  constructor(
    private utilServiceAPI: LegalentityUtilService,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private menuModel: LegalentityMenuPrefNames,
    sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){

      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.userId;
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;


    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

    this.branchMenuName=this.menuModel.branchMenuName;

  }

}
