import {Component, Input, OnInit} from '@angular/core';
import {MarkdownPoint, LineType} from "cabinet-node"
import {faBullseye, faHeading} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-line-content',
  templateUrl: './line-content.component.html',
  styleUrls: ['./line-content.component.css']
})
export class LineContentComponent implements OnInit {

  faIdea = faBullseye

  // @ts-ignore
  @Input() point: MarkdownPoint
  constructor() { }

  ngOnInit(): void {
  }

  isHeading() {
    return this.point.lineType === LineType.HEADING
  }

  isPoint() {
    return this.point.lineType === LineType.BULLET_POINT

  }

  isOthers() {
    return !this.isHeading() && !this.isPoint()
  }

}
