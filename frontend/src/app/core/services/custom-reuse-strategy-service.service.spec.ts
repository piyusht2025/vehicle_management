import { TestBed } from '@angular/core/testing';

import { CustomReuseStrategyServiceService } from './custom-reuse-strategy-service.service';

describe('CustomReuseStrategyServiceService', () => {
  let service: CustomReuseStrategyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomReuseStrategyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
