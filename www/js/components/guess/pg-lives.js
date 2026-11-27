import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { icons } from '../icons.js'

const MAX_LIVES = 6

/** Remaining wrong guesses as a column of Pokéballs; the last one flashes. */
class PgLives extends BaseElement {
  static template = html`
    <div class="lives" role="img">
      ${Array.from({ length: MAX_LIVES }, () => `<div class="life">${icons.life}</div>`).join('')}
    </div>
  `

  static styles = [
    css`
      :host {
        display: contents;
      }

      .lives {
        position: fixed;
        right: 15px;
        top: 70px;

        @media (min-width: 735px) {
          top: 155px;
        }
      }

      .life {
        animation: rotate-and-fade 0.25s ease-in-out forwards;
        opacity: 0;
      }

      .danger .life {
        animation: danger-flash 0.25s ease-in-out infinite;
      }

      svg {
        display: block;
        width: 20px;
        height: 20px;
        margin-top: 5px;
        fill: var(--theme-color);

        @media (min-width: 735px) {
          width: 60px;
          height: 60px;
          margin-top: 10px;
        }
      }

      @keyframes rotate-and-fade {
        0% {
          opacity: 0;
          transform: rotate(0);
        }
        100% {
          opacity: 1;
          transform: rotate(360deg);
        }
      }

      @keyframes danger-flash {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
        }
      }
    `
  ]

  connected() {
    this.watch(
      ({ round, options }) => [round?.maxWrong ?? 0, round?.wrong ?? 0, options.infiniteGuesses],
      ([maxWrong, wrong, infinite]) => {
        const left = maxWrong - wrong
        this.hidden = infinite
        this.$('.lives').classList.toggle('danger', left === 1)
        this.$('.lives').setAttribute('aria-label', String(Math.max(0, left)))
        this.$$('.life').forEach((el, i) => {
          el.hidden = left < i + 1
        })
      }
    )
  }
}

define('pg-lives', PgLives)
