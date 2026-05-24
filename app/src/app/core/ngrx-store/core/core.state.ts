import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {CoreStateModel, PricingResponse, Product} from './core-state.model';
import {delay, Observable, of, tap} from 'rxjs';
import {GetPrice, SaveProduct} from '@core/ngrx-store/core/core.actions';
import {PrintablesService} from '../../../features/printables-pricing-page/services/printables.service';

@State<CoreStateModel>({
  name: 'core',
})
@Injectable()
export class CoreState {
  constructor(
  private printablesService: PrintablesService
  ) {
  }

  @Action(GetPrice)
  getPrice({ patchState, getState }: StateContext<CoreStateModel>,
                   {payload}: GetPrice): Observable<PricingResponse> {
    return this.printablesService.calculatePrice(payload).pipe(
      tap((res: PricingResponse) => {
          patchState({
            pricingResult: res.total
          });
      }),
    );
  }

  @Action(SaveProduct)
  saveProduct({ patchState, getState }: StateContext<CoreStateModel>,
                   {payload}: SaveProduct): any {
    const productsSaved = getState().products;
    patchState({
      products: [...productsSaved, payload]
    })
  }


}
