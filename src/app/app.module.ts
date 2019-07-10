import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LegalentityLoginComponent } from './legalentity/legalentity-login/legalentity-login.component';
import { RouterModule } from '@angular/router';
import { LegalentityMainComponent } from './legalentity/legalentity-main/legalentity-main.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule, MatButton} from '@angular/material/button';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LegalentityUser} from './legalentity/model/legalentity-user';
import { LegalentityDashboardComponent } from './legalentity/legalentity-dashboard/legalentity-dashboard.component';
import {NgPipesModule} from "ngx-pipes";
import { LegalentityEquipmentComponent } from './legalentity/legalentity-equipment/legalentity-equipment.component';
import {LegalentityMenuPrefNames} from './legalentity/model/legalentity-menu-pref-names';
import {LegalentityEquipmentService} from './legalentity/services/legalentity-equipment.service';
import {ToastrModule} from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import { LegalentityCommons} from './legalentity/model/legalentity-commons';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {LegalentityQridUsage} from './legalentity/model/legalentity-qrid-usage';
import {LegalentityDashboardService} from './legalentity/services/legalentity-dashboard.service';
import { LegalentityComplaintConcise } from './legalentity/model/legalentity-complaint-concise';
import { LegalentityOpenComptRptComponent } from './legalentity/legalentity-reports/legalentity-open-compt-rpt/legalentity-open-compt-rpt.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {LegalentityComplaintRptService} from './legalentity/services/legalentity-complaint-rpt.service';
import { LegalentityIndivComplaintRptComponent } from './legalentity/legalentity-reports/legalentity-indiv-complaint-rpt/legalentity-indiv-complaint-rpt.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LegalentityAddTechnicianNewComponent } from './legalentity/legalentity-add-technician-new/legalentity-add-technician-new.component';
import { LegalentityAddTechnicianService } from './legalentity/services/legalentity-add-technician.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LegalentityAssignTechnicianComponent } from './legalentity/legalentity-assign-technician/legalentity-assign-technician.component';
import { LegalentityConfirmAlertComponent } from './legalentity/legalentity-confirm-alert/legalentity-confirm-alert.component';
import { LegalentityTechnicianService } from './legalentity/services/legalentity-technician.service';
import { LegalentityContactsRptComponent } from './legalentity/legalentity-reports/legalentity-contacts-rpt/legalentity-contacts-rpt.component';
import { LegalentityAddContactComponent } from './legalentity/legalentity-add-contact/legalentity-add-contact.component';
import { LegalentityCountryCallingCode } from './legalentity/model/legalentity-country-calling-code';
import { LegalentityForgotPasswordComponent } from './legalentity/legalentity-forgot-password/legalentity-forgot-password.component';
import {LegalentityResetPasswordComponent} from './legalentity/legalentity-reset-password/legalentity-reset-password.component';
import {LegalentityHeadofficeComponent} from './legalentity/legalentity-headoffice/legalentity-headoffice.component';
import {LegalentityBranch}  from './legalentity/model/legalentity-branch';
import {LegalentityBranchService} from './legalentity/services/legalentity-branch.service';
import { LegalentityTechnicianRptComponent } from './legalentity/legalentity-reports/legalentity-technician-rpt/legalentity-technician-rpt.component';
import { LegalentityAssignedQrRptComponent } from './legalentity/legalentity-reports/legalentity-assigned-qr-rpt/legalentity-assigned-qr-rpt.component';
import {LegalentityQrService} from './legalentity/services/legalentity-qr.service';
import { LegalentityEditQrDetailsComponent } from './legalentity/legalentity-edit-qr-details/legalentity-edit-qr-details.component';
import {LegalentityBranchComponent} from './legalentity/legalentity-branch/legalentity-branch.component';
import {LegalentityAddBranch} from './legalentity/model/legalentity-add-branch';
import {LegalentityBranchRulebook} from './legalentity/model/legalentity-branch-rulebook';
import { LegalentityAssingedComplaintRptComponent } from './legalentity/legalentity-reports/legalentity-assinged-complaint-rpt/legalentity-assinged-complaint-rpt.component';
import { LegalentityEditTechnicianComponent } from './legalentity/legalentity-edit-technician/legalentity-edit-technician.component';
import { LegalentityAllotQrBranchComponent } from './legalentity/legalentity-allot-qr-branch/legalentity-allot-qr-branch.component';
import { LegalentityInprogressComptRptComponent } from './legalentity/legalentity-reports/legalentity-inprogress-compt-rpt/legalentity-inprogress-compt-rpt.component';
import { LegalentityClosedComptRptComponent } from './legalentity/legalentity-reports/legalentity-closed-compt-rpt/legalentity-closed-compt-rpt.component';
import { LegalentityComplaintRptComponent } from './legalentity/legalentity-reports/legalentity-complaint-rpt/legalentity-complaint-rpt.component';
import { LegalentityQrDetailsComponent } from './legalentity/legalentity-qr-details/legalentity-qr-details.component';
import {LegalentityIndivComptDetails} from './legalentity/model/legalentity-indiv-compt-details';
import { LegalentityBranchListRptComponent } from './legalentity/legalentity-reports/legalentity-branch-list-rpt/legalentity-branch-list-rpt.component';

@NgModule({
  declarations: [
    AppComponent,
    LegalentityLoginComponent,
    LegalentityMainComponent,
    LegalentityDashboardComponent,
    LegalentityEquipmentComponent,
    LegalentityOpenComptRptComponent,
    LegalentityIndivComplaintRptComponent,
    LegalentityAddTechnicianNewComponent,
    LegalentityAssignTechnicianComponent,
    LegalentityConfirmAlertComponent,
    LegalentityContactsRptComponent,
    LegalentityAddContactComponent,
    LegalentityForgotPasswordComponent,
    LegalentityResetPasswordComponent,
    LegalentityHeadofficeComponent,
    LegalentityTechnicianRptComponent,
    LegalentityAssignedQrRptComponent,
    LegalentityEditQrDetailsComponent,
    LegalentityBranchComponent,
    LegalentityAssingedComplaintRptComponent,
    LegalentityEditTechnicianComponent,
    LegalentityAllotQrBranchComponent,
    LegalentityInprogressComptRptComponent,
    LegalentityClosedComptRptComponent,
    LegalentityComplaintRptComponent,
    LegalentityQrDetailsComponent,
    LegalentityBranchListRptComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatProgressBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    BrowserAnimationsModule,
    NgPipesModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass:'toast-top-right',
      tapToDismiss: true,
      newestOnTop:true,
      preventDuplicates:true
    }),
    ReactiveFormsModule,
    MatSelectModule,
    MatGridListModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    LegalentityUser,
    LegalentityMenuPrefNames,
    LegalentityCommons,
    LegalentityQridUsage,
    LegalentityComplaintConcise,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    LegalentityAddTechnicianService,
    LegalentityTechnicianService,
    LegalentityComplaintRptService,
    LegalentityCountryCallingCode,
    LegalentityBranch,
    LegalentityBranchService,
    LegalentityQrService,
    LegalentityAddBranch,
    LegalentityBranchRulebook,
    LegalentityIndivComptDetails
  ],
  bootstrap: [AppComponent],
  entryComponents:[
    LegalentityIndivComplaintRptComponent,
    LegalentityAssignTechnicianComponent,
    LegalentityConfirmAlertComponent,
    LegalentityAddContactComponent,
    LegalentityQrDetailsComponent
  ]
})
export class AppModule { }
