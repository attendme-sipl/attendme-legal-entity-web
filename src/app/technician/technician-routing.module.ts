import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicianLoginComponent } from './technician-login/technician-login.component';
import { TechnicianMainComponent } from './technician-main/technician-main.component';
import { TechnicianDashboardComponent } from './technician-dashboard/technician-dashboard.component';
import { TechnicianAssignedComplaintRptComponent } from './technician-report/technician-assigned-complaint-rpt/technician-assigned-complaint-rpt.component';
import { TechnicianResetPasswordComponent } from './technician-reset-password/technician-reset-password.component';
import { TechnicianForgotPasswordComponent } from './technician-forgot-password/technician-forgot-password.component';
import { TechnicianInprogressRptComponent } from './technician-report/technician-inprogress-rpt/technician-inprogress-rpt.component';
import { TechnicianClosedComptRptComponent } from './technician-report/technician-closed-compt-rpt/technician-closed-compt-rpt.component';

const technicianRoutes: Routes = [{
  path: "technician", children:[
    {path:"login", component: TechnicianLoginComponent},
    {path:"reset-password", component:TechnicianResetPasswordComponent},
    {path:"forgot-password", component: TechnicianForgotPasswordComponent},
    {path: "", redirectTo:"login", pathMatch: "full"},
    {path: "portal", component:TechnicianMainComponent, children:[
      {path:"dashboard", component: TechnicianDashboardComponent},
      {path:"rpt/assigned", component: TechnicianAssignedComplaintRptComponent},
      {path:"rpt/inprogress", component: TechnicianInprogressRptComponent},
      {path:"rpt/closed", component: TechnicianClosedComptRptComponent}
    ]}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(technicianRoutes)],
  exports: [RouterModule]
})
export class TechnicianRoutingModule { }
