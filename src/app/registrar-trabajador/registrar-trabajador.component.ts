import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServiceService } from '../authenticacion/service/service.service';

@Component({
  selector: 'app-registrar-trabajador',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './registrar-trabajador.component.html',
  styleUrl: './registrar-trabajador.component.css'
})
export class RegistrarTrabajadorComponent {
  errorMessage: string = '';


  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(private auth: ServiceService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { nombre, apellido, username, email, password} = form.value;     
      this.auth.registerWorker({ nombre, apellido, username, email, password }).subscribe(
        (response: any) => {
          alert('Asesor registrado exitosamente');
        },
        (error: string) => {
          console.error('Error de registro:', error);
          this.errorMessage = error;
        }
      );
    }
  }
}
