import { test } from 'node:test'
import assert from 'node:assert/strict'
import { catchSummary, recordCatch, recordFlee, stats } from '../www/js/game/player.js'
import { emptyPlayer } from '../www/js/core/persist.js'

test('recordCatch appends to all legacy arrays', () => {
  let p = recordCatch(emptyPlayer(), { id: 150, gen: 1, special: 'legendary', perfect: true, now: 1 })
  p = recordCatch(p, { id: 151, gen: 1, special: 'mythical', perfect: false, now: 2 })
  assert.deepEqual(p.pokemonCaught, [
    { gen: 1, id: 150, isPerfect: true, timeStamp: 1 },
    { gen: 1, id: 151, isPerfect: false, timeStamp: 2 }
  ])
  assert.deepEqual(p.pokemonCaughtId, [150, 151])
  assert.deepEqual(p.pokemonMet, [150, 151])
  assert.deepEqual(p.catchingStreak, [1, 1])
  assert.deepEqual(p.legendaryPokemonCaught, [1])
  assert.deepEqual(p.mythicalPokemonCaught, [1])
})

test('recordFlee resets the streak and records the encounter', () => {
  let p = recordCatch(emptyPlayer(), { id: 1, gen: 1, special: false, perfect: false })
  p = recordFlee(p, { id: 4 })
  assert.deepEqual(p.catchingStreak, [])
  assert.deepEqual(p.pokemonMet, [1, 4])
  assert.deepEqual(p.pokemonCaughtId, [1])
})

test('stats', () => {
  let p = recordCatch(emptyPlayer(), { id: 1, gen: 1, special: false, perfect: true })
  p = recordCatch(p, { id: 4, gen: 1, special: false, perfect: false })
  p = recordFlee(p, { id: 7 })
  assert.deepEqual(stats(p), {
    lastCaughtId: 4,
    seen: 3,
    caught: 2,
    perfect: 1,
    legendary: 0,
    mythical: 0,
    streak: 0
  })
  assert.equal(stats(emptyPlayer()).lastCaughtId, null)
})

test('catchSummary uses the latest catch and remembers perfect catches', () => {
  let p = recordCatch(emptyPlayer(), { id: 1, gen: 1, special: false, perfect: true, now: 10 })
  p = recordCatch(p, { id: 1, gen: 1, special: false, perfect: false, now: 20 })
  assert.deepEqual(catchSummary(p).get(1), { timeStamp: 20, isPerfect: true })
  assert.equal(catchSummary(p).has(2), false)
})
