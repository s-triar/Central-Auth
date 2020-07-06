import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClaimProjectComponent } from './delete-claim-project.component';

describe('DeleteClaimProjectComponent', () => {
  let component: DeleteClaimProjectComponent;
  let fixture: ComponentFixture<DeleteClaimProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteClaimProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteClaimProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
