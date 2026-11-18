// The placement test's result, kept in localStorage until each app applies it.
//
// placement/ saves { at, levels: { appId: 'N4' | null } }. The next time an
// app opens, it skips ahead past its level (SrsModel.applyPlacement) and notes
// that in `applied`, so each result is applied once per app.

export const PLACEMENT_KEY = 'vibe.placement';
/** Set once the landing page has offered the test, whatever the answer. */
export const OFFERED_KEY = 'vibe.placementOffered';

export function readPlacement() {
  try { return JSON.parse(localStorage.getItem(PLACEMENT_KEY) || 'null'); } catch (e) { return null; }
}

export function writePlacement(p) {
  try { localStorage.setItem(PLACEMENT_KEY, JSON.stringify(p)); } catch (e) { /* storage blocked */ }
}

export function placementOffered() {
  try { return localStorage.getItem(OFFERED_KEY) != null; } catch (e) { return true; }
}

export function markPlacementOffered() {
  try { localStorage.setItem(OFFERED_KEY, String(Date.now())); } catch (e) { /* storage blocked */ }
}

/**
 * Applies a placement result [appId] hasn't applied yet. Resolves with
 * { level, count } when it did, or null.
 */
export async function applyPendingPlacement(appId, model) {
  const p = readPlacement();
  if (!p || !p.levels || !(appId in p.levels)) return null;
  if (p.applied && p.applied[appId] === p.at) return null;
  const level = p.levels[appId];
  const count = level ? await model.applyPlacement(level) : 0;
  // Read again: another app may have applied its part meanwhile.
  const now = readPlacement() || p;
  if (now.at === p.at) writePlacement({ ...now, applied: { ...(now.applied || {}), [appId]: p.at } });
  return { level, count };
}
