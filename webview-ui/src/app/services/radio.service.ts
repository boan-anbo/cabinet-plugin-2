import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {
  CabinetCommandToVsCode,
  CabinetCommandToWebView,
  CabinetContentType,
  CabinetMessageToVsCode,
  CabinetMessageToWebView, MarkdownProviderPayload
} from "../../../../src/shared-types";
import {PreviewService} from "../preview/preview.service";
import {vscode} from "../utilities/vscode";
import {VscodeStateService} from "./vscode-state.service";
import {PreviewState} from "../types/preview-state";
import {PreviewStatesService} from "./preview-states.service";

// Get access to the VS Code API from within the webview context

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  constructor(
    private logger: NGXLogger,
    private preview: PreviewService,
    private vsCodeState: VscodeStateService,
    private previewStates: PreviewStatesService
  ) {
  }

  init() {
    this.setVSCodeMessageListener();
  }


  /**
   * Handle messages from the extension backend.
   * Radio send messages to other services to tell them to do something.
   */
  setVSCodeMessageListener() {
    window.addEventListener("message", (event: MessageEvent<CabinetMessageToWebView<any>>) => {

      this.logger.debug(`Radio heard Message To WebView: ${event.data.command ?? ''}`, {event});

      const message = event.data;
      const command = message.command;
      const payload = message.payload;

      switch (command) {
        case "test":
          this.logger.debug("Radio heard test");
          this.preview.testMessage.next(event.data.payload);
          break;
        case CabinetCommandToWebView.provideTestReport:
          const reportCommand = (message.text as CabinetCommandToVsCode)
          this.vsCodeState.checkEntries[reportCommand] = true;
          break;
        case CabinetCommandToWebView.provideCurrentMarkdownPoints:

          if ((payload as MarkdownProviderPayload).options.forceRefresh) {
            this.previewStates.allowVsCodeToProvideNewMarkdownPoints.next(true);
          }

          this.previewStates.originalMarkdownText = payload.markdownText

          if (message.uri) {
            this.vsCodeState.currentDocumentUri.next(message.uri);
            this.vsCodeState.previewState.next(PreviewState.DATA_READY);
          }

          this.preview.loadMarkdownPoints(payload as MarkdownProviderPayload);

          break;
        case CabinetCommandToWebView.setDocumentUri:
          if (payload.uri) {
            this.vsCodeState.currentDocumentUri.next(payload.uri)
          } else {
            this.logger.error("Radio heard setDocumentUri but no uri provided");
          }

          break;
        case CabinetCommandToWebView.updateUsedCards:
          alert("update used cards")
          break;

        case "goToLine":

          if (!this.previewStates.allowVsCodeToScroll) {
            return;
          }
          console.log("received go to line request for", {
            message
          });

          if (message.uri) {
            // if document uri is provided, check if it's the same as the current document
            if (message.uri !== this.vsCodeState.currentDocumentUri.getValue()) {
              console.log('Jump request received, but the uri are different, so ignoring it');
              return;
            }
          }
          if (message.lineNumber) {
            this.vsCodeState.currentActiveLine.next(message.lineNumber);
          }
          break;
      }
    });
  }

  postMessageToVscode<T = any>(message: CabinetMessageToVsCode<T>) {
    this.logger.debug(`Radio sending Message To VSCode: ${message.command ?? ''}`, {message});
    let throwError = false;
    // check the completeness of the message with contentTypes
    message.contentTypes.forEach(type => {
      if (type === CabinetContentType.text) {
        if (!message.text) {
          this.logger.error(`Content missing claimed types: ${CabinetContentType.text}`, message)
          throwError = true;
        }
      }
      if (type === CabinetContentType.lineNumber) {
        // check if message line number exists and is a valid number
        if (typeof message.lineNumber !== "number" || message.lineNumber < 0) {
          this.logger.error(`Content missing claimed types: ${CabinetContentType.lineNumber}`, message)
          throwError = true;
        }
      }
      if (type === CabinetContentType.uri) {
        if (!message.uri) {
          this.logger.error(`Content missing claimed types: ${CabinetContentType.uri}`, message)
          throwError = true;
        }
      }
      if (type === CabinetContentType.payload) {
        if (!message.payload) {
          this.logger.error(`Content missing claimed types: ${CabinetContentType.payload}`, message)
          throwError = true;
        }
      }
    })

    if (throwError) {
      throw new Error("Message asked to send to VSCode is incomplete");
    }
    vscode.postMessage(message);
  }

}
