/**
 * Normalizes a city string to Title Case (e.g., "new delhi" -> "New Delhi")
 * to ensure consistency when searching against a potentially case-sensitive backend.
 */
export const normalizeCityName = (city) => {
  if (!city) return '';
  return city
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
