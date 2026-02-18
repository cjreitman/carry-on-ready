/**
 * Clothing rule: (ctx, draft) => void
 * ctx = { input, derived }
 * draft = { items, notes, warnings }
 */
module.exports = function clothingRule(ctx, draft) {
  const { derived, input } = ctx;
  const { totalDays, climate, laundry } = derived;

  // --- Base counts ---
  let shoes = 2;
  let pants = 2;
  let shirts = 4;
  let underwear, socks;

  // Hot-only: reduce pants (shoes stay at 2 so wearOne math works)
  if (climate === 'hot') {
    pants = 1;
  }

  // Laundry adjustments
  if (laundry === 'frequent') {
    underwear = 4;
    socks = 4;
    shirts = 3;
  } else if (laundry === 'weekly') {
    underwear = 6;
    socks = 6;
    shirts = 4;
  } else {
    // laundry === 'none'
    if (totalDays <= 7) {
      underwear = totalDays;
      socks = totalDays;
      shirts = Math.min(5, totalDays);
    } else {
      underwear = 7;
      socks = 7;
      shirts = 5;
      draft.notes.push(
        'No laundry access for 7+ days: pack detergent sheets and plan sink washes.'
      );
    }
  }

  // Short-trip clamp: don't pack more than you have days for
  if (totalDays <= 7) {
    underwear = Math.min(underwear, totalDays);
    socks = Math.min(socks, totalDays);
  }
  if (totalDays <= 3) {
    shirts = Math.min(shirts, totalDays);
  }

  // Minimum recommendation floor (overrides short-trip clamp intentionally)
  underwear = Math.max(3, underwear);
  socks = Math.max(3, socks);
  shirts = Math.max(3, shirts);

  // Male-specific max: cap socks/underwear at 5 before tier caps
  if (ctx.derived.gender === 'male') {
    underwear = Math.min(underwear, 5);
    socks = Math.min(socks, 5);
  }

  // Store raw counts on draft for capping
  draft.clothingCounts = { shoes, pants, shirts, underwear, socks, midlayers: 0, outerwear: 0 };

  // --- Climate modifiers ---
  if (climate === 'cold' || climate === 'mixed') {
    draft.clothingCounts.midlayers = 1;
    draft.items.push({
      id: 'clothing-packable-down',
      section: 'Clothing',
      label: 'Packable down jacket',
      count: 1,
      packed: false,
    });
    draft.notes.push('Tip: merino base layers add warmth without bulk.');
  }

  if (derived.rainExpected || climate === 'mixed') {
    draft.clothingCounts.outerwear += 1;
    draft.items.push({
      id: 'clothing-rain-shell',
      section: 'Clothing',
      label: 'Packable rain shell',
      count: 1,
      packed: false,
    });
  }

  if (climate === 'cold') {
    draft.clothingCounts.outerwear += 1;
  }

  // --- Gender-specific standalone extras ---
  if (ctx.derived.gender === 'female') {
    draft.items.push({
      id: 'clothing-leggings',
      section: 'Clothing',
      label: 'Leggings',
      count: 1,
      packed: false,
    });
    if (ctx.derived.climate === 'hot' || ctx.derived.climate === 'mixed') {
      draft.items.push({
        id: 'clothing-dress',
        section: 'Clothing',
        label: 'Packable dress',
        count: 1,
        packed: false,
      });
    }
  }

  // --- Merino suggestions ---
  draft.notes.push(
    'Tip: merino wool underwear, socks, and shirts reduce odor and let you pack fewer items.'
  );
};
