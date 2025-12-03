// rates.js

export const ZONES = [
  { name: "Zone 1", minKm: 0, maxKm: 5 },
  { name: "Zone 2", minKm: 5, maxKm: 10 },
  { name: "Zone 3", minKm: 10, maxKm: 15 },
  { name: "Zone 4A", minKm: 15, maxKm: 50 },
  { name: "Zone 4B", minKm: 50, maxKm: 100 },
  { name: "Zone 4C", minKm: 100, maxKm: 200 },
];

// Pickup & Drop-Off rates
export const RATES = {
  florist: {
    pickupDropOff: [14, 18, 22, 28, 38, 55],
    dropOffOnly: [12, 15, 19, 24, 32, 47],
  },
  pharmacy: {
    pickupDropOff: [9, 12, 15, 20, 28, 42],
    dropOffOnly: [8, 10, 13, 17, 24, 36],
  },
  retail: {
    pickupDropOff: [13, 17, 21, 27, 37, 52],
    dropOffOnly: [11, 14, 18, 23, 31, 44],
  },
  sameday: {
    pickupDropOff: [11, 14, 17, 22, 30, 45],
    dropOffOnly: [9, 12, 14, 19, 26, 38],
  },
};

// Volume discounts
export const VOLUME_DISCOUNTS = [
  { min: 5, max: 9, discount: 0.05 },
  { min: 10, max: 19, discount: 0.1 },
  { min: 20, max: 49, discount: 0.15 },
  { min: 50, max: Infinity, discount: 0.2 },
];