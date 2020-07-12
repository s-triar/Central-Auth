import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScopeProjectComponent } from './update-scope-project.component';

describe('UpdateScopeProjectComponent', () => {
  let component: UpdateScopeProjectComponent;
  let fixture: ComponentFixture<UpdateScopeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateScopeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateScopeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
