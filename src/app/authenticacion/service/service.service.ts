import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Cliente, Prestamo, Trabajador } from '../../models/models.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrlWorker = `${environment.apiUrl}api/v1/trabajador`;
  private apiUrl = `${environment.apiUrl}api/v1`;
  private tokenKey = 'authToken';
  constructor(private Http: HttpClient, private router: Router) { }

  filtrarPrestamos(estado: string): Observable<any[]> {
    return this.Http.get<any[]>(`${this.apiUrl}/prestamos/filtrar?estado=${estado}`);
  }
  
  actualizarDeudas(): Observable<any> {
    return this.Http.post(`${this.apiUrl}/prestamos/actualizar-deudas`, null);
  }
  obtenerPrestamosOrdenados(): Observable<Prestamo[]> {
    return this.Http.get<Prestamo[]>(`${this.apiUrl}/prestamos/listar`);
  }

  getPrestamoById(prestamoId: number): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}/${prestamoId}`);
  }

  obtenerPrestamosPendientes(): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}/prestamos/prestamos-pendientes`);
  }


  registerWorker(requestBody: any): Observable<any> {
    return this.Http.post(`${this.apiUrlWorker}/register`, requestBody).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      console.error(`Error del backend: ${error.status}, ` + `mensaje: ${error.error}`);
    }
    return throwError('Hubo un problema con el registro; por favor intenta nuevamente.');
  }

  // Buscar préstamos por DNI
  getPrestamosPorDni(dni: string): Observable<any[]> {
    return this.Http.get<Prestamo[]>(`${this.apiUrl}/prestamos/prestamoPorDni/${dni}`);
  }

  marcarPagoComoPagado(pagoId: number): Observable<any> {
    return this.Http.put<any>(`${this.apiUrl}/prestamos/marcarPagado/${pagoId}`, {});
  }

  generarPdfPrestamo(prestamoId: number): Observable<Blob> {
    return this.Http.get(`${this.apiUrl}/prestamos/${prestamoId}/pdf`, { responseType: 'blob' });
  }


  crearPrestamo(prestamoData: Prestamo): Observable<any> {
    return this.Http.post<any>(`${this.apiUrl}/prestamos/crear`, prestamoData);
  }

  generarPDF(pagoId: number): Observable<any> {
    return this.Http.get(`${this.apiUrl}/prestamos/generarPDF/${pagoId}`, { responseType: 'blob' });
  }

  eliminarPrestamo(id: number): Observable<void> {
    return this.Http.delete<void>(`${this.apiUrl}/prestamos/eliminar/${id}`);
  }

  registrocliente(cliente: Cliente):Observable<Cliente>{
    return this.Http.post<Cliente>(`${this.apiUrl}/clientes/registrar`, cliente);
  }


  obtenerDatosPorDni(dni: string): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}/clientes/${dni}`);
  }

  login(username: string, password: string, callback: (token: string) => void): Observable<any> {
    // Construimos los parámetros de la URL manualmente
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    
    return this.Http.post<any>(`${this.apiUrlWorker}/login`, null, { params }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);

          const userRole = this.getRoleFromToken();

          if (userRole === 'WORKER') {
         
            if (response.requiresPasswordChange) {
             
              this.router.navigate(['/change-password-worker']);
            } else {
              
              this.router.navigate(['/dashboard-worker']);
            }
          } else if (userRole === 'ADMIN') {
           
            if (response.requiresPasswordChange) {
             
              this.router.navigate(['/change-password']);
            } else {
              
              this.router.navigate(['/dashboard']);
            }
          }
            else {
            console.error('Rol de usuario no reconocido');
          }
        }
      })
    );
  }



  getRoleFromToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
    }
    return null;
  }
  
  private setToken(token:string):void{
    localStorage.setItem(this.tokenKey, token);
  }
  
  private getToken(): string | null{
    if(typeof window!== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else{
      return null;
    }
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || null;  
    }
    return null;
  }


  changePassword(email: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('username', email)
      .set('newPassword', newPassword);
  
    return this.Http.post<any>(`${this.apiUrlWorker}/change-password`, null, { params });
  }
  
  forgotPassword(email: string) {
    const body = new HttpParams().set('email', email);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.Http.post(`${this.apiUrlWorker}/forgot-password`, body.toString(), { headers })
        .pipe(
            map((response: any) => {
              
                return response;
            }),
            catchError((error: any) => {
               
                console.error('Error en forgotPassword:', error);
                return throwError(() => new Error(error.error?.error || 'Hubo un error al enviar el correo. Verifique el correo que sea válido'));
            })
        );
}

resetPassword(token: string, newPassword: string) {
  const body = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);

  const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  return this.Http.post(`${this.apiUrlWorker}/reset-password`, body.toString(), { headers })
      .pipe(map((response: any) => response));
}
  
  
  isAuthenticated(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }
  
  logout(): void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/home']);
  }
  
  getUserInfo(): Observable<Trabajador> {
    const token = this.getToken();  // Obtiene el token del localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.Http.get<Trabajador>(`${this.apiUrlWorker}/me`, { headers });
  }
  
}
