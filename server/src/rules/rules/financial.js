/**
 * Financial prep rule: (ctx, draft) => void
 */
module.exports = function financialRule(ctx, draft) {
  draft.items.push(
    { id: 'fin-cards', section: 'Financial Prep', label: 'Credit / debit cards (notify bank of travel)', count: 1, packed: false },
    { id: 'fin-cash', section: 'Financial Prep', label: 'Small amount of local currency or USD/EUR', count: 1, packed: false },
    { id: 'fin-backup-card', section: 'Financial Prep', label: 'Backup payment method (separate from primary)', count: 1, packed: false }
  );

  draft.notes.push(
    'Tip: use a no-foreign-transaction-fee card to save on every purchase.'
  );

  // TODO: add currency-specific notes per stop
};
