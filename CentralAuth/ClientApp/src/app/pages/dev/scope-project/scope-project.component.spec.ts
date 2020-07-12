import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeProjectComponent } from './scope-project.component';

describe('ScopeProjectComponent', () => {
  let component: ScopeProjectComponent;
  let fixture: ComponentFixture<ScopeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
