import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricsInputComponent } from './rubrics-input.component';

describe('RubricsInputComponent', () => {
  let component: RubricsInputComponent;
  let fixture: ComponentFixture<RubricsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
