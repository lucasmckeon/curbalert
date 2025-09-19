// estimateDeliveryDate.test.ts
import { describe, it, expect } from 'vitest';
import { estimateDeliveryDate } from './estimateDeliveryDate';

// Local-date helpers to avoid UTC/local drift
const localDate = (y: number, m: number, d: number) => new Date(y, m - 1, d); // midnight local
const ymd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;

describe('estimateDeliveryDate', () => {
  it('standard adds 5 BUSINESS days (skips weekend)', () => {
    // System A boundary: Mon + 5 business → next Mon
    const out = estimateDeliveryDate({
      shippingMethod: 'standard',
      isInternational: false,
      isHolidaySeason: false,
      orderPlacedAt: localDate(2025, 1, 6), // Monday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-13');
  });

  it('overnight from Friday lands on Monday (single business-day roll)', () => {
    // System A edge: Fri + 1 business → Mon
    const out = estimateDeliveryDate({
      shippingMethod: 'overnight',
      isInternational: false,
      isHolidaySeason: false,
      orderPlacedAt: localDate(2025, 1, 10), // Friday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-13');
  });

  it('holiday season adds +3 BUSINESS days after base', () => {
    // A→B cascade: Express(2) + Holiday(+3) = 5 business from Mon → next Mon
    const out = estimateDeliveryDate({
      shippingMethod: 'express',
      isInternational: false,
      isHolidaySeason: true,
      orderPlacedAt: localDate(2025, 1, 6), // Monday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-13');
  });

  it('international adds +7 CALENDAR days after business-day math', () => {
    // A then C: Express(2 business) from Mon → Wed, then +7 calendar → next Wed
    const out = estimateDeliveryDate({
      shippingMethod: 'express',
      isInternational: true,
      isHolidaySeason: false,
      orderPlacedAt: localDate(2025, 1, 6), // Monday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-15');
  });

  it('holiday + international cascade (business + business + calendar) stays on weekday', () => {
    // A(5 business) → Mon 13th, B(+3 business) → Thu 16th, C(+7 calendar) → Thu 23rd
    const out = estimateDeliveryDate({
      shippingMethod: 'standard',
      isInternational: true,
      isHolidaySeason: true,
      orderPlacedAt: localDate(2025, 1, 6), // Monday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-23');
  });

  it('multiple-weekend crossing within business-day math remains correct', () => {
    // A across a weekend: Thu -> Fri(1), Mon(2), Tue(3), Wed(4), Thu(5)
    const out = estimateDeliveryDate({
      shippingMethod: 'standard',
      isInternational: false,
      isHolidaySeason: false,
      orderPlacedAt: localDate(2025, 1, 2), // Thursday (local)
    }).estimatedDeliveryAt;
    expect(ymd(out)).toBe('2025-01-09');
  });
});
