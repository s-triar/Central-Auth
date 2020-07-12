import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScopeProjectComponent } from './create-scope-project.component';

describe('CreateScopeProjectComponent', () => {
  let component: CreateScopeProjectComponent;
  let fixture: ComponentFixture<CreateScopeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScopeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScopeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
