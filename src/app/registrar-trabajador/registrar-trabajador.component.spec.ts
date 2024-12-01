import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTrabajadorComponent } from './registrar-trabajador.component';

describe('RegistrarTrabajadorComponent', () => {
  let component: RegistrarTrabajadorComponent;
  let fixture: ComponentFixture<RegistrarTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarTrabajadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
