import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClaimProjectComponent } from './create-claim-project.component';

describe('CreateClaimProjectComponent', () => {
  let component: CreateClaimProjectComponent;
  let fixture: ComponentFixture<CreateClaimProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClaimProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClaimProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
