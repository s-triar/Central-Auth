import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFollowingProjectComponent } from './create-following-project.component';

describe('CreateFollowingProjectComponent', () => {
  let component: CreateFollowingProjectComponent;
  let fixture: ComponentFixture<CreateFollowingProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFollowingProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFollowingProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
