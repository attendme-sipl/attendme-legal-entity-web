import { Injectable } from '@angular/core';
import { LegalentityUtilService } from './legalentity-util.service';
import { HttpClient } from '@angular/common/http';
import { IopenComplaintRtpReqStruct, IAssingTechnicianDialogData } from '../legalentity-reports/legalentity-open-compt-rpt/legalentity-open-compt-rpt.component';
import { Observable } from 'rxjs';
import { utils } from 'protractor';

export interface IopenComplaintRptResponseStruct{
  errorOccured: boolean,
  complaintList:[{
     complaintId: number,
     complaintNumber: string,
     complaintOpenDateTime: string,
     qrId: string,
     qrCodeId: number,
     deviceUserName: string,
     deviceUserMobileNumber: string,
     complaintTrash: boolean
  }]
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

export interface IassignComplaintStructure {
  complaintId: number,
  complaintNumber: string,
  complaintOpenDateTime: string,
  complaintAssignedDateTime: string,
  assingedToTechncianName: string,
  equipmentName: string,
  equipmentModel: string,
  equipmentSerial: string
};

export interface IComplaintBodyStruct
{
  allBranch: boolean,
  branchId: number,
  legalEntityId: number,
  complaintStatus: string,
  fromDate: string,
  toDate: string,
  exportToExcel: boolean,
  complaintMenuName: string,
  technicianMenuName: string,
  equptMenuName: string,
  branchMenuName: string,
  complaintTrash: boolean
};

export interface IComplaintBodyStructForExcelRpt{
  allBranch: boolean,
  branchId: number,
  legalEntityId: number,
  complaintStatus: string,
  fromDate: string,
  toDate: string,
  complaintMenuName: string,
  technicianMenuName: string
};

export interface IassignComplaintStructure {
  complaintId: number,
  complaintNumber: string,
  complaintOpenDateTime: string,
  complaintAssignedDateTime: string,
  assingedToTechncianName: string,
  equipmentName: string,
  equipmentModel: string,
  equipmentSerial: string
};

export interface IAssingnComplaintResponse {
  errorOccurred: boolean,
  complaintList: [{
     complaintId: number,
     complaintNumber: string,
     complaintOpenDateTime: string,
     complaintAssignedDateTime: string,
     assingedToTechncianName: string,
     equipmentName: string,
     equipmentModel: string,
     equipmentSerial: string,
     qrId: string,
     qrCodeId: number,
     complaintTrash: boolean
  }]
};

export interface IComplaintIdStruct{
  complaintId:number,
  complaintNumber: string,
  equipmentMenuName: string,
  technicianMenuName:string,
  complaintMenuName:string,
  errorOccured: boolean
};

export interface IinprogressComptRptResponse{
  errorOccurred: boolean,
  complaintList: [{
     complaintId: string,
     complaintNumber: string,
     qrCodeId: string,
     qrId: string,
     regsiteredByName: string,
     registeredByMobileNumber: string,
     inprogressDateTime: string,
     complaintTrash: boolean
  }]
};

export interface IinprogressComptListResponse{
  complaintId: string,
     complaintNumber: string,
     qrCodeId: string,
     qrId: string,
     regsiteredByName: string,
     registeredByMobileNumber: string,
     inprogressDateTime: string,
     complaintTrash: boolean
};

export interface IclosedComplaintListRptResponse{
  errorOccurred: boolean,
  complaintList: [{
     complaintId: number,
     complaintNumber: string,
     qrCodeId: number,
     qrId: string,
     regsiteredByName: string,
     registeredByMobileNumber: string,
     closedDateTime: string,
     actionTaken: string,
     failureReason: string
  }]
};

export interface IclosedComplaintListDetailsResponse{
  complaintId: number,
  complaintNumber: string,
  qrCodeId: number,
  qrId: string,
  regsiteredByName: string,
  registeredByMobileNumber: string,
  closedDateTime: string,
  actionTaken: string,
  failureReason: string
};

export interface IqrIdAllcomplaintRptResponse{
  errorOccurred: boolean,
  complaintList: [{
     complaintId: number,
     complaintNumber: string,
     qrCodeId: number,
     qrId: string,
     regsiteredByName: string,
     registeredByMobileNumber: string,
     assignedTechnicianName: string,
     asignedTechnicianMobile: string, 
     openDateTime: string,
     assignedDateTime: string,
     inProgressDateTime: string,
     closedDateTime: string,
     actionTaken: string,
     failureReason: string,
     currentComplaintStatus: string
  }]
};

export interface IqrIdAllcomplaintDetailsResponse{
  complaintId: number,
  complaintNumber: string,
  qrCodeId: number,
  qrId: string,
  regsiteredByName: string,
  registeredByMobileNumber: string,
  assignedTechnicianName: string,
  asignedTechnicianMobile: string, 
  openDateTime: string,
  assignedDateTime: string,
  inProgressDateTime: string,
  closedDateTime: string,
  actionTaken: string,
  failureReason: string,
  currentComplaintStatus: string
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityComplaintRptService {

  constructor(
    private util:LegalentityUtilService,
    private httpClient: HttpClient
  ) { }

  getOpenComplaintRtp(openComplaintRptReqObj: IopenComplaintRtpReqStruct):Observable<IopenComplaintRptResponseStruct>{
    
    return this.httpClient.post<IopenComplaintRptResponseStruct>(this.util.legalEntityRestApuURL + "/getOpenComplaints", openComplaintRptReqObj);
  }


  getOpenComplaintRtpToExcel(openComplaintRptReqObj: IopenComplaintRtpReqStruct): Observable<any>{
 console.log(openComplaintRptReqObj);
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/getOpenComplaints",openComplaintRptReqObj, 
    {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'} )
        return blob;
      }
    )
  }

