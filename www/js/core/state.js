import { Store } from './store.js'
import { emptyPlayer } from './persist.js'
import { DEFAULT_OPTIONS } from '../game/options.js'

/**
 * The single application store. Slices:
 * - settings: persisted user preferences (theme, language, name, audio, day/night)
 * - ui:       transient UI state (which layers are open, current route, update hint)
 * - player:   persisted progress, same shape as the legacy localStorage arrays
 * - options:  game options for the current session
 * - round:    the current guessing round (null until the first Pokémon is picked)
 * - game:     round presentation state (reset curtain, celebration, timer, feedback text)
 */
export const store = new Store({
  settings: {
    language: 'de',
    themeColor: '#00b894',
    userName: '',
    showNameBelowClock: true,
    gameBoyMode: false,
    isDay: false,
    audioEnabled: false
  },
  ui: {
    route: '/',
    menuOpen: false,
    gameOptionsOpen: false,
    supportOpen: false,
    optionsOpen: false,
    noticeOpen: true,
    updateAvailable: false
  },
  player: emptyPlayer(),
  options: { ...DEFAULT_OPTIONS },
  round: null,
  game: {
    noPokemon: false,
    resetting: false,
    celebrate: false,
    counter: 20,
    feedback: null
  }
})

/** True while any overlay that should swallow game keyboard input is open. */
export const anyLayerOpen = ({ ui }) =>
  ui.menuOpen || ui.gameOptionsOpen || ui.supportOpen || ui.optionsOpen || ui.noticeOpen
