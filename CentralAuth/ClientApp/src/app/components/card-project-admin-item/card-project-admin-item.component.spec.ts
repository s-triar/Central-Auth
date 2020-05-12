import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjectAdminItemComponent } from './card-project-admin-item.component';

describe('CardProjectAdminItemComponent', () => {
  let component: CardProjectAdminItemComponent;
  let fixture: ComponentFixture<CardProjectAdminItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProjectAdminItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProjectAdminItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
