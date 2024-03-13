import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttAclListComponent } from './mqtt-acl-list.component';

describe('MqttAclListComponent', () => {
  let component: MqttAclListComponent;
  let fixture: ComponentFixture<MqttAclListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttAclListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttAclListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