  getIndivComplaintDetails(indivComplaintReqObj: IcomplaintIndivReqStruct):Observable<IcomplaintIndivResponseStruct>{
   
    return this.httpClient.post<IcomplaintIndivResponseStruct>(this.util.legalEntityRestApuURL + "/getComplaintDetail", indivComplaintReqObj);
  }

  assignTechnicianToComplaint(complaintDetails:IAssingTechnicianDialogData):Observable<any>{
    // console.log(complaintDetails);
    return this.httpClient.post(this.util.legalEntityRestApuURL + "/assignTechToComplaint", complaintDetails);
     
    }

    getAssingedComplaintsListRpt(reportReqBodyObj: IComplaintBodyStruct):Observable<IAssingnComplaintResponse> {
      //console.log(reportReqBodyObj)
      return this.httpClient.post<IAssingnComplaintResponse>(this.util.legalEntityRestApuURL + "/assignComplaintReport", reportReqBodyObj);
    }

    getIprogressComptListRpt(inprogressComptRtpReqObj: IComplaintBodyStruct):Observable<IinprogressComptRptResponse>{
      return this.httpClient.post<IinprogressComptRptResponse>(this.util.legalEntityRestApuURL + "/inProgressComplaintList", inprogressComptRtpReqObj);
    }

    getClosedComplaintListRpt(closedComplaintReqObj:IComplaintBodyStruct):Observable<IclosedComplaintListRptResponse>{
      return this.httpClient.post<IclosedComplaintListRptResponse>(this.util.legalEntityRestApuURL + "/closeComplaintsList", closedComplaintReqObj);
    }

    getQrIdAllComplaintsRpt(qrIdAllComplaintRtpReqObj: IComplaintBodyStruct):Observable<IqrIdAllcomplaintRptResponse>{
      return this.httpClient.post<IqrIdAllcomplaintRptResponse>(this.util.legalEntityRestApuURL + "/complaintListReport", qrIdAllComplaintRtpReqObj);
    }

    exportToExcelQrIdAllComptRpt(qrIdAllComplaintRtpReqObj: IComplaintBodyStruct):Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/complaintsExcelReport",
      qrIdAllComplaintRtpReqObj,
      {responseType: 'blob' as 'json'}
      )
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel'} );
          return blob;
        }
      );
    }

    getAssingedComplaintsListExportToExcel(reportReqBodyObj: IComplaintBodyStruct):Observable<any>{
      
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/assignComplaintReport", 
      reportReqBodyObj,
      {responseType: 'blob' as 'json'})
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      );
    }

    getIprogressComptListExportToExcel(inprogressComptRtpReqObj: IComplaintBodyStruct):Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/inProgressComplaintList", 
      inprogressComptRtpReqObj,
      {responseType: 'blob' as 'json'})
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      );
    }

    getClosedComplaintListExportToExcel(closedComplaintReqObj:IComplaintBodyStruct):Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/closeComplaintsList", 
      closedComplaintReqObj,
      {responseType: 'blob' as 'json'}
      )
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      );
    }

    getQrIdAllComplaintsExportToExcel(qrIdAllComplaintRtpReqObj: IComplaintBodyStruct):Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/complaintListReport", 
      qrIdAllComplaintRtpReqObj,
      {responseType: 'blob' as 'json'})
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
          return blob;
        }
      );
    }

    trashComplaint(complaintId: number, trashComplaint: boolean): Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/complaintTrash",{
        complaintId: complaintId,
        trashComplaint: trashComplaint
      });
    }
    
}
