import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWorkerComponent } from './dashboard-worker.component';

describe('DashboardWorkerComponent', () => {
  let component: DashboardWorkerComponent;
  let fixture: ComponentFixture<DashboardWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
