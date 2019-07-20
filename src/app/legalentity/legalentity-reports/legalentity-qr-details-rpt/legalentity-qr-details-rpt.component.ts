import { Component, OnInit } from '@angular/core';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LegalentityUser } from '../../model/legalentity-user';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityQrService, IqrIdRptReqStruct, IqrIdRptResponseStruct } from '../../services/legalentity-qr.service';

@Component({
  selector: 'app-legalentity-qr-details-rpt',
  templateUrl: './legalentity-qr-details-rpt.component.html',
  styleUrls: ['./legalentity-qr-details-rpt.component.css']
})
export class LegalentityQrDetailsRptComponent implements OnInit {

  legalEntityId: number;
  branchId: number;

  equipmentMenuName: string;

  constructor(
    private utileServiceAPI: LegalentityUtilService,
    private router: Router,
    private toastService: ToastrService,
    private userModel: LegalentityUser,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private menuModel: LegalentityMenuPrefNames,
    private qrIdServiceAPI: LegalentityQrService
  ) {
    iconRegistry.addSvgIcon(
      "refresh-icon",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
    );
   }

   popQrIdDetailsRpt():void{
     const qrIdDetailsRptReqObj: IqrIdRptReqStruct = {
       allBranch: false,
       branchId: this.branchId,
       endDateTime: null,
       lastRecordCount: 0,
       legalEntityId: this.legalEntityId,
       qrActiveStatus: true,
       startDateTime: null
     };

     this.qrIdServiceAPI.getQrIdDetailsRpt(qrIdDetailsRptReqObj)
     .subscribe((data:IqrIdRptResponseStruct) => {
       console.log(data);
     });


   }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

        this.legalEntityId=this.userModel.legalEntityUserDetails.legalEntityId;
        this.branchId=this.userModel.legalEntityBranchDetails.branchId;

    }
    else{
      this.router.navigate(['legalentity','login']);
      return false;
    }

    this.menuModel=this.utileServiceAPI.getLegalEntityMenuPrefNames();

    this.equipmentMenuName=this.menuModel.equipmentMenuName;

    this.popQrIdDetailsRpt();


  }

}
