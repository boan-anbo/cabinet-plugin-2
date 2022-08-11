import { Component, OnInit } from '@angular/core';
import {PreviewState} from "../../types/preview-state";
import {VscodeStateService} from "../../services/vscode-state.service";

@Component({
  selector: 'app-preview-status',
  templateUrl: './preview-status.component.html',
  styleUrls: ['./preview-status.component.css']
})
export class PreviewStatusComponent implements OnInit {

  constructor(
    public vsCodeState: VscodeStateService,
  ) { }

  ngOnInit(): void {
  }

  isLoading() {
    return this.vsCodeState.previewState.getValue() === PreviewState.WAITING_FOR_DATA;
  }

}
