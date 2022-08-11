import {Component, Input, OnInit} from '@angular/core';
import {faAdd, faParagraph} from '@fortawesome/free-solid-svg-icons';
import {VscodeControlService} from "../../../../services/vscode-control.service";
import {MarkdownPoint} from "cabinet-node";

@Component({
  selector: 'app-line-paragraph',
  templateUrl: './line-paragraph.component.html',
  styleUrls: ['./line-paragraph.component.css']
})
export class LineParagraphComponent implements OnInit {
  faParagraph = faParagraph
  faAddPointIcon = faAdd;
  // @ts-ignore
  @Input() point: MarkdownPoint
  @Input() paragraphContent = ''

  constructor(
    public vscodeControl: VscodeControlService,
  ) { }

  ngOnInit(): void {
  }

  addPoint($event: MouseEvent) {
    this.vscodeControl.addPoint(this.paragraphContent, '- ')
    $event.stopPropagation()
  }
}
