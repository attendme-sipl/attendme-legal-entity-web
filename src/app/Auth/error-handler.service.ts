import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  getErrorStatusMessage(errorStatusId: number): string{
    let errorMessage: string ='';

    switch (errorStatusId) {

      case 400:
        errorMessage="Error Code 400 - Bad Request.";
        break;

      case 401:
        errorMessage="Error Code 401 - Unauthorized.";
        break;
      
      case 403:
        errorMessage="Error Code 403 - Forbidden.";
        break;

      case 404:
        errorMessage="Error Code - 404 Not Found.";
        break;
      
      case 500:
        errorMessage="Error Code - 500 Internal Server Error.";
        break;

      case 502:
        errorMessage="Error Code - 502 Bad Gateway.";
        break;

      case 504:
        errorMessage="Error Code - 504 Gateway Timeout.";
        break;

      case 599:
        errorMessage="Error Code - 599 Network connect timeout error.";
        break;
    
      default:
        errorMessage="Something went wrong while accessing web service resource.";
        break;
    }

    return errorMessage;
  }
}
