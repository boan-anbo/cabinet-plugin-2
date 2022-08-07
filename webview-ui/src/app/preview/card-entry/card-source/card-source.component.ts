import {Component, Input, OnInit} from '@angular/core';
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import {Source} from "cabinet-node"
import {provideVSCodeDesignSystem, vsCodeButton} from "@vscode/webview-ui-toolkit";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(vsCodeButton());

@Component({
  selector: 'app-card-source',
  templateUrl: './card-source.component.html',
  styleUrls: ['./card-source.component.css']
})
export class CardSourceComponent implements OnInit {
  faInfo = faInfo;
  // @ts-ignore
  @Input() source : Source | null = null;
  showSourceFullText = false;

  constructor() { }

  ngOnInit(): void {
  }

}
