import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "cabinet-node"

import {faComment} from "@fortawesome/free-regular-svg-icons";
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import {VscodeControlService} from "../../../../services/vscode-control.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  faAdd = faAdd
  faComment = faComment
  // @ts-ignore
  @Input() comment: Comment

  constructor(
    private vscodeControl: VscodeControlService
  ) { }

  ngOnInit(): void {
  }

  addPoint(text: string) {
    this.vscodeControl.addPoint(text, '-')
  }
}
