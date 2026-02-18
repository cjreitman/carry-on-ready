/**
 * Volume estimation profiles (liters per unit).
 * Shoes volumes are per pair.
 */
const VOLUME_PROFILE = {
  // Shirts
  shirt_merino_tshirt: 0.70,
  shirt_long_sleeve_merino: 0.90,
  shirt_button_down_light: 1.00,
  shirt_tank_light: 0.55,

  // Underwear & socks
  underwear_merino: 0.18,
  underwear_standard: 0.22,
  bra_sports_light: 0.25,
  socks_merino: 0.15,
  socks_standard: 0.18,

  // Bottoms
  pants_technical_nylon: 1.40,
  pants_chino_light: 1.70,
  pants_denim: 2.50,
  joggers_technical: 1.60,
  shorts_technical: 0.70,
  leggings_compressive: 0.90,
  skirt_light: 0.80,
  dress_packable: 1.20,
  swim_trunks: 0.35,
  swimsuit_one_piece: 0.45,
  swimsuit_two_piece: 0.35,

  // Midlayers
  sweater_merino_midweight: 2.00,
  hoodie_merino_midweight: 2.30,
  fleece_light: 2.20,

  // Outerwear
  jacket_down_packable: 2.00,
  jacket_synthetic_puffy: 2.20,
  shell_rain_light: 0.80,
  wind_shell_ultralight: 0.55,

  // Cold accessories
  cold_accessories_set: 0.80,

  // Shoes (per pair)
  shoes_minimalist_pair: 3.50,
  shoes_sneakers_pair: 5.00,
  sandals_minimalist_pair: 1.20,

  // Tech
  phone: 0.10,
  earbuds: 0.10,
  laptop_13_14: 1.50,
  laptop_15_16: 1.90,
  tablet: 0.60,
  switch_lite: 0.40,

  // Cables & power
  charger_phone_cable: 0.05,
  charger_laptop_brick: 0.40,
  charger_multiport_brick: 0.35,
  adapter_universal: 0.30,
  powerbank_small: 0.25,
  powerbank_large: 0.40,

  // Documents
  passport: 0.05,
  wallet: 0.08,
  keys: 0.05,
  pen: 0.03,

  // Health
  toiletry_kit_minimal: 0.80,
  toiletry_kit_standard: 1.20,
  meds_pouch: 0.20,
  first_aid_kit_small: 0.50,
  nail_clipper: 0.03,
  toothbrush: 0.05,
  hairbrush_compact: 0.20,

  // Resilience / organization
  packing_cubes_set_2: 1.00,
  lock: 0.05,
  ziplocks_set: 0.10,
  daypack_packable: 0.45,
  sling_small: 0.35,
  clothesline_packable: 0.10,
  water_bottle_collapsible: 0.20,
  sunglasses_case: 0.15,

  // Misc
  detergent_sheets: 0.10,
  sunscreen: 0.15,
  rehydration_salts: 0.10,

  // Optional add-on items
  speaker_bluetooth_mini: 0.30,
  packing_cubes_extra: 0.50,
  travel_towel_micro: 0.40,
  flash_drive: 0.02,
  notebook_small: 0.15,
  airtag: 0.02,
  shaver_electric_mini: 0.25,
  makeup_kit_travel: 0.50,

  DEFAULT_UNKNOWN_ITEM: 0.20,
};

/**
 * Map checklist item IDs to volume profile keys.
 */
