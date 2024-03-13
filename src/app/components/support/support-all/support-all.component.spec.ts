import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAllComponent } from './support-all.component';

describe('SupportAllComponent', () => {
  let component: SupportAllComponent;
  let fixture: ComponentFixture<SupportAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
