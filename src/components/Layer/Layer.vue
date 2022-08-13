<template>
  <div class="layer" :class="layerClassArray">
    <div class="layer__inner">
      <slot></slot>
    </div>

    <div class="layer__overlay"></div>
  </div>
</template>

<script>
export default {
  computed: {
    layerClassArray () {
      return [
        (this.mobileOnly) ? 'mobileOnly' : '',
        (this.isOpen) ? 'open' : '',
        (this.isClosing) ? 'closing' : '',
        (this.isGameboyModeActive) ? 'gameboy' : '',
        this.direction
      ]
    },
    isGameboyModeActive () {
      return this.$store.state.gameBoyModeIsActive
    }
  },
  name: 'Layer',
  props: {
    direction: String,
    isOpen: Boolean,
    isClosing: Boolean,
    mobileOnly: Boolean
  }
}
</script>

<style lang="scss" scoped>
.layer {
  &__inner {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--contrast-color);
    z-index: 2;
    overflow: auto;
    padding: 40px 20px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0s linear;
    transition-delay: 0.25s;

    .day & {
      background-color: var(--contrast-color);
    }

    .open & {
      opacity: 1;
      pointer-events: auto;
    }

    .closing & {
      opacity: 0;
      pointer-events: none;
    }

    .mobileOnly & {
      @media (min-width: 720px) {
        position: relative;
        opacity: 1;
        height: auto;
        width: auto;
        padding: 0;
        pointer-events: auto;
      }
    }
  }

  &__overlay {
    background-color: var(--theme-color);
    content: "";
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(-100vh);
    z-index: 6;

    .open.rtl & {
      animation: slide-rtl 0.75s ease;
    }

    .closing.rtl & {
      animation: slide-ltr 0.75s ease;
    }

    .open.ltr & {
      animation: slide-ltr 0.75s ease;
    }

    .closing.ltr & {
      animation: slide-rtl 0.75s ease;
    }

    .open.ttb & {
      animation: slide-ttb 0.75s ease;
    }

    .closing.ttb & {
      animation: slide-btt 0.75s ease;
    }

    .open.btt & {
      animation: slide-btt 0.75s ease;
    }

    .closing.btt & {
      animation: slide-ttb 0.75s ease;
    }

    &.showOnDesktop {
      @media (min-width: 720px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
      }
    }
  }

  &:not(.search-layer) {
    .layer__inner {
      .gameboy & {
        box-shadow: inset 0 0 20px var(--theme-color);
      }
    }
  }
}

.search-layer {
  .layer__overlay {
    @media (min-width: 720px) {
      display: none;
    }
  }
}

@keyframes slide-rtl {
  0% { transform: translateX(100vw) translateY(0)}
  15% { transform: translateX(100vw) translateY(0)}
  85% { transform: translateX(-100vw) translateY(0)}
  100% { transform: translateX(-100vw) translateY(0)}
}

@keyframes slide-ltr {
  0% { transform: translateX(-100vw) translateY(0)}
  15% { transform: translateX(-100vw) translateY(0)}
  85% { transform: translateX(100vw) translateY(0)}
  100% { transform: translateX(100vw) translateY(0)}
}

@keyframes slide-ttb {
  0% { transform: translateY(-100vh) translateX(0)}
  15% { transform: translateY(-100vh) translateX(0)}
  85% { transform: translateY(100vh) translateX(0)}
  100% { transform: translateY(100vh) translateX(0)}
}

@keyframes slide-btt {
  0% { transform: translateY(100vh) translateX(0)}
  15% { transform: translateY(100vh) translateX(0)}
  85% { transform: translateY(-100vh) translateX(0)}
  100% { transform: translateY(-100vh) translateX(0)}
}
</style>
