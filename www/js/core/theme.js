import { asset } from './paths.js'

export const THEME_COLORS = Object.freeze([
  '#00b894',
  '#00cec9',
  '#0984e3',
  '#6c5ce7',
  '#fdcb6e',
  '#e17055',
  '#d63031',
  '#f24e4f',
  '#e84393',
  '#fd79a8'
])

const FAVICONS = {
  '#00b894': 'favicon.ico',
  '#00cec9': 'favicon1.ico',
  '#0984e3': 'favicon2.ico',
  '#6c5ce7': 'favicon3.ico',
  '#fdcb6e': 'favicon4.ico',
  '#e17055': 'favicon5.ico',
  '#d63031': 'favicon6.ico',
  '#e84393': 'favicon7.ico'
}

const GAMEBOY = { theme: '#081820', day: '#346856', night: '#89C070' }

/**
 * Applies all visual settings in one place. Everything is expressed as CSS custom properties
 * on :root, which inherit into every component's shadow tree.
 */
export function applyTheme({ themeColor, gameBoyMode, isDay, language }) {
  const root = document.documentElement
  const set = (name, value) => root.style.setProperty(name, value)

  const theme = gameBoyMode ? GAMEBOY.theme : themeColor
  const contrast = gameBoyMode ? (isDay ? GAMEBOY.day : GAMEBOY.night) : isDay ? '#ffffff' : '#2D3436'

  set('--theme-color', theme)
  set('--contrast-color', contrast)
  set('--img-blend', gameBoyMode ? 'multiply' : 'normal')
  set('--gb-filter', gameBoyMode ? 'grayscale(100%)' : 'none')
  set('--perfect-color', gameBoyMode ? theme : '#EEE8AA')
  set('--gb-shadow', gameBoyMode ? `inset 0 0 20px ${theme}` : 'none')

  root.lang = language
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme)

  let icon = document.querySelector('link[rel~="icon"]')
  if (!icon) {
    icon = document.createElement('link')
    icon.rel = 'icon'
    document.head.append(icon)
  }
  icon.href = asset(FAVICONS[themeColor] ?? FAVICONS['#00b894'])
}
