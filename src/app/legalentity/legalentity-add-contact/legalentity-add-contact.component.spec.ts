import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalentityAddContactComponent } from './legalentity-add-contact.component';

describe('LegalentityAddContactComponent', () => {
  let component: LegalentityAddContactComponent;
  let fixture: ComponentFixture<LegalentityAddContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalentityAddContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalentityAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
