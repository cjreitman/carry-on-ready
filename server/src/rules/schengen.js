const SCHENGEN_COUNTRIES = new Set([
  'Austria', 'Belgium', 'Croatia', 'Czech Republic', 'Czechia',
  'Denmark', 'Estonia', 'Finland', 'France',
  'Germany', 'Greece', 'Hungary', 'Iceland', 'Italy',
  'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
]);

function isSchengenCountry(countryOrRegion) {
  const normalized = countryOrRegion.trim();
  for (const c of SCHENGEN_COUNTRIES) {
    if (c.toLowerCase() === normalized.toLowerCase()) return true;
  }
  return false;
}

function computeSchengenDays(stops, stopDaysFn) {
  let total = 0;
  for (const stop of stops) {
    if (isSchengenCountry(stop.countryOrRegion)) {
      total += stopDaysFn(stop);
    }
  }
  return total;
}

module.exports = { SCHENGEN_COUNTRIES, isSchengenCountry, computeSchengenDays };
