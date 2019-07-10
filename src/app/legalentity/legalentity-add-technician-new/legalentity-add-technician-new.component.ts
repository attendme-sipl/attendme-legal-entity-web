import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'app-legalentity-add-technician-new',
  templateUrl: './legalentity-add-technician-new.component.html',
  styleUrls: ['./legalentity-add-technician-new.component.css']
})
export class LegalentityAddTechnicianNewComponent implements OnInit {

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

  constructor(
    private util:LegalentityUtilService,
    private router:Router,
    private activeRoute: ActivatedRoute,
    private toastService:ToastrService,
    private addTechnicianFormBuilder: FormBuilder,
    private addTechnicianService: LegalentityAddTechnicianService,
    private legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    private legalEntityUserModel: LegalentityUser
  ) {

    
   }

   /*get branchData()
   {
     return this.addTechnicianForm.get('techicianToBranchMapping').get('branchIdList') as FormArray;
   } */

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

     branchListArr:string[];

     /*popBranchList()
     {

      this.addTechnicianService.getLegalEntityBranchList(this.legalEntityId,true)
      .pipe(first())
      .subscribe(data => {

        if (data.errorOccured == true)
        {
          this.toastService.error("Something wne worn while loading page","");
          return false;
        }

        this.branchListArr = data['branchList'];

        this.branchListArr.forEach(indivBranch => {
         this.branchData.push(this.addTechnicianFormBuilder.control(indivBranch['branchHeadOffice'])); 
        });

    
      })

     }*/

     get technicianDetails() {
       return this.addTechnicianForm.get('technicianDetails') as FormGroup;
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


   /* if (localStorage.getItem('legalEntityUser') != null)
    {
       this.sessionLegalEntityData = JSON.parse(localStorage.getItem('legalEntityUser'));
       this.userId = this.sessionLegalEntityData.userId;
       this.legalEntityId = this.sessionLegalEntityData.legalEntityId;
     
       if (localStorage.getItem('legalEntityBranch') != null)
       {
         this.sessionBranchData = JSON.parse(localStorage.getItem('legalEntityBranch'));
         this.branchId = this.sessionBranchData.branchId;
       }
      
    }
    else
    {
      this.router.navigate(['/legalentity/login']);
    }

    this.menuId = this.activeRoute.snapshot.params['leMenuId'];

    this.util.getMenuName(this.legalEntityId,this.menuId)
    .pipe(first())
    .subscribe(data => {
      
      this.menuName = data.prefMenuName;

      this.util.setTitle('Legal Entity - ' + this.menuName + ' | Attendme');
      
    });

    this.legalEntityMenuPrefObj = JSON.parse(localStorage.getItem('leMenuPreference'));

    const technicianMenuNameObj = this.legalEntityMenuPrefObj.map((value,index) => value? {
      menuName: value['menuName'],
      ngModelPropName: value['ngModelPropName']
    }:null)
    .filter((value) => value.ngModelPropName == 'technician');

    this.techMenuName = technicianMenuNameObj[0]['menuName'];

    const complaintMenuPrefObj = this.legalEntityMenuPrefObj.map((value,index) => value? {
      menuName: value['menuName'],
      ngModelPropName: value['ngModelPropName']
    }:null)
    .filter((value) => value.ngModelPropName == 'complaints');

    this.complaintMenuName = complaintMenuPrefObj[0]['menuName'];

    */

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

  /* this.util.getLegalEntityMenuPreference(this.legalEntityId)
   .pipe(first())
   .subscribe(data => {
     
     let menuPreferdName:string[] = data;

     menuPreferdName.forEach(data => {

      if (data['ngModelPropName'] == 'branch')
      {
        this.branchMenuName = data['menuName'];
      }

     });
   }, error => {
     this.toastService.error("Something wne worn while loading page","");
   });

   */

   this.popCountryCallingCode();

   //this.popBranchList();

  
  }

  

  addTechnician() {

    if (this.addTechnicianForm.invalid)
    {
      this.loadingShow = false;
      this.disableBtn = false;
    
    }
    else
    {
      this.loadingShow = true;
      this.disableBtn = false;
    }

    
      
    this.technicianDetails.get('technicianName').markAsTouched({onlySelf:true});
    this.technicianDetails.get('userMobileNumber').markAsTouched({onlySelf:true});
    this.technicianDetails.get('userEmailId').markAsTouched({onlySelf:true});
  
    const selectedBranchIdList = this.addTechnicianForm.value['techicianToBranchMapping']['branchIdList']
    .map((value,index) => value? {
      branchId:this.branchListArr[index]['branchId'],
      techBranchActive:true
    }: null)
    .filter(value => value!= null);

    this.technicianDetails.patchValue({
      technicianMenuName: this.menuName
    });

    if (this.addTechnicianForm.valid)
    {
      this.addTechnicianService.addTechnicianDetails(this.technicianDetails.value)
      .pipe(first())
      .subscribe(data => {

       // console.log(data);
        
        if (data['errorOccured'] == true)
        {
          this.toastService.error("Something went wrong while adding technician, please try again");
          this.loadingShow = false;
          this.disableBtn = false;
          return false; 
        }

        if (data['mobileEmailExisits']== true)
        {
          this.toastService.error("Entered email id already exists. Please enter another email id");
          this.loadingShow = false;
            this.disableBtn = false;
          return false;
        }

        this.technicianID = data['technicianId'];

        this.addTechnicianService.assignBranchToTechnician(this.technicianID,selectedBranchIdList)
        .pipe(first())
        .subscribe(data => {
          
          if (data['errorOccured'] == true)
          {
            this.loadingShow = false;
            this.disableBtn = false;
            this.toastService.error("Something went wrong while adding technician, please try again");
            return false;
          }

          if (data['technicianToBranchMapped'] == false)
          {
            this.loadingShow = false;
            this.disableBtn = false;
            this.toastService.error("Something went wrong while adding technician, please try again");
            return false;
          }
          else{
            this.loadingShow = false;
            this.disableBtn = false;
            this.toastService.success("Technician added successfully");

            this.resetAll();
          }
          
        }, error => {
            this.loadingShow = false;
            this.disableBtn = false;
            this.toastService.error("Something went wrong while adding technician, please try again");
            return false;
        });

      }, error => {
        this.toastService.error("Something went wrong while adding technician, please try again");
        this.loadingShow = false;
        this.disableBtn = false;
        return false;
      })
    }
    
  }

  resetAll() {

    /*while(this.branchData.length)
    {
      this.branchData.removeAt(0);  
    }*/

    
     this.addTechnicianForm.reset({
      technicianDetails: {
        legalEntityId: this.legalEntityId,
        adminApprove: true,
        technicianActiveStatus: true,
        addedByUserId: this.userId,
        technicianMenuName: this.menuName,
        countryCallingCode: 91,
        userRole: 'technician',
        userActiveStatus: true,
        passwordChange: false
        //defaultAssign: false
      }
      
     });

   // this.popBranchList();
  
    
  }

}
