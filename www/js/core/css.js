/**
 * css`` tagged template -> constructable CSSStyleSheet (shared between all instances
 * of a component via adoptedStyleSheets).
 */
export function css(strings, ...values) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(String.raw(strings, ...values))
  return sheet
}

/** Identity tag so editors highlight HTML templates. */
export function html(strings, ...values) {
  return String.raw(strings, ...values)
}

/** Styles every shadow root starts with. */
export const baseStyles = css`
  :host {
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: inherit;
    font-weight: 600;
    outline: none;
  }

  button,
  input {
    font: inherit;
    font-weight: 600;
  }

  [hidden] {
    display: none !important;
  }

  ::selection {
    background: var(--theme-color);
    color: var(--contrast-color);
  }
`
