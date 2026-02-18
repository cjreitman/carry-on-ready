/**
 * Baseline essential items injected into every checklist after rules/caps.
 * Duplicates are skipped by ID in engine.js — if a rule already emitted
 * an item with the same ID, the baseline version is not added.
 *
 * Fields:
 *   id        — must exist in ITEM_VOLUME_MAP
 *   section   — checklist section name
 *   label     — display label
 *   tier      — 'essential' (only essential items are injected)
 *   genders   — ['all'] or array of gender slugs
 *   climates  — ['all'] or array of climate slugs
 *   workSetup — (optional) array of workSetup values that must match
 */
const BASELINE_ITEMS = [
  {
    id: 'tech-laptop',
    section: 'Tech',
    label: 'Laptop + charger',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
    workSetup: ['light', 'heavy'],
  },
  {
    id: 'tech-phone',
    section: 'Tech',
    label: 'Smartphone',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
  },
  {
    id: 'tech-travel-adapter',
    section: 'Tech',
    label: 'Universal travel adapter',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
  },
  {
    id: 'health-ziploc',
    section: 'Health',
    label: 'Quart-size liquids bag',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
  },
  {
    id: 'health-nailclipper',
    section: 'Health',
    label: 'Nail clipper',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
  },
  {
    id: 'res-waterbottle',
    section: 'Resilience',
    label: 'Water bottle',
    tier: 'essential',
    genders: ['all'],
    climates: ['all'],
  },
];

module.exports = { BASELINE_ITEMS };
