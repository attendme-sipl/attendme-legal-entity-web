import { Injectable } from '@angular/core';
import { LegalentityBranch } from '../model/legalentity-branch';

@Injectable({
  providedIn: 'root'
})
export class LegalentityBranchDataService {

  public branchDetails: any;

  constructor() { }
}
