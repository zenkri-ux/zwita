// Score calculation for a correctly discovered station.
//
// Deterministic and pure so it is unit-testable. The curve rewards finding a
// station with few attempts but never punishes exploration harshly — the
// experience must stay playful, and there is no speed/running incentive.

export const BASE_STATION_POINTS = 100;
const PENALTY_PER_WRONG_ATTEMPT = 20;
const MINIMUM_STATION_POINTS = 20;

/**
 * Points awarded for a station given how many attempts it took.
 *
 * @param attempts total attempts for the station INCLUDING the successful one
 *                 (so the first-try correct scan passes attempts = 1).
 */
export function scoreForStation(attempts: number): number {
  const wrongAttempts = Math.max(0, attempts - 1);
  const raw = BASE_STATION_POINTS - wrongAttempts * PENALTY_PER_WRONG_ATTEMPT;
  return Math.max(MINIMUM_STATION_POINTS, raw);
}
