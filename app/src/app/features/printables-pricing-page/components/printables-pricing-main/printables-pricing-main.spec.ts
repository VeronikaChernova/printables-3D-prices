import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintablesPricingMain } from './printables-pricing-main';

describe('PrintablesPricingMain', () => {
  let component: PrintablesPricingMain;
  let fixture: ComponentFixture<PrintablesPricingMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintablesPricingMain],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintablesPricingMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
