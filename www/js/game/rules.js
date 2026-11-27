/**
 * Pure game rules. No DOM, no storage, no timers - everything here is unit tested.
 * A "round" is a plain immutable object; every transition returns a new round.
 */
import { GENS, genOf } from './gens.js'

/** Characters that are shown from the start and never need to be guessed. */
const IGNORED = /[0-9' :.,♂♀-]/

/** Accented characters that count as a hit for their base letter. */
const FOLDS = {
  a: 'äàáâãåæ',
  c: 'ç',
  d: 'ð',
  e: 'ëéèê',
  i: 'ïìíî',
  n: 'ñ',
  o: 'öòóôõøœ',
  s: 'ßš',
  t: 'Þþ',
  u: 'üùúû',
  y: 'ÿý'
}

export const isIgnored = (char) => IGNORED.test(char)

export const charMatches = (char, key) => char === key || (FOLDS[key]?.includes(char) ?? false)

export function letterIndexes(chars, key) {
  const result = []
  chars.forEach((char, i) => {
    if (charMatches(char, key)) result.push(i)
  })
  return result
}

/** Max wrong guesses / hints depend on rarity; "one guess only" overrides wrong guesses. */
export function limitsFor(special, { oneGuessOnly = false } = {}) {
  let limits
  if (special === 'legendary') limits = { maxWrong: 3, maxHints: 1 }
  else if (special === 'mythical') limits = { maxWrong: 3, maxHints: 0 }
  else limits = { maxWrong: 6, maxHints: 3 }
  if (oneGuessOnly) limits.maxWrong = 1
  return limits
}

/** Inclusive random integer, same semantics as the previous getRandomInt(). */
export function randomInt(min, max, rng = Math.random) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(rng() * (max - min + 1) + min)
}

/**
 * Picks a random Pokémon: first a random active generation, then a random Pokémon in it.
 * With `excludeCaught`, only generations that still have uncaught Pokémon are considered.
 * @returns {{id: number, alreadyCaught: boolean} | null} null when nothing is available
 */
export function pickPokemon({ activeGens, excludeCaught, caughtIds, rng = Math.random }) {
  const caught = new Set(caughtIds)
  const pools = GENS.filter((g) => activeGens.includes(g.id))
    .map((g) => {
      const ids = []
      for (let id = g.start; id <= g.end; id++) {
        if (!excludeCaught || !caught.has(id)) ids.push(id)
      }
      return ids
    })
    .filter((ids) => ids.length > 0)

  if (pools.length === 0) return null
  const pool = pools[randomInt(0, pools.length - 1, rng)]
  const id = pool[randomInt(0, pool.length - 1, rng)]
  return { id, alreadyCaught: caught.has(id) }
}

/**
 * Creates a fresh round.
 * @param {{id:number, name:string, types:string[], special:false|'legendary'|'mythical', alreadyCaught:boolean}} pokemon
 * @param {object} options game options
 */
export function createRound(pokemon, options, rng = Math.random) {
  const tiles = Array.from(pokemon.name.toLowerCase())
  return {
    pokeId: pokemon.id,
    name: pokemon.name,
    tiles,
    revealed: tiles.map(() => false),
    guessed: [],
    wrong: 0,
    hintsUsed: 0,
    phase: 'playing', // playing | won | fled | fled-reveal
    special: pokemon.special,
    gen: genOf(pokemon.id),
    types: pokemon.types,
    alreadyCaught: pokemon.alreadyCaught,
    imagePart: randomInt(0, 3, rng),
    ...limitsFor(pokemon.special, options)
  }
}

export const isWon = (round) => round.tiles.every((char, i) => isIgnored(char) || round.revealed[i])

export const isLost = (round) => !isWon(round) && round.wrong >= round.maxWrong

export const hintsLeft = (round) => Math.max(0, round.maxHints - round.hintsUsed)

/**
 * Applies a letter guess.
 * @returns {{round: object, result: 'duplicate'|'hit'|'miss'|'ignored'}}
 */
export function applyGuess(round, key, { infiniteGuesses = false } = {}) {
  if (round.phase !== 'playing') return { round, result: 'ignored' }
  if (round.guessed.includes(key)) return { round, result: 'duplicate' }

  const hits = letterIndexes(round.tiles, key)
  const revealed = round.revealed.slice()
  for (const i of hits) revealed[i] = true

  const miss = hits.length === 0
  return {
    round: {
      ...round,
      guessed: [...round.guessed, key],
      revealed,
      wrong: miss && !infiniteGuesses ? round.wrong + 1 : round.wrong
    },
    result: miss ? 'miss' : 'hit'
  }
}

/**
 * Reveals a single tile as a hint. Revealed or ignored tiles don't consume a hint.
 * @returns {object|null} new round, or null if the hint is not allowed
 */
export function applyHint(round, index, { hintsAllowed = true } = {}) {
  if (round.phase !== 'playing' || !hintsAllowed || hintsLeft(round) <= 0) return null
  if (index < 0 || index >= round.tiles.length) return null
  if (round.revealed[index] || isIgnored(round.tiles[index])) return null

  const revealed = round.revealed.slice()
  revealed[index] = true
  return { ...round, revealed, hintsUsed: round.hintsUsed + 1 }
}

/** Ends the round as won or fled (fled-reveal shows the Pokémon and its name). */
export function finishRound(round, { showPokemonOnFlee = false } = {}) {
  if (isWon(round)) return { ...round, phase: 'won' }
  if (showPokemonOnFlee) {
    return { ...round, phase: 'fled-reveal', revealed: round.tiles.map(() => true) }
  }
  return { ...round, phase: 'fled' }
}
