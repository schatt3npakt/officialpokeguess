import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  applyGuess,
  applyHint,
  createRound,
  finishRound,
  hintsLeft,
  isIgnored,
  isLost,
  isWon,
  letterIndexes,
  limitsFor,
  pickPokemon,
  randomInt
} from '../www/js/game/rules.js'
import { DEFAULT_OPTIONS, applyGameMode, toggleGen } from '../www/js/game/options.js'

const seq = (...values) => {
  let i = 0
  return () => values[i++ % values.length]
}

const pokemon = (name, extra = {}) => ({
  id: 25,
  name,
  types: ['elektro'],
  special: false,
  alreadyCaught: false,
  ...extra
})

test('ignored characters', () => {
  for (const c of ['0', '9', "'", ' ', ':', '.', ',', '♂', '♀', '-']) assert.ok(isIgnored(c), c)
  for (const c of ['a', 'z', 'é', 'ß']) assert.ok(!isIgnored(c), c)
})

test('accent folding matches base letters', () => {
  assert.deepEqual(letterIndexes([...'flabébé'], 'e'), [4, 6])
  assert.deepEqual(letterIndexes([...'äàáâãåæa'], 'a'), [0, 1, 2, 3, 4, 5, 6, 7])
  assert.deepEqual(letterIndexes([...'straße'], 's'), [0, 4])
  assert.deepEqual(letterIndexes([...'ç'], 'c'), [0])
  assert.deepEqual(letterIndexes([...'é'], 'a'), [])
})

test('limits by rarity and oneGuessOnly', () => {
  assert.deepEqual(limitsFor(false), { maxWrong: 6, maxHints: 3 })
  assert.deepEqual(limitsFor('legendary'), { maxWrong: 3, maxHints: 1 })
  assert.deepEqual(limitsFor('mythical'), { maxWrong: 3, maxHints: 0 })
  assert.deepEqual(limitsFor('legendary', { oneGuessOnly: true }), { maxWrong: 1, maxHints: 1 })
})

test('randomInt is inclusive', () => {
  assert.equal(
    randomInt(0, 3, () => 0),
    0
  )
  assert.equal(
    randomInt(0, 3, () => 0.9999),
    3
  )
})

test('createRound lowercases the name into tiles', () => {
  const round = createRound(pokemon('Mr. Mime'), DEFAULT_OPTIONS, () => 0)
  assert.deepEqual(round.tiles, [...'mr. mime'])
  assert.equal(round.phase, 'playing')
  assert.equal(round.gen, 1)
  assert.equal(round.imagePart, 0)
  assert.equal(round.maxWrong, 6)
})

test('win by guessing; ignored characters do not need to be guessed', () => {
  let round = createRound(pokemon('Mr. Mime'), DEFAULT_OPTIONS)
  for (const key of ['m', 'r', 'i']) {
    assert.ok(!isWon(round))
    round = applyGuess(round, key).round
  }
  assert.ok(!isWon(round))
  const { round: last, result } = applyGuess(round, 'e')
  assert.equal(result, 'hit')
  assert.ok(isWon(last))
  assert.equal(finishRound(last).phase, 'won')
})

test('duplicate and miss handling', () => {
  let round = createRound(pokemon('Abra'), DEFAULT_OPTIONS)
  round = applyGuess(round, 'x').round
  assert.equal(round.wrong, 1)
  const dup = applyGuess(round, 'x')
  assert.equal(dup.result, 'duplicate')
  assert.equal(dup.round, round)
})

test('infiniteGuesses never counts wrong guesses', () => {
  let round = createRound(pokemon('Abra'), DEFAULT_OPTIONS)
  for (const k of 'cdefghijk') round = applyGuess(round, k, { infiniteGuesses: true }).round
  assert.equal(round.wrong, 0)
  assert.ok(!isLost(round))
})

test('losing after max wrong guesses, with and without reveal', () => {
  let round = createRound(pokemon('Mew', { special: 'mythical' }), DEFAULT_OPTIONS)
  for (const k of 'abc') round = applyGuess(round, k).round
  assert.ok(isLost(round))
  assert.equal(finishRound(round).phase, 'fled')
  const revealed = finishRound(round, { showPokemonOnFlee: true })
  assert.equal(revealed.phase, 'fled-reveal')
  assert.ok(revealed.revealed.every(Boolean))
})

test('oneGuessOnly loses on the first miss', () => {
  let round = createRound(pokemon('Abra'), { ...DEFAULT_OPTIONS, oneGuessOnly: true })
  round = applyGuess(round, 'z').round
  assert.ok(isLost(round))
})

test('guesses after the round ended are ignored', () => {
  const round = { ...createRound(pokemon('Abra'), DEFAULT_OPTIONS), phase: 'won' }
  assert.equal(applyGuess(round, 'a').result, 'ignored')
})

test('hints reveal one tile and respect limits', () => {
  let round = createRound(pokemon('Mr. Mime'), DEFAULT_OPTIONS)
  assert.equal(hintsLeft(round), 3)
  assert.equal(applyHint(round, 2), null, 'ignored tile costs nothing')
  round = applyHint(round, 0)
  assert.equal(hintsLeft(round), 2)
  assert.equal(applyHint(round, 0), null, 'already revealed tile costs nothing')
  assert.equal(applyHint(round, 1, { hintsAllowed: false }), null)
  round = applyHint(applyHint(round, 1), 4)
  assert.equal(hintsLeft(round), 0)
  assert.equal(applyHint(round, 5), null)
})

test('mythical Pokémon allow no hints', () => {
  const round = createRound(pokemon('Mew', { special: 'mythical' }), DEFAULT_OPTIONS)
  assert.equal(applyHint(round, 0), null)
})

test('pickPokemon honours active gens and caught exclusion', () => {
  const pick = pickPokemon({ activeGens: [2], excludeCaught: true, caughtIds: [], rng: () => 0 })
  assert.deepEqual(pick, { id: 152, alreadyCaught: false })

  const caughtGen1 = Array.from({ length: 151 }, (_, i) => i + 1)
  assert.equal(pickPokemon({ activeGens: [1], excludeCaught: true, caughtIds: caughtGen1 }), null)

  const again = pickPokemon({ activeGens: [1], excludeCaught: false, caughtIds: caughtGen1, rng: () => 0 })
  assert.deepEqual(again, { id: 1, alreadyCaught: true })

  // only uncaught Pokémon of gen 1 are left -> always picked
  const almost = caughtGen1.filter((id) => id !== 150)
  const last = pickPokemon({ activeGens: [1, 2], excludeCaught: true, caughtIds: almost, rng: seq(0, 0.5) })
  assert.equal(last.id, 150)
})

test('toggleGen never removes the last active generation', () => {
  assert.deepEqual(toggleGen([1, 2], 2), [1])
  assert.deepEqual(toggleGen([1], 1), [1])
  assert.deepEqual(toggleGen([3, 1], 2), [1, 2, 3])
})

test('applyGameMode starts from defaults and keeps preferences', () => {
  const current = { ...DEFAULT_OPTIONS, timerMode: true, useAlphabeticalKeyboard: true }
  const next = applyGameMode(current, { activeGens: [1], hintsAllowed: false, maxHints: 9 })
  assert.equal(next.timerMode, false)
  assert.equal(next.useAlphabeticalKeyboard, true)
  assert.deepEqual(next.activeGens, [1])
  assert.equal(next.hintsAllowed, false)
  assert.ok(!('maxHints' in next))
})
