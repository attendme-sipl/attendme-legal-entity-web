import { Component, OnInit } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { TokenModel } from 'src/app/Common_Model/token-model'
import { LegalentityComplaintRptService, IComplaintBodyStruct, IqrIdAllcomplaintRptResponse, IqrIdAllcomplaintDetailsResponse } from '../../services/legalentity-complaint-rpt.service';
import { IcomplaintRptReqStruct } from 'src/app/technician/services/technician-complaint.service';

export interface IqrIdListResponseStruct{
  qrCodeId: number,
  qrId: string
};

@Component({
  selector: 'app-legalentity-qr-wise-complaint-rpt',
  templateUrl: './legalentity-qr-wise-complaint-rpt.component.html',
  styleUrls: ['./legalentity-qr-wise-complaint-rpt.component.css']
})
export class LegalentityQrWiseComplaintRptComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;
  userRole: string;

  qrCodeId: number;

  equptMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  enableProgressBar: boolean;
  totalRecordCount: number=0;

  qrIdListDetailsObj: IqrIdListResponseStruct[];
  complaintStatus: string;
  complaintFilterType: string;

  qrId: string;
  Search: string;

  dataSource;
  qrIdAllComptListCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  displayedColumns: string[]=[
    "srNo",
    "complaintNumber",
    "qrId",
    "regsiteredByName",
    "openDateTime",
    "assignedDateTime",
    "inProgressDateTime",
    "closedDateTime",
    "assignedTechnicianName",
    "actionTaken",
    "failureReason",
    "currentComplaintStatus",
    "statusChangedBy",
    "statusRemark"
  ];

  qrIdComplaintRecords: IqrIdAllcomplaintDetailsResponse[];

  constructor(
    private userModel: LegalentityUser,
    private utilService: LegalentityUtilService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private authService: AuthService,
    private complaintService: LegalentityComplaintRptService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'back-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/keyboard_backspace-24px.svg')
    );
   }


   getQrId(){
     try {
      
      this.utilService.getLegalEntityAlottedQRIdList(
        this.legalEntityId,
        this.branchId,
        this.userId,
        this.userRole,
        true,
        true,
        false
      )
      .subscribe((data: IqrIdListResponseStruct[]) => {

        this.qrIdListDetailsObj=data.map((value, index) => value ? {
          qrCodeId: value['qrCodeId'],
          qrId: value['qrId']
        } : null)
        .filter(value => value.qrCodeId == this.qrCodeId);

        if (this.qrIdListDetailsObj.length > 0){
          this.qrId = this.qrIdListDetailsObj[0]['qrId'];
        }
      });

     
     } catch (error) {
       this.toastService.error("Something went wrong while getting QR Id details");
     }
   }

   popQrComplaintsList(exportToExcel: boolean): void{
     const qrIdComplaintReqObj: IComplaintBodyStruct ={
       allBranch: false,
       branchId: this.branchId,
       branchMenuName: this.branchMenuName,
       complaintMenuName: this.complaintMenuName,
       complaintStatus: '',
       complaintTrash: false,
       equptMenuName: this.equptMenuName,
       exportToExcel: exportToExcel,
       fromDate: null,
       legalEntityId: this.legalEntityId,
       technicianMenuName: this.technicianMenuName,
       toDate: null,
       userId: this.userId,
       userRole: this.userRole
     }

     this.complaintService.getQrIdAllComplaintsRpt(qrIdComplaintReqObj)
     .subscribe((data: IqrIdAllcomplaintRptResponse) => {
       this.qrIdComplaintRecords = data.complaintList;
        this.qrIdComplaintRecords = this.getFilteredComplaintsRecords();

        this.totalRecordCount=this.qrIdComplaintRecords.length;


     });
   }

   getFilteredComplaintsRecords():IqrIdAllcomplaintDetailsResponse[]{

    let complaintStatusFilterValue: string = this.complaintStatus.toLowerCase();

    let complaintTrashFilterValue: boolean;

    switch(this.complaintFilterType)
    {

      case '0':
        complaintTrashFilterValue=false;
        break;
      
      case '1':
        complaintTrashFilterValue=true;
        break;

      default:
        complaintTrashFilterValue=null;
    }


     const filteredComplaintsRecordsObj = this.qrIdComplaintRecords.map((value, index) => value ? {
      complaintId: value['complaintId'],
      complaintNumber: value['complaintNumber'],
      qrCodeId: value['qrCodeId'],
      qrId: value['qrId'],
      regsiteredByName: value['regsiteredByName'],
      registeredByMobileNumber: value['registeredByMobileNumber'],
      assignedTechnicianName: value['assignedTechnicianName'],
      asignedTechnicianMobile: value['asignedTechnicianMobile'], 
      openDateTime: value['openDateTime'],
      assignedDateTime: value['assignedDateTime'],
      inProgressDateTime: value['inProgressDateTime'],
      closedDateTime: value['closedDateTime'],
      actionTaken: value['actionTaken'],
      failureReason: value['failureReason'],
      currentComplaintStatus: value['currentComplaintStatus'],
      complaintTrash: value['complaintTrash'],
      compalintStatusChangeUserId: value['compalintStatusChangeUserId'],
      compalintStatusChangeUserName: value['compalintStatusChangeUserName'],
      complaintStatusRemark: value['complaintStatusRemark'] 
     } : null)
     .filter(value => {
       
        if (complaintStatusFilterValue == 'all' && complaintTrashFilterValue == null){
          return value;
        }
        else if (complaintStatusFilterValue != 'all' && complaintTrashFilterValue == null){
          return value.currentComplaintStatus == complaintStatusFilterValue;
        }
        else if (complaintStatusFilterValue == 'all' && complaintTrashFilterValue != null){
          return value.complaintTrash == complaintTrashFilterValue;
        }
        else if (complaintStatusFilterValue != 'all' && complaintTrashFilterValue != null){
          return (value.currentComplaintStatus == complaintStatusFilterValue) && (value.complaintTrash == complaintTrashFilterValue); 
        }
        
     });

     return filteredComplaintsRecordsObj
   }


  ngOnInit() {

    try {

      const tokenModel: TokenModel = this.authService.getTokenDetails();

    this.legalEntityId=tokenModel.legalEntityId;
    this.branchId=tokenModel.branchId;
    this.userId=tokenModel.userId;
    this.userRole= tokenModel.userRole;

    /*if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
    }
    else {
      this.router.navigate(['legalentity', 'login']);
      return false;
    }*/

    this.menuModel=this.utilService.getLegalEntityMenuPrefNames();

    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilService.setTitle('Legalentity - QR Id Wise Complaint Report | Attendme');

    let paramSetQrId: string = this.activatedRoute.snapshot.paramMap.get('qrId');
    this.qrCodeId=parseInt(paramSetQrId);

    this.getQrId();

    this.complaintStatus="Assigned"
    this.complaintFilterType="0";

    this.popQrComplaintsList(false);

    //to be added after jwt implementation

    /*if (paramSetQrId != ''){
      this.qrCodeId= parseInt(this.activatedRoute.snapshot.paramMap.get('qrId'));

      this.utilService.getLegalEntityAlottedQRIdList(
        this.legalEntityId,
        false,
        true,
        false
        )
        .subscribe((data: string[]) => {

          try {

            const filteredQrIdArray = data.map((value,index) => value? {
              qrCodeId: value['qrCodeId'],
              qrId: value['qrId']
            }: null)
            .filter(value => value.qrCodeId == this.qrCodeId);
            
            if (filteredQrIdArray.length > 0){
              this.qrId=filteredQrIdArray[0]['qrId'];
            }
            
          } catch (error) {
            
          }

        }, error => {
          this.toastService.error("Something went wrong while get QR Id details");
        });

    }*/
      
    } catch (error) {
      this.toastService.error("Something went wrong while loadin QR ID wise " + this.complaintMenuName + " report.","");
    }

    

  }

  

  onBackButtonClick(){
    this.router.navigate(['legalentity','portal','equipment']);
  }

}
