import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineOtherComponent } from './line-other.component';

describe('LineOtherComponent', () => {
  let component: LineOtherComponent;
  let fixture: ComponentFixture<LineOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineOtherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
