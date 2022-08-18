<template>
  <div class="layer-trigger" @mouseenter="hoverHandler()" @click="clickHandler()" :class="{active: isActive}">
    <slot v-if="!isActive">
      <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
        <path class="st3" d="M93.3,42.4H90c-1.1-5.6-3.2-10.8-6.3-15.3l2.4-2.4c1.6-1.6,1.6-4.3,0-5.9L81.2,14c-1.6-1.6-4.3-1.6-5.9,0
        l-2.4,2.4c-4.5-3.1-9.7-5.3-15.3-6.3V6.7c0-2.3-1.9-4.2-4.2-4.2h-6.9c-2.3,0-4.2,1.9-4.2,4.2V10c-5.6,1.1-10.8,3.2-15.3,6.3L24.7,14
        c-1.6-1.6-4.3-1.6-5.9,0L14,18.8c-1.6,1.6-1.6,4.3,0,5.9l2.4,2.4c-3.1,4.5-5.3,9.7-6.3,15.3H6.7c-2.3,0-4.2,1.9-4.2,4.2v6.9
        c0,2.3,1.9,4.2,4.2,4.2H10c1.1,5.6,3.2,10.8,6.3,15.3L14,75.3c-1.6,1.6-1.6,4.3,0,5.9l4.9,4.9c1.6,1.6,4.3,1.6,5.9,0l2.4-2.4
        c4.5,3.1,9.7,5.3,15.3,6.3v3.3c0,2.3,1.9,4.2,4.2,4.2h6.9c2.3,0,4.2-1.9,4.2-4.2V90c5.6-1.1,10.8-3.2,15.3-6.3l2.4,2.4
        c1.6,1.6,4.3,1.6,5.9,0l4.9-4.9c1.6-1.6,1.6-4.3,0-5.9l-2.4-2.4c3.1-4.5,5.3-9.7,6.3-15.3h3.3c2.3,0,4.2-1.9,4.2-4.2v-6.9
        C97.5,44.2,95.7,42.4,93.3,42.4z M50,59.9c-5.5,0-9.9-4.4-9.9-9.9s4.4-9.9,9.9-9.9s9.9,4.4,9.9,9.9S55.5,59.9,50,59.9z"/>
      </svg>
    </slot>

    <svg v-else version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
      <polygon class="st3" points="61.8,50.2 90.9,79.3 79.1,91.1 50,62 20.9,91.1 9.1,79.3 38.2,50.2 9.1,21.1 20.9,9.3 50,38.4
        79.1,9.3 90.9,21.1 "/>
    </svg>

  </div>
</template>

<script>
import { playMaximizeSound, playMinimizeSound, playRolloverSound } from '../../AudioService'
export default {
  name: 'LayerTrigger',
  props: {
    isActive: Boolean
  },
  methods: {
    hoverHandler () {
      playRolloverSound()
    },
    clickHandler () {
      if (this.isActive) {
        playMinimizeSound()
      } else {
        playMaximizeSound()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-trigger {
  background-color: var(--theme-color);
  animation-delay: 0.75s;
  border-radius: 54px;
  border: 1px solid var(--contrast-color);
  bottom: 15px;
  cursor: pointer;
  display: block;
  height: 35px;
  position: fixed;
  right: 15px;
  transform: scale(1);
  transition: transform 0.25s ease;
  width: 35px;
  z-index: 3;

  @media (min-width: 720px) {
    height: 45px;
    width: 45px;
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 50%;
    transform: translate(-50%, -50%);

    * {
      fill: var(--contrast-color)
    }
  }
}
</style>
