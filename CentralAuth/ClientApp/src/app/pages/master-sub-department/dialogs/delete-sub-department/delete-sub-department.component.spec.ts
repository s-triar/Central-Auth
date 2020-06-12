import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubDepartmentComponent } from './delete-sub-department.component';

describe('DeleteSubDepartmentComponent', () => {
  let component: DeleteSubDepartmentComponent;
  let fixture: ComponentFixture<DeleteSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