const ITEM_VOLUME_MAP = {
  // Clothing (from caps in engine.js)
  'clothing-shoes': 'shoes_minimalist_pair',
  'clothing-pants': 'pants_technical_nylon',
  'clothing-shirts': 'shirt_merino_tshirt',
  'clothing-underwear': 'underwear_merino',
  'clothing-socks': 'socks_merino',
  'clothing-midlayers': 'fleece_light',
  'clothing-outerwear': 'shell_rain_light',

  // Clothing extras
  'clothing-detergent': 'detergent_sheets',
  'clothing-packable-down': 'jacket_down_packable',
  'clothing-rain-shell': 'shell_rain_light',

  // Tech
  'tech-phone-charger': 'charger_phone_cable',
  'tech-adapter': 'adapter_universal',
  'tech-earbuds': 'earbuds',
  'tech-laptop': 'laptop_13_14',
  'tech-phone': 'phone',
  'tech-travel-adapter': 'adapter_universal',
  'tech-mouse': 'DEFAULT_UNKNOWN_ITEM',
  'tech-hub': 'DEFAULT_UNKNOWN_ITEM',

  // Documents
  'docs-passport': 'passport',
  'docs-boarding': 'DEFAULT_UNKNOWN_ITEM',
  'docs-insurance': 'DEFAULT_UNKNOWN_ITEM',
  'docs-copies': 'DEFAULT_UNKNOWN_ITEM',

  // Financial
  'fin-cards': 'wallet',
  'fin-cash': 'DEFAULT_UNKNOWN_ITEM',
  'fin-backup-card': 'DEFAULT_UNKNOWN_ITEM',

  // Health
  'health-toiletries': 'toiletry_kit_standard',
  'health-meds': 'meds_pouch',
  'health-firstaid': 'first_aid_kit_small',
  'health-sunscreen': 'sunscreen',
  'health-rehydration': 'rehydration_salts',

  // Health (new)
  'health-nailclipper': 'nail_clipper',
  'health-ziploc': 'ziplocks_set',
  'health-toothbrush': 'toothbrush',
  'health-hairbrush': 'hairbrush_compact',

  // Resilience
  'res-lock': 'lock',
  'res-packbags': 'packing_cubes_set_2',
  'res-ziplock': 'ziplocks_set',
  'res-pen': 'pen',
  'res-daysack': 'daypack_packable',
  'res-waterbottle': 'water_bottle_collapsible',

  // Clothing extras (gender)
  'clothing-dress': 'dress_packable',
  'clothing-leggings': 'leggings_compressive',

  // Optional add-ons
  'opt-sandals': 'sandals_minimalist_pair',
  'opt-powerbank': 'powerbank_small',
  'opt-speaker': 'speaker_bluetooth_mini',
  'opt-extra-cubes': 'packing_cubes_extra',
  'opt-towel': 'travel_towel_micro',
  'opt-flashdrive': 'flash_drive',
  'opt-notebook': 'notebook_small',
  'opt-airtag': 'airtag',
  'opt-sunglasses-case': 'sunglasses_case',
  'opt-shaver': 'shaver_electric_mini',
  'opt-makeup': 'makeup_kit_travel',
  'opt-lock': 'lock',
  'opt-detergent': 'detergent_sheets',
  'opt-mouse': 'DEFAULT_UNKNOWN_ITEM',
  'opt-hairbrush': 'hairbrush_compact',
};

/**
 * Attach volumeEachLiters and volumeSource to a checklist item.
 */
function attachVolume(item) {
  const profileKey = ITEM_VOLUME_MAP[item.id] || 'DEFAULT_UNKNOWN_ITEM';
  const volumeEachLiters = VOLUME_PROFILE[profileKey] ?? VOLUME_PROFILE.DEFAULT_UNKNOWN_ITEM;
  return {
    ...item,
    volumeEachLiters,
    volumeSource: profileKey,
  };
}

/**
 * Compute usable capacity and total estimated volume.
 */
function computeVolumeDerived(checklist, bagLiters) {
  const usableCapacityLiters = +(bagLiters * 0.85).toFixed(1);
  const estimatedPackedLiters = +checklist
    .reduce((sum, item) => {
      const count = item.count || 1;
      const effectiveCount = item.wearOne ? Math.max(0, count - 1) : count;
      return sum + (item.volumeEachLiters || 0) * effectiveCount;
    }, 0)
    .toFixed(1);
  const estimatedPercentUsed = usableCapacityLiters > 0
    ? +(estimatedPackedLiters / usableCapacityLiters).toFixed(2)
    : 0;

  return { usableCapacityLiters, estimatedPackedLiters, estimatedPercentUsed };
}

module.exports = { VOLUME_PROFILE, ITEM_VOLUME_MAP, attachVolume, computeVolumeDerived };
