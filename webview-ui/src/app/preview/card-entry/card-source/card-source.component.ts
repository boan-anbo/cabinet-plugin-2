import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import {Card, Source} from "cabinet-node"
import {provideVSCodeDesignSystem, vsCodeButton} from "@vscode/webview-ui-toolkit";
import {faBookOpen} from "@fortawesome/free-solid-svg-icons";
import {VscodeControlService} from "../../../services/vscode-control.service";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(vsCodeButton());

@Component({
  selector: 'app-card-source',
  templateUrl: './card-source.component.html',
  styleUrls: ['./card-source.component.css']
})
export class CardSourceComponent implements OnInit, OnChanges {
  faInfo = faInfo;
  faFullText = faBookOpen;
  // @ts-ignore
  @Input() source: Source | null = null;
  // @ts-ignore
  @Input() card: Card;
  showSourceFullText = false;
  fullTextWithoutBreaks: string = '';

  constructor(
    private vscodeControl: VscodeControlService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.source?.text) {
      // replace single line breaks with empty string, but keep double line breaks.
      // save double line breaks as they are.
      this.fullTextWithoutBreaks = this.source.text.replace(/\n/g, '')

    }
  }

  toggleFullText($event: MouseEvent) {
    $event.preventDefault();
    this.showSourceFullText = !this.showSourceFullText
    $event.stopPropagation()
  }

  openFile() {
    this.vscodeControl.openFile(this.card.getCci().toJsonString())
  }
}
