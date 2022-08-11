import {Injectable} from '@angular/core';
import {RadioService} from "./radio.service";
import {VscodeControlService} from "./vscode-control.service";
import {TitleService} from "./title.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private radioService: RadioService,
    private vsCodeControl: VscodeControlService,
    private title: TitleService
  ) {

  }

  initAll() {

    this.radioService.init();

    this.title.init();

    this.vsCodeControl.requestDocumentUri();



  }
}
