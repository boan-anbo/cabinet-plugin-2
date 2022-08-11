import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Card } from 'cabinet-node';
import {faNoteSticky} from "@fortawesome/free-regular-svg-icons";
import {faHighlighter, faAdd, faTree} from "@fortawesome/free-solid-svg-icons";
import {VscodeControlService} from "../../services/vscode-control.service";
import {MarkdownPoint} from "cabinet-node";
import {ScrollService} from "../../services/scroll.service";
import {PreviewService} from "../preview.service";

@Component({
  selector: 'app-card-entry',
  templateUrl: './card-entry.component.html',
  styleUrls: ['./card-entry.component.css']
})
export class CardEntryComponent implements OnInit, OnChanges {
  faAddPointIcon = faAdd
  faNoteSticky = faNoteSticky;
  faHighlighter = faHighlighter;
  // @ts-ignore
  @Input() card: Card
  @Input() cardLine: number = 0;
  // @ts-ignore
  @Input() parentPoint: MarkdownPoint;
  sourceIcon = faTree;
  cardTextWithoutBreak : string = '';
  showButtons = false;

  constructor(
    public vscodeControl: VscodeControlService,
    public scroll: ScrollService,
    public preview: PreviewService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      this.cardTextWithoutBreak = this.card.text.trim().replace(/\n/g, ' ').trim();
    }
  }

  addCardToVsCode() {
    const cardCci = this.card.getCci().toCciMarker();
    this.vscodeControl.addCCI(cardCci);
  }

  hasTags(card: Card) {
    return card?.tags?.length > 0
  }
}
