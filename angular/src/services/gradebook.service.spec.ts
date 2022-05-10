import { TestBed } from '@angular/core/testing';

import { GradebookService } from './gradebook.service';

describe('GradebookService', () => {
  let service: GradebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
