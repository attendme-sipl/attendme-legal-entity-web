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
  complaintId: number,
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string
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

export interface IComplaintReportStruct{

  complaintId: number,
  complaintNumber: string,
  complaintOpenDateTime: string,
  equipmentName: string,
  equipmentModel: string,
  equipmentSerial: string

};

export interface IComplaintBodyStruct
{
  allBranch: boolean,
  branchId: number,
  legalEntityId: number,
  userId: number,
  userRole: string,
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
     failureReason: string,
     complaintTrash: boolean
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
     currentComplaintStatus: string,
     complaintTrash: boolean,
     compalintStatusChangeUserId: number,
     compalintStatusChangeUserName: string,
     complaintStatusRemark: string 
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
  currentComplaintStatus: string,
  complaintTrash: boolean,
  compalintStatusChangeUserId: number,
  compalintStatusChangeUserName: string,
  complaintStatusRemark: string 
};

export interface IbranchComplaintConciseReqStruct{
   legalEntityId: number,
   branchId: number,
   userId: number,
   userRole: string,
   branchActiveStatus: boolean,
   complaintTrash: boolean,
   unresolvedComptDaysCount: number
};

export interface IbranchComplaintConciseResponse{
  errorOccurred: boolean,
  branchComptDetails: [{
     branchId: number,
     branchName: string,
     openComplaintCount: number,
     assignedComplaintCount: number,
     inprogressComplaintCount: number,
     closedComplaintCount: number,
     unresolvedUptoCount: number,
     unreslovedMoreThanCount: number,
     complaintTrashCount: number
  }]
};

export interface IunresolvedComplaintReqStruct{
  allBranch: boolean,
  branchId: number,
  legalEntityId: number,
  userId: number,
  userRole: string,
  unresolvedDayCount: number,
  exportToExcel: boolean,
  complaintMenuName: string,
  technicianMenuName: string,
  equptMenuName: string,
  branchMenuName: string,
  complaintTrash: boolean,
  unresolvedMoreThanUpToDays: boolean
};

export interface IunresolvedComplaintResponseStruct{
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
    inprogressDateTime: string,
    currentComplaintStatus: string,
    complaintTrash: boolean
  }]
};

export interface IactionTakenReqData{
  complaintId: number,
  complaintStatus: string,
  complaintMenuName: string,
  technicianMenuName: string,
  equipmentMenuName: string,
  legalEntityUserId: number
  complaintStageCount: number,
  failureReason: string,
  actionTaken: string,
  complaintStatusDocument: File[],
  userId: number,
  userFullName: string,
  complaintClosedRemark: string,
  legalEntityId: number,
  branchId: number,
  userRole: string,
  technicianId: number,
  statusRemark: string,
  reqComptStatus: string,
  complaintAssignStatus: boolean
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
   
    let params = new URLSearchParams();

    //let indivComplatDetailsForm: FormData = new FormData();

    //indivComplatDetailsForm.append("complaintId", indivComplaintReqObj.complaintId.toString());

    for(let key in indivComplaintReqObj){
     // console.log(key);

     if (key != 'complaintId'){
      params.set(key, indivComplaintReqObj[key]);
     }

      
    }


