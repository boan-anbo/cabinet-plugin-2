import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTagsComponent } from './card-tags.component';

describe('CardTagsComponent', () => {
  let component: CardTagsComponent;
  let fixture: ComponentFixture<CardTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
