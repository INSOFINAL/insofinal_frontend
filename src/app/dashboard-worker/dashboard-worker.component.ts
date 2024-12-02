import { Component } from '@angular/core';
import { Trabajador } from '../models/models.model';
import { ServiceService } from '../authenticacion/service/service.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-worker',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, RouterLinkActive],
  templateUrl: './dashboard-worker.component.html',
  styleUrl: './dashboard-worker.component.css'
})
export class DashboardWorkerComponent {
  user: Trabajador | null = null;
  prestamos: any[] = [];
  dni!: string;
  constructor(private Service: ServiceService) {
  }

  ngOnInit(): void {
   
    this.getinfo();
    this.cargarPrestamosPendientes();
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


  cargarPrestamosPendientes(): void {
    this.Service.obtenerPrestamosPendientes().subscribe(
      (data) => {
        this.prestamos = data;
       
      },
      (error) => {
        console.error('Error al cargar los préstamos pendientes', error);
      }
    );
  }


  marcarComoPagado(pagoId: number) {
    
    this.Service.marcarPagoComoPagado(pagoId).subscribe(response => {
      console.log('Pago marcado como pagado', response);
      this.cargarPrestamosPendientes(); // Actualizar la lista de préstamos
    }, error => {
      console.error('Error al marcar pago como pagado', error);
    });
  }


  esPrimerPagoPendiente(cronogramaPagos: any[], index: number): boolean {
    // Recorre los pagos desde el principio hasta el índice actual
    for (let i = 0; i < index; i++) {
      if (cronogramaPagos[i].estado === 'Pendiente') {
        // Si hay un pago pendiente antes del actual, este no es el primero pendiente
        return false;
      }
    }
    // Si no se encontró ningún otro pago pendiente antes del actual, este es el primero
    return true;
  }
  
  ajustarZonaHoraria(fechaUTC: string): string {
    const fecha = new Date(fechaUTC);
    return fecha.toLocaleString('es-PE', { timeZone: 'America/Lima' });
  }

  imprimirPrestamo(prestamoId: number): void {
    this.Service.generarPdfPrestamo(prestamoId).subscribe({
      next: (pdfBlob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob); // Crea una URL para el archivo PDF
        window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva pestaña
      },
      error: (error) => {
        console.error('Error al generar el PDF del préstamo:', error);
      }
    });
  }

  cancelarPrestamo(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar este préstamo?')) {
      this.Service.eliminarPrestamo(id).subscribe(() => {
        console.log('Préstamo eliminado');
        alert('Prestamo Cancelado');
        window.location.reload();
        // Aquí puedes actualizar la vista o recargar la lista de préstamos
        
      }, error => {
        console.error('Error al cancelar el préstamo', error);
      });
    }
  }




  todosPagosPendientes(prestamo: any): boolean {
    // Revisa si todos los pagos están en estado 'Pendiente' o 'Deuda'
    return prestamo.cronogramaPagos.every((pago: any) => pago.estado !== 'Pagado');
  }
}
