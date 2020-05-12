import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUserComponent } from './master-user.component';

describe('MasterUserComponent', () => {
  let component: MasterUserComponent;
  let fixture: ComponentFixture<MasterUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
