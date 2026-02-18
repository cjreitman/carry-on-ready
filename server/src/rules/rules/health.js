/**
 * Health rule: (ctx, draft) => void
 */
module.exports = function healthRule(ctx, draft) {
  draft.items.push(
    { id: 'health-toiletries', section: 'Health', label: 'Toiletry kit (100ml bottles, TSA-compliant)', count: 1, packed: false },
    { id: 'health-toothbrush', section: 'Health', label: 'Toothbrush', count: 1, packed: false },
    { id: 'health-meds', section: 'Health', label: 'Prescription medications', count: 1, packed: false },
    { id: 'health-firstaid', section: 'Health', label: 'Mini first-aid kit (band-aids, pain relief)', count: 1, packed: false },
    { id: 'health-sunscreen', section: 'Health', label: 'Sunscreen (travel size)', count: 1, packed: false },
    { id: 'health-nailclipper', section: 'Health', label: 'Nail clipper', count: 1, packed: false }
  );

  draft.items.push(
    { id: 'rec-sleep-kit', section: 'Health', label: 'Sleep kit (eye mask + earplugs)', count: 1, packed: false }
  );

  // Hairbrush: essential for female / non-binary, optional otherwise
  const gender = ctx.derived.gender;
  if (gender === 'female' || gender === 'non-binary') {
    draft.items.push(
      { id: 'health-hairbrush', section: 'Health', label: 'Hairbrush', count: 1, packed: false }
    );
  }

  if (ctx.derived.climate === 'hot') {
    draft.items.push(
      { id: 'health-rehydration', section: 'Health', label: 'Electrolyte packets', count: 1, packed: false }
    );
  }

  // TODO: add insect repellent for tropical, altitude meds, etc.
};
