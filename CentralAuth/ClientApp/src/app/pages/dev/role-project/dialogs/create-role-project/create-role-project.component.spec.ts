import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleProjectComponent } from './create-role-project.component';

describe('CreateRoleProjectComponent', () => {
  let component: CreateRoleProjectComponent;
  let fixture: ComponentFixture<CreateRoleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
