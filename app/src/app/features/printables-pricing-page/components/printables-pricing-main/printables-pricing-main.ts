import {Component, input} from '@angular/core';
import {PrintablesPricingCalculator} from '../printables-pricing-calculator/printables-pricing-calculator';
import {PrintablesList} from '../printables-list/printables-list';

@Component({
  selector: 'app-printables-pricing-main',
  imports: [
    PrintablesPricingCalculator,
    PrintablesList
  ],
  templateUrl: './printables-pricing-main.html',
  styleUrl: './printables-pricing-main.scss',
})
export class PrintablesPricingMain {

  /** URL of the featured product image shown on the right */
  imageSrc = input<string>('');

  /** Alt text for the product image */
  imageAlt = input<string>('Featured 3D print');



}
