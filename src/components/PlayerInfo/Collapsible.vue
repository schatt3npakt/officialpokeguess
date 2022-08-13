<template>
  <div
    class="player-data__collapsible"
    :class="{collapsibleOpen: isOpen, showOnDesktop: showOnDesktop}"
  >
    <span class="collapsible-button" @click="toggleIsOpen">{{buttonText}}</span>
    <div class="collapsible-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleIsOpen () {
      this.isOpen = !this.isOpen
    }
  },
  name: 'Collapsible',
  props: {
    buttonText: String,
    showOnDesktop: Boolean
  }
}
</script>

<style scoped lang="scss">
.player-data__collapsible {
  margin: 20px 0;

  &:not(.showOnDesktop) {
    .collapsible-button {
      @media (min-width: 720px) {
        border: none;
        font-size: 24px;
        margin-bottom: 15px;
      }

      &::after,
      &::before {
        @media (min-width: 720px) {
          display: none;
        }
      }
    }

    .collapsible-content {
      @media (min-width: 720px) {
        max-height: none;
      }
    }
  }
}

.collapsible-content {
  margin-top: 20px;
  max-height: 0;
  overflow: auto;
  transition: max-height 0.5s ease-in-out;

  .collapsibleOpen & {
    max-height: 400px;

    @media (min-width: 720px) {
      max-height: none;
    }
  }
}

.collapsible-button {
  display: block;
  background-color: transparent;
  text-align: left;
  border: none;
  border-bottom: 2px solid var(--theme-color);
  font-size: 22px;
  cursor: pointer;
  color: var(--theme-color);
  font-weight: 600;;
  width: 100%;
  position: relative;

  &::after,
  &::before {
    content: "";
    display: block;
    width: 15px;
    height: 3px;
    background-color: var(--theme-color);
    position: absolute;
    top: 50%;
    right: 0;
  }

  &::after {
    transform: rotate(90deg);
    transition: transform 0.5s ease-in-out;

    .collapsibleOpen & {
      transform: rotate(0);
    }
  }
}

.pokedex .collapsibleOpen {
  .collapsible-button {
    @media (min-width: 720px) {
      background-color: var(--contrast-color);
      position: sticky;
      top: 0;
      z-index: 4;
    }
  }
}
</style>
