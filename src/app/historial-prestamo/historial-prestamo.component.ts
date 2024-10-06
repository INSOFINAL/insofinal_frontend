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
