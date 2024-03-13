import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstAnalyticsComponent } from './cbst-analytics.component';

describe('CbstAnalyticsComponent', () => {
  let component: CbstAnalyticsComponent;
  let fixture: ComponentFixture<CbstAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbstAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
