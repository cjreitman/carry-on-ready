const { inferClimateFromStop } = require('../utils/climateHeuristics');

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

  // Per-stop climate/rain inference
  const inferredStopClimates = [];
  const inferredRainFlags = [];
  for (const stop of input.stops) {
    const inferred = inferClimateFromStop(stop);
    inferredStopClimates.push(inferred.climate);
    inferredRainFlags.push(inferred.rainExpected);
  }

  // Overall climate: explicit climateOverall > per-stop override/inferred > default 'moderate'
  let climate;
  if (input.climateOverall) {
    climate = input.climateOverall;
  } else {
    const effective = input.stops.map((s, i) => s.climateOverride || inferredStopClimates[i]);
    if (effective.length === 0) {
      climate = 'moderate';
    } else if (effective.every((c) => c === effective[0])) {
      climate = effective[0];
    } else {
      climate = 'mixed';
    }
  }

  // Rain: user explicit true wins, else use inferred (unchecked does not block inference)
  const rainExpected = input.stops.some(
    (s, i) => s.rainExpected === true || inferredRainFlags[i] === true
  );

  // Passport recommendation: true if any destination differs from citizenship
  const destinations = input.stops.map((s) => s.countryOrRegion);
  const passportRecommended = destinations.some(
    (dest) => dest && dest.trim().toLowerCase() !== input.citizenship.trim().toLowerCase()
  );

  return {
    stopDaysList,
    totalDays,
    bagTier,
    climate,
    laundry: input.laundry,
    workSetup: input.workSetup,
    rainExpected,
    gender: input.gender,
    citizenship: input.citizenship,
    destinations,
    passportRecommended,
    inferredStopClimates,
    inferredRainFlags,
  };
}

module.exports = { computeDerived, inclusiveDays, getBagTier };
