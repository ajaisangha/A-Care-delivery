// Define zones based on distance (in km)
export const ZONES = [
  { name: "Zone 1", maxKm: 5 },
  { name: "Zone 2", maxKm: 10 },
  { name: "Zone 3", maxKm: 15 },
  { name: "Zone 4", maxKm: Infinity }, // Custom quote
];

// Define rates for each service type
export const RATES = {
  florist: { single: [14, 18, 22], premium: [18, 22, 26] },
  pharmacy: { standard: [9, 12, 15], urgent: [18, 22, 28] },
  retail: { small: [13, 17, 21], medium: [17, 22, 27], large: [24, 30, 36] },
  sameday: { economy: [11, 14, 17], standard: [16, 20, 24], express: [25, 30, 35] },
};

// Volume discounts based on quantity
export const VOLUME_DISCOUNTS = [
  { min: 10, max: 19, discount: 0.1 },
  { min: 20, max: 49, discount: 0.15 },
  { min: 50, max: Infinity, discount: 0.2 },
];

// Base address
export const BASE_ADDRESS = "378 Vogel Pl, Waterloo";
