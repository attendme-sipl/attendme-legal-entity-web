export class LegalentityUser {

    legalEntityUserDetails: {
        userId: number,
        legalEntityId: number,
        passwordChange: boolean,
        userFullName: string,
        userRole: string,
        userActiveStatus: true,
        userMobileNumer: string,
        userEmailId: string,
        lastUpdateDateTime: string,
        currentLoginDateTime: string,
        legalEntityName: string,
        legalEntityType: string
    };

    legalEntityBranchDetails:{
        branchHeadOffice: boolean,
        branchId: number,
        branchName: string,
        complaintStageCount: number
    };
}
