import { TestBed } from '@angular/core/testing';

import { ViewSDKClient } from './view-sdk.service';

describe('ViewSdkService', () => {
  let service: ViewSDKClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSDKClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
