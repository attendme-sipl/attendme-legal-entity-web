import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalentityAllotQrBranchComponent } from './legalentity-allot-qr-branch.component';

describe('LegalentityAllotQrBranchComponent', () => {
  let component: LegalentityAllotQrBranchComponent;
  let fixture: ComponentFixture<LegalentityAllotQrBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalentityAllotQrBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalentityAllotQrBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
