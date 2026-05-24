import {CoreState} from '@core/ngrx-store/core/core.state';
import {Selector} from '@ngxs/store';
import {CoreStateModel, Product} from '@core/ngrx-store/core/core-state.model';

export class CoreSelectors {
  @Selector([CoreState])
  static products(state: CoreStateModel): Product[] {
    return state.products;
  }

  @Selector([CoreState])
  static price(state: CoreStateModel): number {
    return state.pricingResult;
  }
}
