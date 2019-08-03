import { Component, OnInit } from '@angular/core';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUtilService } from '../services/legalentity-util.service';

@Component({
  selector: 'app-legalentity-add-branch-new',
  templateUrl: './legalentity-add-branch-new.component.html',
  styleUrls: ['./legalentity-add-branch-new.component.css']
})
export class LegalentityAddBranchNewComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;

  constructor(
    private userModel: LegalentityUser,
    private router: Router,
    private toastService: ToastrService,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){

      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      if (this.userModel.legalEntityUserDetails.userRole != 'admin'){
        this.router.navigate(['legalentity','portal','dashboard']);
        return false;
      }

      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.userModel.legalEntityBranchDetails.branchId;
      this.userId = this.userModel.legalEntityUserDetails.userId;
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

  }

}
