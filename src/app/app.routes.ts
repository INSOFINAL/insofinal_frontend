import { Routes } from '@angular/router';
import { GenerarPrestamoComponent } from './generar-prestamo/generar-prestamo.component';
import { HistorialPrestamoComponent } from './historial-prestamo/historial-prestamo.component';
import { LoginComponent } from './authenticacion/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authenticatedGuard } from './authenticacion/guards/authenticated.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegistrarTrabajadorComponent } from './registrar-trabajador/registrar-trabajador.component';
import { adminGuard } from './authenticacion/guards/admin.guard';
import { workerGuard } from './authenticacion/guards/worker.guard';
import { DashboardWorkerComponent } from './dashboard-worker/dashboard-worker.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [


    //rutas admin
    {
        path:'loan-history',
        title: 'Historial',
        component: HistorialPrestamoComponent,
        canActivate: [adminGuard]
    },

    {
        path:'dashboard',
        title: 'Inicio',
        component: DashboardComponent,
        canActivate: [adminGuard]
    },
    
    {
        path:'generate-loan',
        title: 'Generar Prestamo',
        component: GenerarPrestamoComponent,
        canActivate: [adminGuard]
    },

    {
        path: 'change-password',
        title: 'Cambie su contraseña',
        component: ChangePasswordComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'register-worker',
        title: 'Registrar Trabajador',
        component: RegistrarTrabajadorComponent,
        canActivate: [adminGuard]
    },

//rutas worker
    {
        path:'dashboard-worker',
        title: 'Inicio',
        component: DashboardWorkerComponent,
        canActivate: [workerGuard]
    },
    {
        path: 'change-password-worker',
        title: 'Cambie su contraseña',
        component: ChangePasswordComponent,
        canActivate: [workerGuard]
    },


    {
        path:'generate-loan-w',
        title: 'Generar Prestamo',
        component: GenerarPrestamoComponent,
        canActivate: [workerGuard]
    },


    {
        path:'loan-history-w',
        title: 'Historial',
        component: HistorialPrestamoComponent,
        canActivate: [workerGuard]
    },

    {
        path: 'forgot-password',
        title: 'Recuperar contraseña',
        component: ForgotPasswordComponent,
        canActivate: [authenticatedGuard]
      },
      {
        path: 'reset-password',
        title: 'Cambiar Contraseña',
        component: ResetPasswordComponent,
        canActivate: [authenticatedGuard]
      },


    //redireccion principal
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
