import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMyProjectComponent } from './delete-my-project.component';

describe('DeleteMyProjectComponent', () => {
  let component: DeleteMyProjectComponent;
  let fixture: ComponentFixture<DeleteMyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
