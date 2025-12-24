import { TestBed } from '@angular/core/testing';

import { VehiclesResolverService } from './vehicles-resolver.service';

describe('VehiclesResolverService', () => {
  let service: VehiclesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
