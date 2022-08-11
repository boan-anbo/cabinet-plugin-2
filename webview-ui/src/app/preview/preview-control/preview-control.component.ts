import {Component, OnInit} from '@angular/core';
import {VscodeControlService} from "../../services/vscode-control.service";
import {PreviewService} from "../preview.service";
import {VscodeStateService} from "../../services/vscode-state.service";
import {PreviewNavService} from "../preview-nav/preview-nav.service";
import {PreviewStatesService} from "../../services/preview-states.service";

@Component({
  selector: 'app-preview-control',
  templateUrl: './preview-control.component.html',
  styleUrls: ['./preview-control.component.css']
})
export class PreviewControlComponent implements OnInit {


  constructor(
    public vsCodeControl: VscodeControlService,
    public previewService: PreviewService,
    public vsCodeState: VscodeStateService,
    public previewNavService: PreviewNavService,
    public previewState: PreviewStatesService
  ) {
  }

  ngOnInit(): void {
  }

  renderPreview() {
    this.vsCodeControl.requestCurrentMarkdown();
  }
}
