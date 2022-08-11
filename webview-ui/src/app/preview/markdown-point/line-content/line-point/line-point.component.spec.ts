import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePointComponent } from './line-point.component';

describe('LinePointComponent', () => {
  let component: LinePointComponent;
  let fixture: ComponentFixture<LinePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinePointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
