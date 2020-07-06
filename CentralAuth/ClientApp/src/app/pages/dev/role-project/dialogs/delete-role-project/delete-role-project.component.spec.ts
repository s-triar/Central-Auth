import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRoleProjectComponent } from './delete-role-project.component';

describe('DeleteRoleProjectComponent', () => {
  let component: DeleteRoleProjectComponent;
  let fixture: ComponentFixture<DeleteRoleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRoleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
