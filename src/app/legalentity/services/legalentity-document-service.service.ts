import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';

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

export interface IuploadDocumentReq{
  legalEntityId: number,
  docData: File,
  docDesc: string,
  specificToQr: boolean,
  docActiveStatus: boolean
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
    formData.append("specificToQr", String(uploadedFileObject.docActiveStatus));
    formData.append("docActiveStatus", String(uploadedFileObject.docActiveStatus));

    return this.httpClient.post(this.utilServiceAPI.legalEntityRestApuURL + "/uploadDocument", formData);

  }
}
