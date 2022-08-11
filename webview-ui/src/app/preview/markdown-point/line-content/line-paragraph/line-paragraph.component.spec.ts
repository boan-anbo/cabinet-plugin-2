import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineParagraphComponent } from './line-paragraph.component';

describe('LineParagraphComponent', () => {
  let component: LineParagraphComponent;
  let fixture: ComponentFixture<LineParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineParagraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
