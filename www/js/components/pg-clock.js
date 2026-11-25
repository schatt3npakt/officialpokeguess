import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { icons } from './icons.js'

const pad = (n) => String(n).padStart(2, '0')

/** Clock with a blinking colon, day/night icon and the player name below. */
class PgClock extends BaseElement {
  static template = html`
    <div class="counter">
      <div><span class="h">00</span><span class="colon">:</span><span class="m">00</span></div>
      <span class="icon"></span>
    </div>
    <span class="username"></span>
  `

  static styles = [
    css`
      :host {
        display: inline-block;
        color: var(--theme-color);
        font-size: 55px;
        line-height: 70px;
        margin: 0 auto;
        position: relative;

        @media (min-width: 735px) {
          font-size: 70px;
          margin: 0 auto 30px auto;
        }
      }

      .counter {
        position: relative;
      }

      svg {
        width: 26px;
        height: 26px;
        position: absolute;
        right: -35px;
        top: 50%;
        transform: translateY(-50%);
        fill: var(--theme-color);
        transition: fill 0.25s ease-out;

        @media (min-width: 735px) {
          width: 35px;
          height: 35px;
          right: -40px;
        }
      }

      .colon {
        animation: blinking 2s linear infinite;
      }

      .username {
        position: absolute;
        top: 38px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        white-space: nowrap;
      }

      @keyframes blinking {
        50% {
          opacity: 0;
        }
      }
    `
  ]

  #timer = null

  connected() {
    this.#tick()
    this.watch(
      (s) => s.settings.isDay,
      (isDay) => {
        this.$('.icon').innerHTML = isDay ? icons.sun : icons.moon
      }
    )
    this.watch(
      (s) => [s.settings.userName, s.settings.showNameBelowClock],
      ([name, show]) => {
        const el = this.$('.username')
        el.textContent = name
        el.hidden = !show
      }
    )
  }

  disconnected() {
    clearTimeout(this.#timer)
  }

  /** Updates the time and re-schedules itself exactly at the next full minute. */
  #tick() {
    const now = new Date()
    this.$('.h').textContent = pad(now.getHours())
    this.$('.m').textContent = pad(now.getMinutes())
    const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
    this.#timer = setTimeout(() => this.#tick(), msToNextMinute + 50)
  }
}

define('pg-clock', PgClock)
