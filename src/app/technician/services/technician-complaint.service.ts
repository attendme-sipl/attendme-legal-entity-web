import { Injectable } from '@angular/core';
//import { UtilServicesService } from 'src/app/util-services.service';
import { TehnicianUtilService } from '../services/tehnician-util.service';
import { HttpClient } from '@angular/common/http';
import { ItechConciseComplaintReqStruct } from '../technician-dashboard/technician-dashboard.component';
import { Observable, pipe } from 'rxjs';
import { IchangeComplaintStatusReqStruct } from '../technician-report/technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import {IComplaintBodyStruct } from '../../legalentity/services/legalentity-complaint-rpt.service';
import { map } from 'rxjs/operators';


export interface IcomplaintResponseStruct{
  complaintId: number,
  complaintNumber: string,
  equipmentName: string,
  equipmentModel: string,
  equipmentSerial: string,
  complaintOpenDate: string,
  complaintAssignedDate: string,
  complaintClosedDate: string,
  complaintCurrentStatus:string,
  qrCodeId:  number,
  qrId: string
};

export interface ItechnicianConciseComplaintResponse{
   errorOccurred:boolean
   freshComplaintCount: number,
   assignedComplaintCount: number,
   inprogressComplaintCount: number,
   closedComplaintCount: number,
   leadTimeComplaintCount: number
};

export interface ItechnicianAssingedComptRptReqStruct{
   technicianId: number,
   complaintAssignedStatus: boolean,
   complaintStatus: string,
   fromDate: string,
   toDate: string,
   legalEntityId: number,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string,
   complaintTrash: boolean
};

export interface ItechnicianAssingedComptRptResponse{
  errorOccured: boolean,
  complaintList:[{
     complaintId: number,
     complaintNumber: string,
     equipmentName: string,
     equipmentModel: string,
     equipmentSerial: string,
     complaintOpenDate: string,
     complaintAssignedDate: string,
     complaintClosedDate: string,
     complaintCurrentStatus:string,
     qrCodeId:  number,
     qrId: string
  }]
};

export interface ItechnicianChangeStatusReponse{
  errorOccured: boolean,
  complaintStatusExisits: boolean
};

export interface ItechnicianUnResolvedComptConciseResponse{
  errorOccurred: boolean,
  unresolvedUptoCount: number,
  unresolvedMoreCount: number
};

export interface IcomplaintIndivReqStruct{
  complaintId: number
};

export interface IcomplaintIndivResponseStruct{
  complaintNumber: string,
  complaintDescription: string,
  complaintDate: string,
  operatorName: string,
  operatorContactNumber: string
  errorOccured: boolean,
  assignedDate: string,
  inprogressDate:string,
  closedDate: string,
  assignTechnicianName: string,
  assignTechnicianContactNumber:string,
  failureReason: string,
  actionTaken: string,
  imageData: [{
     imageDocTransId: number,
     imageName: string,
     complaintStatus: string,
     imageLink: string
  }],
  qrCodeId: number,
  qrId: string,
  formFieldDetails:[{
    equptFormFieldIndexId: number,
    formFieldId: number,
    formFieldTitle: string,
    formFieldValue: string
}]
};


export interface IinprogressComplaintListRptResponse{
   errorOccured: boolean,
   complaintList:[
                    {
                       complaintId: number,
                       complaintNumber: string,
                       qrcodeId: number,
                       qrId: string, 
                       complaintOpenDateTime: string,
                       complaintInprogressDateTime: string,
                       complaintRegisterByName: string,
                       compalaintRegisterByMobile: string
                    }
                  ]
};

export interface IinprogressComplaintDetailsResponse{
  complaintId: number,
  complaintNumber: string,
  qrcodeId: number,
  qrId: string, 
  complaintOpenDateTime: string,
  complaintInprogressDateTime: string,
  complaintRegisterByName: string,
  compalaintRegisterByMobile: string
};

export interface IcomplaintRptReqStruct{
   technicianId: number,
   complaintStatus: string,
   fromDate: string,
   toDate: string,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string
   legalEntityId: number,
   complaintTrash: boolean
};

export interface IclosedComplaintListRptResponse{
   errorOccured: boolean,
   complaintList: [
                    {
                       complaintId: number,
                       complaintNumber: string,
                       qrcodeId: number,
                       qrId: string, 
                       complaintOpenDateTime: string,
                       complaintClosedDateTime: string,
                       complaintRegisterByName: string,
                       compalaintRegisterByMobile: string
                    }
                  ]
};

