import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentCreationFormComponent } from './assessment-creation-form.component';

describe('AssessmentCreationFormComponent', () => {
  let component: AssessmentCreationFormComponent;
  let fixture: ComponentFixture<AssessmentCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentCreationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
