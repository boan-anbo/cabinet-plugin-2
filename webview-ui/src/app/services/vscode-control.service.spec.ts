import { TestBed } from '@angular/core/testing';

import { VscodeControlService } from './vscode-control.service';

describe('VscodeControlService', () => {
  let service: VscodeControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VscodeControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
