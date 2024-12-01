import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: ServiceService,private http: HttpClient, private router: Router) {}



  login(): void {
    if (!this.username || !this.password) {
      console.error('Email y contraseña son requeridos');
      return;
    }
  
    this.authService.login(this.username, this.password, (token) => {
    
    }).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Login Failed', err);
        this.errorMessage = 'Error de autenticación. Por favor, revisa tus credenciales.';
      }
    });
  }
}
