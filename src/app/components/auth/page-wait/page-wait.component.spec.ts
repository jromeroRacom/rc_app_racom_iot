import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWaitComponent } from './page-wait.component';

describe('PageWaitComponent', () => {
  let component: PageWaitComponent;
  let fixture: ComponentFixture<PageWaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageWaitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
