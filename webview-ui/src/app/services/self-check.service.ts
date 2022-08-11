import { Injectable } from '@angular/core';
import {CabinetCommandToVsCode, CabinetCommandToWebView} from "../../../../src/shared-types";
import {VscodeControlService} from "./vscode-control.service";
import {VscodeStateService} from "./vscode-state.service";

@Injectable({
  providedIn: 'root'
})
export class SelfCheckService {
  constructor(
    private vscodeControl: VscodeControlService,
    private vscodeStates: VscodeStateService,
  ) { }

  resetAllChecks() {
    for (let key in this.vscodeStates.checkEntries) {
      this.vscodeStates.checkEntries[key] = false;
    }
  }

  testAll() {
    this.resetAllChecks();

    this.vscodeControl.addPoint('test', 'test',true);
    this.vscodeControl.requestDocumentUri(true);
    this.vscodeControl.askVscodeToJump(1, true);
    this.vscodeControl.addCCI('test',true);
    this.vscodeControl.insertLatex('test',true);
    this.vscodeControl.openFile('test',true);
  }

}
