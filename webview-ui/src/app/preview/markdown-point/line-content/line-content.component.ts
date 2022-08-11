import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MarkdownPoint, LineType} from "cabinet-node"
import {faAdd, faBullseye, faCircleChevronDown, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import {VscodeControlService} from "../../../services/vscode-control.service";
import {PreviewService} from "../../preview.service";
import {PreviewStatesService} from "../../../services/preview-states.service";
import {fadeAnimation} from "../../../animations/show-downward";


@Component({
  selector: 'app-line-content',
  templateUrl: './line-content.component.html',
  styleUrls: ['./line-content.component.css'],
  animations: [
    fadeAnimation
  ]
})
export class LineContentComponent implements OnInit {
  faAddPointIcon = faAdd;

  faBodyParagraph = faCircleChevronDown;
  faIdea = faBullseye
  // @ts-ignore
  // @ts-ignore
  @Input() point: MarkdownPoint


  constructor(
    public vscodeControl: VscodeControlService,
    public preview: PreviewService,
    public previewStates: PreviewStatesService,
  ) {
  }

  ngOnInit(): void {
  }

  isHeading() {
    return this.point.lineType === LineType.HEADING
  }

  isPoint() {
    return this.point.lineType === LineType.NUMBER_POINT || this.point.lineType === LineType.BULLET_POINT

  }

  isOther() {
    return !this.isHeading() && !this.isPoint()
  }

  addPoint(bodyParagraphsOnly: boolean, $event: MouseEvent) {
    const contentToAdd = [
    ]

    const mdMarkup = this.point.mdMarkup;

    if (!bodyParagraphsOnly) {
      contentToAdd.push(mdMarkup + ' ' + this.point.content)
    }

    if (bodyParagraphsOnly && this.point.bodyParagraphs?.length > 0) {

      contentToAdd.push(...this.point.bodyParagraphs.map(p => mdMarkup + ' ' + p))
    }
    this.vscodeControl.addPoint(contentToAdd.join('\n\n'), '')

    $event.stopPropagation()

  }

  isPointSelected() {
    return this.previewStates.isPointSelected(this.point.id)
  }

  hasParagraphs() {
    return this.point.bodyParagraphs?.length > 0

  }

  shouldShowParagraphs() {

    if (!this.hasParagraphs()) {
      return false
    }

    if (this.previewStates.showAllParagraphsGlobal) {
      return true;
    }
    return this.isPointSelected()
  }
}
