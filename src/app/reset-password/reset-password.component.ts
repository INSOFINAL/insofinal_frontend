import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceService } from '../authenticacion/service/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: ServiceService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
        this.authService.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe(
            (response) => {
                if (response.message) {
                    this.message = response.message; // Mostrar el mensaje del backend
                } else {
                    this.message = 'Contraseña restablecida con éxito.'; // Mensaje por defecto
                }

                // Esperar 3 segundos antes de redirigir al login
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000); // 3000 milisegundos = 3 segundos
            },
            (error) => {
                console.error('Error en la solicitud:', error); // Log del error
                if (error.error && error.error.error) {
                    this.message = error.error.error; // Mostrar mensaje de error del backend
                } else {
                    this.message = 'Hubo un error al restablecer la contraseña. Inténtalo de nuevo.';
                }
            }
        );
    }
}
}
