# Pokemon Guess

A fan-made Pokémon guessing game (hangman-style), built with standard browser technology:
Custom Elements with Shadow DOM, native ES modules and native CSS. There is **no build step and no
runtime dependency**. Everything the browser loads lives in [`www/`](www/).

## Deploying

Upload the contents of `www/` to any static web host (a sub-path such as `/games/pokeguess/` also
works). No server-side code, database or node process is needed.

Before every deployment, regenerate the service-worker file list so players get the update:

```sh
npm run sw
```

Commit the regenerated `www/precache-manifest.js` together with your changes.

## Development

Requires Node.js 20+ for the dev tooling only (`npm install` installs eslint and prettier).

| Command          | What it does                                                                      |
| ---------------- | --------------------------------------------------------------------------------- |
| `npm run serve`  | Static dev server on http://localhost:8080 (`-- --base /sub/` to test a sub-path) |
| `npm test`       | Unit tests for game rules, persistence and data (`node --test`, no packages)      |
| `npm run lint`   | ESLint (also forbids bare npm imports in `www/`)                                  |
| `npm run format` | Prettier                                                                          |
| `npm run sw`     | Regenerate `www/precache-manifest.js` (service-worker version and file list)      |
| `npm run images` | Convert new PNG artwork in `www/assets/pokemon/` to WebP                          |

The service worker is skipped on `localhost` so you always see fresh files. Append `?sw` to the URL
to test offline mode and updates locally.

## Structure

```bash
www/
  index.html, manifest.webmanifest, service-worker.js, precache-manifest.js (generated)
  css/tokens.css          fonts, colour tokens, document styles
  data/                   pokemon.json, legendary/mythical.json, gameModes.json, i18n.json (en/de/fr)
  assets/                 fonts, icons, sfx, pokemon/{id}.webp, pokemon/icons/{id}.webp, pokemon/sounds/{id}.mp3
  js/
    main.js               boot: restore state, load data, render <pg-app>, register service worker
    core/                 store, persistence, router, i18n, audio, theme, BaseElement
    game/                 pure rules (rules.js, player.js, options.js, gens.js) + round controller (round.js)
    components/           <pg-*> custom elements, one per file
tools/                    dev server, service-worker manifest generator, image conversion
test/                     node:test suites
```

How the code fits together:

- **State** lives in one store (`js/core/state.js`) with slices `settings`, `ui`, `player`,
  `options`, `round` and `game`. Components subscribe with `this.watch(selector, cb)` and render from
  that state. They never read game state back out of the DOM.
- **Game rules** (`js/game/rules.js`) are pure functions and unit tested. `js/game/round.js` is the
  only place that combines rules, timers, sounds and persistence.
- **Components** extend `BaseElement` (`js/core/base-element.js`). They render a static template into
  a shadow root once, then update only what changed. Listeners, store subscriptions and timeouts are
  cleaned up automatically. Text is translated through `data-i18n="Namespace.key"` attributes.
- **Theming** is done with CSS custom properties on `:root` (`js/core/theme.js`), which inherit into
  every shadow root.
- **Saved progress** uses the same localStorage keys and formats as the previous Vue version
  (`js/core/persist.js`), so existing players keep their data.

### Adding a generation

1. Append it to `GENS` in `www/js/game/gens.js`.
2. Add the Pokémon to `www/data/pokemon.json`. Add any legendary/mythical IDs to
   `legendary.json`/`mythical.json`.
3. Put the artwork and icons as PNG into `www/assets/pokemon/` and `www/assets/pokemon/icons/`, then run
   `npm run images`.
4. Add the generation to the game modes in `www/data/gameModes.json` where appropriate.
5. Run `npm test` (it checks names, types and artwork for every Pokémon), then `npm run sw`.
