import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttAclTableComponent } from './mqtt-acl-table.component';

describe('MqttAclTableComponent', () => {
  let component: MqttAclTableComponent;
  let fixture: ComponentFixture<MqttAclTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttAclTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttAclTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
