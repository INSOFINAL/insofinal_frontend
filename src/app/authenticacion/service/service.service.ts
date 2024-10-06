import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cliente, Prestamo, Trabajador } from '../../models/models.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private tokenKey = 'authToken';
  constructor(private Http: HttpClient, private router: Router) { }

  getPrestamoById(prestamoId: number): Observable<any> {
    return this.Http.get<any>(`${this.apiUrl}/${prestamoId}`);
  }

  // Buscar préstamos por DNI
  getPrestamosPorDni(dni: string): Observable<any[]> {
    return this.Http.get<Prestamo[]>(`${this.apiUrl}/prestamos/prestamoPorDni/${dni}`);
  }

  marcarPagoComoPagado(pagoId: number): Observable<any> {
    return this.Http.put<any>(`${this.apiUrl}/prestamos/marcarPagado/${pagoId}`, {});
  }


  crearPrestamo(prestamoData: Prestamo): Observable<Prestamo> {
    return this.Http.post<Prestamo>(`${this.apiUrl}/prestamos/crear`, prestamoData);
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
    
    return this.Http.post<any>(`${this.apiUrl}/trabajador/login`, null, { params }).pipe(
      tap(response => {
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
          callback(response.token);
        }
      })
    );
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
  
    return this.Http.get<Trabajador>(`${this.apiUrl}/trabajador/me`, { headers });
  }
  
}
