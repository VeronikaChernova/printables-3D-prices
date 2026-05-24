import {Component, computed, inject, input, output} from '@angular/core';
import {Product} from '@core/ngrx-store/core/core-state.model';
import {CoreSelectors} from '@core/ngrx-store/core/core.selectors';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-printables-list',
  imports: [],
  templateUrl: './printables-list.html',
  styleUrl: './printables-list.scss',
})
export class PrintablesList {
  // ── Inputs ───────────────────────────────────────────────────────────────
  private store = inject(Store);

  loading  = input<boolean>(false);
  products = this.store.selectSignal(CoreSelectors.products);

  // ── Outputs ──────────────────────────────────────────────────────────────
  addProduct    = output<void>();
  removeProduct = output<string>();       // product id

  // ── Derived ──────────────────────────────────────────────────────────────
  subtitle = computed(() => {
    const count = this.products().length;
    return `NgRx Store · ${count} ${count === 1 ? 'product' : 'products'}`;
  });

  isEmpty = computed(() => !this.loading() && this.products()?.length === 0);

  // ── Helpers ───────────────────────────────────────────────────────────────
  formatMm(value: number): string {
    return `${value.toFixed(2)}mm`;
  }

  formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  formatMass(value: number): string {
    return value ? `${value}g` : 'g';
  }

  trackById(_: number, product: Product): string {
    return product.id;
  }
}
