import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimProjectComponent } from './claim-project.component';

describe('ClaimProjectComponent', () => {
  let component: ClaimProjectComponent;
  let fixture: ComponentFixture<ClaimProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
