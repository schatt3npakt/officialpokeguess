import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { play } from '../core/audio.js'
import { t } from '../core/i18n.js'
import { icons } from './icons.js'

/**
 * On/off switch. Stateless: the parent listens for `click` on the element and sets `on`.
 * Attributes: label, on, type="daytime" (sun/moon), disabled (visual: last active option).
 */
class PgToggle extends BaseElement {
  static observedAttributes = ['label', 'on', 'type']

  static template = html`
    <button class="wrapper" type="button" aria-pressed="false">
      <span class="label" hidden></span>
      <span class="toggle">
        <span class="on-text"></span>
        <span class="off-text"></span>
      </span>
    </button>
  `

  static styles = [
    css`
      :host {
        display: block;
      }

      .wrapper {
        all: unset;
        display: block;
        position: relative;
        text-align: center;
        cursor: pointer;
        transition: transform 0.25s ease-out;
        transform: scale(1);

        &:hover {
          transform: scale(1.05);
        }
      }

      :host([disabled]) .toggle.on {
        cursor: not-allowed;
        opacity: 0.25;
      }

      .label {
        color: var(--theme-color);
        display: block;
        text-align: center;
        margin-bottom: 5px;
      }

      .toggle {
        background-color: var(--contrast-color);
        border-radius: 30px;
        border: 1px solid var(--theme-color);
        display: inline-block;
        font-size: 0;
        height: 28px;
        margin-bottom: 5px;
        position: relative;
        transition:
          background-color 0.25s ease,
          opacity 0.25s ease;
        width: 50px;
        vertical-align: middle;

        @media (min-width: 735px) {
          border-radius: 40px;
          height: 35px;
          width: 60px;
        }

        &::after {
          background-color: var(--theme-color);
          border-radius: 40px;
          border: 1px solid var(--theme-color);
          content: '';
          display: block;
          height: 15px;
          left: 4px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          transition: left 0.25s ease-in-out;
          width: 15px;

          @media (min-width: 735px) {
            height: 18px;
            width: 18px;
          }
        }

        &.on {
          background-color: var(--theme-color);

          &::after {
            background-color: var(--contrast-color);
            left: calc(100% - 20px);

            @media (min-width: 735px) {
              left: calc(100% - 24px);
            }
          }

          span,
          svg {
            color: var(--contrast-color);
            fill: var(--contrast-color);
          }
        }

        > span {
          color: var(--theme-color);
          font-size: 8px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          line-height: 1;

          @media (min-width: 735px) {
            font-size: 9px;
          }
        }

        .on-text {
          left: 6px;

          @media (min-width: 735px) {
            left: 8px;
          }
        }

        .off-text {
          right: 6px;

          @media (min-width: 735px) {
            right: 8px;
          }
        }

        svg {
          display: block;
          height: 15px;
          width: 15px;
          fill: var(--theme-color);
          transition: fill 0.25s ease-out;

          @media (min-width: 735px) {
            height: 18px;
            width: 18px;
          }
        }
      }
    `
  ]

  connected() {
    const wrapper = this.$('.wrapper')
    // Listener on the inner button runs before the parent's listener on the host,
    // so the sound reflects the state *before* the parent toggles it.
    this.listen(wrapper, 'click', () => play(this.on ? 'toggleOff' : 'toggleOn'))
    this.listen(wrapper, 'mouseenter', () => play('rollover'))
    this.render()
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  get on() {
    return this.hasAttribute('on')
  }

  set on(value) {
    this.toggleAttribute('on', Boolean(value))
  }

  translate() {
    this.render()
  }

  render() {
    const label = this.getAttribute('label')
    const daytime = this.getAttribute('type') === 'daytime'
    const labelEl = this.$('.label')
    labelEl.hidden = !label
    labelEl.textContent = label ?? ''
    this.$('.toggle').classList.toggle('on', this.on)
    this.$('.wrapper').setAttribute('aria-pressed', String(this.on))

    const onText = this.$('.on-text')
    const offText = this.$('.off-text')
    onText.hidden = !this.on
    offText.hidden = this.on
    if (daytime) {
      onText.innerHTML = icons.sun
      offText.innerHTML = icons.moon
      this.$('.wrapper').setAttribute('aria-label', 'Day / Night')
    } else {
      onText.textContent = t('Guess.on')
      offText.textContent = t('Guess.off')
    }
  }
}

define('pg-toggle', PgToggle)
