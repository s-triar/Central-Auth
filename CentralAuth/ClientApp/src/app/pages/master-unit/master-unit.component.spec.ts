import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUnitComponent } from './master-unit.component';

describe('MasterUnitComponent', () => {
  let component: MasterUnitComponent;
  let fixture: ComponentFixture<MasterUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
