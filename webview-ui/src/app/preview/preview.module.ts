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
import { LineContentComponent } from './card-entry/line-content/line-content.component';
import { LineHeadingComponent } from './card-entry/line-content/line-heading/line-heading.component';
import { LinePointComponent } from './card-entry/line-content/line-point/line-point.component';



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
        LinePointComponent
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
