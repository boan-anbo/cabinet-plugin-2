import {Component, OnInit} from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
import { vscode } from "./utilities/vscode";
import {NGXLogger} from "ngx-logger";
import {PreviewService} from "./preview/preview.service";
import {VscodeStateService} from "./services/vscode-state.service";
import {InitService} from "./services/init.service";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(vsCodeButton());

// To register more toolkit components, simply import the component
// registration function and call it from within the register
// function, like so:
//
// provideVSCodeDesignSystem().register(
//   vsCodeButton(),
//   vsCodeCheckbox()
// );
//
// Finally, if you would like to register all of the toolkit
// components at once, there's a handy convenience function:
//
// provideVSCodeDesignSystem().register(allComponents.register());

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "hello-world";

  constructor(
    private logger: NGXLogger,
    private preview: PreviewService,
    private initService: InitService,
  ) {
  }


  handleHowdyClick() {

    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  ngOnInit(): void {
    this.initService.initAll();
    this.preview.loadTestInput();
  }
}
