import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ServiceService } from '../authenticacion/service/service.service';
import { Trabajador } from '../models/models.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, ReactiveFormsModule, FormsModule, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: Trabajador | null = null;
  constructor(private Service: ServiceService) {
  }

  ngOnInit(): void {
   
    this.getinfo();
    
  }

  logout():void{ 
    
    this.Service.logout();
  }

  getinfo():void{
    this.Service.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;  // Asigna los detalles del usuario
      },
      error: (err) => {
        console.error('Error al obtener la información del usuario', err);
      }
    });
  }
}
