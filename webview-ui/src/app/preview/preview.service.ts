import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {Card, MarkdownPoint, CardConvert} from "cabinet-node";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {VscodeStateService} from "../services/vscode-state.service";
import {ScrollService} from "../services/scroll.service";
import {PreviewStatesService} from "../services/preview-states.service";
import {MarkdownProviderPayload} from "../../../../src/shared-types";


@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  testMessage = new BehaviorSubject<string>("");

  /**
   * a set with all markdown points currently in view
   */
  linesInViewPort: Set<string> = new Set();
  mouseOverPreviewLine = new BehaviorSubject<number | null>(null);
  /**
   * Current nav line under mouse
   */
  mouseOverNavLine = new BehaviorSubject<number | null>(null);
  linesInViewPortBroadCast = new BehaviorSubject<Set<string>>(this.linesInViewPort);
  showCardButtons = false;
  showRawMarkdownPoint = false;


  constructor(
    private httpClient: HttpClient,
    private logger: NGXLogger,
    private vsCodeStateService: VscodeStateService,
    private scrollService: ScrollService,
    private previewStates: PreviewStatesService
  ) {
    this.vsCodeStateService.currentActiveLine.subscribe(line => {
      if (line) {
        const rawLine = line;
        // log the line number
        this.logger.debug("Jump preview to editor active line", {line: rawLine});
        this.scrollService.scrollToLine(rawLine);
        const pointWithLine = this.markdownPoints.find(point => point.line === rawLine)
        if (pointWithLine) {
          this.previewStates.selectedPoint.next(pointWithLine)
        }
      }
    });
  }


  public markdownPoints: MarkdownPoint[] = []

  loadTestInput() {
    this.httpClient.get("assets/test/md-structure.json").subscribe(data => {
      const rawPojo = data as MarkdownPoint[]
      this.markdownPoints = rawPojo.map(rawPoint => {
        // insert five times the same card
        rawPoint.cards = rawPoint.cards.map(rawCard => {
          // @ts-ignore
          return [rawCard[0], CardConvert.fromApiCard(rawCard[1])]
        });
        return new MarkdownPoint(rawPoint)
      });
      this.markdownPoints = [...this.markdownPoints]
    })
    // load json file from angular asset folder
    // https://stackoverflow.com/questions/41006163/how-tddo-load-json-file-from-angular-asset-folder
  }

  loadMarkdownPoints(payload: MarkdownProviderPayload) {

    /**
     * Before loading markdown points, check if the preview is `frozen`, i.e. rejecting update.
     */
    if (!this.previewStates.allowVsCodeToProvideNewMarkdownPoints.getValue()) {
      this.logger.debug('received request to update markdown points but allowVsCodeToProvideNewMarkdownPoints is false')
      return
    }

    /**
     * If the preview is not frozen, check is the VsCode cursor-to-scroll sync is disabled, if so, enable it.
     * This provides a smoother user experience: after a user added a point, the cursor-to-scroll sync will be disabled from disrupting the user experience.
     * However, if the document has changed, the cursor-to-scroll sync should be re-enabled. Otherwise, the user will experience confusion why the scroll sync no longer works after adding a point.
     */
    if (!this.previewStates.allowVsCodeToScroll) {
      this.previewStates.allowVsCodeToScroll = true;
    }


    this.logger.debug("Preview loading provided payload", {payload});

    const rawPojo = payload.markdownPoints as MarkdownPoint[]
    this.markdownPoints = rawPojo.map(rawPoint => {
      rawPoint.cards = rawPoint.cards.map(rawCard => {
        // @ts-ignore
        return [rawCard[0], CardConvert.fromApiCard(rawCard[1])]
      });
      return new MarkdownPoint(rawPoint)
    }) ?? [];
  }

  jumpToPreviewLine(line: number) {
    this.scrollService.scrollToLine(line);
    const jumpedPoint = this.markdownPoints.find(point => point.line === line)
    if (jumpedPoint) {

      this.previewStates.selectedPoint.next(jumpedPoint)
    }
  }

  selectPoint(point: MarkdownPoint) {
    this.previewStates.selectedPoint.next(point)
  }

  deselectPoint(point: MarkdownPoint) {
    this.previewStates.selectedPoint.next(null)
  }

  isPointAParentOfPointB(pointA: MarkdownPoint, pointB: MarkdownPoint): boolean {
    if (!pointB.hasParent) {
      return false
    }
    return pointB.parentTopHeadingId === pointA.id
      || pointB.parent2ndHeadingId === pointA.id
      || pointB.parent3rdHeadingId === pointA.id
      || pointB.parent4thHeadingId === pointA.id
      || pointB.parent5thHeadingId === pointA.id;

  }
}
