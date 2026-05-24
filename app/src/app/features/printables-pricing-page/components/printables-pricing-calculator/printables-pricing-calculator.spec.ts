import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintablesPricingCalculator } from './printables-pricing-calculator';

describe('PrintablesPricingCalculator', () => {
  let component: PrintablesPricingCalculator;
  let fixture: ComponentFixture<PrintablesPricingCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintablesPricingCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintablesPricingCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
