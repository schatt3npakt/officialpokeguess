import { GENS } from './gens.js'

/** Default game options (same defaults as the previous version). */
export const DEFAULT_OPTIONS = Object.freeze({
  activeGens: Object.freeze(GENS.map((g) => g.id)),
  excludeGuessedPokemon: true,
  hintsAllowed: true,
  showPokeImage: true,
  revealCaught: true,
  showGenHint: true,
  showIndexHint: true,
  showTypeHint: true,
  useAlphabeticalKeyboard: false,
  infiniteGuesses: false,
  oneGuessOnly: false,
  showPartOfImage: false,
  showPokemonOnFlee: false,
  showPokemonCry: true,
  timerMode: false
})

/** Options that are personal preferences and survive switching game modes. */
const PREFERENCE_KEYS = ['useAlphabeticalKeyboard', 'excludeGuessedPokemon']

/**
 * Applies a game mode on top of the defaults, so options of a previously selected mode
 * (e.g. timerMode) don't leak into the next one. Unknown keys in the mode are ignored.
 */
export function applyGameMode(current, modeOptions) {
  const next = { ...DEFAULT_OPTIONS }
  for (const key of PREFERENCE_KEYS) next[key] = current[key]
  for (const [key, value] of Object.entries(modeOptions)) {
    if (key in DEFAULT_OPTIONS) next[key] = value
  }
  if (!next.activeGens?.length) next.activeGens = DEFAULT_OPTIONS.activeGens
  return next
}

/** Toggles a generation, refusing to deactivate the last active one. */
export function toggleGen(activeGens, genId) {
  if (activeGens.includes(genId)) {
    if (activeGens.length === 1) return activeGens
    return activeGens.filter((id) => id !== genId)
  }
  return [...activeGens, genId].sort((a, b) => a - b)
}
