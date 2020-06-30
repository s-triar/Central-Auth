import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleProjectComponent } from './role-project.component';

describe('RoleProjectComponent', () => {
  let component: RoleProjectComponent;
  let fixture: ComponentFixture<RoleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
