import {Component, Input, OnInit} from '@angular/core';
import {MarkdownPoint} from "cabinet-node";

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
}
