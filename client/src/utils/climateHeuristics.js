/**
 * Client-side mirror of server/src/utils/climateHeuristics.js.
 * Used for display-only inference preview in the Build form.
 * Must stay in sync with the server version.
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

const TROPICAL_WET_MONTHS = new Set([6, 7, 8, 9, 10]);

function getMonth(dateStr) {
  if (!dateStr || dateStr.length < 7) return null;
  return parseInt(dateStr.slice(5, 7), 10);
}

function isWinter(month, southern) {
  if (southern) return month >= 5 && month <= 9;
  return month >= 11 || month <= 3;
}

function isSummer(month, southern) {
  if (southern) return month === 12 || month <= 2;
  return month >= 6 && month <= 8;
}

export function inferClimateFromStop(stop) {
  const country = stop.countryOrRegion;
  const month = getMonth(stop.startDate);

  if (!country || !month) return null;

  const southern = SOUTHERN_HEMISPHERE.has(country);

  if (TROPICAL.has(country)) {
    return { climate: 'hot', rainExpected: TROPICAL_WET_MONTHS.has(month) };
  }

  if (DESERT.has(country)) {
    const winterNow = isWinter(month, false);
    return { climate: winterNow ? 'moderate' : 'hot', rainExpected: false };
  }

  if (COLD.has(country)) {
    const summerNow = isSummer(month, southern);
    return { climate: summerNow ? 'moderate' : 'cold', rainExpected: false };
  }

  const winter = isWinter(month, southern);
  const summer = isSummer(month, southern);

  if (summer) return { climate: 'hot', rainExpected: false };
  if (winter) return { climate: 'cold', rainExpected: true };
  return { climate: 'moderate', rainExpected: true };
}
