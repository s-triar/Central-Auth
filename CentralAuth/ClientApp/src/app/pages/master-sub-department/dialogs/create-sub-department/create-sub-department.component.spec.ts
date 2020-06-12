import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubDepartmentComponent } from './create-sub-department.component';

describe('CreateSubDepartmentComponent', () => {
  let component: CreateSubDepartmentComponent;
  let fixture: ComponentFixture<CreateSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
