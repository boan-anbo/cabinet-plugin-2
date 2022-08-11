import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LineType, MarkdownPoint} from "cabinet-node";
import {faBullseye} from "@fortawesome/free-solid-svg-icons";
import {PreviewService} from "../preview.service";
import {Subscription} from "rxjs";
import {VscodeControlService} from "../../services/vscode-control.service";
import {NGXLogger} from "ngx-logger";
import {PreviewStatesService} from "../../services/preview-states.service";

@Component({
  selector: 'app-markdown-point',
  templateUrl: './markdown-point.component.html',
  styleUrls: ['./markdown-point.component.css']
})
export class MarkdownPointComponent implements OnInit, OnDestroy {

  navMouseOverLine = -1;
  faIdea = faBullseye
  // @ts-ignore
  @Input() point: MarkdownPoint;
  @Input() pointIndex: number = 0;

  watchHighlighPoint: Subscription | undefined = undefined;
  shouldHighlight = false;

  constructor(
    public preview: PreviewService,
    public previewStates: PreviewStatesService,
    public vscodeControl: VscodeControlService,
    private logger: NGXLogger
  ) {

    this.previewStates.selectedPoint
      .subscribe(point => {
        if (point) {
          this.shouldHighlight = point.line === this.point.line;
        }
      })

    this.preview.mouseOverNavLine.subscribe(line => {
      if (line) {
        this.navMouseOverLine = line
      } else {
        this.navMouseOverLine = -1
      }
    })

  }

  ngOnDestroy() {
    this.watchHighlighPoint?.unsubscribe();
  }

  ngOnInit(): void {
  }

  isHeader(): boolean {
    return this.point.lineType === LineType.HEADING
  }


  onIntersection(event: { target: Element; visible: boolean }) {
    this.logger.debug('onIntersection', event);
    if (event.visible) {
      this.preview.linesInViewPort.add(event.target.id)
    } else {
      this.preview.linesInViewPort.delete(event.target.id)
    }
    this.preview.linesInViewPortBroadCast.next(this.preview.linesInViewPort)
  }

  isMouseOver() {
    return this.navMouseOverLine === this.point.line
  }

  selectPoint(point: MarkdownPoint) {
    // if the current view mode is selected point only, do not select the point, for it will disrupt user experience.
    if (this.previewStates.showOnlySelectedPoint) {
      return
    }
    // if selected -> deselect
    this.preview.selectPoint(point)
  }

  isSelected(): boolean {
    return this.previewStates.isPointSelected(this.point.id)
  }

  isLevel(number: number): boolean {
    return this.point.headerLevel === number
  }

}
