/**
 * Documents rule: (ctx, draft) => void
 */
module.exports = function documentsRule(ctx, draft) {
  if (ctx.derived.passportRecommended) {
    draft.items.push(
      { id: 'docs-passport', section: 'Documents', label: 'Passport', count: 1, packed: false }
    );
  }

  draft.items.push(
    { id: 'docs-boarding', section: 'Documents', label: 'Boarding passes (digital or printed)', count: 1, packed: false },
    { id: 'docs-insurance', section: 'Documents', label: 'Travel insurance details', count: 1, packed: false },
    { id: 'docs-copies', section: 'Documents', label: 'Photo copies of key documents (phone/cloud)', count: 1, packed: false }
  );

  // TODO: add visa reminders per destination
};
