import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSubDepartmentComponent } from './master-sub-department.component';

describe('MasterSubDepartmentComponent', () => {
  let component: MasterSubDepartmentComponent;
  let fixture: ComponentFixture<MasterSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
