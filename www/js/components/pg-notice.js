import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { store } from '../core/state.js'
import { unlockAudio } from '../core/audio.js'

/** Welcome notice shown on every start. Its click doubles as the audio-unlock gesture. */
class PgNotice extends BaseElement {
  static template = html`
    <div class="backdrop">
      <div class="modal" role="dialog" aria-modal="true">
        <span data-i18n="App.optionsNotice"></span>
        <button type="button" data-i18n="App.optionsNoticeAccept"></button>
      </div>
    </div>
  `

  static styles = [
    css`
      .backdrop {
        z-index: 6;
        position: fixed;
        inset: 0;
      }

      .modal {
        padding: 15px;
        border: 3px solid var(--theme-color);
        border-radius: 15px;
        font-size: 14px;
        color: var(--theme-color);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--contrast-color);
        max-width: 400px;
        width: max-content;
        max-width: min(400px, calc(100vw - 30px));

        @media (min-width: 720px) {
          font-size: 20px;
        }
      }

      button {
        border: none;
        border-radius: 15px;
        background-color: var(--theme-color);
        color: var(--contrast-color);
        display: block;
        margin: 15px auto 0 auto;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.25s ease-in-out;
        transform: scale(1);

        @media (min-width: 720px) {
          font-size: 20px;
        }

        &:hover {
          transform: scale(1.1);
        }
      }
    `
  ]

  connected() {
    // The whole backdrop closes the notice, like before.
    this.listen(this.$('.backdrop'), 'click', () => {
      unlockAudio()
      store.update('ui', { noticeOpen: false })
    })
    this.watch(
      (s) => s.ui.noticeOpen,
      (open) => {
        this.hidden = !open
      }
    )
  }
}

define('pg-notice', PgNotice)
