import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimUserProjectComponent } from './claim-user-project.component';

describe('ClaimUserProjectComponent', () => {
  let component: ClaimUserProjectComponent;
  let fixture: ComponentFixture<ClaimUserProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimUserProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
