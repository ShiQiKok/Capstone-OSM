import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingComponent } from './marking.component';

describe('MarkingComponent', () => {
  let component: MarkingComponent;
  let fixture: ComponentFixture<MarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
