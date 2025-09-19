export function estimateDeliveryDate(input: {
  shippingMethod: 'standard' | 'express' | 'overnight';
  isInternational: boolean;
  isHolidaySeason: boolean;
  orderPlacedAt: Date;
}): { estimatedDeliveryAt: Date } {
  const { shippingMethod, isInternational, isHolidaySeason, orderPlacedAt } =
    input;

  // Utility: Add business days
  function addBusinessDays(start: Date, days: number): Date {
    const date = new Date(start);
    while (days > 0) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) days--; // Skip Sunday (0) and Saturday (6)
    }
    return date;
  }

  // Utility: Add calendar days
  function addCalendarDays(start: Date, days: number): Date {
    const date = new Date(start);
    date.setDate(date.getDate() + days);
    return date;
  }

  // Utility: Shift weekends to Monday
  function shiftIfWeekend(date: Date): Date {
    const day = date.getDay();
    if (day === 6) date.setDate(date.getDate() + 2); // Saturday → Monday
    else if (day === 0) date.setDate(date.getDate() + 1); // Sunday → Monday
    return date;
  }

  // Step 1: Base delivery offset
  let baseDays = 0;
  if (shippingMethod === 'standard') baseDays = 5;
  else if (shippingMethod === 'express') baseDays = 2;
  else if (shippingMethod === 'overnight') baseDays = 1;

  let result = addBusinessDays(orderPlacedAt, baseDays);

  // Step 2: Holiday season adds 3 business days
  if (isHolidaySeason) {
    result = addBusinessDays(result, 3);
  }

  // Step 3: International adds 7 calendar days
  if (isInternational) {
    result = addCalendarDays(result, 7);
  }

  // Step 4: Shift to Monday if result is weekend
  result = shiftIfWeekend(result);

  return { estimatedDeliveryAt: result };
}
