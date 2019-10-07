import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalentityMainComponent } from './legalentity/legalentity-main/legalentity-main.component';
import { LegalentityLoginComponent } from './legalentity/legalentity-login/legalentity-login.component';
import { LegalentityDashboardComponent } from './legalentity/legalentity-dashboard/legalentity-dashboard.component';
import { LegalentityEquipmentComponent } from './legalentity/legalentity-equipment/legalentity-equipment.component';
import { LegalentityOpenComptRptComponent } from './legalentity/legalentity-reports/legalentity-open-compt-rpt/legalentity-open-compt-rpt.component';
import { LegalentityAddTechnicianNewComponent } from './legalentity/legalentity-add-technician-new/legalentity-add-technician-new.component';
import { LegalentityContactsRptComponent } from './legalentity/legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { LegalentityForgotPasswordComponent } from './legalentity/legalentity-forgot-password/legalentity-forgot-password.component';
import { LegalentityResetPasswordComponent } from './legalentity/legalentity-reset-password/legalentity-reset-password.component';
import { LegalentityHeadofficeComponent } from './legalentity/legalentity-headoffice/legalentity-headoffice.component';
import {LegalentityTechnicianRptComponent} from './legalentity/legalentity-reports/legalentity-technician-rpt/legalentity-technician-rpt.component';
import {LegalentityAssignedQrRptComponent} from './legalentity/legalentity-reports/legalentity-assigned-qr-rpt/legalentity-assigned-qr-rpt.component';
import { LegalentityEditQrDetailsComponent } from './legalentity/legalentity-edit-qr-details/legalentity-edit-qr-details.component';
import { LegalentityBranchComponent } from './legalentity/legalentity-branch/legalentity-branch.component';
import { LegalentityAssingedComplaintRptComponent } from './legalentity/legalentity-reports/legalentity-assinged-complaint-rpt/legalentity-assinged-complaint-rpt.component';
import { LegalentityEditTechnicianComponent } from './legalentity/legalentity-edit-technician/legalentity-edit-technician.component';
import { LegalentityAllotQrBranchComponent } from './legalentity/legalentity-allot-qr-branch/legalentity-allot-qr-branch.component';
import { LegalentityInprogressComptRptComponent } from './legalentity/legalentity-reports/legalentity-inprogress-compt-rpt/legalentity-inprogress-compt-rpt.component';
import { LegalentityClosedComptRptComponent } from './legalentity/legalentity-reports/legalentity-closed-compt-rpt/legalentity-closed-compt-rpt.component';
import { LegalentityComplaintRptComponent } from './legalentity/legalentity-reports/legalentity-complaint-rpt/legalentity-complaint-rpt.component';
import { LegalentityQrDetailsComponent } from './legalentity/legalentity-qr-details/legalentity-qr-details.component';
import { LegalentityBranchListRptComponent } from './legalentity/legalentity-reports/legalentity-branch-list-rpt/legalentity-branch-list-rpt.component';
import { LegalentityAddBranch } from './legalentity/model/legalentity-add-branch';
import { LegalentityQrDetailsRptComponent } from './legalentity/legalentity-reports/legalentity-qr-details-rpt/legalentity-qr-details-rpt.component';
import { LegalentityAddBranchNewComponent } from './legalentity/legalentity-add-branch-new/legalentity-add-branch-new.component';
import {LegalentityUpdateQrDetailsComponent} from './legalentity/legalentity-update-qr-details/legalentity-update-qr-details.component';
import {LegalentityBranchQrDetailsRptComponent} from './legalentity/legalentity-reports/legalentity-branch-qr-details-rpt/legalentity-branch-qr-details-rpt.component';
import { LegalentityDocumentRptComponent } from './legalentity/legalentity-reports/legalentity-document-rpt/legalentity-document-rpt.component';
import { LegalentityUploadDocumentComponent } from './legalentity/legalentity-upload-document/legalentity-upload-document.component';
import {LegalentityTrashComptRptComponent} from './legalentity/legalentity-reports/legalentity-trash-compt-rpt/legalentity-trash-compt-rpt.component';
import {LegalentityBranchComptConciseRptComponent} from './legalentity/legalentity-reports/legalentity-branch-compt-concise-rpt/legalentity-branch-compt-concise-rpt.component';
import { LegalentityUser } from './legalentity/model/legalentity-user';
import {LegalentityImportDocumentComponent} from './legalentity/legalentity-import-document/legalentity-import-document.component';

const routes: Routes = [
  {
    path:"legalentity",children:[
      {path:"login", component:LegalentityLoginComponent},
      {path:"forgot-password", component: LegalentityForgotPasswordComponent},
      {path:"reset-password", component: LegalentityResetPasswordComponent},
      {path:"add-head-office", component: LegalentityHeadofficeComponent},
      {path:"portal",component:LegalentityMainComponent, children:[
        {path:"dashboard",component:LegalentityDashboardComponent},
        {path:"branch", component: LegalentityBranchListRptComponent},
        //{path:"branch", component: LegalentityBranchComponent},
        {path:"complaints", component: LegalentityComplaintRptComponent},
        {path:"equipment", component:LegalentityQrDetailsRptComponent},
        {path:"rpt/open", component: LegalentityOpenComptRptComponent},
        {path:"rpt/assigned", component: LegalentityAssingedComplaintRptComponent},
        {path:"rpt/inprogress", component: LegalentityInprogressComptRptComponent},
        {path: "rpt/trash/complaint", component: LegalentityTrashComptRptComponent},
        {path:"rpt/branch/qr-details/:branchId", component: LegalentityBranchQrDetailsRptComponent},
        {path:"rpt/document", component: LegalentityDocumentRptComponent},
        {path:"upload/document", component: LegalentityUploadDocumentComponent},
        {path:"technician", component:LegalentityTechnicianRptComponent},
        {path:"rpt/closed", component: LegalentityClosedComptRptComponent},
        {path:"rpt/contacts", component: LegalentityContactsRptComponent},
        {path:"rpt/branch/dashboard", component: LegalentityBranchComptConciseRptComponent},
        {path:"technician-add", component:LegalentityAddTechnicianNewComponent},
        {path:"qr-assinged/rpt", component: LegalentityAssignedQrRptComponent },
        {path:"edit/qr-details/:id", component: LegalentityUpdateQrDetailsComponent},
        {path:"edit/technician/:id", component: LegalentityEditTechnicianComponent},
        {path:"assign/qr-branch", component: LegalentityAllotQrBranchComponent},
        {path:"info/qr", component: LegalentityQrDetailsComponent},
        {path:'add-branch', component:LegalentityBranchComponent},
        //{path: 'add-branch', component: LegalentityAddBranchNewComponent},
        {path:'add-equipment',component: LegalentityEquipmentComponent},
        {path:'document/import', component: LegalentityImportDocumentComponent}
      ]}
    ]
  },
  {path:"", redirectTo:"legalentity/login", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
