import { Routes } from '@angular/router';
import {
  PrintablesPricingMain
} from './features/printables-pricing-page/components/printables-pricing-main/printables-pricing-main';

export const routes: Routes = [
  {path: '', component: PrintablesPricingMain

// path: '',
    // loadComponent: () =>
    //   import('./features/printables-pricing-page/components/printables-pricing-main.').then((m) => m.PrintablesPricingMainComponent),
  }
  ];
