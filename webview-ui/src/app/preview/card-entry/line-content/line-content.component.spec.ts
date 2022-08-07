import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineContentComponent } from './line-content.component';

describe('LineContentComponent', () => {
  let component: LineContentComponent;
  let fixture: ComponentFixture<LineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
