import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClaimProjectComponent } from './update-claim-project.component';

describe('UpdateClaimProjectComponent', () => {
  let component: UpdateClaimProjectComponent;
  let fixture: ComponentFixture<UpdateClaimProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateClaimProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateClaimProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
