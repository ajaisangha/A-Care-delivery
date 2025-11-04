// rates.js

export const ZONES = [
  { name: "Zone 1", maxKm: 5 },
  { name: "Zone 2", maxKm: 10 },
  { name: "Zone 3", maxKm: 15 },
  { name: "Zone 4A", maxKm: 50 },
  { name: "Zone 4B", maxKm: 100 },
  { name: "Zone 4C", maxKm: 200 },
];

// Pricing table structured by service type and service mode
export const RATES = {
  florist: {
    full: {
      single: [14, 18, 22, 28, 38, 55],
      premium: [18, 22, 26, 32, 45, 65],
      multiple: [25, 32, 40, 50, 70, 100],
      wedding: [45, 55, 65, 85, 120, 180],
    },
    dropoff: {
      single: [12, 15, 19, 24, 32, 47],
      premium: [15, 19, 22, 27, 38, 55],
      multiple: [21, 27, 34, 43, 60, 85],
      wedding: [38, 47, 55, 72, 102, 153],
    },
  },
  pharmacy: {
    full: {
      standard: [9, 12, 15, 20, 28, 42],
      scheduled: [7, 9, 12, 16, 22, 35],
      urgent: [18, 22, 28, 38, 52, 75],
      temp: [3, 3, 4, 5, 6, 8], // extra charge
    },
    dropoff: {
      standard: [8, 10, 13, 17, 24, 36],
      scheduled: [6, 8, 10, 14, 19, 30],
      urgent: [15, 19, 24, 32, 44, 64],
      temp: [3, 3, 4, 5, 6, 8], // extra charge
    },
  },
  retail: {
    full: {
      small: [13, 17, 21, 27, 37, 52],
      medium: [17, 22, 27, 35, 48, 68],
      large: [24, 30, 36, 47, 65, 92],
      xlarge: ["Quote", "Quote", "Quote", "Quote", "Quote", "Quote"],
    },
    dropoff: {
      small: [11, 14, 18, 23, 31, 44],
      medium: [14, 19, 23, 30, 41, 58],
      large: [20, 26, 31, 40, 55, 78],
      xlarge: ["Quote", "Quote", "Quote", "Quote", "Quote", "Quote"],
    },
  },
  sameday: {
    full: {
      economy: [11, 14, 17, 22, 30, 45],
      standard: [16, 20, 24, 32, 44, 65],
      express: [25, 30, 35, 45, 62, 90],
      rush: [35, 42, 49, 65, 85, 120],
    },
    dropoff: {
      economy: [9, 12, 14, 19, 26, 38],
      standard: [14, 17, 20, 27, 37, 55],
      express: [21, 26, 30, 38, 53, 77],
      rush: [30, 36, 42, 55, 72, 102],
    },
  },
};

// Optional: volume discounts
export const VOLUME_DISCOUNTS = [
  { min: 5, max: 9, discount: 0.05 },
  { min: 10, max: 19, discount: 0.1 },
  { min: 20, max: 49, discount: 0.15 },
  { min: 50, max: Infinity, discount: 0.2 },
];
