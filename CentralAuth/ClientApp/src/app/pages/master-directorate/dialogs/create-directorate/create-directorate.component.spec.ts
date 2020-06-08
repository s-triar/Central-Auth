import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectorateComponent } from './create-directorate.component';

describe('CreateDirectorateComponent', () => {
  let component: CreateDirectorateComponent;
  let fixture: ComponentFixture<CreateDirectorateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDirectorateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
