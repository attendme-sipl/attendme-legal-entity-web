import { Injectable } from '@angular/core';
//import {UtilServicesService} from 'src/app/util-services.service'
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs'
import { LegalentityUtilService } from './legalentity-util.service';

export interface ItechnicianListRptResponse{
  errorOccurred: boolean,
  technicianList: [{
     technicianId: number,
     technicianActiveStatus: boolean,
     technicianName: string,
     technicianMobileNumber: string,
     technicianEmailId: string
  }]
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityAddTechnicianService {

  constructor(
  private util:LegalentityUtilService,
  private httpClient:HttpClient
  ) { }

 getLegalEntityBranchList(legalEntityId:number, branchActiveSttus:boolean):Observable<any>
  {
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/getBranchList ", {
      legalEntityId:legalEntityId,
      branchActiveStatus:branchActiveSttus
    });
  }

  addTechnicianDetails(technicianDetails:object):Observable<any>
  {
    console.log(technicianDetails);
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/addFullTechnicianDetails", technicianDetails);
  }

  assignBranchToTechnician(technicianId:number,branchIdList:string[]):Observable<any>
  {
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/assignBranchToTechnician", {
      technicianId:technicianId,
      branchIdList: branchIdList
    });
  }

  getTechnicianList(legalEntityId: number):Observable<ItechnicianListRptResponse>{
    return this.httpClient.post<ItechnicianListRptResponse>(this.util.legalEntityRestApuURL + "/technicianReportList", {
      legalEntityId: legalEntityId
    });
  }
}
