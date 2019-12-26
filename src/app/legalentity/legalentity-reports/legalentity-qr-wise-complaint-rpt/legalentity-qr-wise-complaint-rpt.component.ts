import { Component, OnInit } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-legalentity-qr-wise-complaint-rpt',
  templateUrl: './legalentity-qr-wise-complaint-rpt.component.html',
  styleUrls: ['./legalentity-qr-wise-complaint-rpt.component.css']
})
export class LegalentityQrWiseComplaintRptComponent implements OnInit {

  legalEntityId: number;
  branchId: number;
  userId: number;

  qrCodeId: number;

  equptMenuName: string;
  branchMenuName: string;
  technicianMenuName: string;
  complaintMenuName: string;

  enableProgressBar: boolean;
  totalRecordCount: number=0;

  qrId: string;

  constructor(
    private userModel: LegalentityUser,
    private utilService: LegalentityUtilService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService
  ) {
    iconRegistry.addSvgIcon(
      'refresh-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    )
   }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel = JSON.parse(localStorage.getItem('legalEntityUserDetails'));
      this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
      this.branchId=this.userModel.legalEntityBranchDetails.branchId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
    }
    else {
      this.router.navigate(['legalentity', 'login']);
      return false;
    }

    this.menuModel=this.utilService.getLegalEntityMenuPrefNames();

    this.equptMenuName=this.menuModel.equipmentMenuName;
    this.branchMenuName=this.menuModel.branchMenuName;
    this.technicianMenuName=this.menuModel.technicianMenuName;
    this.complaintMenuName=this.menuModel.complaintMenuName;

    this.utilService.setTitle('Legalentity - QR Id Wise Complaint Report | Attendme');

    let paramSetQrId: string = this.activatedRoute.snapshot.paramMap.get('qrId');

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

  }

}
