const { generateInputSchema } = require('../schemas/generate.schema');
const { computeDerived } = require('./derive');
const { applyCaps } = require('./caps');
const { attachVolume, computeVolumeDerived } = require('./volume');

const { BASELINE_ITEMS } = require('./baselineItems');
const { CONTEXTUAL_ADDONS } = require('./contextualAddOns');
const clothingRule = require('./rules/clothing');
const techRule = require('./rules/tech');
const documentsRule = require('./rules/documents');
const financialRule = require('./rules/financial');
const healthRule = require('./rules/health');
const resilienceRule = require('./rules/resilience');

const RULES_VERSION = '1.0.0';

function getClothingLabels(gender) {
  if (gender === 'male') return {
    shoes: 'Shoes (wear bulkiest, pack the other)',
    pants: 'Pants / shorts',
    shirts: 'Merino T-shirts / tops',
    underwear: 'Merino boxers',
    socks: 'Merino socks',
    midlayers: 'Merino sweater / midlayer',
    outerwear: 'Outerwear',
  };
  if (gender === 'female') return {
    shoes: 'Shoes (wear bulkiest, pack the other)',
    pants: 'Bottoms (pants, skirt, or leggings)',
    shirts: 'Tops (quick-dry preferred)',
    underwear: 'Underwear',
    socks: 'Socks (merino recommended)',
    midlayers: 'Merino sweater / midlayer',
    outerwear: 'Outerwear',
  };
  // non-binary / prefer-not-to-say
  return {
    shoes: 'Shoes (wear bulkiest, pack the other)',
    pants: 'Bottoms',
    shirts: 'Tops (quick-dry preferred)',
    underwear: 'Underwear (merino recommended)',
    socks: 'Socks (merino recommended)',
    midlayers: 'Sweater / midlayer',
    outerwear: 'Outerwear',
  };
}

const OPTIONAL_ADDONS = [
  { id: 'opt-sandals', label: 'Minimalist sandals', tooltip: '~1.2L per pair. Useful for hostels, beaches, or resting primary shoes.' },
  { id: 'opt-powerbank', label: 'Power bank', tooltip: '~0.25L. Useful for long travel days without outlets.' },
  { id: 'opt-speaker', label: 'Bluetooth speaker', tooltip: '~0.3L. Compact option for downtime.' },
  { id: 'opt-extra-cubes', label: 'Extra packing cubes', tooltip: '~0.5L. Helps separate clean and dirty clothes.' },
  { id: 'opt-towel', label: 'Travel towel (microfiber)', tooltip: '~0.4L. Dries 3x faster than cotton.' },
  { id: 'opt-flashdrive', label: 'Flash drive', tooltip: '~0.02L. Offline backup for important documents.' },
  { id: 'opt-notebook', label: 'Small notebook', tooltip: '~0.15L. For journaling or jotting directions.' },
  { id: 'opt-airtag', label: 'AirTag / tracker', tooltip: '~0.02L. Track your bag in case of loss.' },
  { id: 'opt-sunglasses-case', label: 'Sunglasses (hard case)', tooltip: '~0.15L. Protects lenses in a packed bag.' },
  { id: 'opt-shaver', label: 'Electric shaver / trimmer', tooltip: '~0.25L. USB-rechargeable, saves space over razors.' },
  { id: 'opt-makeup', label: 'Makeup kit (travel size)', tooltip: '~0.5L. Decant into small containers to save space.' },
  { id: 'opt-lock', label: 'TSA-approved luggage lock', tooltip: '~0.05L. Secures your bag at hostels and airports.' },
  { id: 'opt-detergent', label: 'Detergent sheets / travel soap', tooltip: '~0.1L. Enables sink washes on long trips.' },
  { id: 'opt-mouse', label: 'Travel mouse', tooltip: '~0.2L. Helpful for heavy laptop work sessions.' },
  { id: 'opt-hairbrush', label: 'Hairbrush', tooltip: '~0.2L. Compact travel brush saves space.' },
];

const CARRYON_PRINCIPLES = [
  '2 shoes max — wear the bulkiest pair on the plane.',
  'Layers > bulk — a midlayer + shell beats a heavy coat.',
  'Merino reduces quantity — odor-resistant fabrics mean fewer items.',
  'Packable down > bulky coat — compresses to almost nothing.',
  'Shell > umbrella — a rain shell doubles as wind protection (umbrella optional).',
];

