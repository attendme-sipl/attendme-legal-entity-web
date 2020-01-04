import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';

export interface IassignedQrIdRptReq{
   legalEntityId: number,
   branchId: number,
   headOffice: boolean
};

export interface IassignedQrIdRptResponse{
  errorOccurred: boolean,
  qrIdList: [{
     qrCodeId: number,
     qrId: string,
     qrActiveStatus: boolean,
     qrAssignDateTime: string,
     assignedByBranchName: string
  }]
};

export interface IallotQrIdToBranchReqStruct{
   legalEntityId: number,
   assignBranchId: number,
   numOfQRId: number,
   qrIdStatus: boolean,
   qrActiveStatus: boolean,
   assignToBranch: boolean
};

export interface IallotQrIdToBranchResponseStruct{
   numOfQRIdExceed: boolean,
   branchQRAttloted: boolean,
   errorOccured: boolean
};

export interface IavailbleQrIdCountReqStruct{
   legalEntityId: number,
   branchId: number,
   qrActiveStatus: boolean,
   qrAssignStatus: boolean,
   userId: number,
   userRole: string
};

export interface IallotQrIdToBranchNewReq{
   legalEntityId: number,
   branchId: number,
   qrActiveStatus: boolean,
   qrAssignStatus: boolean,
   totalQrAssignCount: number,
   qrAllotStatus: boolean,
   userId: number,
   userRole: string
};

export interface IqrIdRptReqStruct{
   legalEntityId: number,
   branchId: number,
   userId: number,
   userRole: string,
   allBranch: boolean,
   qrActiveStatus: boolean,
   startDateTime: string,
   endDateTime: string,
   lastRecordCount: number,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string
};

export interface IqrIdRptResponseStruct{
  errorOccured: boolean,
  formHeads:[{
     formFieldId: number,
     formFiledTitleName: string
  }],
  qrIdDetailsList:[{
     qrCodeId: string,
     qrId: string,
     qrCodeFileLink: string, 
     branchId: string,
     branchName: string,
     qrAssignDateTime:string,
     formFieldDetails:[{
       formFieldId: number,
       formFieldValue: string
     }],
     complaintCount
  }]
};


@Injectable({
  providedIn: 'root'
})
export class LegalentityQrService {

  constructor(
    private httpClient: HttpClient,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  getAssignedQrIdListRpt(assignedQrIdListRptReqObj: IassignedQrIdRptReq):Observable<IassignedQrIdRptResponse>{
    return this.httpClient.post<IassignedQrIdRptResponse>(this.utilServiceAPI.legalEntityRestApuURL + "/assignedQrIdList", assignedQrIdListRptReqObj);
  }

  allotQrIdToBranch(allotQrIdReqObj: IallotQrIdToBranchReqStruct):Observable<IallotQrIdToBranchResponseStruct>{
    return this.httpClient.post<IallotQrIdToBranchResponseStruct>(this.utilServiceAPI.legalEntityRestApuURL + "/allotQrIdToBranch", allotQrIdReqObj);
  }

  getNumOfQrIdAvailableHeadOffice(availbleQrIdCountReqObj:IavailbleQrIdCountReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/checkAvailableQrId", availbleQrIdCountReqObj);
  }

  getNumOfQrIdAvailableBranchOffice(availbleQrIdCountReqObj:IavailbleQrIdCountReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/checkAvailableQrIdBranch", availbleQrIdCountReqObj);
  }

  allotQrIdtoBrachNew(allotQrIdToBranchReqObj: IallotQrIdToBranchNewReq): Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/allotQrId", allotQrIdToBranchReqObj);
  }

  getQrIdDetailsRpt(qrIdDetailsRtpReqObj: IqrIdRptReqStruct):Observable<IqrIdRptResponseStruct>{
    return this.httpClient.post<IqrIdRptResponseStruct>(this.utilServiceAPI.legalEntityRestApuURL + "/qrIdDetailsListReport", qrIdDetailsRtpReqObj);
  }

  getQrIdDetailsExportToExcel(qrIdDetailsRtpReqObj: IqrIdRptReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/qrIdDetailsListReport", 
    qrIdDetailsRtpReqObj,
    {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
        return blob;
      }
    );
  }
}
