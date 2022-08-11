import {Component, Input, OnInit} from '@angular/core';
import {LineType, MarkdownPoint} from "cabinet-node";
import {faLightbulb} from "@fortawesome/free-regular-svg-icons";
import {faCircleChevronDown} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-line-point',
  templateUrl: './line-point.component.html',
  styleUrls: ['./line-point.component.css']
})
export class LinePointComponent implements OnInit {

  faPoint = faLightbulb
  // @ts-ignore
  @Input() point:MarkdownPoint
  constructor() { }

  ngOnInit(): void {
  }

  isNumberPoint() {
    return this.point.lineType === LineType.NUMBER_POINT
  }
}
