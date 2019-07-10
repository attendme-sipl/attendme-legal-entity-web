export interface LegalentityEquipment {
  qrCodeId: number,
  branchId: number,
  adminApprove: boolean,
  equptActiveStatus: boolean,
  addedByUserId: number,
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
