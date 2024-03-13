import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesTypesListComponent } from './devices-types-list.component';

describe('DevicesTypesListComponent', () => {
  let component: DevicesTypesListComponent;
  let fixture: ComponentFixture<DevicesTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
