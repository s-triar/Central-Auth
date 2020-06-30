import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMyProjectComponent } from './create-my-project.component';

describe('CreateMyProjectComponent', () => {
  let component: CreateMyProjectComponent;
  let fixture: ComponentFixture<CreateMyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
