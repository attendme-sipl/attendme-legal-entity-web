import { Component, OnInit, inject, Inject } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IcomplaintIndivReqStruct, LegalentityComplaintRptService, IcomplaintIndivResponseStruct } from '../../services/legalentity-complaint-rpt.service';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityIndivComptDetails } from '../../model/legalentity-indiv-compt-details';

export interface IcomplaintIndivDocResponseStruct{
   imageDocTransId: number,
   imageName: string,
   imageTitle: string,
   imageBase64Data: string
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
  

  constructor(
    private utilServices: LegalentityUtilService,
    public dialogRef: MatDialogRef<LegalentityIndivComplaintRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IcomplaintIndivReqStruct,
    public legalEntityMenuPrefModel: LegalentityMenuPrefNames,
    private complaintRptServiceAPI: LegalentityComplaintRptService,
    public indivComptDetailsModel: LegalentityIndivComptDetails
  ) { 
    dialogRef.disableClose=true;

    this.complaintId = data.complaintId;
    
  }

  popIndivComplaintDetails():void{

    this.indivComplaintProgressBar=true;

    let indivComplaintReqObj: IcomplaintIndivReqStruct = {
      complaintId: this.complaintId
    };

    this.complaintRptServiceAPI.getIndivComplaintDetails(indivComplaintReqObj)
    .subscribe((data: IcomplaintIndivResponseStruct) => {

      //console.log(data);

      if (data.errorOccured){
        this.indivComplaintProgressBar = false;
        this.dialogRef.close();
      }
      
      //this.indivComplaintDetailsObj  = data;

      this.indivComptDetailsModel  = data;

      this.indivComplaintDocLinkArr = data.imageData;

      this.indivComplaintProgressBar = false;

    }, error => {
      this.indivComplaintProgressBar = false;
    });
  }

  ngOnInit() {

    this.legalEntityMenuPrefModel = this.utilServices.getLegalEntityMenuPrefNames();
     this.popIndivComplaintDetails();
  }

}
