import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveFollowerComponent } from './approval-follower.component';

describe('ApproveFollowerComponent', () => {
  let component: ApproveFollowerComponent;
  let fixture: ComponentFixture<ApproveFollowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveFollowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveFollowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
