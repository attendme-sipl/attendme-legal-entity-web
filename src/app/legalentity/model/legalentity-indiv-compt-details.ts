export class LegalentityIndivComptDetails {

    complaintNumber: string;
    complaintDescription: string;
    complaintDate: string;
    operatorName: string;
    operatorContactNumber: string;
    errorOccured: boolean;
    assignedDate: string;
    inprogressDate:string;
    closedDate: string;
    assignTechnicianName: string;
    assignTechnicianContactNumber:string;
    failureReason: string;
    actionTaken: string;
    imageData: [{
       imageDocTransId: number,
       imageName: string,
       imageTitle: string,
       imageBase64Data: string
  }];
  qrCodeId: number;
  qrId: string;
}
