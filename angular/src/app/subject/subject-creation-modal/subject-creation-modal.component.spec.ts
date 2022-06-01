import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCreationModalComponent } from './subject-creation-modal.component';

describe('SubjectCreationModalComponent', () => {
  let component: SubjectCreationModalComponent;
  let fixture: ComponentFixture<SubjectCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectCreationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
