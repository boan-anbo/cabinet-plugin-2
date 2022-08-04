import { TestBed } from '@angular/core/testing';

import { VscodeStateService } from './vscode-state.service';

describe('VscodeStateService', () => {
  let service: VscodeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VscodeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
