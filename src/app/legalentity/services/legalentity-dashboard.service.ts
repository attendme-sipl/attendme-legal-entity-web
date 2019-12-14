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
   userId: number,
   userRole: string,
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

  getQrIdUsageRpt(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<LegalentityQridUsage>{
    return this.httpClient.post<LegalentityQridUsage>(this.util.legalEntityRestApuURL + "/getQrIdUsageDetails", {
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  getComplaintConciseRtp(complaintConciseReqObj: IcomplaintConciseReqObj):Observable< LegalentityComplaintConcise>{
    return this.httpClient.post<LegalentityComplaintConcise>(this.util.legalEntityRestApuURL + "/getConciseEquptComp", complaintConciseReqObj);
  }
 
  getLegalEntityBranchConciseRpt(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string,
    branchActiveStatus: boolean
    ):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/getBranchConciseReport", {
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole,
      branchActiveStatus: branchActiveStatus
    });
  }

  getBrachwiseQRIdConciseRpt(
    legalentity: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<IbranchWiseQrIdConciseReponseStruct>{
    return this.httpClient.post<IbranchWiseQrIdConciseReponseStruct>(this.util.legalEntityRestApuURL + "/branchQrUsageReport", {
      legalEntityId: legalentity,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  getAllottedBranchQrIdListRpt(
    legalEntityId:number,
    branchId: number,
    userId: number,
    userRole: string 
    ):Observable<IallottedBranchQrIdListRptResponse>{
    return this.httpClient.post<IallottedBranchQrIdListRptResponse>(this.util.legalEntityRestApuURL + "/branchQrIdConciseReport",{
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  getBranchUnreslovedComptRpt(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string,
    unresolvedComptDayCount: number,
    complaintTrash: boolean):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/unresolvedComplaintReport", {
      legalEntityId: legalEntityId,
      
      branchId: branchId,
      unresolvedComptDayCount: unresolvedComptDayCount,
      complaintTrash: complaintTrash
    });
  }

  getUnresolvedDaysRuleBook(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/unresolvedRuleBookDetails",{
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }
 
}
