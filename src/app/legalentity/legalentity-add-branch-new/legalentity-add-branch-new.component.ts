import { Component, OnInit } from '@angular/core';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUtilService, IcountryCallingCodeResponse } from '../services/legalentity-util.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { AuthService } from 'src/app/Auth/auth.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { LegalentityBranchService, IbranchRuleBookReq, IbranchRuleBookRes } from '../services/legalentity-branch.service';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LegalentityCountryCallingCode } from '../model/legalentity-country-calling-code';

@Component({
  selector: 'app-legalentity-add-branch-new',
  templateUrl: './legalentity-add-branch-new.component.html',
  styleUrls: ['./legalentity-add-branch-new.component.css']
})
export class LegalentityAddBranchNewComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;
  branchHeadOffice: boolean;

  exceedAlert: boolean;

  faArrowLeft = faArrowLeft;

  equipmentMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  dispAddBranchForm: boolean;

  addBranchFormGroup: FormGroup;
  countryCallingCodeObj: IcountryCallingCodeResponse;

  addBranchSubmit: boolean;

  constructor(
    private router: Router,
    private toastService: ToastrService,
    private utilServiceAPI: LegalentityUtilService,
    private authService: AuthService,
    private menuModel: LegalentityMenuPrefNames,
    private branchAPIService: LegalentityBranchService,
    private addBranchFb: FormBuilder
  ) { }

  ngOnInit() {
    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.dispAddBranchForm=true;

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.branchHeadOffice=tokenModel.branchHeadOffice;

    this.menuModel = this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.equipmentMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilServiceAPI.setTitle("Legal Entity - Add " + this.menuModel.branchMenuName + " | Attendme");

    this.verifyBranchRuleBook();

    this.addBranchFormGroup=this.addBranchFb.group({
      legalEntityId: this.legalEntityId,
      branchId: this.branchId,
      userId: this.userId,
      userRole: this.userRole,
      branchHeadOffice: this.branchHeadOffice,
      branchName: ['', [Validators.required]],
      branchAddress: ['', [Validators.required]],
      contactPersonName: [''],
      contactMobileNumber: [''],
      contactCountryCallingCode: 91,
      contactEmailId: [''],
      adminApprove: true,
      addedByUserId : this.userId,
      branchUserActiveStatus: true,
      branchUserName: [''],
      branchUserMobileNumber: [''],
      branchUserCountryCallingCode: 91,
      branchUserEmail: [''],
      branchUserRole: ['branch'],
      branchActiveStatus: true,
      branchUserPasswordChange: false,
      branchMenuName: this.branchMenuName
    });

    this.popCountryCallingCode();
  }

  onSubmitClick(){
    this.addBranchSubmit=true;
  }

  verifyBranchRuleBook(){
    const branchRuleBookReq: IbranchRuleBookReq = {
      branchHeadOffice: this.branchHeadOffice,
      branchId: this.branchId,
      legalEntityId: this.legalEntityId,
      userId: this.userId,
      userRole: this.userRole
    };

    this.branchAPIService.getBranchRuleBookNew(branchRuleBookReq)
    .subscribe((data: IbranchRuleBookRes) => {
      //console.log(data);

      if (data.addedBranchCount >= data.ruleBookBranchCount){
        this.exceedAlert=true;
        this.dispAddBranchForm=false;
      }
      else{
        this.exceedAlert=false;
        this.dispAddBranchForm=true;
      }
    });
  }

  popCountryCallingCode(){
    try {

      this.utilServiceAPI.countryCallingCode()
      .subscribe((data: IcountryCallingCodeResponse) => {
        this.countryCallingCodeObj=data
      });
      
    } catch (error) {
      this.toastService.error("Something went wrong while loading country calling codes");
    }
  }

  onBackClick(){
    
    this.router.navigate(['legalentity','portal','branch']);
  }
    

}
