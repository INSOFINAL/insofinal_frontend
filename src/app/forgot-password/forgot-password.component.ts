import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../authenticacion/service/service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: ServiceService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
        this.loading = true; // Activar el estado de carga
        this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
            (response) => {
                this.loading = false; // Desactivar el estado de carga
                // Aquí se procesa la respuesta en caso de éxito
                if (response.message) {
                    this.message = response.message; // Usar el mensaje del backend
                } else {
                    this.message = 'Se ha enviado un correo con instrucciones para restablecer la contraseña.'; // Mensaje por defecto
                }
            },
            (error) => {
                this.loading = false; // Desactivar el estado de carga
                // Manejo del error en la solicitud
                console.error('Error en la solicitud:', error); // Log de error
                if (error.error && error.error.error) {
                    this.message = error.error.error; // Mostrar mensaje de error específico
                } else {
                    this.message = 'Correo no registrado o invalido.';
                }
            }
        );
    }
}
}
