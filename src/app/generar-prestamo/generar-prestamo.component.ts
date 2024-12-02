import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ServiceService } from '../authenticacion/service/service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { run } from 'node:test';

@Component({
  selector: 'app-generar-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './generar-prestamo.component.html',
  styleUrl: './generar-prestamo.component.css'
})
export class GenerarPrestamoComponent {
  isLoading: boolean = false;
  prestamoForm!: FormGroup ;
  clienteForm!: FormGroup;
  clienteInfo: any = null;
  errorMessage: string | null = null;
  plazos: number[] = [1, 6]; 
  tipoDocumento: string = 'dni'; 
  dniForm!: FormGroup;
  rucForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private clienteService: ServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dniForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nroDocumento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1), Validators.max(5000)]],
      plazo: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
    });

    // Inicializamos el formulario para RUC
    this.rucForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      nroDocumento: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1), Validators.max(5000)]],
      plazo: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
    });
  

    this.dniForm.get('dni')?.valueChanges.subscribe(dni => {
      if (this.dniForm.get('dni')?.valid) {
        this.errorMessage = null;
        this.buscarDatosCliente(dni);
      }
    });

    this.rucForm.get('ruc')?.valueChanges.subscribe(ruc => {
      if (this.rucForm.get('ruc')?.valid) {
        this.errorMessage = null;
        this.buscarDatosCliente(ruc);
      }
    });
  
  }

  integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !Number.isInteger(value)) {
      return { notInteger: true };  
    }
    return null; 
  }


  

  buscarDatosCliente(documento: string): void {
    
    
    if (this.tipoDocumento === 'dni') {
      this.clienteService.obtenerDatosPorDni(documento).subscribe(
        (data) => {
      
          if (data) {
            this.dniForm.patchValue({
              nroDocumento: data.numeroDocumento,
              nombre: data.nombres,
              apellidoPaterno: data.apellidoPaterno,
              apellidoMaterno: data.apellidoMaterno
            });
            this.errorMessage = null;
          } else {
            this.errorMessage = 'No existe esa persona con DNI, no podemos realizar el préstamo.';
          }
        },
        (error) => {
          console.error('Error al buscar datos del cliente por DNI:', error);
          this.errorMessage = 'Error al buscar datos del cliente por DNI.';
        }
      );
    } else if (this.tipoDocumento === 'ruc') {
      this.clienteService.obtenerDatosPorDni(documento).subscribe(
        (data) => {
          if (data) {
            this.rucForm.patchValue({
              nroDocumento: data.numeroDocumento,
              razonSocial: data.razonSocial,
              direccion: data.direccion,
              distrito: data.distrito,
              provincia: data.provincia,
              departamento: data.departamento
            });
            this.errorMessage = null;
          } else {
            this.errorMessage = 'No existe esa empresa con RUC, no podemos realizar el préstamo.';
          }
        },
        (error) => {
          console.error('Error al buscar datos del cliente por RUC:', error);
          this.errorMessage = 'Error al buscar datos del cliente por RUC.';
        }
      );
    }
  }

  

  crearPrestamoDni(): void {
    if (this.dniForm.valid) {
      const prestamoData = { ...this.dniForm.value };
      prestamoData.nroDocumento = prestamoData.dni; // Asignamos el número de documento
  
      this.isLoading = true;
      this.clienteService.registrocliente(prestamoData).subscribe({
        next: (cliente) => {
          // Si el cliente se registra correctamente, se crea el préstamo
          this.crearPrestamo(prestamoData);
        },
        error: (error) => {
          console.error('Error al crear el cliente: ', error);
  
          // Si el cliente ya existe (Error 409), proceder a crear solo el préstamo
          if (error.status === 409) {
            console.log('Cliente ya existe, creando solo préstamo...');
            this.crearPrestamo(prestamoData);
          } else {
            alert(`Error al crear cliente: ${error.message || 'Ocurrió un error inesperado.'}`);
            this.isLoading = false;
          }
        }
      });
    }
  }
  
  crearPrestamo(prestamoData: any): void {
    this.clienteService.crearPrestamo(prestamoData).subscribe({
      next: (response) => {
        // Si el préstamo se creó exitosamente
        alert('Préstamo creado exitosamente');
        this.dniForm.reset(); 
        this.router.navigate(['/loan-history']); 
        this.isLoading = false;
      },
      error: (error) => {
        // Mostrar error al crear préstamo
        console.log(error)
        alert(`Error al crear préstamo: ${error.error.mensaje || 'Ocurrió un error inesperado.'}`);
        this.isLoading = false;
      }
    });
  }
  
  crearPrestamoRuc(): void {
    if (this.rucForm.valid) {
      const prestamoData = { ...this.rucForm.value };
      prestamoData.nroDocumento = prestamoData.ruc; // Asignamos el número de documento
  
      this.isLoading = true;
      this.clienteService.registrocliente(prestamoData).subscribe({
        next: (cliente) => {
          // Si el cliente se registra correctamente, se crea el préstamo
          this.crearPrestamo(prestamoData);
        },
        error: (error) => {
          console.error('Error al crear el cliente: ', error);
  
          // Si el cliente ya existe (Error 409), proceder a crear solo el préstamo
          if (error.status === 409) {
            console.log('Cliente ya existe, creando solo préstamo...');
            this.crearPrestamo(prestamoData);
          } else {
            alert(`Error al crear cliente: ${error.message || 'Ocurrió un error inesperado.'}`);
            this.isLoading = false;
          }
        }
      });
    }
  }

  cambiarTipoDocumento(tipo: string): void {
    this.tipoDocumento = tipo;
    this.errorMessage = null; 
    if (tipo === 'dni') {
      this.rucForm.reset();
    } else if (tipo === 'ruc') {
      this.dniForm.reset(); 
    }
  }

}
