import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityUser } from '../model/legalentity-user';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { IbranchListDetailsResponse, LegalentityBranchService, IbranchListReportResponse } from '../services/legalentity-branch.service';
import { LegalentityQrService, IallotQrIdToBranchResponseStruct } from '../services/legalentity-qr.service';

export interface IupdatedBranchDetailsResponse{
  branchId: number,
  branchHeadOffice: boolean,
  branchName: string
};

@Component({
  selector: 'app-legalentity-allot-qr-branch',
  templateUrl: './legalentity-allot-qr-branch.component.html',
  styleUrls: ['./legalentity-allot-qr-branch.component.css']
})
export class LegalentityAllotQrBranchComponent implements OnInit {
  @ViewChild('form') form;
  
  branchMenuName: string;
  legalEntityId: number;
  allotQrIdBranchFormGroup: FormGroup;

  branchListArray: IbranchListDetailsResponse[] = [];

  formSubmit:boolean;
  enableProgressBar:boolean;

  dispErrorMessage: boolean;
  errorMessage: string;

  updatedBranchList:IupdatedBranchDetailsResponse[];

  constructor(
    private utilServiceAPI:LegalentityUtilService,
    private userModel: LegalentityUser,
    private router: Router,
    private toastService: ToastrService,
    private menuModel: LegalentityMenuPrefNames,
    private fb: FormBuilder,
    private branchServiceAPI: LegalentityBranchService,
    private qrIdServiceAPI: LegalentityQrService
  ) { }

  popBranchList():void{
    this.branchServiceAPI.getBranchListReport(this.legalEntityId)
    .subscribe((data:IbranchListReportResponse) => {
      
      if (data.errorOccured){
        this.toastService.error("Something went wrong while loading " + this.branchMenuName + " list");
        return false;
      }

      this.branchListArray=data.branchDetailsList;

      this.updatedBranchList = this.branchListArray.map((value,index) => value?{
        branchId: value['branchId'],
        branchHeadOffice: value['branchHeadOffice'],
        branchName: value['branchName']
      }:null)
      .filter(value => value.branchHeadOffice == false);
       
    });
  }

  onSubmitClick(form:NgForm){

    this.formSubmit=true;

    if (this.allotQrIdBranchFormGroup.valid){
      this.enableProgressBar=true;

      this.qrIdServiceAPI.allotQrIdToBranch(this.allotQrIdBranchFormGroup.value)
      .subscribe((data: IallotQrIdToBranchResponseStruct) => {

        if (data.errorOccured){
          this.toastService.error("Something went wrong while alloting QR IDs");
          this.enableProgressBar=false;
          return false;
        }

        if (data.numOfQRIdExceed){
          this.toastService.error("Entered number of QR IDs are not available. Please enter number of QR IDs lesser or equal to available QR ID");
          this.enableProgressBar=false;
          return false;
        }

        if (data.branchQRAttloted){
          this.toastService.success("QR Ids allotted to " + this.branchMenuName + " successfully.");
          this.enableProgressBar=false;
          
        }
        else
        {
          this.toastService.error("Something went wrong while alloting QR IDs");
          this.enableProgressBar=false;
          return false;
        }

        this.resetForm(form);

      }, error => {
        this.toastService.error("Something went wrong while alloting QR IDs");
        this.enableProgressBar=false;
      });

    }
   
  }

  resetForm(form:NgForm){
    this.formSubmit=false;

    this.enableProgressBar=false;

    this.errorMessage="";
    this.dispErrorMessage=false;

    this.form.resetForm();

    this.setFormGroup();


  }

  setFormGroup(){

    this.allotQrIdBranchFormGroup= this.fb.group({
      legalEntityId: this.legalEntityId,
      assignBranchId: ['',Validators.required],
      numOfQRId: ['', Validators.required],
      qrIdStatus: false,
      qrActiveStatus: true,
      assignToBranch: false
   });

  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;

      if (this.userModel.legalEntityBranchDetails.branchHeadOffice==false){
        this.router.navigate(['legalentity','login']);
        return false;   
      }
    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    this.branchMenuName=this.menuModel.branchMenuName;
 
    this.setFormGroup();
    

    this.popBranchList();
  }
  
}
