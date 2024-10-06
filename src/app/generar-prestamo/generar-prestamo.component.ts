import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../authenticacion/service/service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { error } from 'console';


@Component({
  selector: 'app-generar-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './generar-prestamo.component.html',
  styleUrl: './generar-prestamo.component.css'
})
export class GenerarPrestamoComponent {
  prestamoForm!: FormGroup ;
  clienteForm!: FormGroup;
  clienteInfo: any = null;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private clienteService: ServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.prestamoForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      monto: ['', [Validators.required, Validators.min(300)]],
      plazo: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      nombres: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }]
    });

   
    this.prestamoForm.get('dni')?.valueChanges.subscribe(dni => {
      if (this.prestamoForm.get('dni')?.valid) {
        this.errorMessage = null;
        this.buscarDatosCliente(dni);
      }
    });
  }


  

  buscarDatosCliente(dni: string) {
    this.clienteService.obtenerDatosPorDni(dni).subscribe(
      (data) => {
        if (data) {
          this.clienteInfo = data;
          this.prestamoForm.patchValue({
            nombres: data.nombres,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno
          });
          this.errorMessage = null; // Limpiar mensaje de error si se encuentra el cliente
        } else {
          this.errorMessage = 'No existe esa persona con DNI, no podemos realizar el prestamo'; // Mostrar mensaje de error si no se encuentra el cliente
        }
      },
      (error) => {
        console.error('Error al buscar datos del cliente', error);

        this.errorMessage = 'Error al buscar datos del cliente'; // Mensaje de error en caso de fallo en la solicitud
      }
    );
  }

  crearPrestamo(): void {
    if (this.prestamoForm?.valid) {
      // Primero, intenta registrar al cliente
      this.clienteService.registrocliente(this.prestamoForm.value).subscribe({
        next: (cliente) => {
          console.log('Cliente creado: ', cliente);
  
          // Si el cliente se creó correctamente, procede a crear el préstamo
          this.clienteService.crearPrestamo(this.prestamoForm.value).subscribe({
            next: (prestamo) => {
              console.log('Préstamo creado:', prestamo);
              this.router.navigate(['/loan-history']);
            },
            error: (error) => {
              console.error('Error al crear préstamo:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al crear el cliente: ', error);
  
          // Si el cliente ya existe, puedes proceder a crear el préstamo
          if (error.status === 409) { // Suponiendo que el servidor devuelve un 409 si el cliente ya existe
            this.clienteService.crearPrestamo(this.prestamoForm.value).subscribe({
              next: (prestamo) => {
                console.log('Préstamo creado:', prestamo);
                this.router.navigate(['/loan-history']);
              },
              error: (error) => {
                console.error('Error al crear préstamo:', error);
              }
            });
          }
        }
      });
    }
  }
}
