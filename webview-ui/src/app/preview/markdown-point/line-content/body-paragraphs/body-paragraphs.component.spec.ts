import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyParagraphsComponent } from './body-paragraphs.component';

describe('BodyParagraphsComponent', () => {
  let component: BodyParagraphsComponent;
  let fixture: ComponentFixture<BodyParagraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodyParagraphsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyParagraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