export interface IclosedComplaintRptDetails{
  complaintId: number,
  complaintNumber: string,
  qrcodeId: number,
  qrId: string, 
  complaintOpenDateTime: string,
  complaintClosedDateTime: string,
  complaintRegisterByName: string,
  compalaintRegisterByMobile: string
};

@Injectable({
  providedIn: 'root'
})
export class TechnicianComplaintService {

  constructor(
    private util: TehnicianUtilService,
    private httpClient: HttpClient
  ) { }

  getTechnicianComplaintConciseRpt(conciseRtpReqObj: ItechConciseComplaintReqStruct):Observable<ItechnicianConciseComplaintResponse>{
    
    return this.httpClient.post<ItechnicianConciseComplaintResponse>(this.util.legalEntityAPI_URL + "/techComplaintConciseRpt", conciseRtpReqObj);
  }

  getTechnicianAssingnedComptRpt(assignedComplaintReqObj: ItechnicianAssingedComptRptReqStruct):Observable<ItechnicianAssingedComptRptResponse>{
    return this.httpClient.post<ItechnicianAssingedComptRptResponse>(this.util.legalEntityAPI_URL + "/getAssignedComplaints", assignedComplaintReqObj);
  }

  setComplaintStatusChange(complaintStatusChangeReqObj: IchangeComplaintStatusReqStruct):Observable<ItechnicianChangeStatusReponse>{
    return this.httpClient.post<ItechnicianChangeStatusReponse>(this.util.legalEntityAPI_URL + "/techChangeCompStatus", complaintStatusChangeReqObj);
  }

  getUnresolvedDaysRuleBook(legalEntityId: number):Observable<any>{
    return this.httpClient.post(this.util.legalEntityAPI_URL + "/unresolvedRuleBookDetails",{
      legalEntityId: legalEntityId
    });
  }

  getTechnicianUnResolvedConciseRpt(technicianId: number, unresolvedComptDayCount: number, complaintTrash: boolean):Observable<ItechnicianUnResolvedComptConciseResponse>{
    return this.httpClient.post<ItechnicianUnResolvedComptConciseResponse>(this.util.legalEntityAPI_URL + "/unresolveTechnicianComplaintReport", {
      technicianId: technicianId,
      unresolvedComptDayCount: unresolvedComptDayCount
    });
  }

  getIndivComplaintDetails(indivComplaintReqObj: IcomplaintIndivReqStruct):Observable<IcomplaintIndivResponseStruct>{
   
    return this.httpClient.post<IcomplaintIndivResponseStruct>(this.util.legalEntityAPI_URL + "/getComplaintDetail", indivComplaintReqObj);
  }

  getInprogressComplaintsListRtp(inprogressReqObj: IcomplaintRptReqStruct):Observable<IinprogressComplaintListRptResponse>{
    return this.httpClient.post<IinprogressComplaintListRptResponse>(this.util.legalEntityAPI_URL + "/technicianInProgressComplaintReport", inprogressReqObj);
  }

  getClosedComplaintListRpt(closedComplaintReqObj: IcomplaintRptReqStruct):Observable<IclosedComplaintListRptResponse>{
    return this.httpClient.post<IclosedComplaintListRptResponse>(this.util.legalEntityAPI_URL + "/techCloseComplaintReport", closedComplaintReqObj);
  }

  getTechnicianAssingnedComptExportToExcel(assignedComplaintReqObj: ItechnicianAssingedComptRptReqStruct):Observable<any>{
  
    return this.httpClient.post(this.util.legalEntityAPI_URL + "/getAssignedComplaints", 
    assignedComplaintReqObj,
    {responseType: 'blob' as 'json'})
    .pipe(
      map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      )
    );
  }


  getInprogressComplaintsListExportToExcel(inprogressReqObj: IcomplaintRptReqStruct):Observable<any>{
    return this.httpClient.post(this.util.legalEntityAPI_URL + "/technicianInProgressComplaintReport", 
    inprogressReqObj,
    {responseType: 'blob' as 'json'})
    .pipe(
      map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      )
    );
  }

  getClosedComplaintListExportToExcel(closedComplaintReqObj: IcomplaintRptReqStruct):Observable<any>{
    return this.httpClient.post(this.util.legalEntityAPI_URL + "/techCloseComplaintReport", 
    closedComplaintReqObj,
    {responseType: 'blob' as 'json'})
    .pipe(
      map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      )
    );
  }
}
