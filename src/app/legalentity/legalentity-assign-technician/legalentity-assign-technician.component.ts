import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
//import { LegalentityLogin } from '../model/legalentity-login';
//import { LegalentityBranch } from '../model/legalentity-branch';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { LegalentityConfirmAlertComponent } from '../legalentity-confirm-alert/legalentity-confirm-alert.component';
//import { LegalentityTechnicianService } from '../services/legalentity-technician.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { IAssingTechnicianDialogData } from '../legalentity-reports/legalentity-open-compt-rpt/legalentity-open-compt-rpt.component';
import { LegalentityTechnicianService } from '../services/legalentity-technician.service';
import { LegalentityUser } from '../model/legalentity-user';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { AuthService } from 'src/app/Auth/auth.service';


export interface IAlertData{

  alertMsg: string

};

@Component({
  selector: 'app-legalentity-assign-technician',
  templateUrl: './legalentity-assign-technician.component.html',
  styleUrls: ['./legalentity-assign-technician.component.css']
})
export class LegalentityAssignTechnicianComponent implements OnInit {

  legalEntityId:number;
  branchId:number;
  userId:number;
  userRole: string;

  technicianMenuName: string;
  complaintMenueName: string;

  complaintNumber: string;

  technicianNameArr: string[];

  technicianId:number;

  assignTechnicianForm;

  constructor(
    private router:Router,
    //private legalEntityLoginModel:LegalentityLogin,
    //private branchModel:LegalentityBranch,:
    private legalEntityUserModel: LegalentityUser,
    public dialogRef: MatDialogRef<LegalentityAssignTechnicianComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAssingTechnicianDialogData,
    private dialog:MatDialog,
    private technicianServiceAPI: LegalentityTechnicianService,
    private toasterService:ToastrService,
    private authService: AuthService
  ) { 
    this.technicianMenuName = data.technicianMenuName;
    this.complaintNumber = data.complaintNumber;
    this.complaintMenueName = data.complaintMenuName;

    dialogRef.disableClose = true;
  }

  onNoClick():void{
    this.dialogRef.close();
  }

  onSubmitClick(technicianForm:NgForm):void{
    if (technicianForm.valid){
      this.data.technicianId =  this.technicianId;

      this.dialogRef.close();
    }
  }


  openAlertDialog():void
  {
    
    let msgObj:IAlertData = {
      alertMsg:"There was an error"
    };

    const dialogRef = this.dialog.open(LegalentityConfirmAlertComponent,{
      data: {msgObj}
    });
  }

  popTechnicianList(){

    try {
      this.technicianServiceAPI.getTechnicianNameList(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole,
        true)
      .subscribe((data) => {
      
      this.technicianNameArr = data['technicialList'];
    
      /*if (data['errorOccured'] == true)
      {
        this.toasterService.error("Something went wrong while loading " + this.technicianMenuName + " list.");
        return false;
      }*/
  
     
      //console.log(data);
  
     // this.technicianNameArr = data['technicialList'];
  
      }, error => {
        //this.toasterService.error("Something went wrong while loading " + this.technicianMenuName + " list.");
      });
    } catch (error) {
      this.toasterService.error("Something went wrong while loading " + this.technicianMenuName + " list.");
      //return false;
    }

    
  }

  ngOnInit() {

    try {
      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.popTechnicianList();
    /*if(localStorage.getItem('legalEntityUserDetails') != null){
      this.legalEntityUserModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId = this.legalEntityUserModel.legalEntityUserDetails.legalEntityId;
      this.branchId = this.legalEntityUserModel.legalEntityBranchDetails.branchId;
      this.userId = this.legalEntityUserModel.legalEntityUserDetails.userId;  
    }
    else {
      this.router.navigate(['legalentity','login']);
      return false;
    } */

   /* if (localStorage.getItem('legalEntityUser') != null)
    {
      this.legalEntityLoginModel = JSON.parse(localStorage.getItem('legalEntityUser'));
      
      this.legalEntityId = this.legalEntityLoginModel.legalEntityId;
      this.userId = this.legalEntityLoginModel.userId;

      if (localStorage.getItem('legalEntityBranch') != null)
      {
        this.branchModel = JSON.parse(localStorage.getItem('legalEntityBranch'));

        this.branchId = this.branchModel.branchId;
      }
      else
      {
        this.router.navigate(['/legalentity/login']);  
      }
    }
    else
    {
      this.router.navigate(['/legalentity/login']);
    }

    */

    //this.technicianId = 0;
  
    } catch (error) {
      this.toasterService.error("Something went wrong while loading assign " + this.technicianMenuName + " dialog.","");
      this.dialogRef.close();
    }
   
    
  }

}
