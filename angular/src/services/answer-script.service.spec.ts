import { TestBed } from '@angular/core/testing';

import { AnswerScriptService } from './answer-script.service';

describe('AnswerScriptService', () => {
  let service: AnswerScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
