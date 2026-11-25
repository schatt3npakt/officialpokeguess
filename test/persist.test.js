import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  PLAYER_KEYS,
  SCHEMA_KEY,
  emptyPlayer,
  hasUserName,
  loadPlayer,
  loadSettings,
  migrate,
  savePlayer,
  saveSetting
} from '../www/js/core/persist.js'

class FakeStorage {
  constructor(data = {}) {
    this.data = { ...data }
  }
  getItem(k) {
    return k in this.data ? this.data[k] : null
  }
  setItem(k, v) {
    this.data[k] = String(v)
  }
}

/** What the previous Vue version leaves in localStorage. */
const legacy = () =>
  new FakeStorage({
    themeColor: '#6c5ce7',
    userName: 'Ash',
    language: 'en',
    gameBoyModeIsActive: 'false',
    showUserNameBelowClock: 'false',
    dayTime: 'false',
    isAutoDayTime: 'false',
    pokemonCaught: JSON.stringify([{ gen: 1, id: 25, isPerfect: true, timeStamp: 1650000000000 }]),
    pokemonCaughtId: '[25]',
    pokemonMet: '[25,4]',
    catchingStreak: '[1]',
    legendaryPokemonCaught: '[]',
    mythicalPokemonCaught: '[]',
    badgeProgress: '[]'
  })

test('reads legacy settings', () => {
  const s = loadSettings(legacy(), { prefersDark: true })
  assert.deepEqual(s, {
    language: 'en',
    themeColor: '#6c5ce7',
    userName: 'Ash',
    showNameBelowClock: false,
    gameBoyMode: false,
    isDay: false,
    audioEnabled: false
  })
})

test('light-mode systems start in day mode', () => {
  assert.equal(loadSettings(legacy(), { prefersDark: false }).isDay, true)
})

test('defaults for a new player', () => {
  const storage = new FakeStorage()
  const s = loadSettings(storage, { prefersDark: true })
  assert.equal(s.language, 'de')
  assert.equal(s.themeColor, '#00b894')
  assert.equal(s.showNameBelowClock, true)
  assert.equal(s.isDay, false)
  assert.equal(hasUserName(storage), false)
  assert.deepEqual(loadPlayer(storage), emptyPlayer())
})

test('settings are written in the legacy formats', () => {
  const storage = new FakeStorage()
  saveSetting(storage, 'showNameBelowClock', false)
  saveSetting(storage, 'gameBoyMode', true)
  saveSetting(storage, 'isDay', true)
  saveSetting(storage, 'themeColor', '#0984e3')
  assert.equal(storage.data.showUserNameBelowClock, 'false')
  assert.equal(storage.data.gameBoyModeIsActive, 'true')
  assert.equal(storage.data.dayTime, 'true')
  assert.equal(storage.data.themeColor, '#0984e3')
  assert.throws(() => saveSetting(storage, 'nope', 1))
})

test('player data round-trips and only changed keys are written', () => {
  const storage = legacy()
  const player = loadPlayer(storage)
  assert.deepEqual(player.pokemonCaughtId, [25])
  assert.equal(player.pokemonCaught[0].isPerfect, true)

  const next = { ...player, pokemonMet: [...player.pokemonMet, 7] }
  const writes = []
  const spy = {
    getItem: (k) => storage.getItem(k),
    setItem: (k, v) => {
      writes.push(k)
      storage.setItem(k, v)
    }
  }
  savePlayer(spy, next, player)
  assert.deepEqual(writes, ['pokemonMet'])
  assert.deepEqual(loadPlayer(storage).pokemonMet, [25, 4, 7])
})

test('corrupt player entries fall back to empty arrays', () => {
  const storage = new FakeStorage({ pokemonMet: '{oops', catchingStreak: '"x"' })
  const player = loadPlayer(storage)
  assert.deepEqual(player.pokemonMet, [])
  assert.deepEqual(player.catchingStreak, [])
  assert.deepEqual(Object.keys(player).sort(), [...PLAYER_KEYS].sort())
})

test('migrate marks the schema version once', () => {
  const storage = legacy()
  assert.equal(migrate(storage), 1)
  assert.equal(storage.data[SCHEMA_KEY], '1')
  assert.equal(migrate(storage), 1)
  assert.equal(storage.data.pokemonMet, '[25,4]', 'legacy data untouched')
})

test('storage failures do not throw', () => {
  const broken = {
    getItem() {
      throw new Error('denied')
    },
    setItem() {
      throw new Error('full')
    }
  }
  assert.doesNotThrow(() => loadSettings(broken))
  assert.doesNotThrow(() => saveSetting(broken, 'language', 'en'))
  assert.deepEqual(loadPlayer(broken), emptyPlayer())
})
