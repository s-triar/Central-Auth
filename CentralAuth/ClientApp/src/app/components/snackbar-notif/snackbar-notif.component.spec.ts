import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarNotifComponent } from './snackbar-notif.component';

describe('SnackbarNotifComponent', () => {
  let component: SnackbarNotifComponent;
  let fixture: ComponentFixture<SnackbarNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarNotifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
