import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSessionsListComponent } from './users-sessions-list.component';

describe('UsersSessionsListComponent', () => {
  let component: UsersSessionsListComponent;
  let fixture: ComponentFixture<UsersSessionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersSessionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSessionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
