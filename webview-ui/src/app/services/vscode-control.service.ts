import {Injectable} from '@angular/core';
import {RadioService} from "./radio.service";
import {CabinetCommandToVsCode, CabinetContentType, CardPlace} from "../../../../src/shared-types";
import {vscode} from '../utilities/vscode';
import {VscodeStateService} from "./vscode-state.service";
import {MarkdownPoint, movePoint} from "cabinet-node";
import {PreviewState} from "../types/preview-state";
import {PreviewStatesService} from "./preview-states.service";

@Injectable({
  providedIn: 'root'
})
export class VscodeControlService {

  constructor(
    private radio: RadioService,
    private vscodeState: VscodeStateService,
    private previewState: PreviewStatesService
  ) {

  }

  requestDocumentUri(isTest = false) {
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.requestDocumentUri,
      isTest: isTest,
      contentTypes: []
    })
  }


  addCCI(cciString: string, isTest = false) {
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.addCCI,
      isTest: isTest,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }

  insertLatex(cciString: string, isTest = false) {
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.insertLatex,
      isTest: isTest,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }

  openFile(cciString: string, isTest = false) {

    // add open file button
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.openFile,
      isTest: isTest,
      contentTypes: [CabinetContentType.text],
      text: cciString,
    });
  }


  addPoint(pointText: string, mdHeader: string, isTest = false) {

    // when adding point, automatically disable syncing with VSCODE cursor, because otherwise the preview will jump to the wrong line and cause confusion
    this.previewState.allowVsCodeToScroll = false;
    let text = pointText;
    if (mdHeader && mdHeader.length > 0) {
      text = mdHeader + " " + text;
    }
    const message = {
      command: CabinetCommandToVsCode.addPoint,
      isTest: isTest,
      contentTypes: [CabinetContentType.text],
      text,
    }

    // alert(JSON.stringify(message, null, 2));
    this.radio.postMessageToVscode(message);
  }

  // TODO fix card place
  jumpToLineByCard(cardPlace: CardPlace, isTest = false) {

    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.jumpToLineByCard,
      isTest: isTest,
      contentTypes: [CabinetContentType.payload],
      payload: cardPlace
    });
  }

  requestUsedCardsReport(isTest = false) {

    if (vscode) {
      this.radio.postMessageToVscode({
        command: CabinetCommandToVsCode.updateUsedCardsInPreview,
        isTest: isTest,
        contentTypes: [CabinetContentType.none]
      });
    }
  }

  askVscodeToJump(lineNumber: number, test = false) {
    alert('askVscodeToJump to ' + lineNumber);

    const documentUri = this.vscodeState.currentDocumentUri.getValue();

    if (!documentUri || !lineNumber) {
      throw new Error("documentUri and lineNumber are required");
    }

    const editorLineNumber = lineNumber;
    if (vscode) {
      console.log("sending message to vscode to jump to line", editorLineNumber);
      this.radio.postMessageToVscode({
        command: CabinetCommandToVsCode.jumpToLine,
        isTest: test,
        contentTypes: [CabinetContentType.lineNumber, CabinetContentType.uri],
        lineNumber: editorLineNumber,
        uri: documentUri
      });
    }
  }

  sendMoveInstruction(allPoints: MarkdownPoint[], pointToMove: MarkdownPoint, pointToMoveNextTo: MarkdownPoint, position: 'before' | 'after' | 'insideFirst' | 'insideLast', isTest = false) {

    /**
     * Before the move instruction is sent out, it has to unfreeze the preview, otherwise a changed original document will be different from what the preview is showing, and a next move instruction will be disastrous
     */
    this.previewState.allowVsCodeToProvideNewMarkdownPoints.next(true);
    const instruction = movePoint(allPoints, pointToMove, pointToMoveNextTo, position);
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.movePoints,
      contentTypes: [CabinetContentType.payload, CabinetContentType.uri],
      contentNote: "move instruction between two points",
      isTest: isTest,
      payload: instruction,
      uri: this.vscodeState.currentDocumentUri.getValue()
    })
  }

  /**
   * Ask VsCode to Provide Latest Markdown Points
   */
  requestCurrentMarkdown() {
    this.radio.postMessageToVscode({
      command: CabinetCommandToVsCode.requestCurrentMarkdown,
      contentTypes: [CabinetContentType.uri],
      uri: this.vscodeState.currentDocumentUri.getValue() ?? undefined
    })
    this.vscodeState.previewState.next(PreviewState.WAITING_FOR_DATA);
  }
}
