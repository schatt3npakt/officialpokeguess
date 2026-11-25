import { store } from './state.js'

/**
 * Hash router. Uses the same URLs as the previous vue-router hash mode
 * (#/, #/player, #/pokedex, #/gamemodes), which works on any static host.
 * Views are loaded lazily via dynamic import().
 */
export const ROUTES = Object.freeze([
  {
    path: '/',
    tag: 'pg-guess-view',
    label: 'Menu.r0',
    icon: 'home',
    load: () => import('../components/guess/pg-guess-view.js')
  },
  {
    path: '/player',
    tag: 'pg-player-view',
    label: 'Menu.r1',
    icon: 'playerData',
    load: () => import('../components/player/pg-player-view.js')
  },
  {
    path: '/pokedex',
    tag: 'pg-pokedex-view',
    label: 'Menu.r2',
    icon: 'pokeDex',
    load: () => import('../components/pokedex/pg-pokedex-view.js')
  },
  {
    path: '/gamemodes',
    tag: 'pg-modes-view',
    label: 'Menu.r3',
    icon: 'pokeDex',
    load: () => import('../components/modes/pg-modes-view.js')
  }
])

const currentPath = () => {
  const path = location.hash.replace(/^#/, '') || '/'
  return ROUTES.some((r) => r.path === path) ? path : '/'
}

export const routeFor = (path) => ROUTES.find((r) => r.path === path) ?? ROUTES[0]

export function navigate(path) {
  location.hash = `#${path}`
}

export function startRouter() {
  const sync = () => store.update('ui', { route: currentPath() })
  window.addEventListener('hashchange', sync)
  sync()
}
