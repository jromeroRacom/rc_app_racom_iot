import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSupportComponent } from './footer-support.component';

describe('FooterSupportComponent', () => {
  let component: FooterSupportComponent;
  let fixture: ComponentFixture<FooterSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
