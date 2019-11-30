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
  docData: File,
  docDesc: string,
  specificToQr: boolean,
  docActiveStatus: boolean
};

export interface IimportDocumentQrIdReq{
  legalEntityId: number,
  docSpecificToQrId: boolean,
  excelData: File
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityDocumentServiceService {

  constructor(
    private httpClient: HttpClient,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  getLegalEntityDocumentsRpt(legalEntityId: number):Observable<IlegalEntityDocumentRptResponse>{
    return this.httpClient.post<IlegalEntityDocumentRptResponse>(this.utilServiceAPI.legalEntityRestApuURL + "/documentInfo", {
      legalEntityId: legalEntityId
    });
  }

  uploadLegalEntityDocument(uploadedFileObject: IuploadDocumentReq):Observable<any>{
    const formData: FormData = new FormData();

    
    formData.append("docData",uploadedFileObject.docData, uploadedFileObject.docData.name);
    formData.append("legalEntityId", uploadedFileObject.legalEntityId.toString());
    formData.append("docDesc", uploadedFileObject.docDesc);
    formData.append("docActiveStatus", String(uploadedFileObject.docActiveStatus));
    formData.append("specificToQr", String(uploadedFileObject.specificToQr));
    
    formData.append("complaintStatusDocument", uploadedFileObject.docData, uploadedFileObject.docData.name);
    
    const formDataNew: FormData = new FormData();
    
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
    formDataNew.append("userId","7");


   // return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/uploadDocument", formData);

    
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/techChangeCompStatus", formDataNew);

  }

  importDocumentQrIExcel(importDocumentQrIdExcelReqObj: IimportDocumentQrIdReq): Observable<any>{
    const formData: FormData = new FormData();

    formData.append("legalEntityId", importDocumentQrIdExcelReqObj.legalEntityId.toString());
    formData.append("docSpecificToQrId", String(importDocumentQrIdExcelReqObj.docSpecificToQrId));
    formData.append("excelData",importDocumentQrIdExcelReqObj.excelData, importDocumentQrIdExcelReqObj.excelData.name);

    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/importEquipmentExcel", formData);
  }

  requestDocDownloadData(documentId: number): Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/downloadDocument",{
      documentId: documentId
    }, {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'} )
        return blob;
      }
    );
  }

  deleteDocumentRequest(documentId: number):Observable<any>{
    return this.httpClient.patch(this.utilServiceAPI.legalEntityRestApuURL + "/deleteDocument", {
      documentId: documentId
    });
  }

  downloadEquptDocTemplate(legalEntityId: number):Observable<any>{
    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/qrIdExcelTemplate",{
      legalEntityId: legalEntityId
    }, {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'} )
        return blob;
      }
    )
  }
}
