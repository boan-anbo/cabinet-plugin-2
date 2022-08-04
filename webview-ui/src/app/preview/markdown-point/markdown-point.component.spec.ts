import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownPointComponent } from './markdown-point.component';

describe('MarkdownPointComponent', () => {
  let component: MarkdownPointComponent;
  let fixture: ComponentFixture<MarkdownPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
