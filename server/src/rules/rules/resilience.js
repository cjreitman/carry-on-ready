/**
 * Resilience rule: (ctx, draft) => void
 */
module.exports = function resilienceRule(ctx, draft) {
  draft.items.push(
    { id: 'res-lock', section: 'Resilience', label: 'TSA-approved luggage lock', count: 1, packed: false },
    { id: 'res-packbags', section: 'Resilience', label: 'Packing cubes or compression bags', count: 1, packed: false },
    { id: 'res-ziplock', section: 'Resilience', label: 'Ziplock bags (liquids, dirty laundry)', count: 2, packed: false },
    { id: 'res-pen', section: 'Resilience', label: 'Pen (customs forms)', count: 1, packed: false }
  );

  if (ctx.derived.totalDays > 10) {
    draft.items.push(
      { id: 'res-daysack', section: 'Resilience', label: 'Packable daypack', count: 1, packed: false }
    );
  }

  // TODO: add portable door lock, money belt for high-risk regions
};
