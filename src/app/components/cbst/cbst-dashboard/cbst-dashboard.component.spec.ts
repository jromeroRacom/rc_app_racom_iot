import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstDashboardComponent } from './cbst-dashboard.component';

describe('CbstDashboardComponent', () => {
  let component: CbstDashboardComponent;
  let fixture: ComponentFixture<CbstDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbstDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
