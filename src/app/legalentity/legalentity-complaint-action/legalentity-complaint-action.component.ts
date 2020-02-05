import { Component, OnInit, Inject } from '@angular/core';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import { MatIconRegistry, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { FormGroup, FormBuilder, NgForm, Validators, RequiredValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItechnicianListRptResponse } from '../services/legalentity-add-technician.service';
import { LegalentityTechnicianService } from '../services/legalentity-technician.service';
import { ItechnicianDetailsReponse } from '../services/legalentity-user.service';
import { IactionTakenReqData } from '../services/legalentity-complaint-rpt.service';

export interface IactionTakenList{
  actionTakenValue: string,
  actionTakenTxt: string
};

export interface ItechnicianList{
  technicianId: number,
  technicianName: string
};

@Component({
  selector: 'app-legalentity-complaint-action',
  templateUrl: './legalentity-complaint-action.component.html',
  styleUrls: ['./legalentity-complaint-action.component.css']
})
export class LegalentityComplaintActionComponent implements OnInit {

  legalEntityId: number;
  userId: number;
  branchId: number;
  userRole: string;
  technicianMenuName: string;
  complaintMenuName: string;

  actionTakenForm: FormGroup;
 
  fileObject: File[] =[];
  updatedFileObject: File[] = [];

  actionTakenList: IactionTakenList[] = [];

  technicianListArr: ItechnicianList[];

  technicianVisisble: boolean;
  failureReasonVisisble: boolean;
  actionTakenVisible: boolean;

  actionSubmit: boolean;

  requestedComptStatus: string;

  constructor(
    private userModel: LegalentityUser,
    private router: Router,
    private menuModel: LegalentityMenuPrefNames,
    private iconRegistry: MatIconRegistry,
    sanitzer: DomSanitizer,
    private utilServiceAPI: LegalentityUtilService,
    private authService: AuthService,
    private toastService: ToastrService,
    private technicianServiceAPI: LegalentityTechnicianService,
    @Inject(MAT_DIALOG_DATA) public data: IactionTakenReqData,
    private actionTakenFb: FormBuilder,
    public actionDialogRef: MatDialogRef<LegalentityComplaintActionComponent>
  ) {
    actionDialogRef.disableClose = true;

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

  popActionTakenList(action: string){

    switch(action){
      case "open":
        this.actionTakenList.push({
          actionTakenTxt: 'Assign ' + this.technicianMenuName,
          actionTakenValue: 'assigned'
        },
        {
          actionTakenTxt: 'Close',
          actionTakenValue: 'closed'
        });
        break;

      case "assigned":
        this.actionTakenList.push({
          actionTakenTxt: 'In Progress',
          actionTakenValue: 'inprogress'
        },
        {
          actionTakenTxt: 'Close',
          actionTakenValue: 'closed'
        });
        break;
      
      case "inprogress":
        this.actionTakenList.push({
          actionTakenTxt: 'Close',
          actionTakenValue: 'closed'
        });
        break;

      default:
        this.actionTakenList=[];
        break;

    }

    
  }

  setActionTaken(actionCalling: string){
    switch(actionCalling){
      case "open":
        this.actionTakenForm.patchValue({
          complaintActionCnt: "assigned"
        });
        break;
      case "assigned":
        this.actionTakenForm.patchValue({
          complaintActionCnt: "inprogress"
        });
        break;
      case "inprogress":
        this.actionTakenForm.patchValue({
          complaintActionCnt: "closed"
        });
        break;
    }
  }

  customFormAction(action: string){
    switch(action){
      case "assigned":
        this.technicianVisisble=true;
        this.failureReasonVisisble=false;
        this.actionTakenVisible=false;
        this.actionTakenForm.controls['failureReasonCnt'].clearValidators();
        this.actionTakenForm.controls['failureReasonCnt'].updateValueAndValidity();
        this.actionTakenForm.controls['actionTakeCnt'].clearValidators();
        this.actionTakenForm.controls['actionTakeCnt'].updateValueAndValidity();

        this.actionTakenForm.patchValue({
          technicianIdCnt: 0
        });

        this.actionSubmit=false;
        break;

      case "inprogress":
        
        this.technicianVisisble=false;
        this.failureReasonVisisble=true;
        this.actionTakenVisible=true;
        
        this.actionTakenForm.controls['failureReasonCnt'].setValidators([Validators.required]);
        this.actionTakenForm.controls['failureReasonCnt'].updateValueAndValidity();
        this.actionTakenForm.controls['actionTakeCnt'].setValidators([Validators.required]);
        this.actionTakenForm.controls['actionTakeCnt'].updateValueAndValidity();
        
        this.actionTakenForm.patchValue({
          technicianIdCnt: 0
        });

        this.actionSubmit=false;
        break;

      case "closed":
 
        this.technicianVisisble=false;
        this.failureReasonVisisble=true;
        this.actionTakenVisible=true;
        this.actionTakenForm.controls['failureReasonCnt'].setValidators([Validators.required]);
        this.actionTakenForm.controls['failureReasonCnt'].updateValueAndValidity();
        this.actionTakenForm.controls['actionTakeCnt'].setValidators([Validators.required]);
        this.actionTakenForm.controls['actionTakeCnt'].updateValueAndValidity();
        this.actionSubmit=false;

        this.actionTakenForm.patchValue({
          technicianIdCnt: 0
        });

        break;
    }
  }

  popTechnicianList(){
    this.technicianServiceAPI.getTechnicianNameList(
      this.legalEntityId,
      this.branchId,
      this.userId,
      this.userRole,
      true
    )
    .subscribe(data => {
     
      this.technicianListArr=data['technicialList'];
 
    });
  }

  onSubmitClick(){
   
   
    let selStatus: string = this.actionTakenForm.get('complaintActionCnt').value;

    this.actionSubmit=true;

    if (this.actionTakenForm.valid){
      if (selStatus == "assigned"){
      
        let technicianId: number = this.actionTakenForm.get('technicianIdCnt').value;
  
        if (technicianId == 0){
          this.toastService.error("Please select " + this.technicianMenuName + " from the list");
          return false;
        }
  
        //console.log(this.actionTakenForm.value);
  
        //console.log(this.updatedFileObject);
  
        //this.data.actionTaken="assigned";
        //this.data.complaintClosedRemark=this.actionTakenForm.get('comptRemarkCnt').value;
        this.data.complaintStatus="assigned";
        this.data.complaintStatusDocument=this.updatedFileObject;
        this.data.statusRemark=this.actionTakenForm.get('comptRemarkCnt').value;
        this.data.technicianId=this.actionTakenForm.get('technicianIdCnt').value;
  
        this.closeDialog();
  
        /*let actionTakenReqData: IactionTakenReqData = {
          actionTaken: "assigned",
          branchId: this.branchId,
          complaintClosedRemark: this.actionTakenForm.get('comptRemarkCnt').value,
          complaintId: this.data.complaintId,
          complaintMenuName: this.complaintMenuName,
          complaintStageCount: this.data.complaintStageCount,
          complaintStatus: "assigned",
          complaintStatusDocument: this.updatedFileObject,
          equipmentMenuName: this.data.equipmentMenuName,
          failureReason: null,
          legalEntityId: this.legalEntityId,
          legalEntityUserId: this.userId,
          reqComptStatus: "open",
          statusRemark: this.actionTakenForm.get('comptRemarkCnt').value,
          technicianId: this.actionTakenForm.get('technicianIdCnt').value,
          technicianMenuName: this.technicianMenuName,
          userFullName: this.data.userFullName,
          userId: this.userId,
          userRole: this.userRole
        }*/
  
      }
      
      if (selStatus == "closed"){
        /*let actionTakenReqData: IactionTakenReqData = {
          actionTaken: "assigned",
          branchId: this.branchId,
          complaintClosedRemark: this.actionTakenForm.get('comptRemarkCnt').value,
          complaintId: this.data.complaintId,
          complaintMenuName: this.complaintMenuName,
          complaintStageCount: this.data.complaintStageCount,
          complaintStatus: "assigned",
          complaintStatusDocument: this.updatedFileObject,
          equipmentMenuName: this.data.equipmentMenuName,
          failureReason: null,
          legalEntityId: this.legalEntityId,
          legalEntityUserId: this.userId,
          reqComptStatus: "open",
          statusRemark: this.actionTakenForm.get('comptRemarkCnt').value,
          technicianId: this.actionTakenForm.get('technicianIdCnt').value,
          technicianMenuName: this.technicianMenuName,
          userFullName: this.data.userFullName,
          userId: this.userId,
          userRole: this.userRole
        }*/
  
        this.data.actionTaken=this.actionTakenForm.get('actionTakeCnt').value;
        this.data.complaintClosedRemark= this.actionTakenForm.get('comptRemarkCnt').value;
        this.data.complaintStatus= "closed";
        this.data.complaintStatusDocument= this.updatedFileObject;
        this.data.failureReason= this.actionTakenForm.get('failureReasonCnt').value;
        this.data.statusRemark= this.actionTakenForm.get('comptRemarkCnt').value;
  
        this.closeDialog();
  
      }

      if (selStatus == "inprogress"){

        this.data.actionTaken=this.actionTakenForm.get('actionTakeCnt').value;
        this.data.complaintClosedRemark= this.actionTakenForm.get('comptRemarkCnt').value;
        this.data.complaintStatus= "inprogress";
        this.data.complaintStatusDocument= this.updatedFileObject;
        this.data.failureReason= this.actionTakenForm.get('failureReasonCnt').value;
        this.data.statusRemark= this.actionTakenForm.get('comptRemarkCnt').value;

        this.closeDialog();
      }
    }

  }

  setCustomValidators(){
    
    const actionControlChange = this.actionTakenForm.get('complaintActionCnt').valueChanges;

    actionControlChange.subscribe(actionValue => {
      //console.log("in custom validator " + actionValue);
      switch(actionValue){

        case "inprogress":
          this.actionTakenForm['controls']['failureReasonCnt'].setValidators([Validators.required]);
          this.actionTakenForm['controls']['failureReasonCnt'].updateValueAndValidity({emitEvent: false});
        
        case "closed":
          //console.log("in closed custom validator");
          this.actionTakenForm.controls['failureReasonCnt'].setValidators([Validators.required]);
          this.actionTakenForm.controls['failureReasonCnt'].updateValueAndValidity();
          //console.log(this.actionTakenForm.controls['failureReasonCnt']);
          //this.actionTakenForm.get('failureReasonCnt').setValidators([Validators.required]);
          //this.actionTakenForm.get('failureReasonCnt').updateValueAndValidity({emitEvent: false});
          
        case "assigned":
          this.actionTakenForm['controls']['failureReasonCnt'].clearValidators();
          this.actionTakenForm['controls']['failureReasonCnt'].updateValueAndValidity({emitEvent: false});
      }

      


      
    });
  }

  ngOnInit() {

    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
    }
    else{
      this.router.navigate(['legalentity/login']);
      return false;
    }*/

    this.menuModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();
    
    this.complaintMenuName=this.menuModel.complaintMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;

    this.actionTakenForm=this.actionTakenFb.group({
      complaintActionCnt: [''],
      technicianIdCnt: [0],
      compDocumentCnt: [''],
      failureReasonCnt: [''],
      actionTakeCnt: [''],
      comptRemarkCnt: ['']
    });

    this.requestedComptStatus=this.data.reqComptStatus;

    this.popActionTakenList(this.requestedComptStatus);
    this.setActionTaken(this.requestedComptStatus);

    this.popTechnicianList();

    this.customFormAction(this.actionTakenForm.get('complaintActionCnt').value);
    
    //this.setCustomValidators();

  }

  onActionTakenChange(){
    this.customFormAction(this.actionTakenForm.get('complaintActionCnt').value);
  }

  closeDialog(){
    this.actionDialogRef.close();
  }

}
