import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDeviceComponent } from './main-device.component';

describe('MainDeviceComponent', () => {
  let component: MainDeviceComponent;
  let fixture: ComponentFixture<MainDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
