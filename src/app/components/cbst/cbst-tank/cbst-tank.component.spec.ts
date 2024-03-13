import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstTankComponent } from './cbst-tank.component';

describe('CbstTankComponent', () => {
  let component: CbstTankComponent;
  let fixture: ComponentFixture<CbstTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbstTankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
