import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSupportComponent } from './header-support.component';

describe('HeaderSupportComponent', () => {
  let component: HeaderSupportComponent;
  let fixture: ComponentFixture<HeaderSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
