import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegalentityBranch } from '../model/legalentity-branch';
import { Observable } from 'rxjs';
import { LegalentityUtilService } from './legalentity-util.service';
import { LegalentityAddBranch } from '../model/legalentity-add-branch';
import { LegalentityBranchRulebook } from '../model/legalentity-branch-rulebook';
import { IbranchReqStruct } from './legalentity-user.service';

export interface IbranchListReportResponse{
  errorOccured: boolean,
  branchDetailsList: [{
     branchId: number,
     branchHeadOffice: boolean,
     branchName: string,
     branchContactPersonName: string,
     branchContactMobile: string,
     branchEmail: string,
     branchAddress: string,
     allotedQRIdCount: number,
     branchActiveStatus: boolean
  }]
};

export interface IbranchListDetailsResponse{
  branchId: number,
  branchHeadOffice: boolean,
  branchName: string,
  branchContactPersonName: string,
  branchContactMobile: string,
  branchEmail: string,
  branchAddress: string,
  allotedQRIdCount: number,
  branchActiveStatus: boolean
};

export interface IbranchRptReqStruct{
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string,
  exportToExcel: boolean,
  complaintMenuName: string,
  technicianMenuName: string,
  equptMenuName: string,
  branchMenuName: string
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityBranchService {

  constructor(
    private httpClient: HttpClient,
    private branchModel: LegalentityBranch,
    private util: LegalentityUtilService,
    private addBranchModel: LegalentityAddBranch,
    private branchRuleBookModel: LegalentityBranchRulebook
  ) { }

  addAndGetBranchHeadOffice(branchModel):Observable<LegalentityBranch>
  {
    
  //  console.log(branchModel);

    return this.httpClient.post<LegalentityBranch>(this.util.legalEntityRestApuURL + "/addHeadOfficeDetails",branchModel)
    
    //.pipe(map(branch => {

      //localStorage.setItem('localStorage.setItem',JSON.stringify({
        
        //branchId:branch.branchId,
        //branchName:branch.branchName,
        //branchHeadOffice:branch.branchHeadOffice

      //}));

      //return branch;
 // }));

}

addNewBranchDetails():Observable<LegalentityAddBranch>
{

  //console.log(this.addBranchModel);

  return this.httpClient.post<LegalentityAddBranch>(this.util.legalEntityRestApuURL + "/addOrCreateBranch", this.addBranchModel);
}

getBranchRuleBook():Observable<LegalentityBranchRulebook>
{
  return this.httpClient.post<LegalentityBranchRulebook>(this.util.legalEntityRestApuURL + "/checkBranchCount",this.branchRuleBookModel)
}

getBranchListReport(branchListRptReqObj: IbranchRptReqStruct):Observable<IbranchListReportResponse>{
  return this.httpClient.post<IbranchListReportResponse>(this.util.legalEntityRestApuURL + "/legalEntityBranchReport", branchListRptReqObj);
}

getBranchListExportToExcel(branchListRptReqObj: IbranchRptReqStruct):Observable<any>{
  return this.httpClient.post(this.util.legalEntityRestApuURL + "/legalEntityBranchReport", 
  branchListRptReqObj,
  {responseType: 'blob' as 'json'})
  .map(
    (res: Blob) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
      return blob;
    }
  );
}

}
