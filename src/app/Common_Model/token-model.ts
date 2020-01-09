export class TokenModel {
    legalEntityId: number;
    legalEntityName: string;
    legalEntityType: string;
    userId: number;
    userRole: string;
    userFullName: string;
    branchId: number;
    branchName: string;
    branchHeadOffice: boolean;
    complaintStageCount: number;
    passwordChange: boolean;
    technicianId: number;
    technicianName: string;
    ///technicianCreationDateTime: string;
    technicianActiveStatus: boolean;
    sub: string;
    userMobileNumber: string;
}
