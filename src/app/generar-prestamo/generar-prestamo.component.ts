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
          this.clienteService.crearPrestamo(prestamoData).subscribe({
            next: (pdfBase64) => {
              console.log('Préstamo creado. Abriendo PDF...');
              this.abrirPdfBlob(pdfBase64);
              console.log(prestamoData);
                console.log(pdfBase64);
              window.location.reload();
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al crear préstamo:', error);
              this.isLoading = false;
            },
          });
        },
        error: (error) => {
          console.error('Error al crear el cliente: ', error);
  
          // Si el cliente ya existe, proceder a crear el préstamo
          if (error.status === 409) {
            this.clienteService.crearPrestamo(this.dniForm.value).subscribe({
              next: (pdfBase64) => {
                console.log('Préstamo creado. Abriendo PDF...');
                console.log(this.dniForm.value);
                console.log(pdfBase64);
                this.abrirPdfBlob(pdfBase64);
                window.location.reload();
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error al crear préstamo:', error);
                
             
                this.isLoading = false;
              },
            });
          }
        },
      });
    }
  }

  // Función para manejar la creación de préstamo para RUC
  crearPrestamoRuc(): void {
    if (this.rucForm.valid) {
      const prestamoData = { ...this.rucForm.value };
      prestamoData.nroDocumento = prestamoData.ruc; // Asignamos el número de documento
  
      this.isLoading = true;
      this.clienteService.registrocliente(prestamoData).subscribe({
        next: (cliente) => {
          this.clienteService.crearPrestamo(prestamoData).subscribe({
            next: (pdfBase64) => {
              console.log('Préstamo creado. Abriendo PDF...');
              this.abrirPdfBlob(pdfBase64);
              console.log(prestamoData);
                console.log(pdfBase64);
              window.location.reload();
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al crear préstamo:', error);
              this.isLoading = false;
            },
          });
        },
        error: (error) => {
          console.error('Error al crear el cliente: ', error);
  
          // Si el cliente ya existe, proceder a crear el préstamo
          if (error.status === 409) {
            this.clienteService.crearPrestamo(this.rucForm.value).subscribe({
              next: (pdfBase64) => {
                console.log('Préstamo creado. Abriendo PDF...');
                this.abrirPdfBlob(pdfBase64);
                console.log(this.rucForm.value);
                console.log(pdfBase64);
                window.location.reload();
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error al crear préstamo:', error);
                this.isLoading = false;
              },
            });
          }
        },
      });
    }
  }
  
  abrirPdfBlob(pdfBlob: Blob): void {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank'; 
    a.download = 'prestamo.pdf'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  cambiarTipoDocumento(tipo: string): void {
    this.tipoDocumento = tipo; // Actualiza el tipo de documento seleccionado
  }
  
  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
