import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewStatusComponent } from './preview-status.component';

describe('PreviewStatusComponent', () => {
  let component: PreviewStatusComponent;
  let fixture: ComponentFixture<PreviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
