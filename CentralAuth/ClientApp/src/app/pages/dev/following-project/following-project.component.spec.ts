import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingProjectComponent } from './following-project.component';

describe('FollowingProjectComponent', () => {
  let component: FollowingProjectComponent;
  let fixture: ComponentFixture<FollowingProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
