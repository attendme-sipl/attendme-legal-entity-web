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
import { FormGroup, FormBuilder, Validators, PatternValidator } from '@angular/forms';
import { LegalentityCountryCallingCode } from '../model/legalentity-country-calling-code';
import { LegalentityBranch } from '../model/legalentity-branch';
import { LegalentityAddBranch } from '../model/legalentity-add-branch';

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
  numericValidatorPattern: string = "^[0-9]*$";

  addBranchProgressBar: boolean;
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
      branchAddress: [''],
      contactPersonName: [''],
      contactMobileNumber: ['', [Validators.pattern(this.numericValidatorPattern)]],
      contactCountryCallingCode: 91,
      contactEmailId: ['', [Validators.email]],
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

    this.setCustomValidators();

    this.popCountryCallingCode();
  }

  onSubmitClick(){
    
    this.addBranchSubmit=true;

    if (this.addBranchFormGroup.valid){


      let contactCountryCallingCode: number = this.addBranchFormGroup.get('contactCountryCallingCode').value;
      let contactMobileNumber: string = this.addBranchFormGroup.get('contactMobileNumber').value;

      let updateContactMobileNumber: string = '';

      if (contactMobileNumber != '' || contactMobileNumber != null){
        updateContactMobileNumber=contactCountryCallingCode + '-' + contactMobileNumber;
      }

      let branchUserCountryCallingCode: number = this.addBranchFormGroup.get('branchUserCountryCallingCode').value;
      let branchUserMobileNumber: string = this.addBranchFormGroup.get('branchUserMobileNumber').value;
      let updatedBranchUserMobileNumber: string = '';

      if (branchUserMobileNumber != '' && branchUserMobileNumber != null){
        updatedBranchUserMobileNumber=branchUserCountryCallingCode + '-' + branchUserMobileNumber;
      }

      let addBranchObj: LegalentityAddBranch = this.addBranchFormGroup.value;

      addBranchObj.contactMobileNumber=updateContactMobileNumber;
      addBranchObj.branchUserMobileNumber = updatedBranchUserMobileNumber;

      let branchUserName: string = this.addBranchFormGroup.get('branchUserName').value;
      let branchUserMobileNumberWcCC: string = this.addBranchFormGroup.get('branchUserMobileNumber').value;
      let branchUserEmailId: string = this.addBranchFormGroup.get('branchUserEmail').value;

      if (branchUserName != '' && branchUserMobileNumberWcCC != '' && branchUserEmailId != ''){

        this.addBranchProgressBar=true;

        this.branchAPIService.addNewBranchDetails(addBranchObj)
        .subscribe((data: LegalentityAddBranch) => {
         

          if (data.branchExceed == true){
            this.toastService.error("Total number of" + this.branchMenuName + " added has exceeded as per your rule book. To uprgade. Please contact administrator.");
            this.addBranchProgressBar=false;
            return false;
          }

          if (data.userEmailMobileExisits){
            this.toastService.error("Entered email id already exists. Please try another email id.");
            this.addBranchProgressBar=false;
            return false;
          }

          if (data.branchId == 0 || data.branchAdded ==false){
            this.toastService.error("Something went wrong while adding new " + this.branchMenuName);
            this.addBranchProgressBar=false;
            return false;
          }
            this.toastService.success(this.branchMenuName + " added sucessfully !!!");
            this.addBranchProgressBar=false;
            this.resetForm();
        }, error => {this.addBranchProgressBar=false;});
      }
      
    }
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

  resetForm(){
    this.addBranchFormGroup.reset({
      contactCountryCallingCode: 91,
      branchUserCountryCallingCode: 91,
      branchUserName: '',
      branchUserMobileNumber: '',
      branchUserEmail: ''
    });

    this.addBranchSubmit=false;

    //this.setCustomValidators();
  }

  setCustomValidators(){

    const contactPersonNameChange$=this.addBranchFormGroup.get('branchUserName').valueChanges;

    contactPersonNameChange$.subscribe(contactPersonNameTxt => {
      let contactMobileNumber: string = this.addBranchFormGroup.controls['branchUserMobileNumber'].value;
      let contactEmailId: string = this.addBranchFormGroup.controls['branchUserEmail'].value;

      if (contactPersonNameTxt != ''){

        if (contactMobileNumber == ''){
         
          this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
          this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
        }
        
        if (contactEmailId == ''){
         
          this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
          this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});
        }

      }
      else{
        
        if (contactMobileNumber == '' && contactEmailId == ''){
          
          this.addBranchFormGroup.get('branchUserName').clearValidators();
          this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserEmail').clearValidators();
          this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserMobileNumber').clearValidators();
          this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
        }
        else{
          
          if (contactMobileNumber != '' && contactEmailId != ''){
            this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
            this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});
          }


          if (contactMobileNumber != '' && contactEmailId == ''){
            this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
            this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

            this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});
          }

          if (contactMobileNumber == '' && contactEmailId != ''){
            this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
            this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

            this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
          }
        }
      }
    });

    const branchUserMobileNumberChange$ = this.addBranchFormGroup.get('branchUserMobileNumber').valueChanges;

    branchUserMobileNumberChange$.subscribe(branchUserMobileNumberTxt => {

      let branchUserName: string = this.addBranchFormGroup.get('branchUserName').value;
      let branchUserEmailId: string = this.addBranchFormGroup.get('branchUserEmail').value;

      if (branchUserMobileNumberTxt != ''){

        if (branchUserName ==''){
          this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
          this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});
        }

        if (branchUserEmailId ==''){
          this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
          this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});
        }

      }
      else{
        if (branchUserName =='' && branchUserEmailId == ''){
          this.addBranchFormGroup.get('branchUserName').clearValidators();
          this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserMobileNumber').clearValidators();
          this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserEmail').clearValidators();
          this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});
        }
        else{
          if(branchUserName != '' && branchUserEmailId != ''){
            this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
            this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
          }

          if (branchUserName != '' && branchUserEmailId == ''){
            this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
            this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});

            this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});
          }

          if (branchUserName == '' && branchUserEmailId != ''){
            this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
            this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});

            this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
            this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});
          }
        }
      }
    });

    const branchUserEmailIdChange$ = this.addBranchFormGroup.get('branchUserEmail').valueChanges;

    branchUserEmailIdChange$.subscribe(branchUserEmailTxt => {
      let branchUserName: string = this.addBranchFormGroup.get('branchUserName').value;
      let branchUserMobileNumber: string = this.addBranchFormGroup.get('branchUserMobileNumber').value;

      if (branchUserEmailTxt != ''){
        if (branchUserName == ''){
          this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
          this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});
        }

        if (branchUserMobileNumber == ''){
          this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
          this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
        }
      }
      else{
        if (branchUserName == '' && branchUserMobileNumber == ''){
          this.addBranchFormGroup.get('branchUserName').clearValidators();
          this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserEmail').clearValidators();
          this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});

          this.addBranchFormGroup.get('branchUserMobileNumber').clearValidators();
          this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false});
        }
        else{
          if (branchUserName != '' && branchUserMobileNumber != ''){
            this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false});            
          }

          if (branchUserName != '' && branchUserMobileNumber == ''){
            this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false}); 

            this.addBranchFormGroup.get('branchUserMobileNumber').setValidators([Validators.required, Validators.pattern(this.numericValidatorPattern)]);
            this.addBranchFormGroup.get('branchUserMobileNumber').updateValueAndValidity({emitEvent: false}); 
          }

          if (branchUserName == '' && branchUserMobileNumber != ''){
            this.addBranchFormGroup.get('branchUserEmail').setValidators([Validators.required, Validators.email]);
            this.addBranchFormGroup.get('branchUserEmail').updateValueAndValidity({emitEvent: false}); 

            this.addBranchFormGroup.get('branchUserName').setValidators([Validators.required]);
            this.addBranchFormGroup.get('branchUserName').updateValueAndValidity({emitEvent: false});

          }
        }
      }
    });
  }

}
