const TIER_CAPS = {
  ULTRA: {
    shoes: 2, pants: 1, shirts: 3,
    underwear: 4, socks: 4,
    midlayers: 1, outerwear: 1,
  },
  TIGHT: {
    shoes: 2, pants: 1, shirts: 4,
    underwear: 6, socks: 6,
    midlayers: 1, outerwear: 1,
  },
  STANDARD: {
    shoes: 2, pants: 2, shirts: 5,
    underwear: 7, socks: 7,
    midlayers: 1, outerwear: 2,
  },
  MAX: {
    shoes: 2, pants: 2, shirts: 6,
    underwear: 8, socks: 8,
    midlayers: 2, outerwear: 2,
  },
  OVERSIZE: {
    shoes: 2, pants: 2, shirts: 7,
    underwear: 10, socks: 10,
    midlayers: 2, outerwear: 2,
  },
};

function applyCaps(counts, bagTier) {
  const caps = TIER_CAPS[bagTier];
  if (!caps) return { capped: counts, warnings: [] };

  const capped = { ...counts };
  const warnings = [];

  for (const [key, max] of Object.entries(caps)) {
    if (capped[key] != null && capped[key] > max) {
      warnings.push(
        `${key} reduced from ${capped[key]} to ${max} to fit ${bagTier} bag tier`
      );
      capped[key] = max;
    }
  }

  return { capped, warnings };
}

module.exports = { TIER_CAPS, applyCaps };
