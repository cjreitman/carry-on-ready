/**
 * Tech rule: (ctx, draft) => void
 */
module.exports = function techRule(ctx, draft) {
  const { workSetup } = ctx.derived;

  draft.items.push(
    { id: 'tech-phone-charger', section: 'Tech', label: 'Phone + charger', count: 1, packed: false },
    { id: 'tech-adapter', section: 'Tech', label: 'Universal power adapter', count: 1, packed: false },
    { id: 'tech-earbuds', section: 'Tech', label: 'Earbuds / headphones', count: 1, packed: false }
  );

  if (workSetup === 'light') {
    draft.items.push(
      { id: 'tech-laptop', section: 'Tech', label: 'Laptop + charger', count: 1, packed: false }
    );
  }

  if (workSetup === 'heavy') {
    draft.items.push(
      { id: 'tech-laptop', section: 'Tech', label: 'Laptop + charger', count: 1, packed: false },
      { id: 'tech-hub', section: 'Tech', label: 'USB-C hub / dongle', count: 1, packed: false }
    );
  }

  // TODO: add portable battery, cable organizer
};
