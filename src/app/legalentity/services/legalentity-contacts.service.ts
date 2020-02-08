import { Injectable } from '@angular/core';
import { LegalentityUtilService } from './legalentity-util.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IaddContactReqUpdatedStruct } from '../legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';

export interface IcontactResponseStruct{
  errorOccurred: boolean,
  contactList: [{
    contactId: number,
    contactPersonName: string,
    contactMobileNumber: string,
    contactEmailId: string,
    contactToBeDisplayed: boolean,
    countryCallingCode: number,
    contactSelected: boolean,
    smsRequired: boolean,
    emailRequired: boolean,
    specificToQrId: boolean
  }]
};

export interface IdeactivateContactReqStruct{
   contactId: number,
   contactActiveStatus: boolean,
   legalEntityId: number,
   branchId: number,
   userId: number,
   userRole: string
};

export interface IcontactRptReqStruct{
   legalEntityId: number,
   branchId: number,
   userId: number,
   userRole: string,
   contactActiveStatus: boolean,
   exportToExcel: boolean,
   complaintMenuName: string,
   technicianMenuName: string,
   equptMenuName: string,
   branchMenuName: string
};

export interface IcontactUpdateReqStruct{
  legalEntityId: number,
  contactId: number,
  contactPersonName: string,
  contactMobileNumber: string,
  contactEmailId: string,
  contactActiveStatus: boolean,
  branchId: number,
  userId: number,
  userRole: string
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityContactsService {

  constructor(
    private utilServicesAPI: LegalentityUtilService,
    private httpClient: HttpClient
  ) { }

  getLegalEntityContactListRpt(contactRptReqObj: IcontactRptReqStruct):Observable<IcontactResponseStruct>{
    return this.httpClient.post<IcontactResponseStruct>(this.utilServicesAPI.legalEntityRestApuURL + "/equptNotificationContactList", contactRptReqObj);
  }

  addContacts(addContactResponseObj:IaddContactReqUpdatedStruct):Observable<any>{
    return this.httpClient.post(this.utilServicesAPI.legalEntityRestApuURL + "/addEquptNotificationContact", addContactResponseObj);
  }

  deactiveContact(deactiveContactReqObj: IdeactivateContactReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServicesAPI.legalEntityRestApuURL + "/activeDeActivateNotificationContact", deactiveContactReqObj);
  }

  getLegalEntityContactListExportToExcel(contactRptReqObj: IcontactRptReqStruct):Observable<any>{
    return this.httpClient.post(this.utilServicesAPI.legalEntityRestApuURL + "/equptNotificationContactList", 
    contactRptReqObj,
    {responseType: 'blob' as 'json'})
    .map(
      (res: Blob) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'});
        return blob;
      }
    );
  }

  updateNotificationContacts(updateContactObj: IcontactUpdateReqStruct): Observable<any>{
    return this.httpClient.post(this.utilServicesAPI.legalEntityRestApuURL + "/updateNotificationContact", updateContactObj);
  }

}
