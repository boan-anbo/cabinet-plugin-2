import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatAddButtonComponent } from './float-add-button.component';

describe('FloatAddButtonComponent', () => {
  let component: FloatAddButtonComponent;
  let fixture: ComponentFixture<FloatAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatAddButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
