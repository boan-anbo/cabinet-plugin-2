import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {InitService} from "../services/init.service";
import {PreviewService} from "./preview.service";
import {provideVSCodeDesignSystem, vsCodeButton} from "@vscode/webview-ui-toolkit";
import {vscode} from "../utilities/vscode";
import {VscodeStateService} from "../services/vscode-state.service";
import {VscodeControlService} from "../services/vscode-control.service";
import {interval, Subscription} from "rxjs";
import {PreviewState} from "../types/preview-state";
import {NGXLogger} from "ngx-logger";
import {MarkdownPoint} from "cabinet-node";
import {PreviewStatesService} from "../services/preview-states.service";

provideVSCodeDesignSystem().register(vsCodeButton());

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {

  changeDetectorSubscription: Subscription | undefined = undefined;

  constructor(
    public vsCodeState: VscodeStateService,
    public preview: PreviewService,
    public changeDetector: ChangeDetectorRef,
    public logger: NGXLogger,
    private previewState: PreviewStatesService
  ) {
  }

  ngOnInit() {

    // use rxjs interval to automatically detect changes every 300 ms
    this.changeDetectorSubscription = interval(300).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.changeDetectorSubscription?.unsubscribe();
  }


  isLevel(point: MarkdownPoint, number: number) {
    // if point headerLevel > 0, it's a header
    return point.headerLevel > 0 ? point.headerLevel === number : point.parentHeaderLevel === number;
  }


  isParentHeaderLevel(point: MarkdownPoint, number: number) {
    // return point.parentHeaderLevel === number;
    return false
  }

  shouldShowPoint(markdownPoint: MarkdownPoint) {
    if (!this.previewState.showOnlySelectedPoint) {
      return true;
    } else {
      if (this.previewState.isPointSelected(markdownPoint.id)) {
        return true;
      }
      // check if the unselected point is a child of the selected point
      const selectedPoint = this.previewState.selectedPoint.getValue();
      if (!selectedPoint) {
        return false;
      }

      return this.preview.isPointAParentOfPointB(selectedPoint, markdownPoint);


    }
  }
}
