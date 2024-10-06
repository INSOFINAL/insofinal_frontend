import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPrestamoComponent } from './generar-prestamo.component';

describe('GenerarPrestamoComponent', () => {
  let component: GenerarPrestamoComponent;
  let fixture: ComponentFixture<GenerarPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarPrestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
