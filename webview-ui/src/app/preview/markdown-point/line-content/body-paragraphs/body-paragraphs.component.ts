import {Component, Input, OnInit} from '@angular/core';
import { faParagraph } from '@fortawesome/free-solid-svg-icons';
import {MarkdownPoint} from "cabinet-node";

@Component({
  selector: 'app-body-paragraphs',
  templateUrl: './body-paragraphs.component.html',
  styleUrls: ['./body-paragraphs.component.css']
})
export class BodyParagraphsComponent implements OnInit {
  faParagraph = faParagraph

  // @ts-ignore
  @Input() point: MarkdownPoint;
  constructor() { }

  ngOnInit(): void {
  }

}
