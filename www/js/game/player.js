/**
 * Pure player-progress transitions. The shape mirrors the legacy localStorage arrays
 * (see core/persist.js), so data written by the old version stays readable and vice versa.
 */

export function recordCatch(player, { id, gen, special, perfect, now = Date.now() }) {
  const next = {
    ...player,
    pokemonCaught: [...player.pokemonCaught, { gen, id, isPerfect: perfect, timeStamp: now }],
    pokemonCaughtId: [...player.pokemonCaughtId, id],
    catchingStreak: [...player.catchingStreak, 1],
    pokemonMet: [...player.pokemonMet, id]
  }
  if (special === 'legendary') next.legendaryPokemonCaught = [...player.legendaryPokemonCaught, 1]
  if (special === 'mythical') next.mythicalPokemonCaught = [...player.mythicalPokemonCaught, 1]
  return next
}

export function recordFlee(player, { id }) {
  return {
    ...player,
    catchingStreak: [],
    pokemonMet: [...player.pokemonMet, id]
  }
}

export function stats(player) {
  const last = player.pokemonCaught[player.pokemonCaught.length - 1]
  return {
    lastCaughtId: last?.id ?? null,
    seen: player.pokemonMet.length,
    caught: player.pokemonCaught.length,
    perfect: player.pokemonCaught.filter((p) => p.isPerfect).length,
    legendary: player.legendaryPokemonCaught.length,
    mythical: player.mythicalPokemonCaught.length,
    streak: player.catchingStreak.length
  }
}

/**
 * Per-Pokémon summary for the Pokédex: latest catch time, and whether it was ever caught
 * perfectly.
 * @returns {Map<number, {timeStamp: number, isPerfect: boolean}>}
 */
export function catchSummary(player) {
  const map = new Map()
  for (const entry of player.pokemonCaught) {
    const prev = map.get(entry.id)
    map.set(entry.id, {
      timeStamp: Math.max(prev?.timeStamp ?? 0, entry.timeStamp ?? 0),
      isPerfect: Boolean(prev?.isPerfect || entry.isPerfect)
    })
  }
  return map
}
