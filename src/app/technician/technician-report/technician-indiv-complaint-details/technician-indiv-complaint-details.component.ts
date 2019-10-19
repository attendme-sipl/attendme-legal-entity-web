import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';
import { IUserLoginResponseStruct } from '../../services/technician-login.service';
import { ItechnicianDetailsReponse } from '../../services/tehnician-util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IcomplaintIndivReqStruct, TechnicianComplaintService, IcomplaintIndivResponseStruct } from '../../services/technician-complaint.service';
import { TechnicianIndivComptDetails } from '../../model/technician-indiv-compt-details';
import { TehnicianUtilService } from '../../services/tehnician-util.service';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';

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
  selector: 'app-technician-indiv-complaint-details',
  templateUrl: './technician-indiv-complaint-details.component.html',
  styleUrls: ['./technician-indiv-complaint-details.component.css']
})
export class TechnicianIndivComplaintDetailsComponent implements OnInit {

  technicianId: number;
  complaintId: number;

  indivComplaintProgressBar: boolean;

  indivComplaintDetailsObj: IcomplaintIndivResponseStruct;

  indivComplaintDocLinkArr: IcomplaintIndivDocResponseStruct[];
  equipmentMenuName: string;
  complaintMenuName: string;

  qrIdFormFieldsObj: IqrIdFormFieldsResponseStruct[];
  
  formFieldCountToDisp: number;

  constructor(
    private router: Router,
    private utilServiceAPI: TehnicianUtilService,
    public dialogRef: MatDialogRef<TechnicianIndivComplaintDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IcomplaintIndivReqStruct,
    private complaintRptServiceAPI: TechnicianComplaintService,
    public technicainIndivComplaintModel: TechnicianIndivComptDetails
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

      //console.log(indivComplaintReqObj);
      if (data.errorOccured){
        this.indivComplaintProgressBar = false;
        this.dialogRef.close();
      }
      
      //this.indivComplaintDetailsObj  = data;

      this.technicainIndivComplaintModel = data;

      this.indivComplaintDocLinkArr = data.imageData;

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

      this.indivComplaintProgressBar = false;

    }, error => {
      this.indivComplaintProgressBar = false;
    });
  }

  setLegalEntityMenuPref():void{
    let menuPrefObj: LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));

    const complaintMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'complaints');

    this.complaintMenuName = complaintMenuNameObj[0]['userDefMenuName'];

    /*const technicianMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'technician');*/

    //this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];

    const equipmentMenuNameObj = menuPrefObj.map((value,index) => value? {
      userDefMenuName: value['menuName'],
      ngModelPropMenuName: value['ngModelPropName']
    }: null)
    .filter(value => value.ngModelPropMenuName == 'equipment');

    this.equipmentMenuName = equipmentMenuNameObj[0]['userDefMenuName'];
  }

  ngOnInit() {

    if (localStorage.getItem('technicianUserDetails') != null){
        let technicianUserObj: IUserLoginResponseStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

      if (localStorage.getItem('technicianDetails') != null){
         let technicianObj: ItechnicianDetailsReponse = JSON.parse(localStorage.getItem('technicianDetails'));

         this.technicianId=technicianObj.technicianId;
      }else{
        //this.router.navigate(['technician/login']);
        this.router.navigate(['legalentity','login']);
        return false;  
      }
    }
    else{
      //this.router.navigate(['technician/login']);
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.setLegalEntityMenuPref();

    this.popIndivComplaintDetails();

    this.formFieldCountToDisp=4;
  }

}
