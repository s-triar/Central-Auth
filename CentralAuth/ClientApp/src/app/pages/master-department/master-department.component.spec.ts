import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDepartmentComponent } from './master-department.component';

describe('MasterDepartmentComponent', () => {
  let component: MasterDepartmentComponent;
  let fixture: ComponentFixture<MasterDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
