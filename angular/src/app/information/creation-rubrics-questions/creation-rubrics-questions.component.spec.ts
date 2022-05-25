import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationRubricsQuestionsComponent } from './creation-rubrics-questions.component';

describe('CreationRubricsQuestionsComponent', () => {
  let component: CreationRubricsQuestionsComponent;
  let fixture: ComponentFixture<CreationRubricsQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationRubricsQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationRubricsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
