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
}
