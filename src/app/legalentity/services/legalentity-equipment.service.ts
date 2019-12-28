import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';
import { LegalentityEquipment } from '../model/legalentity-equipment';

export interface IequptFormFieldPrefResponse{

  errorOccured: boolean,
  equptFormFieldTitles:[{
    formFieldId: number,
    formFiledTitleName: string
  }]
};

export interface IaddQrIdDetailsStruct{
   qrCodeId: number,
   branchId: number,
   adminApprove: boolean,
   equptActiveStatus: boolean,
   addedByUserId: number,
   formFieldData:[
                  { 
                   formFieldId: number, 
                   formFieldValue: string
                  }
                ],
   qrContactData:[
                  {
                   contactPersonName: string,
                   contactMobileNumber: string,
                   contactEmailId: string,
                   contactToBeDisplayed: boolean,
                   contactId: number
                  }
                 ]
};

export interface IaddQrIdResponseStruct{
  errorOccured: boolean,
  qrCodeAlreadyAssigned: boolean,
  qrAllotedLimitOver: boolean
};

export interface IbranchWiseQrIdListResStruct{
  errorOccured: boolean,
  qrIdList:[
              { 
                qrCodeId: number,
                qrId: string
              }
            ]
};

export interface IbranchWiseQrIdListReqStruct{
  leglalEntity: number,
  branchId: number,
  userId: number,
  userRole: string,
  qrStatus: boolean,
  qrActiveStatus: boolean
};


export interface IqrIdIndivDetailsResponse{
   errorOccurred: boolean,
   qrIdValid: boolean
   equipmentId: number,
   lastServiceDate: string,
   qrIdData:[{
     formFieldId: number,
     formFieldIndexId: number,  
     formFieldTitle: string,
     formFieldValue: string
   }],
   qrContactData:[{
     contactId: number,
     contactToBeDisplayed: boolean,
     smsRequired: boolean,
     emailRequired: boolean
   }],
   equptDocList:[{
    equptDocId: number
   }]
};

export interface IupdateQrIdDetailsReqStruct{
   qrCodeId: number,
   branchId: number,
   userId: number,
   userRole: string,
   adminApprove: boolean,
   equptActiveStatus: boolean,
   addedByUserId: number,

   formFieldData:[{
    formFieldId: number,
    formFieldValue: string
   }],

   qrContactData: [{
     contactId: number,
     contactToBeDisplayed: boolean,                    
     smsRequired: boolean,
     emailRequired: boolean
   }]
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityEquipmentService {

  constructor(
    private util: LegalentityUtilService,
    private httpclient: HttpClient
  ) { }

  getEquptFormFieldPref(
    legalEntityId: number, 
    branchId: number,
    userId: number,
    userRole: string,
    formFieldActiveStatus: boolean
    ):Observable<IequptFormFieldPrefResponse>{
    return this.httpclient.post<IequptFormFieldPrefResponse>(this.util.legalEntityRestApuURL + "/formFieldPref",{
      legalEntityId: legalEntityId,
      equptFormFieldActiveStatus: formFieldActiveStatus,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  getAddQrIdDetails(qrIdAddDetailsObj:LegalentityEquipment):Observable<IaddQrIdResponseStruct>{
    return this.httpclient.post<IaddQrIdResponseStruct>(this.util.legalEntityRestApuURL + "/addEquipment", qrIdAddDetailsObj);
  }

  getBranchWiseQrId(branchWiseQrIdListReqObj: IbranchWiseQrIdListReqStruct):Observable<IbranchWiseQrIdListResStruct>{
    return this.httpclient.post<IbranchWiseQrIdListResStruct>(this.util.legalEntityRestApuURL + "/branchWiseQrIdList", branchWiseQrIdListReqObj);
  }

  getQrIdIndivDetails(
    qrCodeId: number,
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<IqrIdIndivDetailsResponse>{
    return this.httpclient.post<IqrIdIndivDetailsResponse>(this.util.legalEntityRestApuURL + "/qrIdDetailsWeb", {
      qrCodeId: qrCodeId,
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  updateQrIdDetails(qrIdRequestObj: IupdateQrIdDetailsReqStruct):Observable<any>{
    
    return this.httpclient.patch(this.util.legalEntityRestApuURL + "/updateEquptDetails", qrIdRequestObj);
  }

  updateQrIdDetailsNew(qrIdRequestObj: LegalentityEquipment):Observable<any>{
    console.log(qrIdRequestObj);
    return this.httpclient.patch(this.util.legalEntityRestApuURL + "/updateEquptDetails", qrIdRequestObj);
  }
  
}
