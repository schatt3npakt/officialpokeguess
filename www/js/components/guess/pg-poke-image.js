import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { pokemonImage } from '../../core/paths.js'

const outline = (px, color = 'var(--theme-color)') =>
  `drop-shadow(${px}px 0 0 ${color}) drop-shadow(-${px}px 0 0 ${color}) drop-shadow(0 ${px}px 0 ${color}) drop-shadow(0 -${px}px 0 ${color})`

/**
 * The Pokémon artwork: silhouette while guessing, revealed / fleeing animations at the end.
 * Dispatches `pg-image-loading` (detail: boolean) so the view can show a spinner.
 */
class PgPokeImage extends BaseElement {
  static template = html`<img alt="" decoding="async" />`

  static styles = [
    css`
      :host {
        display: contents;
      }

      img {
        display: block;
        width: auto;
        height: 100%;
        max-height: 180px;
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        transition:
          clip-path 0.25s ease-out,
          opacity 0.25s ease-out;
        filter: brightness(0) ${outline(1)};
        mix-blend-mode: var(--img-blend);

        @media (max-width: 720px) and (orientation: landscape) {
          left: 100px;
        }

        @media (min-width: 720px) {
          top: 180px;
          max-height: 160px;
          filter: brightness(0) ${outline(2)};
        }

        @media (min-width: 1200px) {
          max-height: 230px;
        }

        @media (min-width: 1700px) {
          max-height: 400px;
        }

        @media (max-height: 500px) {
          max-height: 110px;
        }
      }

      .loading {
        opacity: 0;
      }

      .obscure0 {
        clip-path: inset(50% -10px -10px -10px);
      }
      .obscure1 {
        clip-path: inset(-10px -10px 50% -10px);
      }
      .obscure2 {
        clip-path: inset(-10px 50% -10px -10px);
      }
      .obscure3 {
        clip-path: inset(-10px -10px -10px 50%);
      }

      .night.mythical:not(.reveal) {
        animation: glow-mythical 5s infinite ease-in-out;
        filter: brightness(0) ${outline(1)} drop-shadow(0 0 2px rgb(238, 232, 170));
      }

      .night.legendary:not(.reveal) {
        animation: glow-legendary 5s infinite ease-in-out;
        filter: brightness(0) ${outline(1)} drop-shadow(0 0 2px rgb(192, 192, 192));
      }

      .show {
        filter: brightness(1) ${outline(2)} !important;
      }

      .hide {
        opacity: 0;

        &.reveal {
          opacity: 1;
        }
      }

      .reveal {
        animation:
          reveal-and-bounce 2s ease forwards,
          minify-pokemon 0.5s ease 3.75s forwards;
        clip-path: inset(-10px -10px -10px -10px);
      }

      .flee {
        animation: pokemon-flee 2s ease forwards;
      }

      .flee-reveal {
        animation: pokemon-flee-reveal 2s ease forwards;
      }

      @keyframes reveal-and-bounce {
        0% {
          transform: translateX(-50%) scale(1);
          filter: brightness(0);
        }
        15% {
          transform: translateX(-50%) scale(0.9);
          filter: brightness(0);
        }
        85% {
          transform: translateX(-50%) scale(1.1);
          filter: brightness(1);
        }
        100% {
          transform: translateX(-50%) scale(1);
          filter: brightness(1);
        }
      }

      @keyframes minify-pokemon {
        0% {
          transform: translateX(-50%) scale(1);
          filter: brightness(1);
        }
        50% {
          transform: translateX(-50%) scale(1.1);
          filter: brightness(1);
        }
        90% {
          opacity: 1;
          transform: translateX(-50%) scale(0.2);
          filter: brightness(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) scale(0.2);
          filter: brightness(1);
        }
      }

      @keyframes pokemon-flee {
        0% {
          transform: translateX(-50%) scale(1);
          filter: brightness(0) ${outline(2)};
        }
        50% {
          opacity: 1;
          transform: translateX(-70%) scale(0.9);
          filter: brightness(0) ${outline(2)};
        }
        100% {
          opacity: 0;
          transform: translateX(100%) scale(1);
          filter: brightness(0) ${outline(2)};
        }
      }

      @keyframes pokemon-flee-reveal {
        0% {
          transform: translateX(-50%) scale(1);
          filter: brightness(1);
        }
        50% {
          opacity: 1;
          transform: translateX(-70%) scale(0.9);
          filter: brightness(1);
        }
        100% {
          opacity: 0;
          transform: translateX(100%) scale(1);
          filter: brightness(1);
        }
      }

      @keyframes glow-legendary {
        50% {
          filter: brightness(0) ${outline(1)} drop-shadow(0 0 10px rgb(169, 169, 169));
        }
      }

      @keyframes glow-mythical {
        50% {
          filter: brightness(0) ${outline(1)} drop-shadow(0 0 10px rgb(238, 232, 170));
        }
      }
    `
  ]

  connected() {
    const img = this.$('img')
    const setLoading = (loading) => {
      img.classList.toggle('loading', loading)
      this.dispatchEvent(
        new CustomEvent('pg-image-loading', { detail: loading, bubbles: true, composed: true })
      )
    }
    this.listen(img, 'load', () => setLoading(false))
    this.listen(img, 'error', () => setLoading(false))

    this.watch(
      (s) => s.round?.pokeId,
      (id) => {
        if (!id) return
        const src = pokemonImage(id)
        if (img.src === src && img.complete) return
        setLoading(true)
        img.src = src
      }
    )

    this.watch(
      ({ round, options, settings }) => ({
        phase: round?.phase,
        special: round?.special,
        alreadyCaught: round?.alreadyCaught,
        imagePart: round?.imagePart,
        showPokeImage: options.showPokeImage,
        showPartOfImage: options.showPartOfImage,
        revealCaught: options.revealCaught,
        isDay: settings.isDay
      }),
      (s) => {
        const c = img.classList
        c.toggle('hide', !s.showPokeImage)
        for (let i = 0; i < 4; i++) c.toggle(`obscure${i}`, s.showPartOfImage && s.imagePart === i)
        c.toggle('legendary', s.special === 'legendary')
        c.toggle('mythical', s.special === 'mythical')
        c.toggle('night', !s.isDay)
        c.toggle('show', Boolean(s.alreadyCaught && s.revealCaught))
        c.toggle('reveal', s.phase === 'won')
        c.toggle('flee', s.phase === 'fled')
        c.toggle('flee-reveal', s.phase === 'fled-reveal')
      }
    )
  }
}

define('pg-poke-image', PgPokeImage)
