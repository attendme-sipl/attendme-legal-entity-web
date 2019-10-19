import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserLoginResponseStruct } from '../services/technician-login.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ItechnicianLoginDetailsStruct, TehnicianUtilService, ItechnicianBranchRequestStruct, ItechnicianBranchReponseStruct, ItechnicianDetailsReponse } from '../services/tehnician-util.service';
//import { UtilServicesService, IlegalEntityMenuPref } from 'src/app/util-services.service';
import { ToastrService } from 'ngx-toastr';
import { LegalentityMenuPref } from 'src/app/legalentity/model/legalentity-menu-pref';

@Component({
  selector: 'app-technician-main',
  templateUrl: './technician-main.component.html',
  styleUrls: ['./technician-main.component.css']
})
export class TechnicianMainComponent implements OnInit {

  userFullName: string;
  userId: number;
  legalEntityId: number;

  technicianMenuName: string;
  complaintsMenuName: string;
  serviceMenuName: string;

  branchName: string;

  constructor(
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private utilServiceAPI: TehnicianUtilService,
    private toastService: ToastrService,
    private technicianBranchUtilAPI: TehnicianUtilService
  ) {
    iconRegistry.addSvgIcon(
      "attendme-logo",
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/ic_launcher.svg')
    );

    iconRegistry.addSvgIcon(
      'home-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-home-24px.svg')
    );
   }

   setBranchDetails():void{

    let branchRequestObj: ItechnicianBranchRequestStruct ={
      adminApprove: true,
      branchActive: true,
      userId: this.userId
    }

     this.technicianBranchUtilAPI.getUserBranchDetails(branchRequestObj)
     .subscribe((data:ItechnicianBranchReponseStruct) => {
       
      this.branchName = data.branchName; 
      localStorage.setItem('technicinaBranchDetails',JSON.stringify(data));

     });
   }

   setLegalEntityMenuPreference(): void
   { 

    if (localStorage.getItem('legalEntityMenuPref') == null)
    {
      this.utilServiceAPI.getLegalEntityMenuPreference(this.legalEntityId)
    .subscribe(data => {

      localStorage.setItem("legalEntityMenuPref",JSON.stringify(data));

      let menuPrefObj: ItechnicianLoginDetailsStruct[] = data;
     

      const technicianMenuNameObj = menuPrefObj.map((value,index) => value? {
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }: null)
      .filter(value => value.ngModelPropMenuName == 'technician');

      this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];
    
      const complaintsMenuNameObj = menuPrefObj.map((value,index) => value?{
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }:null)
      .filter(value => value.ngModelPropMenuName == 'complaints');

      this.complaintsMenuName = complaintsMenuNameObj[0]['userDefMenuName'];

      const servicesMenuNameObj = menuPrefObj.map((value,index) => value?{
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }:null)
      .filter(value => value.ngModelPropMenuName == 'services');

      if (servicesMenuNameObj.length != 0){
        this.serviceMenuName = servicesMenuNameObj[0]['userDefMenuName'];
      }


    }, error => {
      this.toastService.error("Something whent wrong while loading user details");
    });
    }

   }

   setTechnicianDetails():void {

    this.technicianBranchUtilAPI.getTechnicicianDetails(this.userId)
    .subscribe((data: ItechnicianDetailsReponse) => {
      if (data.errorOccured)
      {
        this.toastService.error("Something when wrong while loading user details");
        return false;
      }

      localStorage.setItem('technicianDetails',JSON.stringify(data));
    }, error => {
      this.toastService.error("Something when wrong while loading user details");
    })

   }

  ngOnInit() {

    if (localStorage.getItem('technicianUserDetails') != null)
    {

      let technicianUserDetails: ItechnicianLoginDetailsStruct = JSON.parse(localStorage.getItem('technicianUserDetails'));

      this.legalEntityId = technicianUserDetails.legalEntityId;
      this.userFullName = technicianUserDetails.userFullName;
      this.userId = technicianUserDetails.userId;

      if (technicianUserDetails.passwordChange == false){

        this.router.navigate(['technician','reset-password']);
        return false;
      }

    }
    else
    {
     //this.router.navigate(['technician/login']);
     this.router.navigate(['legalentity','login']);
     return false;
    }

  
    if (localStorage.getItem('legalEntityMenuPref') != null)
    {

      let legalEntityMenuPrefObj:LegalentityMenuPref[] = JSON.parse(localStorage.getItem('legalEntityMenuPref'));

      const technicianMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value? {
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }: null)
      .filter(value => value.ngModelPropMenuName == 'technician');

      this.technicianMenuName = technicianMenuNameObj[0]['userDefMenuName'];
    
      const complaintsMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value?{
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }:null)
      .filter(value => value.ngModelPropMenuName == 'complaints');

      this.complaintsMenuName = complaintsMenuNameObj[0]['userDefMenuName'];

      const servicesMenuNameObj = legalEntityMenuPrefObj.map((value,index) => value?{
        userDefMenuName: value['menuName'],
        ngModelPropMenuName: value['ngModelPropName']
      }:null)
      .filter(value => value.ngModelPropMenuName == 'services');

      if (servicesMenuNameObj.length != 0){
        this.serviceMenuName = servicesMenuNameObj[0]['userDefMenuName']; 
      }

    }
    
   

  }


  logOut():void{
   localStorage.removeItem('technicianUserDetails');
   localStorage.removeItem('legalEntityMenuPref');
   localStorage.removeItem('technicianDetails');
   
   //this.router.navigate(['technician/login']);
   this.router.navigate(['legalentity','login']);  
   //this.router.navigate(['legalentity/login'])
  }

}
