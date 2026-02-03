/**
 * Qibla direction (bearing to the Kaaba in Mecca) from a given location.
 * No API required – pure math. Result is degrees from True North (0–360).
 */

const KAABA_LAT = 21.4224779 * (Math.PI / 180);
const KAABA_LON = 39.8251832 * (Math.PI / 180);

/**
 * Get Qibla bearing in degrees from True North (0 = North, 90 = East, 180 = South, 270 = West).
 * @param latDeg - Your latitude in degrees
 * @param lonDeg - Your longitude in degrees
 * @returns Bearing in degrees 0–360
 */
export function getQiblaBearing(latDeg: number, lonDeg: number): number {
  const φ1 = latDeg * (Math.PI / 180);
  const λ1 = lonDeg * (Math.PI / 180);
  const Δλ = KAABA_LON - λ1;

  const y = Math.sin(Δλ) * Math.cos(KAABA_LAT);
  const x =
    Math.cos(φ1) * Math.sin(KAABA_LAT) -
    Math.sin(φ1) * Math.cos(KAABA_LAT) * Math.cos(Δλ);

  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  bearing = (bearing + 360) % 360;
  return bearing;
}

/** Kaaba coordinates (for display). */
export const KAABA_COORDS = { lat: 21.4224779, lon: 39.8251832 };
