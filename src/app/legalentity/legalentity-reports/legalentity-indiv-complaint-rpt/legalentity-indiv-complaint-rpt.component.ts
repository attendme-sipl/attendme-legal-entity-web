import { Component, OnInit, inject, Inject } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IcomplaintIndivReqStruct, LegalentityComplaintRptService, IcomplaintIndivResponseStruct } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityIndivComptDetails } from '../../model/legalentity-indiv-compt-details';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model';

export interface IcomplaintIndivDocResponseStruct{
   imageDocTransId: number,
   imageName: string,
   complaintStatus: string,
   imageLink: string
};

export interface IqrIdFormFieldsResponseStruct{
  equptFormFieldIndexId: number,
  formFieldId: number,
  formFieldTitle: string,
  formFieldValue: string
};

@Component({
  selector: 'app-legalentity-indiv-complaint-rpt',
  templateUrl: './legalentity-indiv-complaint-rpt.component.html',
  styleUrls: ['./legalentity-indiv-complaint-rpt.component.css']
})
export class LegalentityIndivComplaintRptComponent implements OnInit {

  complaintId: number;

  complaintOpenTime: string;
  indivComplaintProgressBar:boolean;

  indivComplaintDetailsObj: IcomplaintIndivResponseStruct;

  indivComplaintDocLinkArr: IcomplaintIndivDocResponseStruct[];

  qrIdFormFieldsObj: IqrIdFormFieldsResponseStruct[];
  
  formFieldCountToDisp: number;

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  constructor(
    private utilServices: LegalentityUtilService,
    public dialogRef: MatDialogRef<LegalentityIndivComplaintRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IcomplaintIndivReqStruct,
    public legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    private complaintRptServiceAPI: LegalentityComplaintRptService,
    public indivComptDetailsModel: LegalentityIndivComptDetails,
    private authService: AuthService
  ) { 
    dialogRef.disableClose=true;

    this.complaintId = data.complaintId;
    
  }

  popIndivComplaintDetails():void{

    this.indivComplaintProgressBar=true;

    let indivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: this.complaintId
    };

    try {

      this.complaintRptServiceAPI.getIndivComplaintDetails(indivComplaintReqObj)
    .subscribe((data: IcomplaintIndivResponseStruct) => {

     // console.log(data);

      /*if (data.errorOccured){
        this.indivComplaintProgressBar = false;
        this.dialogRef.close();
      }*/
      
      //this.indivComplaintDetailsObj  = data;

      this.indivComptDetailsModel  = data;

      this.indivComplaintDocLinkArr = data.imageData;

      this.indivComplaintProgressBar = false;

      let formFieldDataObj: IqrIdFormFieldsResponseStruct[] = data.formFieldDetails;

      let formFiledDataCount: number; //= data.formFieldDetails.length;

      if (data.formFieldDetails != null){
        formFiledDataCount = data.formFieldDetails.length;
      }
      else{
        formFiledDataCount=0;
      }

      this.qrIdFormFieldsObj=[];
      
      if (formFiledDataCount >= this.formFieldCountToDisp){
        for(let i:number=0;i<this.formFieldCountToDisp;i++){
          this.qrIdFormFieldsObj.push(formFieldDataObj[i]);
        }
      }
      else{
        this.qrIdFormFieldsObj=data.formFieldDetails;
      }

      //console.log(this.qrIdFormFieldsObj);

      //this.qrIdFormFieldsObj=data.formFieldDetails;

      //console.log(this.qrIdFormFieldsObj);

    }, error => {
      this.indivComplaintProgressBar = false;
    });
      
    } catch (error) {
      this.indivComplaintProgressBar = false;
      this.dialogRef.close();
    }

    
  }

  ngOnInit() {
   
    const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole=tokenModel.userRole;

    this.legalEntityMenuPrefModel = this.utilServices.getLegalEntityMenuPrefNames();
     this.popIndivComplaintDetails();

     this.formFieldCountToDisp=4;
  }

}
