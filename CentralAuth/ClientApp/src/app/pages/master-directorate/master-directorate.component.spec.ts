import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDirectorateComponent } from './master-directorate.component';

describe('MasterDirectorateComponent', () => {
  let component: MasterDirectorateComponent;
  let fixture: ComponentFixture<MasterDirectorateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDirectorateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
