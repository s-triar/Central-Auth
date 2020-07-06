import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFollowingProjectComponent } from './delete-following-project.component';

describe('DeleteFollowingProjectComponent', () => {
  let component: DeleteFollowingProjectComponent;
  let fixture: ComponentFixture<DeleteFollowingProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFollowingProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFollowingProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
