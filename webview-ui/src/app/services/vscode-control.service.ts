import {Injectable} from '@angular/core';
import {RadioService} from "./radio.service";
import {CabinetCommandToVsCode, CabinetContentType, CardPlace} from "../../../../src/shared-types";
import {vscode} from '../utilities/vscode';

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
      contentTypes: []
    })
  }


  addCCI(cciString: string) {
    this.radio.postMessageToVscode({
      // command: "addCCI",
      command: CabinetCommandToVsCode.addCCI,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }

  insertLatex(cciString: string) {
    this.radio.postMessageToVscode({
      // command: "insertLatex",
      command: CabinetCommandToVsCode.insertLatex,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }

  openFile(cciString: string) {

    // add open file button
    this.radio.postMessageToVscode({
      // command: "openFile",
      command: CabinetCommandToVsCode.openFile,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }


  addPoint(pointText: string) {

    this.radio.postMessageToVscode({
      // command: "addPoint",
      command: CabinetCommandToVsCode.addPoint,
      contentTypes: [CabinetContentType.text],
      text: pointText,
    });
  }

  // TODO fix card place
  jumpToLineByCard(cardPlace: CardPlace) {

    this.radio.postMessageToVscode({
      // command: "jumpToLineByCard",
      command: CabinetCommandToVsCode.jumpToLineByCard,
      contentTypes: [CabinetContentType.payload],
      payload: cardPlace
    });
  }

  requestUsedCardsReport() {

    if (vscode) {
      this.radio.postMessageToVscode({
        command: CabinetCommandToVsCode.updateUsedCardsInPreview,
        contentTypes: [CabinetContentType.none]
      });
    }
  }

  askVscodeToJump(documentUri:any, lineNumber:any, event:any) {
    // send message to vscode to add point
    if (vscode) {
      console.log("sending message to vscode to jump to line", lineNumber);
      this.radio.postMessageToVscode({
        command: CabinetCommandToVsCode.jumpToLine,
        contentTypes: [CabinetContentType.lineNumber, CabinetContentType.uri],
        lineNumber: lineNumber,
        uri: documentUri
      });

    }
  }

}
