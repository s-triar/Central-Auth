import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRoleProjectComponent } from './claim-role-project.component';

describe('ClaimRoleProjectComponent', () => {
  let component: ClaimRoleProjectComponent;
  let fixture: ComponentFixture<ClaimRoleProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRoleProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
