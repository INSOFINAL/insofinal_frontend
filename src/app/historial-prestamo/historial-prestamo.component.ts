import { Component } from '@angular/core';
import { ServiceService } from '../authenticacion/service/service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-prestamo.component.html',
  styleUrl: './historial-prestamo.component.css'
})
export class HistorialPrestamoComponent {
  prestamos: any[] = [];
  nroDocumento!: string;
  prestamos2: any[] = [];
  constructor(private prestamoService: ServiceService){}

  ngOnInit(): void {
    this.cargarPrestamos();
  }


  cargarPrestamos(): void {
    this.prestamoService.obtenerPrestamosOrdenados().subscribe(
      (data) => {
        this.prestamos2 = data;
      },
      (error) => {
        console.error('Error al cargar los préstamos', error);
      }
    );
  }

  ajustarZonaHoraria(fechaUTC: string): string {
    const fecha = new Date(fechaUTC);
    return fecha.toLocaleString('es-PE', { timeZone: 'America/Lima' });
  }

  marcarComoPagado(pagoId: number) {
 
    this.prestamoService.marcarPagoComoPagado(pagoId).subscribe(response => {
    
      this.buscarPrestamos(); // Actualizar la lista de préstamos
    }, error => {
      console.error('Error al marcar pago como pagado', error);
    });
  }

  todosPagosPendientes(prestamo: any): boolean {
    // Revisa si todos los pagos están en estado 'Pendiente' o 'Deuda'
    return prestamo.cronogramaPagos.every((pago: any) => pago.estado !== 'Pagado');
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


  imprimirPago(pago: any): void {
    this.prestamoService.generarPDF(pago.id).subscribe(response => {
      // Crear un enlace para descargar el archivo PDF
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prestamo_pagado_${pago.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error("Error al generar PDF", error);
    });
  }

  imprimirPrestamo(prestamoId: number): void {
    this.prestamoService.generarPdfPrestamo(prestamoId).subscribe({
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
      this.prestamoService.eliminarPrestamo(id).subscribe(() => {
        console.log('Préstamo eliminado');
        alert('Prestamo Cancelado');
        window.location.reload();
        // Aquí puedes actualizar la vista o recargar la lista de préstamos
        
      }, error => {
        console.error('Error al cancelar el préstamo', error);
      });
    }
  }

  buscarPrestamos() {
    this.prestamoService.getPrestamosPorDni(this.nroDocumento).subscribe(data => {
       this.prestamos = data; 
 
    }, error => {
      console.error('Error fetching prestamos', error); 
    });
  }
}
