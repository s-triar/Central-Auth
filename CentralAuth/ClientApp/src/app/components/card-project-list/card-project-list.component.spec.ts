import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjectListComponent } from './card-project-list.component';

describe('CardProjectListComponent', () => {
  let component: CardProjectListComponent;
  let fixture: ComponentFixture<CardProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
