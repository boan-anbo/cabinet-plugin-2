import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { MarkdownPointComponent } from './markdown-point/markdown-point.component';
import { CardEntryComponent } from './card-entry/card-entry.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { CardSourceComponent } from './card-source/card-source.component';
import {MatButtonModule} from "@angular/material/button";
import { PreviewNavComponent } from './preview-nav/preview-nav.component';
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";



@NgModule({
    declarations: [
        PreviewComponent,
        MarkdownPointComponent,
        CardEntryComponent,
        CardSourceComponent,
        PreviewNavComponent
    ],
    exports: [
        PreviewComponent
    ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    ScrollToModule
  ]
})
export class PreviewModule { }
