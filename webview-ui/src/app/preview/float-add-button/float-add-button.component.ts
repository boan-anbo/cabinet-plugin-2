import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {faAdd, faHeading, faParagraph} from "@fortawesome/free-solid-svg-icons";
import {MarkdownPoint} from "cabinet-node";
import {VscodeControlService} from "../../services/vscode-control.service";
import {faLightbulb, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {MatMenuTrigger} from "@angular/material/menu";
import {BehaviorSubject, debounceTime, Subscription} from "rxjs";
import {PreviewStatesService} from "../../services/preview-states.service";

@Component({
  selector: 'app-float-add-button',
  templateUrl: './float-add-button.component.html',
  styleUrls: ['./float-add-button.component.css']
})
export class FloatAddButtonComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  mouseEnteredButton = new BehaviorSubject(false)
  mouseLeftButton = new BehaviorSubject(false);
  mouseEnteredMenu = false;
  @Input() addButtonType: 'add' | 'addAll' = 'add'
  faAddPointIcon = faAdd;
  faPoint = faLightbulb
  faParagraph = faParagraph
  faHeading = faHeading
  faAddAll = faSquarePlus;
  // @ts-ignore
  @Input() point: MarkdownPoint
  @Input() enable: boolean = true
  @Input() visible = true;

  constructor(
    public vscodeControl: VscodeControlService,
    private previewState: PreviewStatesService,
  ) { }

  // @ts-ignore
  subMouseLeftButton: Subscription
  // @ts-ignore
  subMouseEnteredButton: Subscription;
  // @ts-ignore
  subCurrentOpenMenuPoint: Subscription

  ngOnInit(): void {
    this.subMouseLeftButton = this.mouseLeftButton.pipe(debounceTime(100)).subscribe(v => {
      if (v && !this.mouseEnteredMenu) {
        this.closeMenu()
        this.previewState.currentOpenMenuPoint.next(null)
      }
    })

    this.subMouseEnteredButton = this.mouseEnteredButton
      .pipe(debounceTime(350))
      .subscribe((v) => {

        if (v) {
          this.openMenu()
        }

      });

    this.subCurrentOpenMenuPoint = this.previewState.currentOpenMenuPoint.subscribe((p: MarkdownPoint | null) => {

      if (p && p.id != this.point.id) {
        this.closeMenu()
      }
    })
  }

  ngOnDestroy(): void {
    this.subMouseLeftButton?.unsubscribe()
    this.subMouseEnteredButton?.unsubscribe()
    this.subCurrentOpenMenuPoint?.unsubscribe()
  }

  addPoint(mdMarkup: string, bodyParagraphsOnly: boolean, $event: MouseEvent) {
    const contentToAdd = []

    if (this.addButtonType === 'addAll') {
      bodyParagraphsOnly = true
    }

    if (!bodyParagraphsOnly) {
      contentToAdd.push(mdMarkup + ' ' + this.point.content)
    }

    if (bodyParagraphsOnly && this.point.bodyParagraphs?.length > 0) {
      contentToAdd.push(...this.point.bodyParagraphs.map(p => mdMarkup + ' ' + p))
    }
    this.vscodeControl.addPoint(contentToAdd.join('\n\n'), '')

    this.closeMenu()
    $event.stopPropagation()

  }

  closeMenu() {
    this.menuTrigger.closeMenu()

  }

  openMenu() {
    if (this.mouseLeftButton.value) {
      return;
    }
    this.menuTrigger.openMenu()
    this.previewState.currentOpenMenuPoint.next(this.point)
  }

  onMouseEnteredMenu() {
    this.mouseEnteredMenu = true
  }

  onMouseLeftMenu() {
    this.mouseEnteredMenu = false
    this.closeMenu()
    this.previewState.currentOpenMenuPoint.next(null)
  }

  onMouseEnterButton() {
    this.mouseLeftButton.next(false)
    this.mouseEnteredButton.next(true)
  }
}
