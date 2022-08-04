import {Injectable} from '@angular/core';
import {RadioService} from "./radio.service";
import {CabinetCommandToVsCode, CabinetContentType} from "../../../../src/shared-types";

@Injectable({
  providedIn: 'root'
})
export class VscodeControlService {

  constructor(
    private radio: RadioService,
  ) {

  }

  requestDocumentUri() {
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.requestDocumentUri,
      contentType: CabinetContentType.none
    })
  }
}
