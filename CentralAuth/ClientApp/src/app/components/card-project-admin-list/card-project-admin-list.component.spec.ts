import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProjectAdminListComponent } from './card-project-admin-list.component';

describe('CardProjectAdminListComponent', () => {
  let component: CardProjectAdminListComponent;
  let fixture: ComponentFixture<CardProjectAdminListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProjectAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProjectAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
