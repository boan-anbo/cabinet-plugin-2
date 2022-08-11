import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LineType, MarkdownPoint} from "cabinet-node";
import {NGXLogger} from "ngx-logger";
import {PreviewService} from "../preview.service";
import {VscodeControlService} from "../../services/vscode-control.service";
import {ScrollService} from "../../services/scroll.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {VscodeStateService} from "../../services/vscode-state.service";
import {PreviewState} from "../../types/preview-state";
import {from, of, Subscription} from "rxjs";
import {PreviewNavService} from "./preview-nav.service";
import {PreviewStatesService} from "../../services/preview-states.service";

@Component({
  selector: 'app-preview-nav',
  templateUrl: './preview-nav.component.html',
  styleUrls: ['./preview-nav.component.css']
})
export class PreviewNavComponent implements OnInit, OnDestroy {

  @Input() points: MarkdownPoint [] = []

  mouseOverLine: number = -1

  // @ts-ignore
  pointInViewPointSubscription: Subscription
  // @ts-ignore
  mouseOverLinSubscription: Subscription;
  // @ts-ignore
  private mouseOverNavLineSubscription: Subscription;

  constructor(
    private logger: NGXLogger,
    public preview: PreviewService,
    public previewNav: PreviewNavService,
    private vscodeControl: VscodeControlService,
    public vscodeState: VscodeStateService,
    public scroll: ScrollService,
    public previewState: PreviewStatesService
  ) {
  }

  ngOnInit(): void {
    // turn set into an observable with rxjs and subscribe to it
    this.pointInViewPointSubscription = this.preview.linesInViewPortBroadCast.subscribe(
      (lines: Set<string>) => {
        this.logger.debug("linesInViewPortBroadCast", {lines})
        // check if preview nav allows sync
        if (!this.previewNav.allowNavToScrollWithPreview) {
          return
        }
        // sort lines by string
        const linesArray = Array.from(lines)
        linesArray.sort()

        // get first line in set use destructuring to get the first element
        const firstLine = linesArray[0]
        if (firstLine) {
          const firstLineId = 'nav-' + firstLine;
          // check if the preview nav entry is already in the view port, if so, do nothing
          if (!this.isPreviewNavLineInViewPort(firstLineId)) {
            this.scroll.scrollToId(firstLineId, -300)
          }
        }
      }
    )
    this.mouseOverLinSubscription = this.preview.mouseOverPreviewLine.subscribe(line => {
      if (line) {
        this.logger.debug("mouseOverLine", {line})
        this.mouseOverLine = line
      } else {
        this.mouseOverLine = -1
      }
    })

    this.mouseOverNavLineSubscription = this.preview.mouseOverNavLine.subscribe(line => {
      // if no line, scroll back to the selected point
      if (!line) {
      }
      if (this.previewState.autoScrollToMouseOverNavLine) {
        this.scroll.scrollToId('line-' + line, -300)
      }
    });
  }

  ngOnDestroy() {
    this.pointInViewPointSubscription?.unsubscribe()
    this.mouseOverLinSubscription?.unsubscribe()
  }

  onClickNavPoint(point: MarkdownPoint) {
    this.preview.jumpToPreviewLine(point.line)
  }


  isHeading(point: MarkdownPoint) {
    return point.lineType === LineType.HEADING
  }

  isLevelOne(point: MarkdownPoint): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 1
  }


  isLevelTwo(point: MarkdownPoint): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 2
  }

  isLevelThree(point: MarkdownPoint): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 3
  }

  isLevelFour(point: MarkdownPoint): boolean {
    if (!this.isHeading(point)) {
      return false;
    }
    return point.headerLevel === 4
  }

  onDblClickNavPoint(point: MarkdownPoint) {
    this.vscodeControl.askVscodeToJump(point.line)
  }

  drop($event: CdkDragDrop<MarkdownPoint[], any, any>) {
    this.logger.debug("drop event triggered", {$event})

    const movePoint = $event.item.data
    const isUpwards = $event.currentIndex < $event.previousIndex
    const isDownwards = $event.currentIndex > $event.previousIndex
    const noMove = $event.currentIndex === $event.previousIndex
    if (noMove) {
      return;
    }
    let moveToPointBefore
    let moveToPointAfter
    if (isUpwards) {
      moveToPointBefore = $event.container.data[$event.currentIndex]
    } else {
      moveToPointBefore = $event.container.data[$event.currentIndex + 1]
    }
    this.logger.debug(`movePoint ${movePoint.content}`, {movePoint})

    if (moveToPointBefore) {
      this.logger.debug(`targetPoint ${moveToPointBefore.content}`, {targetPoint: moveToPointBefore})
      this.vscodeControl.sendMoveInstruction($event.container.data, movePoint, moveToPointBefore, 'before')
    } else {
      // when the move point is dropped at the end of the list
      moveToPointAfter = $event.container.data[$event.currentIndex]
      this.logger.debug(`targetPoint ${moveToPointAfter.content}`, {targetPoint: moveToPointAfter})
      this.vscodeControl.sendMoveInstruction($event.container.data, movePoint, moveToPointAfter, 'after')
    }
  }

  canDrag() {
    return this.vscodeState.previewState.getValue() === PreviewState.DATA_READY
  }

  isPreviewLineInViewPort(line: number) {
    return this.preview.linesInViewPort.has('line-' + line)
  }

  isMouseOverLine(line: number) {
    return this.mouseOverLine === line
  }

  isPreviewNavLineInViewPort(lineId: string) {
    return this.previewNav.navLinesInViewPort.has(lineId)

  }

  onIntersection(event: { target: Element; visible: boolean }) {
    this.logger.debug('onIntersection', event);
    if (event.visible) {
      this.previewNav.navLinesInViewPort.add(event.target.id)
    } else {
      this.previewNav.navLinesInViewPort.delete(event.target.id)
    }
    this.preview.linesInViewPortBroadCast.next(this.preview.linesInViewPort)
  }

  onMouseLeaveNav() {
    this.preview.mouseOverNavLine.next(null)

    this.scrollBackToSelected();
  }

  /**
   * Scroll back to the selected point after mouse leave the nav
   */
  scrollBackToSelected() {
    if (this.previewState.autoScrollToMouseOverNavLine && this.previewState.selectedPoint && this.previewState.autoBackScrollToSelectedPointNav) {
      this.scroll.scrollToId('line-' + this.previewState.selectedPoint.getValue()?.line, -300)
    }
  }

  isNavPointSelected(point: MarkdownPoint) {
    return this.previewState.selectedPoint?.getValue()?.line === point.line
  }
}

