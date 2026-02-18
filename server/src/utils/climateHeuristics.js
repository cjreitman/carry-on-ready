/**
 * Lightweight, deterministic climate inference from country + travel month.
 * No external APIs — uses static lookup tables.
 */

const TROPICAL = new Set([
  'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'Cambodia', 'Laos',
  'Myanmar', 'Malaysia', 'Singapore', 'Brunei', 'East Timor',
  'India', 'Sri Lanka', 'Bangladesh', 'Maldives',
  'Colombia', 'Ecuador', 'Venezuela', 'Peru', 'Brazil',
  'Costa Rica', 'Panama', 'Honduras', 'Guatemala', 'Nicaragua',
  'El Salvador', 'Belize', 'Dominican Republic', 'Cuba', 'Jamaica',
  'Haiti', 'Trinidad and Tobago', 'Barbados', 'Bahamas',
  'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Mozambique',
  'Madagascar', 'Ghana', 'Nigeria', 'Cameroon', 'Ivory Coast',
  'Senegal', 'Guinea', 'Sierra Leone', 'Liberia',
  'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Papua New Guinea',
  'Solomon Islands', 'Kiribati', 'Micronesia', 'Palau', 'Nauru', 'Tuvalu',
  'Comoros', 'Seychelles', 'Mauritius',
]);

const COLD = new Set([
  'Iceland', 'Norway', 'Sweden', 'Finland', 'Denmark',
  'Russia', 'Canada', 'Mongolia', 'Kazakhstan',
  'Kyrgyzstan', 'Tajikistan',
]);

const DESERT = new Set([
  'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Egypt', 'Libya', 'Algeria', 'Tunisia', 'Morocco',
  'Iraq', 'Jordan', 'Israel', 'Palestine',
  'Niger', 'Chad', 'Mali', 'Mauritania', 'Sudan',
  'Djibouti', 'Eritrea', 'Somalia',
]);

const SOUTHERN_HEMISPHERE = new Set([
  'Australia', 'New Zealand', 'South Africa', 'Argentina', 'Chile',
  'Uruguay', 'Paraguay', 'Bolivia', 'Botswana', 'Namibia',
  'Lesotho', 'Eswatini', 'Zimbabwe', 'Zambia', 'Malawi',
]);

// Monsoon / tropical wet season months (1-indexed)
const TROPICAL_WET_MONTHS = new Set([6, 7, 8, 9, 10]); // Jun–Oct

function getMonth(dateStr) {
  if (!dateStr || dateStr.length < 7) return null;
  return parseInt(dateStr.slice(5, 7), 10); // 1-indexed
}

function isWinter(month, southern) {
  // Northern winter: Nov–Mar (11,12,1,2,3)
  // Southern winter: May–Sep (5,6,7,8,9)
  if (southern) return month >= 5 && month <= 9;
  return month >= 11 || month <= 3;
}

function isSummer(month, southern) {
  // Northern summer: Jun–Aug (6,7,8)
  // Southern summer: Dec–Feb (12,1,2)
  if (southern) return month === 12 || month <= 2;
  return month >= 6 && month <= 8;
}

/**
 * Infer climate and rain from a stop's country + startDate.
 * @param {{ countryOrRegion: string, startDate: string }} stop
 * @returns {{ climate: string, rainExpected: boolean }}
 */
function inferClimateFromStop(stop) {
  const country = stop.countryOrRegion;
  const month = getMonth(stop.startDate);

  // No date → safe default
  if (!month) return { climate: 'moderate', rainExpected: false };

  const southern = SOUTHERN_HEMISPHERE.has(country);

  // Tropical: always hot, rain during wet season
  if (TROPICAL.has(country)) {
    return { climate: 'hot', rainExpected: TROPICAL_WET_MONTHS.has(month) };
  }

  // Desert: hot most of year, moderate in Dec–Feb, no rain
  if (DESERT.has(country)) {
    const winterNow = isWinter(month, false); // all northern hemisphere
    return { climate: winterNow ? 'moderate' : 'hot', rainExpected: false };
  }

  // Cold countries: cold in winter, moderate in summer
  if (COLD.has(country)) {
    const summerNow = isSummer(month, southern);
    return { climate: summerNow ? 'moderate' : 'cold', rainExpected: false };
  }

  // Temperate fallback (everything else): season-dependent
  const winter = isWinter(month, southern);
  const summer = isSummer(month, southern);

  if (summer) return { climate: 'hot', rainExpected: false };
  if (winter) return { climate: 'cold', rainExpected: true };
  // Shoulder seasons (spring/autumn)
  return { climate: 'moderate', rainExpected: true };
}

module.exports = { inferClimateFromStop };
