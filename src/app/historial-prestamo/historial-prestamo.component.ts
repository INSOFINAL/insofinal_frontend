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
  dni!: string;

  constructor(private prestamoService: ServiceService){}

  ngOnInit(): void {
      
  }


  marcarComoPagado(pagoId: number) {
    console.log('Pago ID:', pagoId);
    this.prestamoService.marcarPagoComoPagado(pagoId).subscribe(response => {
      console.log('Pago marcado como pagado', response);
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
    this.prestamoService.getPrestamosPorDni(this.dni).subscribe(data => {
      console.log(data); // Imprime la respuesta en la consola para verificar
      this.prestamos = data; // Asigna la respuesta
    }, error => {
      console.error('Error fetching prestamos', error); // Verifica la respuesta en la consola
    });
  }
}
