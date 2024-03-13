import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstMainComponent } from './cbst-main.component';

describe('CbstMainComponent', () => {
  let component: CbstMainComponent;
  let fixture: ComponentFixture<CbstMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbstMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
