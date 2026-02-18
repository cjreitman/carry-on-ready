/**
 * Contextual optional add-ons: items that are conditionally recommended
 * but suppressed by user inputs. When suppressed, they appear in
 * Optional Add-ons with a tooltip explaining why.
 *
 * Each entry:
 *   id              — unique, opt- prefixed
 *   label           — display label
 *   tooltip         — explains why not recommended + when to add
 *   includeWhen     — (derived, input) => boolean: when the item IS recommended
 *   showWhenSuppressed — (derived, input) => boolean: when to show as optional
 */
const CONTEXTUAL_ADDONS = [
  {
    id: 'opt-puffy-jacket',
    label: 'Packable down / puffy jacket',
    tooltip:
      'Not recommended because your climate is warm. Add if you run cold, expect chilly evenings, or will be in strong AC.',
    includeWhen: (d) => d.climate === 'cold' || d.climate === 'mixed',
    showWhenSuppressed: (d) => d.climate === 'hot' || d.climate === 'moderate',
  },
  {
    id: 'opt-midlayer',
    label: 'Merino sweater / midlayer',
    tooltip:
      'Not recommended because your climate is warm. Add if temperatures drop at night or you want a layering option for flights.',
    includeWhen: (d) => d.climate === 'cold' || d.climate === 'mixed',
    showWhenSuppressed: (d) => d.climate === 'hot' || d.climate === 'moderate',
  },
  {
    id: 'opt-rain-shell',
    label: 'Packable rain shell',
    tooltip:
      "Not recommended because rain wasn't expected. Add if weather is unpredictable or you want a wind layer.",
    includeWhen: (d) => d.rainExpected || d.climate === 'mixed',
    showWhenSuppressed: (d) => !d.rainExpected && d.climate !== 'mixed',
  },
  {
    id: 'opt-warm-accessories',
    label: 'Warm accessories (beanie, gloves, scarf)',
    tooltip:
      'Useful for cold climates or chilly evenings. Adds warmth with minimal volume.',
    includeWhen: () => false, // never auto-recommended by rules
    showWhenSuppressed: (d) => d.climate === 'cold' || d.climate === 'mixed',
  },
  {
    id: 'opt-swimwear',
    label: 'Swim trunks / swimsuit',
    tooltip:
      'Not auto-included for your climate. Add if you expect pools, spas, or beaches.',
    includeWhen: () => false, // never auto-recommended by rules
    showWhenSuppressed: (d) => d.climate === 'hot' || d.climate === 'mixed',
  },
];

module.exports = { CONTEXTUAL_ADDONS };
