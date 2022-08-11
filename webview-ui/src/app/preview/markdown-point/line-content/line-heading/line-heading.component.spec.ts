import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineHeadingComponent } from './line-heading.component';

describe('LineHeadingComponent', () => {
  let component: LineHeadingComponent;
  let fixture: ComponentFixture<LineHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineHeadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
