import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { GENS, genOf, idsOfGen } from '../www/js/game/gens.js'

const www = new URL('../www/', import.meta.url)
const json = (file) => JSON.parse(readFileSync(new URL(`data/${file}`, www), 'utf8'))
const pokemon = json('pokemon.json')
const i18n = json('i18n.json')

test('generations are contiguous and cover exactly the Pokémon data', () => {
  assert.equal(GENS[0].start, 1)
  for (let i = 1; i < GENS.length; i++) assert.equal(GENS[i].start, GENS[i - 1].end + 1)
  const ids = Object.keys(pokemon)
    .map(Number)
    .sort((a, b) => a - b)
  assert.equal(ids.length, GENS.at(-1).end)
  assert.equal(ids.at(-1), GENS.at(-1).end)
})

test('genOf / idsOfGen', () => {
  assert.equal(genOf(151), 1)
  assert.equal(genOf(494), 5)
  assert.equal(genOf(906), 9)
  assert.equal(genOf(9999), 0)
  assert.equal(idsOfGen(1).length, 151)
  assert.deepEqual(idsOfGen(9).slice(0, 2), [906, 907])
})

test('every Pokémon has en/de/fr names, translated types and artwork', () => {
  for (const [id, p] of Object.entries(pokemon)) {
    for (const lang of ['en', 'de', 'fr']) assert.ok(p.name[lang], `${id} ${lang}`)
    for (const type of p.types) assert.ok(i18n.Guess.types[type], `${id} type ${type}`)
    const img = ['webp', 'png'].some((ext) => existsSync(new URL(`assets/pokemon/${id}.${ext}`, www)))
    assert.ok(img, `artwork for ${id}`)
  }
})

test('game modes only use known generations', () => {
  const ids = new Set(GENS.map((g) => g.id))
  for (const mode of json('gameModes.json')) {
    assert.ok(i18n.GameModes[mode.title], mode.title)
    for (const gen of mode.gameOptions.activeGens) assert.ok(ids.has(gen))
  }
})
