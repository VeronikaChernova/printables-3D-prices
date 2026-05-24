import { TestBed } from '@angular/core/testing';

import { Printables } from './printables';

describe('Printables', () => {
  let service: Printables;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Printables);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
