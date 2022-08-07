import {Component, Input, OnInit} from '@angular/core';
import {LineType, MarkdownPoint} from "cabinet-node";
import {faBullseye} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-markdown-point',
  templateUrl: './markdown-point.component.html',
  styleUrls: ['./markdown-point.component.css']
})
export class MarkdownPointComponent implements OnInit {

  faIdea = faBullseye
  // @ts-ignore
  @Input() point: MarkdownPoint;

  constructor() { }

  ngOnInit(): void {
  }

  isHeader(): boolean {
    return this.point.lineType === LineType.HEADING
  }



}