function generate(rawInput) {
  // 1. Validate
  const parsed = generateInputSchema.parse(rawInput);

  // 2. Derive computed values
  const derived = computeDerived(parsed);

  // 3. Build draft (each rule mutates this)
  const draft = {
    items: [],
    notes: [],
    warnings: [],
    clothingCounts: null, // set by clothingRule
  };

  const ctx = { input: parsed, derived };

  // 4. Run each rule
  clothingRule(ctx, draft);
  techRule(ctx, draft);
  documentsRule(ctx, draft);
  financialRule(ctx, draft);
  healthRule(ctx, draft);
  resilienceRule(ctx, draft);

  // 5. Apply bag tier caps to clothing counts
  if (draft.clothingCounts) {
    const { capped, warnings: capWarnings } = applyCaps(
      draft.clothingCounts,
      derived.bagTier
    );
    draft.warnings.push(...capWarnings);

    // Emit clothing items from capped counts (gender-aware labels)
    const labels = getClothingLabels(derived.gender);
    const clothingItems = [
      { key: 'shoes', label: labels.shoes },
      { key: 'pants', label: labels.pants },
      { key: 'shirts', label: labels.shirts },
      { key: 'underwear', label: labels.underwear },
      { key: 'socks', label: labels.socks },
      { key: 'midlayers', label: labels.midlayers },
      { key: 'outerwear', label: labels.outerwear },
    ];

    for (const { key, label } of clothingItems) {
      if (capped[key] > 0) {
        const item = {
          id: `clothing-${key}`,
          section: 'Clothing',
          label,
          count: capped[key],
          packed: false,
        };
        if (key === 'shoes') item.wearOne = true;
        draft.items.unshift(item);
      }
    }
  }

  // 6. Must-bring items (after caps, prepended so they appear first)
  if (parsed.mustBringItems && parsed.mustBringItems.length > 0) {
    const mustBring = parsed.mustBringItems.map((label) => ({
      id: 'must-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      section: 'Must-bring',
      label,
      count: 1,
      packed: false,
      isUserRequired: true,
    }));
    draft.items.unshift(...mustBring);
  }

  // 7. Oversize warning
  if (derived.bagTier === 'OVERSIZE') {
    draft.warnings.push(
      `Your bag (${parsed.bagLiters}L) may exceed carry-on limits on some airlines. Check your airline's policy.`
    );
  }

  // 7. Minimum clothing guidance
  draft.notes.push(
    'Minimum viable rotation: 3 shirts / socks / underwear. 5 is preferred.'
  );

  // 9. Carry-on principles (always shown)
  draft.notes.push('--- Carry-on Principles ---');
  draft.notes.push(...CARRYON_PRINCIPLES);

  // 10. Attach volume metadata to every item
  const checklist = draft.items.map(attachVolume);

  // 10b. Must-bring items: null out volume (user-supplied, unknown size)
  for (const item of checklist) {
    if (item.isUserRequired) {
      item.volumeEachLiters = null;
      item.volumeSource = null;
    }
  }

  // 11. Inject baseline essential items (skip duplicates by ID)
  const existingIds = new Set(checklist.map((item) => item.id));
  for (const baseline of BASELINE_ITEMS) {
    if (baseline.tier !== 'essential') continue;
    if (existingIds.has(baseline.id)) continue;
    if (!baseline.genders.includes('all') && !baseline.genders.includes(derived.gender)) continue;
    if (!baseline.climates.includes('all') && !baseline.climates.includes(derived.climate)) continue;
    if (baseline.workSetup && !baseline.workSetup.includes(parsed.workSetup)) continue;

    checklist.push(attachVolume({
      id: baseline.id,
      section: baseline.section,
      label: baseline.label,
      count: 1,
      packed: false,
    }));
  }

  const volumeDerived = computeVolumeDerived(checklist, parsed.bagLiters);

  // 12. Build optional add-ons (static list, then filter gender-conditional ones)
  const checklistIdSet = new Set(checklist.map((item) => item.id));
  const optionalAddOns = OPTIONAL_ADDONS
    .filter((addon) => {
      // Hairbrush: only show as add-on when NOT already essential (female/non-binary)
      if (addon.id === 'opt-hairbrush') {
        return !checklistIdSet.has('health-hairbrush');
      }
      return true;
    })
    .map((addon) =>
      attachVolume({ ...addon, section: 'Optional', count: 1, packed: false })
    );

  // 13. Contextual optional add-ons (suppressed recommendations)
  const optionalIdSet = new Set(optionalAddOns.map((a) => a.id));
  for (const entry of CONTEXTUAL_ADDONS) {
    if (checklistIdSet.has(entry.id) || optionalIdSet.has(entry.id)) continue;
    if (entry.includeWhen(derived, parsed)) continue; // already recommended
    if (!entry.showWhenSuppressed(derived, parsed)) continue; // not relevant
    optionalAddOns.push(
      attachVolume({
        id: entry.id,
        section: 'Optional',
        label: entry.label,
        tooltip: entry.tooltip,
        count: 1,
        packed: false,
      })
    );
  }

  return {
    checklist,
    optionalAddOns,
    notes: draft.notes,
    warnings: draft.warnings,
    derived: {
      totalDays: derived.totalDays,
      bagTier: derived.bagTier,
      ...volumeDerived,
    },
    rulesVersion: RULES_VERSION,
  };
}

module.exports = { generate };
