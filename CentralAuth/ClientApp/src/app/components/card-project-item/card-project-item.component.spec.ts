import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjectItemComponent } from './card-project-item.component';

describe('CardProjectItemComponent', () => {
  let component: CardProjectItemComponent;
  let fixture: ComponentFixture<CardProjectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProjectItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProjectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
