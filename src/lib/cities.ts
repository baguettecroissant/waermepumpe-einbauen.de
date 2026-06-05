import { cities, type City } from '../data/cities-de';

export function getAllCities(): City[] {
  return cities.sort((a, b) => b.pop - a.pop);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}

export function getNearbyCities(city: City, limit = 8): City[] {
  return cities
    .filter(c => c.slug !== city.slug)
    .map(c => ({
      ...c,
      distance: Math.sqrt(
        Math.pow(c.lat - city.lat, 2) + Math.pow(c.lng - city.lng, 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export function getCitiesByState(bundesland: string): City[] {
  return cities.filter(c => c.bundesland === bundesland).sort((a, b) => b.pop - a.pop);
}

export function getAllStates() {
  const stateMap = new Map<string, { name: string; count: number }>();
  for (const city of cities) {
    if (!stateMap.has(city.bundesland)) {
      stateMap.set(city.bundesland, {
        name: city.bundesland,
        count: 0,
      });
    }
    stateMap.get(city.bundesland)!.count++;
  }
  return Array.from(stateMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
export { type City };
