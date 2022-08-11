import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MarkdownPoint} from "cabinet-node";

/**
 * Store static values for preview states, separated from preview service to avoid circular dependency.
 */
@Injectable({
  providedIn: 'root'
})
export class PreviewStatesService {

  /**
   * Toggle to allow vscode request to scroll preview
   */
  allowVsCodeToScroll = true;
  /**
   * Toggle to allow vscode to provide new markdown points, i.e. whether allow refresh from vscode
   */
  allowVsCodeToProvideNewMarkdownPoints = new BehaviorSubject<boolean>(true);

  selectedPoint: BehaviorSubject<MarkdownPoint | null> = new BehaviorSubject<MarkdownPoint | null>(null);

  /**
   * Whether to show all paragraphs.
   */
  showAllParagraphsGlobal = true;

  /**
   * Show only selected point.
   */
  showOnlySelectedPoint = false;

  /**
   * Whether automatically scroll to mouse over preview navigation line.
   */
  autoScrollToMouseOverNavLine = true;

  /**
   * Whether scroll back to the selected point.
   */
  autoBackScrollToSelectedPointNav = false;

  /**
   * Current open menu point
   */
  currentOpenMenuPoint: BehaviorSubject<MarkdownPoint | null> = new BehaviorSubject<MarkdownPoint | null>(null);

  _originalMarkdownText: string | null = null;

  set originalMarkdownText(text: string | null) {
    this._originalMarkdownText = text;
  }

  get originalMarkdownText(): string | null {
    return this._originalMarkdownText;
  }

  constructor() {
  }

  isPointSelected(pointId: string): boolean {
    return this.selectedPoint.value?.id === pointId;
  }
}

