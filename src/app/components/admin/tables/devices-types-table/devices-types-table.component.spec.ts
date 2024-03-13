import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesTypesTableComponent } from './devices-types-table.component';

describe('DevicesTypesTableComponent', () => {
  let component: DevicesTypesTableComponent;
  let fixture: ComponentFixture<DevicesTypesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesTypesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
