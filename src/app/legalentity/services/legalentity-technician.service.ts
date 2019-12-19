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
  technicianMobileNumber: string
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
      technicianActiveStatus: technicianActiveStatus
    });
  }

  getTechnicianDetails(technicianId: number):Observable<ItechnicianIndivDetails>{
    return this.httpClient.post<ItechnicianIndivDetails>(this.util.legalEntityRestApuURL + "/individualTechDetail",{
      technician: technicianId
    });
  }

  updateTechnicianDetails(updateTechnicianReqObj:ItechnicianUpdateReqStruct):Observable<any>{
    return this.httpClient.patch(this.util.legalEntityRestApuURL+"/updateTechnicianDetails", updateTechnicianReqObj);
  }

  deleteTechnicianUser(technicianId: number):Observable<any>{
    return this.httpClient.patch(this.util.legalEntityRestApuURL + "/deleteTechnician",{
      technician: technicianId
    });
  }
}
