/**
 * Health rule: (ctx, draft) => void
 */
module.exports = function healthRule(ctx, draft) {
  draft.items.push(
    { id: 'health-toiletries', section: 'Health', label: 'Toiletry kit (100ml bottles, TSA-compliant)', count: 1, packed: false },
    { id: 'health-meds', section: 'Health', label: 'Prescription medications (in original packaging)', count: 1, packed: false },
    { id: 'health-firstaid', section: 'Health', label: 'Mini first-aid kit (band-aids, pain relief)', count: 1, packed: false },
    { id: 'health-sunscreen', section: 'Health', label: 'Sunscreen (travel size)', count: 1, packed: false }
  );

  if (ctx.derived.climate === 'hot') {
    draft.items.push(
      { id: 'health-rehydration', section: 'Health', label: 'Electrolyte packets', count: 1, packed: false }
    );
  }

  // TODO: add insect repellent for tropical, altitude meds, etc.
};
