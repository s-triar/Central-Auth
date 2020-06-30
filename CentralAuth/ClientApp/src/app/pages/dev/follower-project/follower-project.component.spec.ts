import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerProjectComponent } from './follower-project.component';

describe('FollowerProjectComponent', () => {
  let component: FollowerProjectComponent;
  let fixture: ComponentFixture<FollowerProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowerProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
