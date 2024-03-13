import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttUsersTableComponent } from './mqtt-users-table.component';

describe('MqttUsersTableComponent', () => {
  let component: MqttUsersTableComponent;
  let fixture: ComponentFixture<MqttUsersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttUsersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
