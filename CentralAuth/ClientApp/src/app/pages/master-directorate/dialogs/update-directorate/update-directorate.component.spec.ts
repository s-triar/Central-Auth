import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDirectorateComponent } from './update-directorate.component';

describe('UpdateDirectorateComponent', () => {
  let component: UpdateDirectorateComponent;
  let fixture: ComponentFixture<UpdateDirectorateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDirectorateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
