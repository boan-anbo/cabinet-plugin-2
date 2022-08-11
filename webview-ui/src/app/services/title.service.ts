import {Injectable} from '@angular/core';
import {VscodeStateService} from "./vscode-state.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private vscodeState: VscodeStateService) {
  }

  init() {

    this.vscodeState.currentDocumentUri.subscribe((currentUri) => {
      if (currentUri && currentUri != 'NONE' && currentUri.length > 0) {
        this.setBrowserWindowTitle();
      } else {
        window.document.title = 'Magic Outline';
      }

    })
  }

  setBrowserWindowTitle() {
    // use the last part, the file name, of the document uri
    const title = this.vscodeState.currentDocumentUri.value.split('/').pop();
    if (title) {
      window.document.title = title;
    }
  }
}
