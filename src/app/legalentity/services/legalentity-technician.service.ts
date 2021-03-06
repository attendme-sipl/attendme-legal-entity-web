import { Injectable } from '@angular/core';
//import { UtilServicesService } from 'src/app/util-services.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegalentityUtilService } from './legalentity-util.service';

export interface ItechnicianIndivDetails{
   errorOccured: boolean,
   technicianName: string,
   technicianMobileNumber: string,
   technicianEmailId: string
};

export interface ItechnicianUpdateReqStruct{
  technicianId: number,
  technicianName: string,
  technicianMobileNumber: string,
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string
};


@Injectable({
  providedIn: 'root'
})
export class LegalentityTechnicianService {

  constructor(
    private util:LegalentityUtilService,
    private httpClient: HttpClient
  ) { }

  getTechnicianNameList(
    legalEntityId: number, 
    branchId: number,
    userId: number,
    userRole: string,
    technicianActiveStatus: boolean
    ):Observable<any>
  {
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/getTechnicianList",{
      legalEntityId: legalEntityId,
      technicianActiveStatus: technicianActiveStatus,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  getTechnicianDetails(
    technicianId: number,
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<ItechnicianIndivDetails>{
    return this.httpClient.post<ItechnicianIndivDetails>(this.util.legalEntityRestApuURL + "/individualTechDetail",{
      technician: technicianId,
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  updateTechnicianDetails(updateTechnicianReqObj:ItechnicianUpdateReqStruct):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL+"/updateTechnicianDetails", updateTechnicianReqObj);
  }

  deleteTechnicianUser(
    technicianId: number,
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<any>{
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/deleteTechnician",{
      technician: technicianId,
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }
}
