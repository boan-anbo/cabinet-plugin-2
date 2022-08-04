import { Component, OnInit } from '@angular/core';
import {InitService} from "../services/init.service";
import {PreviewService} from "./preview.service";
import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
import { vscode } from "../utilities/vscode";
import {VscodeStateService} from "../services/vscode-state.service";

provideVSCodeDesignSystem().register(vsCodeButton());

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor(
    private initService: InitService,
    public preview: PreviewService,
    public vsCodeState: VscodeStateService
  )
   { }

  ngOnInit(): void {
    this.initService.initAll();
    this.preview.loadTestInput();
  }

}
