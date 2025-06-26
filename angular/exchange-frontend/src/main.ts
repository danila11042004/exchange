import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
bootstrapApplication(App, {
  providers: [
        importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
