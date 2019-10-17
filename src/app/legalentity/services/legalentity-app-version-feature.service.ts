import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegalentityUtilService } from './legalentity-util.service';
import { Observable } from 'rxjs';

export interface IversionFeatureResponseStruct{
  errorOccured: boolean,
  versionFeatureList:[{
    featureId: number,
    featureVersion: string,
    featureDescription: string,
    featureDateTime: string,
    featureActiveStatus: boolean,
    featureDetailsList:[{
      featureDetailsId: number,
      featureTitle:  string,
      featureDetails: string,
      featureImageDocPath: string
    }]
  }]
};

export interface IversionUserCheckHistoryReqStruct{
  userId: number,
  allCheckHistory: boolean,
  featureActiveStatus: boolean
};

export interface IversionUserCheckHistoryResponseStruct{
  errorOccured: boolean,
  userCheckHistoryList:[{
    featureId: number,
    checkDateTime: string
  }]
};

@Injectable({
  providedIn: 'root'
})
export class LegalentityAppVersionFeatureService {

  constructor(
    private httpClient: HttpClient,
    private utilServiceAPI: LegalentityUtilService
  ) { }

  getActiveVersionDetails(versionActiveStatus: boolean):Observable<IversionFeatureResponseStruct>{
    return this.httpClient.get<IversionFeatureResponseStruct>(this.utilServiceAPI.legalEntityRestApuURL + "/versionFeatureDetail/" + versionActiveStatus);
  }

  getUserVersionCheckHistory(userVersionCheckHistoryObj: IversionUserCheckHistoryReqStruct): Observable<IversionUserCheckHistoryResponseStruct>{
    return this.httpClient.post<IversionUserCheckHistoryResponseStruct>(this.utilServiceAPI.legalEntityRestApuURL + "/checkVersionHistory", userVersionCheckHistoryObj);
  }
}
