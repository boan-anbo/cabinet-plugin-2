import {Component, Input, OnInit} from '@angular/core';
import { Card } from 'cabinet-node';
import {faNoteSticky} from "@fortawesome/free-regular-svg-icons";
import {faHighlighter} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-card-entry',
  templateUrl: './card-entry.component.html',
  styleUrls: ['./card-entry.component.css']
})
export class CardEntryComponent implements OnInit {
  faNoteSticky = faNoteSticky;
  faHighlighter = faHighlighter;
  // @ts-ignore
  @Input() card: Card

  constructor() { }

  ngOnInit(): void {
  }

}
