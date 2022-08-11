import {Component, Input, OnInit} from '@angular/core';
import {faBullseye, faParagraph} from "@fortawesome/free-solid-svg-icons";
import {MarkdownPoint} from "cabinet-node";

@Component({
  selector: 'app-line-other',
  templateUrl: './line-other.component.html',
  styleUrls: ['./line-other.component.css']
})
export class LineOtherComponent implements OnInit {
  faParagraph = faParagraph
  // @ts-ignore
  @Input() point:MarkdownPoint
  constructor() { }

  ngOnInit(): void {
  }

}
