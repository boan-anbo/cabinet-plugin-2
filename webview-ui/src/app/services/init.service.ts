import {Injectable} from '@angular/core';
import {RadioService} from "./radio.service";
import {VscodeControlService} from "./vscode-control.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private radioService: RadioService,
    private vsCodeControl: VscodeControlService
  ) {

  }

  initAll() {

    this.radioService.init();

    this.vsCodeControl.requestDocumentUri();

  }
}
