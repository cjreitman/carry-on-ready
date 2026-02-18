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
  const isIndefinite = !!input.isIndefiniteTravel;
  const bagTier = getBagTier(input.bagLiters);
  const citizenshipRaw = (input.citizenship || '').trim();

  // Passport recommendation
  const destinations = input.stops.map((s) => s.countryOrRegion || '');
  let passportRecommended = false;
  if (input.forcePassportRecommended || isIndefinite) {
    passportRecommended = true;
  } else if (citizenshipRaw) {
    passportRecommended = destinations.some(
      (dest) => dest && dest.trim().toLowerCase() !== citizenshipRaw.toLowerCase()
    );
  }

  // Indefinite mode: skip date-based logic, respect user overrides for climate/rain
  if (isIndefinite) {
    const stopDaysList = input.stops.map((s) => ({ ...s, stopDays: 14 }));

    // Climate: respect user overrides, default to 'mixed'
    let climate;
    if (input.climateOverall) {
      climate = input.climateOverall;
    } else {
      const overrides = input.stops.map((s) => s.climateOverride).filter(Boolean);
      if (overrides.length === 0) {
        climate = 'mixed';
      } else if (overrides.every((c) => c === overrides[0])) {
        climate = overrides[0];
      } else {
        climate = 'mixed';
      }
    }

    // Rain: respect user overrides, default to true
    const hasAnyRainFlag = input.stops.some((s) => s.rainExpected === true || s.rainExpected === false);
    let rainExpected;
    if (hasAnyRainFlag) {
      rainExpected = input.stops.some((s) => s.rainExpected === true);
    } else {
      rainExpected = true; // default for indefinite
    }

    return {
      stopDaysList,
      totalDays: 14,
      bagTier,
      climate,
      laundry: input.laundry,
      workSetup: input.workSetup,
      rainExpected,
      gender: input.gender,
      citizenship: citizenshipRaw,
      destinations,
      passportRecommended,
      isIndefiniteTravel: true,
      inferredStopClimates: input.stops.map(() => 'mixed'),
      inferredRainFlags: input.stops.map(() => true),
    };
  }

  const stopDaysList = input.stops.map((s) => ({
    ...s,
    stopDays: inclusiveDays(s),
  }));

  const totalDays = stopDaysList.reduce((sum, s) => sum + s.stopDays, 0);

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

  // Rain: tri-state per stop (true = forced on, false = forced off, null/undefined = auto)
  const rainExpected = input.stops.some((s, i) => {
    if (s.rainExpected === true) return true;
    if (s.rainExpected === false) return false;
    return inferredRainFlags[i] === true; // null/undefined = auto
  });

  return {
    stopDaysList,
    totalDays,
    bagTier,
    climate,
    laundry: input.laundry,
    workSetup: input.workSetup,
    rainExpected,
    gender: input.gender,
    citizenship: citizenshipRaw,
    destinations,
    passportRecommended,
    inferredStopClimates,
    inferredRainFlags,
  };
}

module.exports = { computeDerived, inclusiveDays, getBagTier };
