import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "cabinet-node"

import {faComment} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  faComment = faComment
  // @ts-ignore
  @Input() comment: Comment

  constructor() { }

  ngOnInit(): void {
  }

}
