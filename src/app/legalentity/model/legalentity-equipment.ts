export interface LegalentityEquipment {
  qrCodeId: number,
  branchId: number,
  legalEntityId: number,
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
                    }[]
                

}
