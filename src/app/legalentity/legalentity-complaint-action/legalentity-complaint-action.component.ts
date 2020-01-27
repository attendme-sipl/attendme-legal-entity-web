import { Component, OnInit, Inject } from '@angular/core';
import { LegalentityUser } from '../model/legalentity-user';
import { Router } from '@angular/router';
import { LegalentityMenuPref } from '../model/legalentity-menu-pref';
import { MatIconRegistry, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityUtilService } from '../services/legalentity-util.service';
import { LegalentityMenuPrefNames } from '../model/legalentity-menu-pref-names';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItechnicianListRptResponse } from '../services/legalentity-add-technician.service';
import { LegalentityTechnicianService } from '../services/legalentity-technician.service';
import { ItechnicianDetailsReponse } from '../services/legalentity-user.service';

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

  actionTakenForm: NgForm;

  complaintActionCnt: string;
  technicianIdCnt: number;
  compDocumentCnt: string;
  failureReasonCnt: string;
  actionTakeCnt: string;
  comptRemarkCnt: string;
 
  fileObject: File[] =[];
  updatedFileObject: File[] = [];

  actionTakenList: IactionTakenList[] = [];

  technicianListArr: ItechnicianList[];

  technicianListVisisble: boolean;
  failureReasonVisisble: boolean;
  actionTakenVisisble: boolean;

  selectedAction: string;

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
    @Inject(MAT_DIALOG_DATA) public data: IactionTakenList
  ) { }


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

        if (totFileSize < 10485760){
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
        //this.complaintActionCnt="assigned";

        this.actionTakenForm.controls['complaintActionCnt'].setValue('assigned');
        break;
      case "assigned":
        this.complaintActionCnt="inprogress";
        break;
      case "inprogress":
        this.complaintActionCnt="closed";
        break;
    }
  }

  customFormonAction(action: string){
    switch(action){
      case "assigned":
        this.actionTakenForm
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

    this.popActionTakenList('open');
    //this.setActionTaken('open');

    this.complaintActionCnt="0"

    this.popTechnicianList();

    this.technicianIdCnt=0;

    console.log(this.actionTakenForm);

  }

}
