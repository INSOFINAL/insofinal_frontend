import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../authenticacion/service/service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: ServiceService, private router: Router) {}

  changePassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      console.error('La nueva contraseña y su confirmación son obligatorias');
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }
    
    const username = this.authService.getUsernameFromToken();
  
    if (!username) {
      console.error('No se pudo obtener el correo del token');
      return;
    }
  
    // Llamada al servicio de cambio de contraseña
    this.authService.changePassword(username, this.newPassword).subscribe({
      next: (response) => {
        console.log('Contraseña cambiada exitosamente');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al cambiar la contraseña', err);
      }
    });
  }
}
