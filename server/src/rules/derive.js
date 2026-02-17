function inclusiveDays(stop) {
  const start = new Date(stop.startDate + 'T00:00:00');
  const end = new Date(stop.endDate + 'T00:00:00');
  const diffMs = end - start;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // inclusive
}

function getBagTier(liters) {
  if (liters <= 25) return 'ULTRA';
  if (liters <= 34) return 'TIGHT';
  if (liters <= 40) return 'STANDARD';
  if (liters <= 45) return 'MAX';
  return 'OVERSIZE';
}

function computeDerived(input) {
  const stopDaysList = input.stops.map((s) => ({
    ...s,
    stopDays: inclusiveDays(s),
  }));

  const totalDays = stopDaysList.reduce((sum, s) => sum + s.stopDays, 0);
  const bagTier = getBagTier(input.bagLiters);

  // Infer climate: explicit climateOverall > stop overrides > default 'moderate'
  let climate;
  if (input.climateOverall) {
    climate = input.climateOverall;
  } else {
    const overrides = input.stops.map((s) => s.climateOverride).filter(Boolean);
    if (overrides.length === 0) {
      climate = 'moderate';
    } else if (overrides.every((o) => o === overrides[0])) {
      climate = overrides[0];
    } else {
      climate = 'mixed';
    }
  }

  const rainExpected = input.stops.some((s) => s.rainExpected === true);

  return {
    stopDaysList,
    totalDays,
    bagTier,
    climate,
    laundry: input.laundry,
    workSetup: input.workSetup,
    rainExpected,
    gender: input.gender,
  };
}

module.exports = { computeDerived, inclusiveDays, getBagTier };
