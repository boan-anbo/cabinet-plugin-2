import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CabinetCommandToWebView, CabinetMessageToVsCode, CabinetMessageToWebView} from "../../../../src/shared-types";
import {PreviewService} from "../preview/preview.service";
import {vscode} from "../utilities/vscode";
import {VscodeStateService} from "./vscode-state.service";

// Get access to the VS Code API from within the webview context

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  constructor(
    private logger: NGXLogger,
    private preview: PreviewService,
    private vsCodeState: VscodeStateService,
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
        case CabinetCommandToWebView.setDocumentUri:
          if (payload.uri) {
            this.vsCodeState.currentDocumentUri.next(payload.uri)
          } else {
            this.logger.error("Radio heard setDocumentUri but no uri provided");
          }
      }
    });
  }

  postMessageToVscode<T = any>(message: CabinetMessageToVsCode<T>) {
    this.logger.debug(`Radio sending Message To VSCode: ${message.command ?? ''}`, {message});
    vscode.postMessage(message);
  }

}
