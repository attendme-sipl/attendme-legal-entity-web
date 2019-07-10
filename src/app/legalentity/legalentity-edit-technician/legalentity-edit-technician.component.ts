import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, RouterLinkActive } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
//import { stringify } from '@angular/core/src/util';
import {first} from 'rxjs/operators';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LegalentityAddTechnicianService } from '../services/legalentity-add-technician.service';
//import { AddLegalentityService } from 'src/app/superadmin/services/add-legalentity.service';
import { formatDate } from '@angular/common';
import { parse } from 'querystring';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { LegalentityUser } from '../model/legalentity-user';
import { ToastrService } from 'ngx-toastr';
import { LegalentityTechnicianService, ItechnicianIndivDetails, ItechnicianUpdateReqStruct } from '../services/legalentity-technician.service';

@Component({
  selector: 'app-legalentity-edit-technician',
  templateUrl: './legalentity-edit-technician.component.html',
  styleUrls: ['./legalentity-edit-technician.component.css']
})
export class LegalentityEditTechnicianComponent implements OnInit {

  addTechnicianForm:FormGroup;

  sessionLegalEntityData:any;
  sessionBranchData:any;
  legalEntityId:number;
  branchId:number;
  userId:number;

  menuId:number;
  menuName:string;
  branchMenuName:string;

  callingCodeArr:number[];

  disableBtn:boolean;  
  loadingShow:boolean;

  technicianID:number;

  legalEntityMenuPrefObj:string[];

  techMenuName:string;
  complaintMenuName:string;

  suppliedTechnicianId:number;

  constructor(
    private util:LegalentityUtilService,
    private router:Router,
    private activeRoute: ActivatedRoute,
    private toastService:ToastrService,
    private addTechnicianFormBuilder: FormBuilder,
    private addTechnicianService: LegalentityAddTechnicianService,
    private technicianServiceAPI: LegalentityTechnicianService,
    private legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    private legalEntityUserModel: LegalentityUser,
    private route: ActivatedRoute
  ) { }

  popCountryCallingCode()
  {
   
     this.util.countryCallingCode()
     .subscribe((data:any) => {
    
     this.callingCodeArr = data;

     //console.log(data);
      
     },
   error => {
     this.toastService.error("Something wne worn while loading page","");
   })
  }

  get technicianDetails() {
    return this.addTechnicianForm.get('technicianDetails') as FormGroup;
  }

  popTechnicianDetails():void{
     this.technicianServiceAPI.getTechnicianDetails(this.suppliedTechnicianId)
     .subscribe((data:ItechnicianIndivDetails) => {
       if (data.errorOccured){
         this.toastService.error("Something went wrong while loading " + this.techMenuName + " details");
         return false;
       }

       let completeTechnicianMobileNumber: string[] = data.technicianMobileNumber.split("-");

       let countryCallingCode: number = parseInt(completeTechnicianMobileNumber[0]);
       let technicianMobileNumber: string = completeTechnicianMobileNumber[1];

       this.addTechnicianForm.get('technicianDetails').patchValue({
        technicianName: data.technicianName,
        countryCallingCode: countryCallingCode,
        userMobileNumber: technicianMobileNumber,
        userEmailId: data.technicianEmailId,
       })
     })
  }

  updateTechnician():void{

    if (this.addTechnicianForm.valid){
      
      this.loadingShow=true;

    const technicianDetailsUpdateReqObj:ItechnicianUpdateReqStruct={
      technicianId: this.suppliedTechnicianId,
      technicianMobileNumber: this.addTechnicianForm.get('technicianDetails').value['countryCallingCode'] + '-' + this.addTechnicianForm.get('technicianDetails').value['userMobileNumber'],
      technicianName: this.addTechnicianForm.get('technicianDetails').value['technicianName']
    };

    this.technicianServiceAPI.updateTechnicianDetails(technicianDetailsUpdateReqObj)
    .subscribe(data => {
      if (data['errorOccurred']){
        this.toastService.error("Something when wrong while updating "+ this.techMenuName + " details.");
        this.loadingShow=false;
        return false;
      }

      this.toastService.success(this.techMenuName + " details updated successfully");
      this.loadingShow = false;

      this.router.navigate(['legalentity','portal','technician']);
    },error =>{
      this.toastService.error("Something when wrong while updating "+ this.techMenuName + " details.");
      this.loadingShow=false;
    })

    }


  }

  ngOnInit() {

    this.loadingShow = false;

    if (localStorage.getItem('legalEntityUserDetails') != null)
    {
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId = this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.legalEntityUserModel.legalEntityBranchDetails.branchId;
      this.userId = this.legalEntityUserModel.legalEntityUserDetails.userId;
     // this.userLastLoginDateTime = this.legalEntityUserModel.legalEntityUserDetails.lastUpdateDateTime;
     // this.userCurrentLoginDateTime = this.legalEntityUserModel.legalEntityUserDetails.currentLoginDateTime;
    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.legalEntityMenuPrefModel = this.util.getLegalEntityMenuPrefNames();

    this.techMenuName = this.legalEntityMenuPrefModel.technicianMenuName;
    this.menuName = this.legalEntityMenuPrefModel.technicianMenuName;
    this.branchMenuName = this.legalEntityMenuPrefModel.branchMenuName;

    this.addTechnicianForm = this.addTechnicianFormBuilder.group({

      technicianDetails: this.addTechnicianFormBuilder.group({
 
       legalEntityId: [this.legalEntityId],
       technicianName: ['',[Validators.required]],
       adminApprove: [true],
       technicianActiveStatus: [true],
       addedByUserId: [this.userId],
       technicianMenuName: [this.menuName],
       countryCallingCode: [''],
       userMobileNumber: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]+')]],
       userEmailId: ['',[Validators.required,Validators.email]],
       userRole: ['technician'],
       userActiveStatus: [true],
       passwordChange: [false]
       //defaultAssign: [false]
     }),
 
     techicianToBranchMapping: this.addTechnicianFormBuilder.group({
       technicianId: [''],
       branchIdList: this.addTechnicianFormBuilder.array([])
     })
 
    });
 
    this.addTechnicianForm.patchValue({
     technicianDetails: {
       countryCallingCode:91
     }  
     
   });

  this.addTechnicianForm.get('technicianDetails').get('userEmailId').disable();

  this.suppliedTechnicianId=parseInt(this.route.snapshot.paramMap.get('id'));

 
   this.popCountryCallingCode();

   this.popTechnicianDetails();

  }

}
