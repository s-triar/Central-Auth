import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDirectorateComponent } from './delete-directorate.component';

describe('DeleteDirectorateComponent', () => {
  let component: DeleteDirectorateComponent;
  let fixture: ComponentFixture<DeleteDirectorateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDirectorateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
