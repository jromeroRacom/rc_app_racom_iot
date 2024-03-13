import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsTableComponent } from './sessions-table.component';

describe('SessionsTableComponent', () => {
  let component: SessionsTableComponent;
  let fixture: ComponentFixture<SessionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
