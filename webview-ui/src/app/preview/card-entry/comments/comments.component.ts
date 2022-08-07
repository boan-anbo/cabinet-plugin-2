import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "cabinet-node"

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment [] = []

  constructor() { }

  ngOnInit(): void {
  }

}
