import { Component, OnInit, Inject } from '@angular/core';
//import { IlegalEntityMenuPref } from 'src/app/util-services.service';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { IchangeComplaintStatusReqStruct } from '../technician-report/technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import { NgForm } from '@angular/forms';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';
import { AuthService } from 'src/app/Auth/auth.service';
import { LegalentityMenuPrefNames } from 'src/app/legalentity/model/legalentity-menu-pref-names';
import { LegalentityUtilService } from 'src/app/legalentity/services/legalentity-util.service';
import { ToastrService } from 'ngx-toastr';

export interface IchangeStatusFormStruct{
 actionTakenName: string,
 complaintStatusName: string,
 failureReasonName: string
};

@Component({
  selector: 'app-technician-change-status',
  templateUrl: './technician-change-status.component.html',
  styleUrls: ['./technician-change-status.component.css']
})
export class TechnicianChangeStatusComponent implements OnInit {

  complaintMenuName: string;
  complaintNumber: string;

  complaintStatus: string;
  failureReason: string;
  txtActionTaken: string;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  constructor(
    public changeComplaintDialogRef: MatDialogRef<TechnicianChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IchangeComplaintStatusReqStruct,
    //private dialogRef: MatDialog,
    //private menuModel: LegalentityMenuPref,
    private authService: AuthService,
    private menuModel: LegalentityMenuPrefNames,
    private legalEntityUtilAPI: LegalentityUtilService,
    private toastService: ToastrService
  ) { 
    changeComplaintDialogRef.disableClose;
  }

  onSubmitClick(changeStatusFrom: NgForm):void{

    try {
      if (changeStatusFrom.valid)
    {

      let changeStatusFormData:IchangeStatusFormStruct = changeStatusFrom.value;
      this.data.actionTaken = changeStatusFormData.actionTakenName;
      this.data.failureReason = changeStatusFormData.failureReasonName;
      this.data.complaintStatus = changeStatusFormData.complaintStatusName;
      
      this.changeComplaintDialogRef.close();
      
    }

    } catch (error) {
      this.toastService.error("Something went wrong while submitting " + this.complaintMenuName + " status details");
    }


  }

  ngOnInit() {

    try {
      this.menuModel = this.legalEntityUtilAPI.getLegalEntityMenuPrefNames();

      this.complaintMenuName=this.menuModel.complaintMenuName;
  
      /*if (localStorage.getItem('legalEntityMenuPref') != null)
      {
       let menuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'))
  
       const complaintMenuNameObj = menuPrefObj.map((value,index) => value?{
         userDefMenuName: value['menuName'],
         ngModalPropMenuName: value['ngModelPropName']
       }:null)
       .filter(value => value.ngModalPropMenuName == 'complaints');
  
       this.complaintMenuName = complaintMenuNameObj[0]['userDefMenuName'];
  
      }*/
  
      this.complaintNumber = this.data.complaintNumber;
  
      //console.log(this.data); 
    } catch (error) {
      this.toastService.error("Something went wrong while loading this dialog control","");
    }

  }

  onNoClick():void{
    this.changeComplaintDialogRef.close();
  }

}
