import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp, firebaseApp$ } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './env/environment';
import localeAr from '@angular/common/locales/ar-EG';
import { registerLocaleData } from '@angular/common';

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { DatepickerI18nService } from './core/services/datepicker-i18n.service';
import { NgbDatepickerConfig, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

registerLocaleData(localeAr);

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, '../../public/i18n', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideRouter(routes),
    importProvidersFrom([
      BrowserAnimationsModule,
      GoogleTagManagerModule.forRoot({
        id: 'GTM-WGDFSM2J',
      }),
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    
    { provide: NgbDatepickerI18n, useClass: DatepickerI18nService },
    
    {
      provide: NgbDatepickerConfig,
      useFactory: (translate: TranslateService) => {
        const config = new NgbDatepickerConfig();

        // helper to set correct first day
        const updateFirstDay = (lang: string) => {
          if (lang === 'ar') {
            config.firstDayOfWeek = 6; 
          } else {
            config.firstDayOfWeek = 7; 
          }
        };

        // initialize
        updateFirstDay(translate.currentLang);

        // listen to language changes
        translate.onLangChange.subscribe(e => updateFirstDay(e.lang));

        return config;
      },
      deps: [TranslateService]
    }
  ]
  
};
