import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttUsersListComponent } from './mqtt-users-list.component';

describe('MqttUsersListComponent', () => {
  let component: MqttUsersListComponent;
  let fixture: ComponentFixture<MqttUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MqttUsersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
