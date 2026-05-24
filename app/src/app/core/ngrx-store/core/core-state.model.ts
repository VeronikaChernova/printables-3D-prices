export interface CoreStateModel {
  pricingResult: number;
  productToSave: Product;
  products: Product[];
}

export type PlasticGroup = 'standard' | 'engineering' | 'flexible';

export interface PlasticOption {
  id: string;
  label: string;
  group: PlasticGroup;
}

export interface ProductFormModel {
  layerHeight: number | null;
  layerWidth: number | null;
  mass: number | null;
  plastic: string | null;
  imageFile: File | null;
  imagePreview: string | null;
  customizationPrice: number | null;
}

export interface Product {
  id: string;
  name?: string;
  material?: string;
  layerHeight: number;  // mm
  layerWidth: number;   // mm
  mass?: number;         // g
  plasticType?: string;
  price: number;
  status?: string;
  imagePreview?: string | null;
}

export const LAYER_HEIGHT_OPTIONS = [
  { value: 0.2, label: '200 mkm', resolutionMkm: 200 as const },
  { value: 0.3, label: '300 mkm', resolutionMkm: 300 as const },
  { value: 0.4, label: '400 mkm', resolutionMkm: 300 as const }, // falls into draft (300) tier
] as const;

export type LayerHeightMm = number; // 0.2 | 0.3 | 0.4

/** Allowed layer widths in mm */
export const LAYER_WIDTH_OPTIONS = [
  { value: 0.2, label: '0.2 mm' },
  { value: 0.4, label: '0.4 mm' },
  { value: 0.6, label: '0.6 mm' },
] as const;

export type LayerWidthMm = typeof LAYER_WIDTH_OPTIONS[number]['value']; // 0.2 | 0.4 | 0.6

/** Pricing resolution bucket — maps from layer height choice */
export type LayerResolution = 200 | 300;

// ─── Plastic materials ───────────────────────────────────────────────────────

export type PlasticId =
  | 'abs+'
  | 'pla'
  | 'pet'
  | 'copet';

export interface PricingRequest {
  plasticId:          PlasticId;
  massGrams:          number;
  layerHeight:        LayerHeightMm;  // one of: 0.2 | 0.3 | 0.4
  layerWidth:         LayerWidthMm;   // one of: 0.2 | 0.4 | 0.6
  /** Raw USD value from the form — service applies ×2 internally */
  customizationPrice: number;
}

export interface PriceLineItem {
  label:  string;
  amount: number; // USD
}

export interface PricingResponse {
  plasticLabel:       string;
  layerHeight:        LayerHeightMm;
  layerWidth:         LayerWidthMm;
  layerResolutionMkm: LayerResolution;
  ratePerGramUsd:     number;
  lineItems:          PriceLineItem[];
  materialCost:       number;
  customizationCost:  number; // already ×2 applied
  subtotal:           number;
  belowMinimum:       boolean;
  minimumOrderUsd:    number;
  total:              number;
  exchangeRate:       number;
}
