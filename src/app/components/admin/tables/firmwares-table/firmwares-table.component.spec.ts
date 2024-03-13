import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwaresTableComponent } from './firmwares-table.component';

describe('FirmwaresTableComponent', () => {
  let component: FirmwaresTableComponent;
  let fixture: ComponentFixture<FirmwaresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmwaresTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwaresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
