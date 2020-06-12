import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubDepartmentComponent } from './update-sub-department.component';

describe('UpdateSubDepartmentComponent', () => {
  let component: UpdateSubDepartmentComponent;
  let fixture: ComponentFixture<UpdateSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
