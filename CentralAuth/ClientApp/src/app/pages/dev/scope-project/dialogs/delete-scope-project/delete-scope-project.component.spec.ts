import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteScopeProjectComponent } from './delete-scope-project.component';

describe('DeleteScopeProjectComponent', () => {
  let component: DeleteScopeProjectComponent;
  let fixture: ComponentFixture<DeleteScopeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteScopeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteScopeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
