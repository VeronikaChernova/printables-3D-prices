import {PricingRequest, Product} from '@core/ngrx-store/core/core-state.model';

export class GetPrice {
  static readonly type = '[Core] Get Price';

  constructor(
    public payload: PricingRequest
  ) {}
}

export class SaveProduct {
  static readonly type = '[Core] Save Product';
  constructor(
    public payload: Product
  ) {}
}