    return this.httpClient.get<IcomplaintIndivResponseStruct>(this.util.legalEntityRestApuURL + "/getComplaintDetail/" + indivComplaintReqObj.complaintId + "?" + params);
  }

  assignTechnicianToComplaint(complaintDetails: IactionTakenReqData):Observable<any>{
    // console.log(complaintDetails);

    const actionTakenFormData: FormData = new FormData();

    actionTakenFormData.append("complaintId", complaintDetails.complaintId.toString());
    actionTakenFormData.append("technicianId", complaintDetails.technicianId.toString());
    actionTakenFormData.append("complaintStatus", complaintDetails.complaintStatus.toString());
    actionTakenFormData.append("complaintAssignStatus", complaintDetails.complaintAssignStatus.toString());
    actionTakenFormData.append("equipmentMenuName", complaintDetails.equipmentMenuName.toString());
    actionTakenFormData.append("complaintMenuName", complaintDetails.complaintMenuName.toString());
    actionTakenFormData.append("technicianMenuName", complaintDetails.technicianMenuName.toString());
    actionTakenFormData.append("legalEntityId", complaintDetails.legalEntityId.toString());
    actionTakenFormData.append("branchId", complaintDetails.branchId.toString());
    actionTakenFormData.append("userId", complaintDetails.userId.toString());
    actionTakenFormData.append("userRole", complaintDetails.userRole.toString());

    if (complaintDetails.complaintStatusDocument.length > 0){
      for (let i: number=0; i <= complaintDetails.complaintStatusDocument.length-1; i++){
        actionTakenFormData.append("complaintStatusDocument", complaintDetails.complaintStatusDocument[i],complaintDetails.complaintStatusDocument[i].name );
      }
    }
    else{
      let dummyFileDate: File;
      actionTakenFormData.append("complaintStatusDocument", dummyFileDate);
    }

    if (complaintDetails.statusRemark ! = null){
      actionTakenFormData.append("statusRemark", complaintDetails.statusRemark.toString());
    }
    else{
      actionTakenFormData.append("statusRemark", '');
    }


    return this.httpClient.post(this.util.legalEntityRestApuURL + "/assignTechToComplaint", actionTakenFormData);
     
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

    trashComplaint(
      complaintId: number, 
      trashComplaint: boolean,
      legalEntityId: number,
      branchId: number,
      userId: number,
      userRole: string
      ): Observable<any>{
      return this.httpClient.post(this.util.legalEntityRestApuURL + "/complaintTrash",{
        complaintId: complaintId,
        trashComplaint: trashComplaint,
        legalEntityId: legalEntityId,
        branchId: branchId,
        userId: userId,
        userRole: userRole
      });
    }

    getBranchComplaintConciseRpt(branchComptConciseReqObj: IbranchComplaintConciseReqStruct): Observable<IbranchComplaintConciseResponse>{
      return this.httpClient.post<IbranchComplaintConciseResponse>(this.util.legalEntityRestApuURL + "/branchComplaintConciseDetailList", branchComptConciseReqObj);
    }

    getUnresolvedComplaintRpt(unresolvedComplaintReqObj: IunresolvedComplaintReqStruct): Observable<IunresolvedComplaintResponseStruct>{
      return this.httpClient.post<IunresolvedComplaintResponseStruct>(this.util.legalEntityRestApuURL + "/legalEntityUnresolvedComplaintReport", unresolvedComplaintReqObj);
    }

    exportToExcelUnresolvedComplaintRpt(unresolvedComplaintReqObj: IunresolvedComplaintReqStruct): Observable<any>{
      //return this.httpClient.post<IunresolvedComplaintResponseStruct>(this.util.legalEntityRestApuURL + "/legalEntityUnresolvedComplaintReport", unresolvedComplaintReqObj);

      return this.httpClient.post(this.util.legalEntityRestApuURL + "/legalEntityUnresolvedComplaintReport",
      unresolvedComplaintReqObj,
      {responseType: 'blob' as 'json'}
      )
      .map(
        (res: Blob) => {
          var blob = new Blob([res], {type: 'application/vnd.ms-excel'} );
          return blob;
        }
      );
    }

    changeComptStatusLeUser(complaintDetails: IactionTakenReqData): Observable<any>{
      const actionTakenFormData: FormData = new FormData();

      actionTakenFormData.append("complaintId", complaintDetails.complaintId.toString());
      actionTakenFormData.append("complaintStatus", complaintDetails.complaintStatus.toString());
      actionTakenFormData.append("complaintMenuName", complaintDetails.complaintMenuName.toString());
      actionTakenFormData.append("technicianMenuName", complaintDetails.technicianMenuName.toString());
      actionTakenFormData.append("equipmentMenuName", complaintDetails.equipmentMenuName.toString());
      actionTakenFormData.append("legalEntityUserId", complaintDetails.legalEntityId.toString());
      actionTakenFormData.append("complaintStageCount", complaintDetails.complaintStageCount.toString());
    
      if (complaintDetails.failureReason != null || complaintDetails.failureReason != ''){
        actionTakenFormData.append("failureReason", complaintDetails.failureReason.toString());
      }

      if (complaintDetails.actionTaken != null || complaintDetails.actionTaken != ''){
        actionTakenFormData.append("actionTaken", complaintDetails.actionTaken.toString());
      }

      if (complaintDetails.complaintStatusDocument.length != 0){
        for (let i: number=0; i <= complaintDetails.complaintStatusDocument.length-1; i++){
          actionTakenFormData.append("complaintStatusDocument", complaintDetails.complaintStatusDocument[i],complaintDetails.complaintStatusDocument[i].name );
        }
      }
      else{
        let dummyFileDate: File;
        actionTakenFormData.append("complaintStatusDocument", dummyFileDate);
      }

      actionTakenFormData.append("userId", complaintDetails.userId.toString());
      actionTakenFormData.append("userFullName", complaintDetails.userFullName.toString());

      if (complaintDetails.complaintClosedRemark != null || complaintDetails.complaintClosedRemark != ''){
        actionTakenFormData.append("complaintClosedRemark", complaintDetails.complaintClosedRemark.toString());
      }

      actionTakenFormData.append("legalEntityId", complaintDetails.legalEntityId.toString());
      actionTakenFormData.append("branchId", complaintDetails.branchId.toString());
      actionTakenFormData.append("userRole", complaintDetails.userRole.toString());

      return this.httpClient.post(this.util.legalEntityRestApuURL + "/legalEntityAdminChangeCompStatus", actionTakenFormData);
       
    }
    
}
