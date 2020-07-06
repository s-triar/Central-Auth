import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleProjectComponent } from './update-role-project.component';

describe('UpdateRoleProjectComponent', () => {
  let component: UpdateRoleProjectComponent;
  let fixture: ComponentFixture<UpdateRoleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRoleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
