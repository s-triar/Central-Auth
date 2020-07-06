import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserProjectComponent } from './delete-user-project.component';

describe('DeleteUserProjectComponent', () => {
  let component: DeleteUserProjectComponent;
  let fixture: ComponentFixture<DeleteUserProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUserProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
