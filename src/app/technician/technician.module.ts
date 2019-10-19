import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TechnicianRoutingModule } from './technician-routing.module';
import { TechnicianLoginComponent } from './technician-login/technician-login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {TechnicianLoginService} from './services/technician-login.service';
import { TechnicianMainComponent } from './technician-main/technician-main.component';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { TechnicianComplaintService } from './services/technician-complaint.service';
import { TechnicianAssignedComplaintRptComponent } from './technician-report/technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TechnicianChangeStatusComponent } from './technician-change-status/technician-change-status.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { TechnicianResetPasswordComponent } from './technician-reset-password/technician-reset-password.component';
import { TechnicianForgotPasswordComponent } from './technician-forgot-password/technician-forgot-password.component';
import { TechnicianIndivComplaintDetailsComponent } from './technician-report/technician-indiv-complaint-details/technician-indiv-complaint-details.component';
import {TechnicianIndivComptDetails} from './model/technician-indiv-compt-details';
import { TechnicianInprogressRptComponent } from './technician-report/technician-inprogress-rpt/technician-inprogress-rpt.component';
import { TechnicianClosedComptRptComponent } from './technician-report/technician-closed-compt-rpt/technician-closed-compt-rpt.component';
import {TechnicianMenuModel} from './model/technician-menu-model';
import {TechnicianMenuDataStruct} from './model/technician-menu-data-struct';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TechnicianRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  declarations: [TechnicianLoginComponent, TechnicianMainComponent, TechnicianDashboardComponent, 
    ResetPasswordComponent, TechnicianAssignedComplaintRptComponent, TechnicianChangeStatusComponent, 
    TechnicianResetPasswordComponent, TechnicianForgotPasswordComponent, TechnicianIndivComplaintDetailsComponent, TechnicianInprogressRptComponent, TechnicianClosedComptRptComponent],
  providers:[
    TechnicianComplaintService,
    TechnicianIndivComptDetails,
    TechnicianMenuModel,
    TechnicianMenuDataStruct
  ],
  entryComponents:[
    TechnicianChangeStatusComponent,
    TechnicianIndivComplaintDetailsComponent
  ]
  
})
export class TechnicianModule { }
