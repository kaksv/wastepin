/**
 * Simple nearest-neighbor algorithm for route optimization (Traveling Salesman Problem approximation)
 * Given a starting location and list of jobs, returns an optimized order
 */

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

export function optimizeRoute(startLat, startLon, jobs) {
  if (!jobs || jobs.length === 0) {
    return [];
  }

  const unvisited = [...jobs];
  const route = [];
  let currentLat = startLat;
  let currentLon = startLon;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    // Find nearest unvisited job
    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(currentLat, currentLon, unvisited[i].latitude, unvisited[i].longitude);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const nearest = unvisited.splice(nearestIdx, 1)[0];
    route.push(nearest);
    totalDistance += nearestDist;
    currentLat = nearest.latitude;
    currentLon = nearest.longitude;
  }

  return { route, totalDistance };
}

export function estimateDuration(distanceKm) {
  // Assume average speed of 25 km/h in urban areas
  const hours = distanceKm / 25;
  return {
    hours: Math.floor(hours),
    minutes: Math.round((hours % 1) * 60),
    totalMinutes: Math.round(hours * 60),
  };
}
