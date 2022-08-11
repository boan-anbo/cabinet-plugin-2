import { TestBed } from '@angular/core/testing';

import { PreviewNavService } from './preview-nav.service';

describe('PreviewNavService', () => {
  let service: PreviewNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
