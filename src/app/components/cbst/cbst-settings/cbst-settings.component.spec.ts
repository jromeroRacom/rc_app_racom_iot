import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstSettingsComponent } from './cbst-settings.component';

describe('CbstSettingsComponent', () => {
  let component: CbstSettingsComponent;
  let fixture: ComponentFixture<CbstSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbstSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
