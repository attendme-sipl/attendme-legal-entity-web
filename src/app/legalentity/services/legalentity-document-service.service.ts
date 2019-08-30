import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LegalentityDocumentServiceService {

  constructor(
    private httpClient: HttpClient
  ) { }
}
