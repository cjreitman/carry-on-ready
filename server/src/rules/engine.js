const { generateInputSchema } = require('../schemas/generate.schema');
const { computeDerived } = require('./derive');
const { applyCaps } = require('./caps');

const clothingRule = require('./rules/clothing');
const techRule = require('./rules/tech');
const documentsRule = require('./rules/documents');
const financialRule = require('./rules/financial');
const healthRule = require('./rules/health');
const resilienceRule = require('./rules/resilience');

const RULES_VERSION = '1.0.0';

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

    // Emit clothing items from capped counts
    const clothingItems = [
      { key: 'shoes', label: 'Shoes (wear bulkiest, pack the other)' },
      { key: 'pants', label: 'Pants / bottoms' },
      { key: 'shirts', label: 'Shirts / tops (quick-dry preferred)' },
      { key: 'underwear', label: 'Underwear (merino recommended)' },
      { key: 'socks', label: 'Socks (merino recommended)' },
      { key: 'midlayers', label: 'Midlayer (fleece or light sweater)' },
      { key: 'outerwear', label: 'Outerwear' },
    ];

    for (const { key, label } of clothingItems) {
      if (capped[key] > 0) {
        draft.items.unshift({
          id: `clothing-${key}`,
          section: 'Clothing',
          label,
          count: capped[key],
          packed: false,
        });
      }
    }
  }

  // 6. Oversize warning
  if (derived.bagTier === 'OVERSIZE') {
    draft.warnings.push(
      `Your bag (${parsed.bagLiters}L) may exceed carry-on limits on some airlines. Check your airline's policy.`
    );
  }

  // 7. Schengen warnings
  if (derived.schengenApplies) {
    if (derived.estimatedSchengenTotal > 90) {
      draft.warnings.push(
        `Schengen alert: estimated ${derived.estimatedSchengenTotal} of 90 days used. You may exceed the 90/180 Schengen rule. Consider adjusting your itinerary.`
      );
    }
    draft.notes.push(
      `Schengen 90/180 estimator: ${parsed.schengenDaysUsedLast180} prior days + ${derived.schengenDaysThisTrip} this trip = ${derived.estimatedSchengenTotal} days. Informational only, not legal advice.`
    );
  }

  // 8. Carry-on principles (always shown)
  draft.notes.push('--- Carry-on Principles ---');
  draft.notes.push(...CARRYON_PRINCIPLES);

  return {
    checklist: draft.items,
    notes: draft.notes,
    warnings: draft.warnings,
    derived: {
      totalDays: derived.totalDays,
      bagTier: derived.bagTier,
      hasSchengenStop: derived.hasSchengenStop,
      schengenApplies: derived.schengenApplies,
      schengenDaysThisTrip: derived.schengenDaysThisTrip,
      estimatedSchengenTotal: derived.estimatedSchengenTotal,
    },
    rulesVersion: RULES_VERSION,
  };
}

module.exports = { generate };
