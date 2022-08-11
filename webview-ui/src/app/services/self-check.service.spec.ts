import { TestBed } from '@angular/core/testing';

import { SelfCheckService } from './self-check.service';

describe('SelfCheckService', () => {
  let service: SelfCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
