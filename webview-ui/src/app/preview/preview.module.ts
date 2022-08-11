import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { MarkdownPointComponent } from './markdown-point/markdown-point.component';
import { CardEntryComponent } from './card-entry/card-entry.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { CardSourceComponent } from './card-entry/card-source/card-source.component';
import {MatButtonModule} from "@angular/material/button";
import { PreviewNavComponent } from './preview-nav/preview-nav.component';
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";
import { CommentsComponent } from './card-entry/comments/comments.component';
import { CommentComponent } from './card-entry/comments/comment/comment.component';
import { LineContentComponent } from './markdown-point/line-content/line-content.component';
import { LineHeadingComponent } from './markdown-point/line-content/line-heading/line-heading.component';
import { LinePointComponent } from './markdown-point/line-content/line-point/line-point.component';
import {AppRoutingModule} from "../app-routing.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { CardTagsComponent } from './card-entry/card-tags/card-tags.component';
import {MatChipsModule} from "@angular/material/chips";
import { PreviewControlComponent } from './preview-control/preview-control.component';
import { PreviewStatusComponent } from './preview-status/preview-status.component';
import {InViewportModule} from "ng-in-viewport";
import { LineOtherComponent } from './markdown-point/line-content/line-other/line-other.component';
import { BodyParagraphsComponent } from './markdown-point/line-content/body-paragraphs/body-paragraphs.component';
import { LineParagraphComponent } from './markdown-point/line-content/line-paragraph/line-paragraph.component';
import { FloatAddButtonComponent } from './float-add-button/float-add-button.component';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";



@NgModule({
    declarations: [
        PreviewComponent,
        MarkdownPointComponent,
        CardEntryComponent,
        CardSourceComponent,
        PreviewNavComponent,
        CommentsComponent,
        CommentComponent,
        LineContentComponent,
        LineHeadingComponent,
        LinePointComponent,
        CardTagsComponent,
        PreviewControlComponent,
        PreviewStatusComponent,
        LineOtherComponent,
        BodyParagraphsComponent,
        LineParagraphComponent,
        FloatAddButtonComponent
    ],
    exports: [
        PreviewComponent
    ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    ScrollToModule,
    AppRoutingModule,
    MatTooltipModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    InViewportModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ]
})
export class PreviewModule { }
