import {Component, Input, OnInit} from '@angular/core';
import {MarkdownPoint} from "cabinet-node";
import {faHeading} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-line-heading',
  templateUrl: './line-heading.component.html',
  styleUrls: ['./line-heading.component.css']
})
export class LineHeadingComponent implements OnInit {

  faHeading = faHeading
  // @ts-ignore
  @Input() point:MarkdownPoint
  constructor() { }

  ngOnInit(): void {
  }

}
