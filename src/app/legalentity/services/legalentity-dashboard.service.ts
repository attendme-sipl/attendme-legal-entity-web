import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';
import { LegalentityQridUsage } from '../model/legalentity-qrid-usage';
import { LegalentityComplaintConcise } from '../model/legalentity-complaint-concise';

export interface IcomplaintConciseReqObj{
   allBranch: boolean,
   legalEntityId: number,
   branchId: number,
   userLastLoginDateTime: string,
   userLoginDateTime:string,
   legalTimeDays: number
};

export interface IbranchWiseQrIdConciseReponseStruct{
  errorOccured: boolean,
  qrIdIssuedCount: number,
  qrIdAssignedCount: number,
  qrIdRemaining: number
};

export interface IallottedBranchQrIdListRptResponse{
  errorOccurred:boolean,
  qrIdBranchList:[{
     branchId: number,
     branchName: string,
     qrIdAllottedCount: number,
     qrIdAssignedCount: number,
     qrIdPendingCount: number
  }]
};

export interface IallottedBranchQrIdListDetailsExtract{
  branchId: number,
  branchName: string,
  qrIdAllottedCount: number,
  qrIdAssignedCount: number,
  qrIdPendingCount: number
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityDashboardService {

  constructor(
    private httpClient: HttpClient,
    private util: LegalentityUtilService 
  ) { }

  getQrIdUsageRpt(legalEntityId: number):Observable<LegalentityQridUsage>{
    return this.httpClient.post<LegalentityQridUsage>(this.util.legalEntityRestApuURL + "/getQrIdUsageDetails", {
      legalEntityId: legalEntityId
    });
  }

  getComplaintConciseRtp(complaintConciseReqObj: IcomplaintConciseReqObj):Observable< LegalentityComplaintConcise>{
    return this.httpClient.post<LegalentityComplaintConcise>(this.util.legalEntityRestApuURL + "/getConciseEquptComp", complaintConciseReqObj);
  }
 
  getLegalEntityBranchConciseRpt(legalEntityId: number, branchActiveStatus: boolean):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/getBranchConciseReport", {
      legalEntityId: legalEntityId,
      branchActiveStatus: branchActiveStatus
    });
  }

  getBrachwiseQRIdConciseRpt(branchId: number):Observable<IbranchWiseQrIdConciseReponseStruct>{
    return this.httpClient.post<IbranchWiseQrIdConciseReponseStruct>(this.util.legalEntityRestApuURL + "/branchQrUsageReport", {
      branchId: branchId
    });
  }

  getAllottedBranchQrIdListRpt(legalEntityId:number):Observable<IallottedBranchQrIdListRptResponse>{
    return this.httpClient.post<IallottedBranchQrIdListRptResponse>(this.util.legalEntityRestApuURL + "/branchQrIdConciseReport",{
      legalEntityId: legalEntityId
    });
  }

  getBranchUnreslovedComptRpt(branchId: number, unresolvedComptDayCount: number):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/unresolvedComplaintReport", {
       branchId: branchId,
       unresolvedComptDayCount: unresolvedComptDayCount
    });
  }

  getUnresolvedDaysRuleBook(legalEntityId: number):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/unresolvedRuleBookDetails",{
      legalEntityId: legalEntityId
    });
  }
 
}
