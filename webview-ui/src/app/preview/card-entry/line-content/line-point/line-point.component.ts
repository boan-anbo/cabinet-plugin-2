import {Component, Input, OnInit} from '@angular/core';
import {MarkdownPoint} from "cabinet-node";
import {faBullseye} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-line-point',
  templateUrl: './line-point.component.html',
  styleUrls: ['./line-point.component.css']
})
export class LinePointComponent implements OnInit {

  faPoint = faBullseye
  // @ts-ignore
  @Input() point:MarkdownPoint
  constructor() { }

  ngOnInit(): void {
  }
}
