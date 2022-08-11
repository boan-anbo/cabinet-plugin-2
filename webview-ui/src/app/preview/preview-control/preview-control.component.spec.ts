import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewControlComponent } from './preview-control.component';

describe('PreviewControlComponent', () => {
  let component: PreviewControlComponent;
  let fixture: ComponentFixture<PreviewControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
