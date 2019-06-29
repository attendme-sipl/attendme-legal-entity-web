import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalentityUser } from '../../model/legalentity-user';
import { LegalentityUtilService } from '../../services/legalentity-util.service';
import { Router } from '@angular/router';
import { LegalentityMenuPrefNames } from '../../model/legalentity-menu-pref-names';
import { LegalentityAddTechnicianService, ItechnicianListRptResponse } from '../../services/legalentity-add-technician.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatSort, MatTableDataSource, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export interface ItechnicianListDetailsStruct{
   technicianId: number,
   technicianActiveStatus: boolean,
   technicianName: string,
   technicianMobileNumber: string,
   technicianEmailId: string
};

@Component({
  selector: 'app-legalentity-technician-rpt',
  templateUrl: './legalentity-technician-rpt.component.html',
  styleUrls: ['./legalentity-technician-rpt.component.css']
})
export class LegalentityTechnicianRptComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  legalEntityId: number;
  userId: number;

  technicianMenuName: string;
  enableProgressBar: boolean;

  dataSource;
  technicianRecordCount: number;
  pageSize: number = 10;
  pageSizeOption: number[] = [5,10,25,50,100];

  technicianDetailsArray: ItechnicianListDetailsStruct[];

  displayedColumns: string[]=[
    "srNo",
    "technicianName",
    "technicianMobileNumber",
    "technicianEmailId",
    "editTechnicianDetails",
    "deleteTechnician"
  ];

  constructor(
    private userModel: LegalentityUser,
    private utilServiceAPI: LegalentityUtilService,
    private router: Router,
    private menuPrefNameModel: LegalentityMenuPrefNames,
    private technicianServiceAPI: LegalentityAddTechnicianService,
    private toastService: ToastrService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) { 
      iconRegistry.addSvgIcon(
        'edit-icon',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-edit-24px.svg')
      );

      iconRegistry.addSvgIcon(
        'delete-icon',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-delete-24px.svg')
      );

      iconRegistry.addSvgIcon(
        'refresh-icon',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg_icons/baseline-refresh-24px.svg')
      )
  }

  popTechnicianListRpt():void{
    this.enableProgressBar=true;

    this.technicianServiceAPI.getTechnicianList(this.legalEntityId)
    .subscribe((data:ItechnicianListRptResponse) => {
      
      if (data.errorOccurred){
        this.toastService.error("Something went wrong while loading " + this.technicianMenuName + " list");
        this.enableProgressBar=false;
        return false;
      }

      this.technicianRecordCount=data.technicianList.length;
      this.dataSource=new MatTableDataSource(data.technicianList);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;

      this.technicianDetailsArray=data.technicianList;

      this.enableProgressBar=false;

    }, error => {
      this.toastService.error("Something went wrong while loading " + this.technicianMenuName + " list");
      this.enableProgressBar=false;
    });
  }

  addTechnicianClick(){
    
    this.router.navigate(['legalentity','portal','technician-add']);
  }

  onEditClick(technicianId: number){
    this.router.navigate(['legalentity','portal','edit','technician',technicianId]);
  }

  ngOnInit() {

    if (localStorage.getItem('legalEntityUserDetails') != null){
     
      this.userModel=JSON.parse(localStorage.getItem('legalEntityUserDetails'));

      this.legalEntityId = this.userModel.legalEntityUserDetails.legalEntityId;
      this.userId=this.userModel.legalEntityUserDetails.userId;
      
      this.menuPrefNameModel=this.utilServiceAPI.getLegalEntityMenuPrefNames();

      this.technicianMenuName=this.menuPrefNameModel.technicianMenuName;

    }
    else{
      this.router.navigate(['legalentity','login']);
    }

    this.popTechnicianListRpt();

    this.utilServiceAPI.setTitle("Legalentity - " + this.technicianMenuName + " | Attendme");

  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
