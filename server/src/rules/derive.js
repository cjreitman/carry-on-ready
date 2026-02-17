const { isSchengenCountry, computeSchengenDays } = require('./schengen');

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

  const hasSchengenStop = input.stops.some((s) =>
    isSchengenCountry(s.countryOrRegion)
  );

  const schengenDaysThisTrip = computeSchengenDays(input.stops, inclusiveDays);

  const schengenApplies =
    hasSchengenStop && input.passportRegion !== 'EU';

  const estimatedSchengenTotal = schengenApplies
    ? input.schengenDaysUsedLast180 + schengenDaysThisTrip
    : null;

  return {
    stopDaysList,
    totalDays,
    bagTier,
    hasSchengenStop,
    schengenApplies,
    schengenDaysThisTrip,
    estimatedSchengenTotal,
    climate: input.climateOverall,
    laundry: input.laundry,
    workSetup: input.workSetup,
  };
}

module.exports = { computeDerived, inclusiveDays, getBagTier };
