<template>
  <div>
    <LayerTrigger class="support-bubble" :class="{hide: menuIsOpen || gameOptionsIsOpen}" :is-active="gameSupportIsOpen" @click.native="supportLayerClickHandler">
      <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
        <rect x="49.7" y="48.9" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.2098 49.8431)" class="st0" width="0.8" height="0.8"/>
        <rect x="49.7" y="48.9" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.2098 49.8431)" class="st0" width="0.8" height="0.8"/>
        <path class="st0" d="M99.7,32.3c0,6.8-2.6,13.7-7.8,18.9l-4.1,4.1l-0.6,0.6L50.1,93L12.9,55.8l-0.6-0.6l-4.1-4.1c-10.4-10.4-10.4-27.3,0-37.7c5.2-5.2,12-7.8,18.9-7.8c6.8,0,13.7,2.6,18.9,7.8l4.1,4.1l-0.6,0.6l0.6,0.6l0.6-0.6l-0.6-0.6l4.1-4.1C64.6,3,81.5,3,91.9,13.4C97.1,18.6,99.7,25.5,99.7,32.3z"/>
        <rect x="49.7" y="48.9" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.2098 49.8431)" class="st0" width="0.8" height="0.8"/>
      </svg>
    </LayerTrigger>

    <Layer class="support-layer" direction="ttb" :is-closing="supportLayerIsClosing" :is-open="gameSupportIsOpen">
      <p>
        {{text.supportlayer[language]}}
      </p>

      <p>
        <a href="https://bitheart.de/imprint/">bitheart imprint</a> <br>

        <a href="https://twitter.com/thebitheart" target="_blank" rel="noopener noreferrer">Twitter</a>
      </p>
    </Layer>
  </div>
</template>

<script>
import Layer from '@/components/Layer/Layer'
import LayerTrigger from '@/components/Layer/LayerTrigger'

export default {
  components: {
    Layer,
    LayerTrigger
  },
  computed: {
    language () {
      return this.$store.state.language
    },
    routes () {
      return this.$router.options.routes
    },
    isDay () {
      return this.$store.state.isDay
    },
    menuIsOpen () {
      return this.$store.state.menuIsOpen
    },
    gameOptionsIsOpen () {
      return this.$store.state.gameOptionsIsOpen
    },
    gameSupportIsOpen () {
      return this.$store.state.gameSupportIsOpen
    }
  },
  data: function () {
    return {
      text: require('../../lang/Guess.json'),
      supportLayerIsClosing: false
    }
  },
  methods: {
    supportLayerClickHandler () {
      if (this.$store.state.gameSupportIsOpen === false) {
        this.$store.state.gameSupportIsOpen = true
      } else {
        this.supportLayerIsClosing = true
        this.$store.state.gameSupportIsOpen = false

        window.setTimeout(() => {
          this.supportLayerIsClosing = false
        }, 800)
      }
    }
  },
  name: 'SupportLayer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.support-layer {
  color: var(--theme-color);
  font-weight: 600;;
  font-size: 22px;

  .layer__inner {
    padding-top: 50px;
    z-index: 1;
  }

  p {
    margin: 0 auto 15px auto;
    max-width: 400px;
    font-size: 18px;

    @media (min-width: 735px) {
      font-size: 22px;
      margin: 0 auto 30px auto;
    }

    a {
      color: var(--theme-color);
    }
  }
}

.support-bubble {
  z-index: 3;
  top: 15px;
  transition: transform 0.25s ease;
  transform: scale(1);

  &.hide {
    transform: scale(0);
  }
}

.version-hint {
  position: absolute;
  bottom: 0;
  left: 30px;
}
</style>
