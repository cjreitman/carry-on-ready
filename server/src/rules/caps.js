const TIER_CAPS = {
  ULTRA: {
    shoes: 2, pants: 1, shorts: 1, shirts: 3,
    underwear: 4, socks: 4,
    midlayers: 1, outerwear: 1,
  },
  TIGHT: {
    shoes: 2, pants: 1, shorts: 1, shirts: 4,
    underwear: 5, socks: 5,
    midlayers: 1, outerwear: 1,
  },
  STANDARD: {
    shoes: 2, pants: 2, shorts: 2, shirts: 5,
    underwear: 5, socks: 5,
    midlayers: 1, outerwear: 2,
  },
  MAX: {
    shoes: 2, pants: 2, shorts: 2, shirts: 6,
    underwear: 5, socks: 5,
    midlayers: 2, outerwear: 2,
  },
  OVERSIZE: {
    shoes: 2, pants: 2, shorts: 2, shirts: 7,
    underwear: 5, socks: 5,
    midlayers: 2, outerwear: 2,
  },
};

function applyCaps(counts, bagTier) {
  const caps = TIER_CAPS[bagTier];
  if (!caps) return { capped: counts, warnings: [] };

  const capped = { ...counts };

  for (const [key, max] of Object.entries(caps)) {
    if (capped[key] != null && capped[key] > max) {
      capped[key] = max;
    }
  }

  return { capped, warnings: [] };
}

module.exports = { TIER_CAPS, applyCaps };
