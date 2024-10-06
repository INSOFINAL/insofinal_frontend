import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers:[
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    HttpClientModule
  ],
}).catch((err) => console.error(err));
