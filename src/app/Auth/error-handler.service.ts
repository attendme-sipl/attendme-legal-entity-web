import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  getErrorStatusMessage(errorStatusId: number): string{
    let errorMessage: string ='';

    switch (errorStatusId) {
      case 401:
        errorMessage="Unauthorized Access";
        break;
    
      default:
        break;
    }

    return errorMessage;
  }
}
