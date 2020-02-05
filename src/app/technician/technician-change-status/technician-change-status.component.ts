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

  fileObject: File[] =[];

  updatedFileObject: File[] = [];

  complaintDocUploadControl: string;

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

  onFileChange(event){
    this.fileObject=event.target.files;

    let updatedFileLength: number = this.updatedFileObject.length + this.fileObject.length;

    if (updatedFileLength > 3){
      this.toastService.error("Cannot add file more than 3.");
      
      this.fileObject = [];

      return false;
    }
    

    for (let i: number=0; i <= this.fileObject.length-1; i++ ){

     if ((this.fileObject[0].type == 'application/pdf' || 
      this.fileObject[0].type == 'image/gif' ||
      this.fileObject[0].type == 'image/jpeg' ||
      this.fileObject[0].type == 'image/png')){

        let PreviousAddedFileSize: number = 0;

        for(let j: number=0; j<= this.updatedFileObject.length-1; j++){
          PreviousAddedFileSize = PreviousAddedFileSize + this.updatedFileObject[j].size;
        }

        let totFileSize: number = this.fileObject[0].size + PreviousAddedFileSize;

        if (totFileSize < 15728640){
          this.updatedFileObject.push(this.fileObject[i]);
        }
        else{
          this.toastService.error("Total added file size exceed. File added after file size exceed cannot be added to list");
        }

      }
      else{
        this.toastService.error("Files with invalid file types cannot be attached");
        //return false;
      }
     
    }

    

  }

  removeFileFromList(fileIndex: number){
    this.updatedFileObject.splice(fileIndex,1);
  }

  onSubmitClick(changeStatusFrom: NgForm):void{

    try {
      if (changeStatusFrom.valid)
    {

      let changeStatusFormData:IchangeStatusFormStruct = changeStatusFrom.value;
      this.data.complaintStatusDocument = this.updatedFileObject;
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
