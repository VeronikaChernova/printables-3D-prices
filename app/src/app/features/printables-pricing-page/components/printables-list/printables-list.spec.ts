import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintablesList } from './printables-list';

describe('PrintablesList', () => {
  let component: PrintablesList;
  let fixture: ComponentFixture<PrintablesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintablesList],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintablesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
