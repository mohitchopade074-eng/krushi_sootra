// KRUSHI-SOOTRA (कृषी-सूत्र)
// Location Service & Mathematical Haversine Distance Engine (Zero-Cost, Offline-Resilient)

/**
 * Calculates the great-circle distance between two geographic points using Haversine formula.
 * @param {number} lat1 Latitude of origin
 * @param {number} lon1 Longitude of origin
 * @param {number} lat2 Latitude of destination
 * @param {number} lon2 Longitude of destination
 * @returns {number} Distance in kilometers rounded to 1 decimal place
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Filter items located within a specific radius (default: 20km for farmer equipment/labour discovery)
 * @param {Array} items Array of items containing latitude and longitude
 * @param {number} userLat Current user latitude
 * @param {number} userLon Current user longitude
 * @param {number} maxRadiusKm Max radius in kilometers (default: 20)
 * @returns {Array} Sorted items with attached calculated distance
 */
export function filterByRadius(items = [], userLat, userLon, maxRadiusKm = 20) {
  if (!userLat || !userLon || !Array.isArray(items)) {
    return items;
  }

  return items
    .map((item) => {
      const distanceKm = calculateHaversineDistanceKm(
        userLat,
        userLon,
        item.latitude,
        item.longitude
      );
      return {
        ...item,
        distanceKm,
      };
    })
    .filter((item) => item.distanceKm !== null && item.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Format distance for display in localized UI
 * @param {number} distanceKm
 * @param {'mr' | 'en' | 'hi'} language
 * @returns {string} e.g. "3.4 किमी" or "3.4 km"
 */
export function formatDistance(distanceKm, language = 'mr') {
  if (distanceKm == null) return '';
  if (language === 'mr' || language === 'hi') {
    return `${distanceKm} किमी`;
  }
  return `${distanceKm} km`;
}

// Default reference coordinates for Maharashtra agricultural hubs
export const AGRICULTURAL_LOCATIONS = {
  PUNE: { name: 'पुणे (हवेली)', lat: 18.5204, lon: 73.8567 },
  NASHIK: { name: 'नाशिक (निफाड)', lat: 19.9975, lon: 73.7898 },
  KOLHAPUR: { name: 'कोल्हापूर (शिरोळ)', lat: 16.7050, lon: 74.2433 },
  AURANGABAD: { name: 'छत्रपती संभाजीनगर', lat: 19.8762, lon: 75.3433 },
  AMRAVATI: { name: 'अमरावती (अचलपूर)', lat: 20.9374, lon: 77.7796 },
  SOLAPUR: { name: 'सोलापूर (पंढरपूर)', lat: 17.6599, lon: 75.9064 },
};
