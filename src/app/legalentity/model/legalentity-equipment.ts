export interface LegalentityEquipment {
  qrCodeId: number,
  branchId: number,
  legalEntityId: number,
  userId: number,
  userRole: string,
  adminApprove: boolean,
  equptActiveStatus: boolean,
  addedByUserId: number,
  headOffice: boolean,
  formFieldData:
                    { 
                        formFieldId: number, 
                        formFieldValue: string
                    }[]
                ,
  qrContactData :
                    {
                         contactPersonName: string,
                         contactMobileNumber: string,
                         contactEmailId: string,
                         contactToBeDisplayed: boolean
                    }[],
  equptDocList:{
    equptDocId: number,
    equptDocActiveStatus: boolean,
    docSelected: boolean
  }[]
                

}
