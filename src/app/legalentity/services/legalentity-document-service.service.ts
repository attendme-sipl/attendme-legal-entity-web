import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/render3/util';

export interface IlegalEntityDocumentRptResponse{
  errorOccurred: boolean,
  documentList: [{
    docId: number,
    docPath: string,
    docName: string,
    docFileType: string,
    docFileSize: number,
    docDesc: string,
    docCreationDate: string,
    docActiveStatus: boolean
  }]
};

export interface IlegalEntityDocumentRptDetails{
  docId: number,
  docPath: string,
  docName: string,
  docFileType: string,
  docFileSize: number,
  docDesc: string,
  docCreationDate: string,
  docActiveStatus: boolean
};

export interface IlegalEntityDocumentRptWithSelect{
  equptDocId: number,
  docPath: string,
  docName: string,
  docFileType: string,
  docFileSize: number,
  docDesc: string,
  docCreationDate: string,
  equptDocActiveStatus: boolean,
  docSelected: boolean
};

export interface IuploadDocumentReq{
  legalEntityId: number,
  branchId: number,
  userId: number,
  userRole: string,
  docData: File,
  docDesc: string,
  specificToQr: boolean,
  docActiveStatus: boolean
};

export interface IimportDocumentQrIdReq{
  legalEntityId: number,
  docSpecificToQrId: boolean,
  excelData: File,
  branchId: number,
  userId: number,
  userRole: string
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityDocumentServiceService {

  constructor(
    private httpClient: HttpClient,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  getLegalEntityDocumentsRpt(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<IlegalEntityDocumentRptResponse>{
    return this.httpClient.post<IlegalEntityDocumentRptResponse>(this.utilServiceAPI.legalEntityRestApuURL + "/documentInfo", {
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  uploadLegalEntityDocument(uploadedFileObject: IuploadDocumentReq):Observable<any>{
    const formData: FormData = new FormData();

    
    formData.append("docData",uploadedFileObject.docData, uploadedFileObject.docData.name);
    formData.append("legalEntityId", uploadedFileObject.legalEntityId.toString());
    formData.append("branchId", uploadedFileObject.branchId.toString());
    formData.append("userId", uploadedFileObject.userId.toString());
    formData.append("userRole", uploadedFileObject.userRole);
    formData.append("docDesc", uploadedFileObject.docDesc);
    formData.append("docActiveStatus", String(uploadedFileObject.docActiveStatus));
    formData.append("specificToQr", String(uploadedFileObject.specificToQr));
    
    //formData.append("complaintStatusDocument", uploadedFileObject.docData, uploadedFileObject.docData.name);
    
    /*const formDataNew: FormData = new FormData();
    
    formDataNew.append("complaintStatusDocument",uploadedFileObject.docData);
    formDataNew.append("complaintId","1814");
    formDataNew.append("technicianId","4");
    formDataNew.append("complaintStatus","closed");
    formDataNew.append("complaintMenuName","Complaint");
    formDataNew.append("technicianMenuName","Engineer");
    formDataNew.append("equipmentMenuName","Machine");
    formDataNew.append("legalEntityUserId","7");
    formDataNew.append("androidPortalKey","false");
    formDataNew.append("complaintStageCount","4");
    formDataNew.append("failureReason","NA");
    formDataNew.append("actionTaken","NA");
    formDataNew.append("userId","7"); */


    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/uploadDocument", formData);

    
    //return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/techChangeCompStatus", formDataNew);

  }

  importDocumentQrIExcel(importDocumentQrIdExcelReqObj: IimportDocumentQrIdReq): Observable<any>{
    const formData: FormData = new FormData();

    formData.append("legalEntityId", importDocumentQrIdExcelReqObj.legalEntityId.toString());
    formData.append("branchId", importDocumentQrIdExcelReqObj.branchId.toString());
    formData.append("userId", importDocumentQrIdExcelReqObj.userId.toString());
    formData.append("userRole", importDocumentQrIdExcelReqObj.userRole);
    formData.append("docSpecificToQrId", String(importDocumentQrIdExcelReqObj.docSpecificToQrId));
    formData.append("excelData",importDocumentQrIdExcelReqObj.excelData, importDocumentQrIdExcelReqObj.excelData.name);

    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/importEquipmentExcel", formData);
  }

  requestDocDownloadData(
    documentId: number,
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ): Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/downloadDocument",{
      documentId: documentId,
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    }, {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'} )
        return blob;
      }
    );
  }

  deleteDocumentRequest(
    documentId: number,
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/deleteDocument", {
      documentId: documentId,
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      userRole: userRole
    });
  }

  downloadEquptDocTemplate(
    legalEntityId: number,
    branchId: number,
    userId: number,
    userRole: string
    ):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/qrIdExcelTemplate",{
      legalEntityId: legalEntityId,
      branchId: branchId,
      userId: userId,
      uerRole: userRole
    }, {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'} )
        return blob;
      }
    );
  }
}
