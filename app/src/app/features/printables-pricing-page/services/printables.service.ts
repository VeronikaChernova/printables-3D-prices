import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  LAYER_HEIGHT_OPTIONS, LAYER_WIDTH_OPTIONS,
  LayerHeightMm,
  LayerResolution, LayerWidthMm,
  PlasticId, PriceLineItem,
  PricingRequest,
  PricingResponse
} from '@core/ngrx-store/core/core-state.model';
import {delay, Observable, of, throwError} from 'rxjs';



  // ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

  const UAH_TO_USD            = 1 / 44.24; // snapshot May 24 2026
  const MIN_ORDER_UAH         = 400;
  const MIN_ORDER_USD         = +(MIN_ORDER_UAH * UAH_TO_USD).toFixed(2); // ~$9.04
  const CUSTOMIZATION_MULT    = 2;

// ─────────────────────────────────────────────────────────────────────────────
// Plastics
// ─────────────────────────────────────────────────────────────────────────────

  export const PLASTIC_OPTIONS: { id: PlasticId; label: string }[] = [
    { id: 'abs+',         label: 'ABS+'         },
    { id: 'pla',          label: 'PLA'          },
    { id: 'pet',          label: 'PET'          },
    { id: 'copet',        label: 'coPET'        },
  ];

// ─────────────────────────────────────────────────────────────────────────────
// Price tier table
// Source: 3dstorm.com.ua/printing (UAH/gram)
// Only 200 mkm and 300 mkm columns needed — 100 mkm removed.
// 0.4 mm layer height (400 mkm) falls into the 300 mkm pricing tier.
// ─────────────────────────────────────────────────────────────────────────────
  interface PriceTier {
  label:    string;
  maxGrams: number;
  rates:    Record<LayerResolution, number>; // UAH/gram
}

const PRICE_TIERS: PriceTier[] = [
  { label: 'from 50 g',       maxGrams: 50,       rates: { 200: 11.0, 300: 9.0 } },
  { label: 'from 100–250 g',  maxGrams: 250,       rates: { 200: 10.0, 300: 8.0 } },
  { label: 'from 250–500 g',  maxGrams: 500,       rates: { 200:  9.0, 300: 7.0 } },
  { label: 'from 500–1000 g', maxGrams: 1_000,     rates: { 200:  8.0, 300: 6.5 } },
  { label: 'from 1–2 kg',     maxGrams: 2_000,     rates: { 200:  7.0, 300: 6.0 } },
  { label: 'from 2–5 kg',     maxGrams: 5_000,     rates: { 200:  6.0, 300: 5.0 } },
  { label: 'from 5–10 kg',    maxGrams: 10_000,    rates: { 200:  4.5, 300: 4.0 } },
  { label: 'from 10+ kg',     maxGrams: Infinity,  rates: { 200:  2.5, 300: 2.3 } },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toUsd(uah: number): number {
  return +(uah * UAH_TO_USD).toFixed(4);
}

/**
 * Maps the selected layer height option → pricing resolution bucket.
 * Lookup is driven by LAYER_HEIGHT_OPTIONS so the mapping stays in one place.
 */
function resolveResolution(layerHeight: LayerHeightMm): LayerResolution {
  return LAYER_HEIGHT_OPTIONS.find((o) => o.value === layerHeight)!.resolutionMkm;
}

function findTier(massGrams: number): PriceTier {
  return PRICE_TIERS.find((t) => massGrams <= t.maxGrams)!;
}

function plasticLabel(id: PlasticId): string {
  return PLASTIC_OPTIONS.find((p) => p.id === id)?.label ?? id;
}

function layerHeightLabel(h: LayerHeightMm): string {
  return LAYER_HEIGHT_OPTIONS.find((o) => o.value === h)?.label ?? `${h} mm`;
}

function layerWidthLabel(w: LayerWidthMm): string {
  return LAYER_WIDTH_OPTIONS.find((o) => o.value === w)?.label ?? `${w} mm`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core calculation — pure function
// ─────────────────────────────────────────────────────────────────────────────
function compute(req: PricingRequest): PricingResponse {
  const resolution      = resolveResolution(req.layerHeight);
  const tier            = findTier(req.massGrams);
  const ratePerGramUsd  = toUsd(tier.rates[resolution]);

  const materialCost    = +(req.massGrams * ratePerGramUsd).toFixed(2);
  const customizationCost = +(req.customizationPrice * CUSTOMIZATION_MULT).toFixed(2);
  const subtotal        = +(materialCost + customizationCost).toFixed(2);
  const belowMinimum    = subtotal < MIN_ORDER_USD;
  const total           = +(Math.max(subtotal, MIN_ORDER_USD)).toFixed(2);

  const lineItems: PriceLineItem[] = [
    {
      label:  [
        `Material · ${plasticLabel(req.plasticId)}`,
        `height ${layerHeightLabel(req.layerHeight)}`,
        `width ${layerWidthLabel(req.layerWidth)}`,
        `${tier.label}`,
      ].join(' · '),
      amount: materialCost,
    },
    {
      label:  `Customization (×${CUSTOMIZATION_MULT})`,
      amount: customizationCost,
    },
    ...(belowMinimum
      ? [{ label: 'Minimum order adjustment', amount: +(MIN_ORDER_USD - subtotal).toFixed(2) }]
      : []),
  ];

  return {
    plasticLabel:       plasticLabel(req.plasticId),
    layerHeight:        req.layerHeight,
    layerWidth:         req.layerWidth,
    layerResolutionMkm: resolution,
    ratePerGramUsd,
    lineItems,
    materialCost,
    customizationCost,
    subtotal,
    belowMinimum,
    minimumOrderUsd:    MIN_ORDER_USD,
    total,
    exchangeRate:       UAH_TO_USD,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({
  providedIn: 'root',
})
export class PrintablesService {
  constructor(private http: HttpClient) {}

  /**
   * Mocked POST /api/pricing
   *
   * Layer height is one of: 0.2 | 0.3 | 0.4 mm (200 / 300 / 300 mkm tier).
   * Layer width is one of: 0.2 | 0.4 | 0.6 mm (informational, not priced separately).
   * All plastics share the same tier table.
   * Customization = entered USD × 2.
   * Minimum order ≈ $9.04 (400 UAH).
   */
  calculatePrice(req: PricingRequest): Observable<PricingResponse> {
    if (!req.massGrams || req.massGrams <= 0) {
      return throwError(() => new Error('Mass must be greater than 0 g'));
    }
    if (req.customizationPrice < 0) {
      return throwError(() => new Error('Customization price cannot be negative'));
    }

    return of(compute(req)).pipe(delay(900));
  }

}
