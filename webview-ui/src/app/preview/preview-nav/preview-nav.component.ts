import {Component, Input, OnInit} from '@angular/core';
import {MarkdownPoint, LineType} from "cabinet-node";

@Component({
  selector: 'app-preview-nav',
  templateUrl: './preview-nav.component.html',
  styleUrls: ['./preview-nav.component.css']
})
export class PreviewNavComponent implements OnInit {

  @Input() points: MarkdownPoint [] = []
  constructor() { }

  ngOnInit(): void {
  }

  onClickHeader() {

  }

  isHeading(point: MarkdownPoint) {
    return point.lineType === LineType.HEADING
  }

  isLevelOne(point: MarkdownPoint ): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 1
  }


  isLevelTwo(point: MarkdownPoint ): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 2
  }

  isLevelThree(point: MarkdownPoint ): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 3
  }

  isLevelFour(point: MarkdownPoint ): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 4
  }
}

