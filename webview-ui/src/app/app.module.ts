import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppComponent} from "./app.component";
import {PreviewModule} from "./preview/preview.module";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {HttpClientModule} from "@angular/common/http";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NgScrollbarModule} from "ngx-scrollbar";
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";

@NgModule({
  declarations: [AppComponent],
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
    ScrollToModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
