import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Card, Tag } from 'cabinet-node';
import {faStar} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-card-tags',
  templateUrl: './card-tags.component.html',
  styleUrls: ['./card-tags.component.css']
})
export class CardTagsComponent implements OnInit, OnChanges {
  faImportant = faStar;

  // @ts-ignore
  @Input() card: Card

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  isTagImportant(tag: Tag) {
    return tag.key.toLowerCase()=== 'important' || tag.key.toLowerCase()=== 'point'
  }

}
