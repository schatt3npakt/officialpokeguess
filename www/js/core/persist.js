/**
 * localStorage adapter.
 *
 * Reads and writes the exact keys and value formats of the previous (Vue) version so existing
 * players keep their progress. Pure functions taking a Storage-like object, so they are testable
 * in node with a fake storage.
 */

export const SCHEMA_KEY = 'pg.schema'
export const SCHEMA_VERSION = 1

export const PLAYER_KEYS = Object.freeze([
  'badgeProgress',
  'catchingStreak',
  'legendaryPokemonCaught',
  'mythicalPokemonCaught',
  'pokemonCaught',
  'pokemonCaughtId',
  'pokemonMet'
])

/** settings field -> { key, read(raw), write(value) } */
const bool = (fallback) => ({
  read: (raw) => (raw === null ? fallback : raw === 'true'),
  write: (v) => String(Boolean(v))
})
const string = (fallback) => ({
  read: (raw) => (raw === null || raw === '' ? fallback : raw),
  write: (v) => String(v)
})

export const SETTINGS_FIELDS = Object.freeze({
  language: { key: 'language', ...string('de') },
  themeColor: { key: 'themeColor', ...string('#00b894') },
  userName: { key: 'userName', read: (raw) => raw ?? '', write: (v) => String(v) },
  showNameBelowClock: { key: 'showUserNameBelowClock', ...bool(true) },
  gameBoyMode: { key: 'gameBoyModeIsActive', ...bool(false) },
  isDay: { key: 'dayTime', ...bool(false) },
  audioEnabled: { key: 'pg.audio', ...bool(false) }
})

function safeGet(storage, key) {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, value)
  } catch {
    // storage full or disabled (private mode) - the game still works for this session
  }
}

function parseArray(raw) {
  if (raw === null) return []
  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

/**
 * @param {Storage} storage
 * @param {{prefersDark?: boolean}} env
 */
export function loadSettings(storage, { prefersDark = false } = {}) {
  const settings = {}
  for (const [field, def] of Object.entries(SETTINGS_FIELDS)) {
    settings[field] = def.read(safeGet(storage, def.key))
  }
  // Previous behaviour: light-mode systems always start in day mode, dark-mode systems
  // restore the last chosen day/night state.
  if (!prefersDark) settings.isDay = true
  return settings
}

export function saveSetting(storage, field, value) {
  const def = SETTINGS_FIELDS[field]
  if (!def) throw new Error(`Unknown setting: ${field}`)
  safeSet(storage, def.key, def.write(value))
}

export function hasUserName(storage) {
  return Boolean(safeGet(storage, SETTINGS_FIELDS.userName.key))
}

export function emptyPlayer() {
  return Object.fromEntries(PLAYER_KEYS.map((k) => [k, []]))
}

export function loadPlayer(storage) {
  return Object.fromEntries(PLAYER_KEYS.map((k) => [k, parseArray(safeGet(storage, k))]))
}

/** Writes only the player keys whose array reference changed. */
export function savePlayer(storage, player, prev = {}) {
  for (const key of PLAYER_KEYS) {
    if (player[key] !== prev[key]) safeSet(storage, key, JSON.stringify(player[key] ?? []))
  }
}

/** Run once at boot. Future storage format changes go here, keyed by version. */
export function migrate(storage) {
  const current = Number(safeGet(storage, SCHEMA_KEY)) || 0
  if (current >= SCHEMA_VERSION) return current
  // v0 -> v1: no data changes; the legacy keys are read as-is. Only mark the schema.
  safeSet(storage, SCHEMA_KEY, String(SCHEMA_VERSION))
  return SCHEMA_VERSION
}
