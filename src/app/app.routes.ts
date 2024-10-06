import { Routes } from '@angular/router';
import { GenerarPrestamoComponent } from './generar-prestamo/generar-prestamo.component';
import { HistorialPrestamoComponent } from './historial-prestamo/historial-prestamo.component';
import { LoginComponent } from './authenticacion/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authenticatedGuard } from './authenticacion/guards/authenticated.guard';
import { authGuard } from './authenticacion/guards/auth.guard';

export const routes: Routes = [
    {
        path:'loan-history',
        title: 'Historial',
        component: HistorialPrestamoComponent,
        canActivate: [authGuard]
    },

    {
        path:'dashboard',
        title: 'Inicio',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path:'generate-loan',
        title: 'Generar Prestamo',
        component: GenerarPrestamoComponent,
        canActivate: [authGuard]
    },

    {
        path:'home',
        title: 'Prestamos',
        component: LoginComponent,
        canActivate: [authenticatedGuard]
    },
    {
        path: '**',
        redirectTo: '/home'
    }


];
