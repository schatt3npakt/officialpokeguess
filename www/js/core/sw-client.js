import { store } from './state.js'
import { url } from './paths.js'

let waitingWorker = null

/**
 * Registers the service worker and surfaces updates via `ui.updateAvailable`.
 * The user confirms the update (pg-update-hint), which activates the waiting worker;
 * the page reloads once the new worker takes control.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return
  // Skip on localhost unless explicitly enabled, so development always gets fresh files.
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname)
  if (isLocal && !new URLSearchParams(location.search).has('sw')) return

  const track = (worker) => {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        waitingWorker = worker
        store.update('ui', { updateAvailable: true })
      }
    })
  }

  navigator.serviceWorker
    .register(url('service-worker.js'))
    .then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker = reg.waiting
        store.update('ui', { updateAvailable: true })
      }
      if (reg.installing) track(reg.installing)
      reg.addEventListener('updatefound', () => track(reg.installing))
    })
    .catch((err) => console.error('Service worker registration failed:', err))

  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}

export function applyUpdate() {
  store.update('ui', { updateAvailable: false })
  waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
}
