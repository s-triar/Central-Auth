import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserProjectComponent } from './create-user-project.component';

describe('CreateUserProjectComponent', () => {
  let component: CreateUserProjectComponent;
  let fixture: ComponentFixture<CreateUserProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
