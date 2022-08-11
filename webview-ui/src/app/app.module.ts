import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from "./app.component";
import {PreviewModule} from "./preview/preview.module";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {HttpClientModule} from "@angular/common/http";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";
import { HealthCheckComponent } from './health-check/health-check.component';
import { AppRoutingModule } from './app-routing.module';
import {InViewportModule} from "ng-in-viewport";

@NgModule({
  declarations: [AppComponent, HealthCheckComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    PreviewModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
    }),
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ScrollToModule.forRoot(

    ),
    AppRoutingModule,
    InViewportModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
