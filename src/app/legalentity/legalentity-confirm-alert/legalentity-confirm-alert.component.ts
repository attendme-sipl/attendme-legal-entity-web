import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAlertData } from '../legalentity-assign-technician/legalentity-assign-technician.component';

export interface IConfirmAlertStruct{
 alertMessage:string,
 confirmBit: boolean
};

@Component({
  selector: 'app-legalentity-confirm-alert',
  templateUrl: './legalentity-confirm-alert.component.html',
  styleUrls: ['./legalentity-confirm-alert.component.css']
})
export class LegalentityConfirmAlertComponent implements OnInit {

  alertMsg: string;

  constructor(
    public dialogRef:MatDialogRef<LegalentityConfirmAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data:IConfirmAlertStruct
  ) { 
    this.alertMsg = data.alertMessage;

    dialogRef.disableClose = true;
  }

  onButtonClick(userSelectedConfirmBit:boolean):void{

    this.data.confirmBit = userSelectedConfirmBit;

    this.dialogRef.close();

  }

  ngOnInit() {
  }

}
