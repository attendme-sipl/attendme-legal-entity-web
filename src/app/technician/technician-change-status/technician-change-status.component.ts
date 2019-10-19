import { Component, OnInit, Inject } from '@angular/core';
//import { IlegalEntityMenuPref } from 'src/app/util-services.service';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { IchangeComplaintStatusReqStruct } from '../technician-report/technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import { NgForm } from '@angular/forms';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';

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

  constructor(
    public changeComplaintDialogRef: MatDialogRef<TechnicianChangeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IchangeComplaintStatusReqStruct,
    //private dialogRef: MatDialog,
    //private menuModel: LegalentityMenuPref
  ) { 
    changeComplaintDialogRef.disableClose;
  }

  onSubmitClick(changeStatusFrom: NgForm):void{

    if (changeStatusFrom.valid)
    {

      let changeStatusFormData:IchangeStatusFormStruct = changeStatusFrom.value;
      this.data.actionTaken = changeStatusFormData.actionTakenName;
      this.data.failureReason = changeStatusFormData.failureReasonName;
      this.data.complaintStatus = changeStatusFormData.complaintStatusName;
     
      this.changeComplaintDialogRef.close();
      
    }

  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityMenuPref') != null)
    {
     let menuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'))

     const complaintMenuNameObj = menuPrefObj.map((value,index) => value?{
       userDefMenuName: value['menuName'],
       ngModalPropMenuName: value['ngModelPropName']
     }:null)
     .filter(value => value.ngModalPropMenuName == 'complaints');

     this.complaintMenuName = complaintMenuNameObj[0]['userDefMenuName'];

    }

    this.complaintNumber = this.data.complaintNumber;

    //console.log(this.data);

  }

  onNoClick():void{
    this.changeComplaintDialogRef.close();
  }

}
