import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUserLoginComponent } from './card-user-login.component';

describe('CardUserLoginComponent', () => {
  let component: CardUserLoginComponent;
  let fixture: ComponentFixture<CardUserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardUserLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
