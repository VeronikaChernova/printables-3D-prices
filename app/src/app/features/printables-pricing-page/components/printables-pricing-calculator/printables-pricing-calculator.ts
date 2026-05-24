import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import {
  PlasticId,
  LayerHeightMm,
  LayerWidthMm, LAYER_HEIGHT_OPTIONS, LAYER_WIDTH_OPTIONS,
} from '../../../../core/ngrx-store/core/core-state.model';

import {GetPrice, SaveProduct} from '@core/ngrx-store/core/core.actions';
import { CoreSelectors } from '@core/ngrx-store/core/core.selectors';
import {PLASTIC_OPTIONS} from '../../services/printables.service';

@Component({
  selector: 'app-printables-pricing-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './printables-pricing-calculator.html',
  styleUrl: './printables-pricing-calculator.scss',
})
export class PrintablesPricingCalculator {

  // ── Option lists (driven by pricing service constants) ────────────────────
  readonly layerHeightOptions = LAYER_HEIGHT_OPTIONS;
  readonly layerWidthOptions  = LAYER_WIDTH_OPTIONS;
  readonly plasticOptions     = PLASTIC_OPTIONS;

  // ── DI ────────────────────────────────────────────────────────────────────
  private readonly fb    = inject(FormBuilder);
  private readonly store = inject(Store);

  // ── Store selectors ───────────────────────────────────────────────────────
  priceEstimate = this.store.selectSignal(CoreSelectors.price);

  // ── Reactive form ─────────────────────────────────────────────────────────
  readonly form = this.fb.group({
    layerHeight:        [0.2 as LayerHeightMm,  Validators.required],
    layerWidth:         [0.4 as LayerWidthMm,   Validators.required],
    mass:               [null as number | null,  [Validators.required, Validators.min(0.01)]],
    plastic:            ['pla' as PlasticId,     Validators.required],
    imageFile:          [null as File | null],
    imagePreview:       [null as string | null],
    customizationPrice: [null as number | null],
  });

  // ── UI state ──────────────────────────────────────────────────────────────
  isDragOver = signal(false);

  // ── Getters ───────────────────────────────────────────────────────────────
  get selectedPlastic(): PlasticId {
    return this.form.controls.plastic.value as PlasticId;
  }

  get selectedLayerHeight(): LayerHeightMm {
    return this.form.controls.layerHeight.value as LayerHeightMm;
  }

  get selectedLayerWidth(): LayerWidthMm {
    return this.form.controls.layerWidth.value as LayerWidthMm;
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  // ── Chip selectors ────────────────────────────────────────────────────────
  selectPlastic(id: PlasticId): void {
    this.form.controls.plastic.setValue(id);
  }

  setLayerHeight(value: LayerHeightMm): void {
    this.form.controls.layerHeight.setValue(value);
  }

  setLayerWidth(value: LayerWidthMm): void {
    this.form.controls.layerWidth.setValue(value);
  }

  // ── Mass / customization price (still free inputs) ────────────────────────
  setMass(value: string): void {
    const parsed = parseFloat(value);
    this.form.controls.mass.setValue(isNaN(parsed) ? null : parsed);
  }

  setCustomizationPrice(value: string): void {
    const parsed = parseFloat(value);
    this.form.controls.customizationPrice.setValue(isNaN(parsed) ? null : parsed);
  }

  // ── Image handling ────────────────────────────────────────────────────────
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) this.processFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) this.processFile(file);
  }

  private processFile(file: File): void {
    const reader    = new FileReader();
    reader.onload   = (e) => {
      this.form.patchValue({
        imageFile:    file,
        imagePreview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.form.patchValue({ imageFile: null, imagePreview: null });
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  onCalculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const f = this.form.getRawValue();

    this.store.dispatch(new GetPrice({
      plasticId:          f.plastic          as PlasticId,
      massGrams:          f.mass!,
      layerHeight:        f.layerHeight      as LayerHeightMm,
      layerWidth:         f.layerWidth       as LayerWidthMm,
      customizationPrice: f.customizationPrice ?? 0,
    }));
  }

  onReset(): void {
    this.form.reset({
      layerHeight:        0.2,
      layerWidth:         0.4,
      mass:               null,
      plastic:            'pla',
      imageFile:          null,
      imagePreview:       null,
      customizationPrice: null,
    });
  }

  onSaveProduct(): void {
    const f = this.form.getRawValue();

    // this.store.dispatch(new SaveProduct({
    //   id:   Math.random().toString(),
    //   layerHeight:  f.layerHeight as number ,
    //   layerWidth:   f.layerWidth as number,
    //   imagePreview: f.imagePreview as string,
    //   price: this.priceEstimate(),
    // }))
  }
}
