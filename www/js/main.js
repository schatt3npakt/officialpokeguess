import { store } from './core/state.js'
import {
  SETTINGS_FIELDS,
  hasUserName,
  loadPlayer,
  loadSettings,
  migrate,
  savePlayer,
  saveSetting
} from './core/persist.js'
import { loadI18n } from './core/i18n.js'
import { loadPokedex } from './game/pokedex-data.js'
import { applyTheme } from './core/theme.js'
import { setAudioEnabled } from './core/audio.js'
import { startRouter } from './core/router.js'
import { registerServiceWorker } from './core/sw-client.js'

async function boot() {
  const storage = window.localStorage

  // 1. Restore persisted state
  migrate(storage)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  store.update('settings', loadSettings(storage, { prefersDark }))
  store.update('player', () => loadPlayer(storage))
  store.update('ui', { optionsOpen: !hasUserName(storage) })

  // 2. Keep it persisted
  for (const field of Object.keys(SETTINGS_FIELDS)) {
    store.subscribe(
      (s) => s.settings[field],
      (value) => saveSetting(storage, field, value),
      { immediate: false }
    )
  }
  store.subscribe(
    (s) => s.player,
    (player, prev) => savePlayer(storage, player, prev),
    { immediate: false }
  )

  // 3. Side effects of settings
  store.subscribe(
    ({ settings: s }) => ({
      themeColor: s.themeColor,
      gameBoyMode: s.gameBoyMode,
      isDay: s.isDay,
      language: s.language
    }),
    applyTheme
  )
  store.subscribe((s) => s.settings.audioEnabled, setAudioEnabled)

  // 4. Static data, then render
  await Promise.all([loadI18n(), loadPokedex()])
  startRouter()
  await import('./components/pg-app.js')

  registerServiceWorker()
}

boot().catch((err) => {
  console.error(err)
  document.body.textContent = 'Pokemon Guess! could not be loaded. Please reload the page.'
})
