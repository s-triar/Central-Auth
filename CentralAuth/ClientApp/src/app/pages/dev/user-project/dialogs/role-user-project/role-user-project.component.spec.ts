import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUserProjectComponent } from './role-user-project.component';

describe('RoleUserProjectComponent', () => {
  let component: RoleUserProjectComponent;
  let fixture: ComponentFixture<RoleUserProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleUserProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
