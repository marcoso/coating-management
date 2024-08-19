import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';
import { WINDOW_PROVIDERS } from './core/service/window.service';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { SpinnerInterceptor } from './core/interceptor/spinner.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    SpinnerOverlayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },    
    WINDOW_PROVIDERS,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
