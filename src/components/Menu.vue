<template>
  <div class="menu" :class="{open: menuIsOpen}">
    <LayerTrigger :class="{hide: gameSupportIsOpen || gameOptionsIsOpen}" :is-active="menuIsOpen" @click.native="layerTriggerClickHandler">
      <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
        <rect x="10" y="15.1" class="st3" width="74.3" height="10.4"/>
        <rect x="10" y="42.5" class="st3" width="74.3" height="10.4"/>
        <rect x="10" y="71" class="st3" width="74.3" height="10.4"/>
      </svg>
    </LayerTrigger>

    <Layer direction="rtl" :is-closing="isClosing" :is-open="menuIsOpen">
      <ul>
        <li @click="layerTriggerClickHandler" v-for="(route, i) in routes" :key="i">
          <router-link :to="route.path">
            <svg v-if="route.icon === 'home'" version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                            <g>
                <path class="st0" d="M93.1,52.5l-8.4,8.4v29.7c0,4.6-3.8,8.4-8.4,8.4H63.7V78.4c0-4.6-3.8-8.4-8.4-8.4H44.7c-4.6,0-8.4,3.8-8.4,8.4
                  V99H23.7c-4.6,0-8.4-3.8-8.4-8.4V60.9l-8.4-8.4c-3.3-3.3-3.3-8.6,0-11.9L44,3.5c3.3-3.3,8.6-3.3,11.9,0l37.2,37.2
                  C96.4,43.9,96.4,49.2,93.1,52.5z"/>
              </g>
            </svg>

            <svg version="1.1" v-if="route.icon === 'mag'" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
              <path class="st3" d="M95.5,84.6L84.2,73.3c0,0-0.1-0.1-0.1-0.1c6.2-7.6,9.9-17.3,9.9-27.9C94,20.9,74.1,1,49.6,1S5.3,20.9,5.3,45.4
                s19.9,44.4,44.4,44.4c9.4,0,18.2-2.9,25.4-8c0.1,0.1,0.2,0.3,0.4,0.4l11.3,11.3c2.4,2.4,6.4,2.4,8.8,0C97.9,91,97.9,87.1,95.5,84.6z
                 M15.7,45.4c0-18.7,15.2-33.9,33.9-33.9s33.9,15.2,33.9,33.9c0,18.7-15.2,33.9-33.9,33.9S15.7,64.1,15.7,45.4z"/>
            </svg>

            <svg version="1.1" v-if="route.icon === 'guess'" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                            <path class="st0" d="M98.1,15c0,0-19.3-0.2-32.9,23.2c0,0-11.3-8.3-29.2-0.9c0,0-18.1-21.2-34.3-19c0,0,4.2,16.8,27,25.8
                c0,0-4.6,4.7-2.9,14.1c0,0-0.3,2.7-1.1,4.8c0,0-6.6,12.5,15.7,21.1c0,0,10.3,2.9,20.1-1.8c0,0,13-4.5,14.7-14.2c0,0,0.6-1.7-1-5.9
                c-0.9-2.3-1-3.6-1.2-5.2c0,0,0.6-2.1,0.4-4.8c-0.3-3.9-0.9-5.2-2.4-7.2C71.3,45.1,92,33.9,98.1,15z M52.1,71.7
                c-0.6,0.6-1.3,0.9-2.3,0.9s-1.8-0.3-2.4-0.9c-0.6-0.6-0.9-1.4-0.9-2.3c0-0.9,0.3-1.7,0.9-2.3c0.6-0.6,1.4-0.9,2.4-0.9
                s1.8,0.3,2.3,0.9c0.6,0.6,0.8,1.3,0.8,2.3C52.9,70.3,52.6,71.1,52.1,71.7z M57.5,55.1c-0.5,1-1.4,2-2.7,3.1c-1.2,1-2,1.8-2.4,2.5
                c-0.4,0.7-0.7,1.4-0.8,2.2c-0.1,0.4-0.3,0.7-0.5,1c-0.3,0.2-0.7,0.4-1.2,0.4c-0.6,0-1-0.2-1.3-0.5c-0.3-0.4-0.5-0.9-0.5-1.5
                c0-1.1,0.2-2.1,0.6-3c0.4-0.9,1.1-1.9,2.1-3c0.7-0.8,1.2-1.4,1.5-1.9c0.3-0.5,0.4-1.1,0.4-1.7c0-0.7-0.2-1.2-0.8-1.6
                c-0.5-0.4-1.2-0.6-2.2-0.6c-0.9,0-1.7,0.1-2.5,0.3c-0.8,0.2-1.5,0.5-2.2,1c-0.8,0.4-1.5,0.5-2.1,0.3c-0.6-0.2-1-0.6-1.2-1.2
                c-0.2-0.6-0.2-1.2,0-1.8c0.2-0.7,0.8-1.2,1.6-1.7c1-0.6,2.1-1,3.4-1.3c1.2-0.3,2.4-0.5,3.5-0.5c1.7,0,3.1,0.3,4.4,0.8
                c1.2,0.5,2.2,1.3,2.9,2.2c0.7,1,1,2.1,1,3.4C58.3,53.1,58.1,54.1,57.5,55.1z"/>
            </svg>

            <svg version="1.1" v-if="route.icon === 'playerData'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
              <path class="st3" d="M50,3.1c-19,0-34.4,15.4-34.4,34.4c0,12,6.2,22.7,15.6,28.8v27.6c0,1.1,0.6,2.1,1.5,2.6c1,0.5,2.1,0.5,3.1,0
                L48.4,89c1-0.6,2.2-0.6,3.1,0l12.7,7.5c0.5,0.3,1,0.4,1.5,0.4s1-0.1,1.5-0.4c1-0.5,1.5-1.5,1.5-2.6V66.2
                c9.4-6.1,15.6-16.7,15.6-28.8C84.4,18.5,69,3.1,50,3.1z M65.6,93.7l-12.5-7.4c-1-0.6-2.1-0.9-3.2-0.9c-1.1,0-2.2,0.3-3.2,0.9
                l-12.4,7.4V68.1c4.7,2.4,10,3.8,15.6,3.8s11-1.3,15.6-3.8V93.7z M50,59.8c-11.3,0-20.5-8.5-21.7-19.4h14.3c1,3.1,3.9,5.3,7.4,5.3
                s6.4-2.2,7.4-5.3h14.3C70.5,51.3,61.3,59.8,50,59.8z M57.4,35.6c-1-3.1-3.9-5.3-7.4-5.3s-6.4,2.2-7.4,5.3H28.3
                C29.5,24.7,38.7,16.2,50,16.2s20.5,8.5,21.7,19.4H57.4z"/>
            </svg>

            <svg version="1.1" v-if="route.icon === 'pokeDex'" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
              <g>
                <path class="st0" d="M94.7,55C92.2,77.5,73.2,95,50,95S7.8,77.5,5.3,55h29.5c2.1,6.4,8.1,11,15.2,11s13.1-4.6,15.2-11H94.7z"/>
              </g>
              <g>
                <path class="st0" d="M94.7,45H65.2c-2.1-6.4-8.1-11-15.2-11s-13.1,4.6-15.2,11H5.3C7.8,22.5,26.8,5,50,5S92.2,22.5,94.7,45z"/>
              </g>
            </svg>

            {{text[constructKey(i)][language]}}
          </router-link>
        </li>

        <li @click="optionsClickHandler">
          <div>
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

            {{text.options[language]}}
          </div>
        </li>
      </ul>
    </Layer>
  </div>
</template>

<script>
import LayerTrigger from '@/components/Layer/LayerTrigger'
import Layer from '@/components/Layer/Layer'

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
    currentRoute () {
      return this.$route.name
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
      isClosing: false,
      text: require('../lang/Menu.json')
    }
  },
  methods: {
    constructKey (i) {
      return 'r' + i
    },
    optionsClickHandler () {
      this.$store.state.menuIsOpen = false

      this.$store.commit('setOptionsIsOpen', true)
    },
    layerTriggerClickHandler () {
      if (this.menuIsOpen === false) {
        this.$store.state.menuIsOpen = true
      } else {
        this.isClosing = true
        this.$store.state.menuIsOpen = false

        window.setTimeout(() => {
          this.isClosing = false
        }, 800)
      }
    }
  },
  name: 'Menu'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.menu {
  color: var(--theme-color);
  font-size: 25px;
  font-weight: 600;
  z-index: 4;

  .layer-trigger {
    transition: transform 0.25s ease;
    transform: scale(1);

    &.hide {
      transform: scale(0);
    }
  }

  ul  {
    list-style-type: none;
    margin: 0;
    padding: 0;

    @media (min-width: 720px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    li {
      opacity: 1;
      text-transform: uppercase;
      margin-bottom: 15px;
      text-decoration: none;
      position: relative;

      @media (min-width: 720px) {
        display: inline-block;
        text-align: center;
        margin: 0;
      }

      &:hover {
        svg {
          transform: scale(1.1);
        }
      }

      svg {
        display: none;

        @media (min-width: 720px) {
          display: block;
          margin: 0 auto 30px auto;
          width: 77px;
          height: 77px;
          transform: scale(1);
          transition: transform 0.25s ease-in-out;
        }

        * {
          fill: var(--theme-color);
        }
      }
    }

    li a,
    li div {
      color: var(--theme-color);
      opacity: 1 !important;
      display: inline-block;
      text-transform: uppercase;
      margin-bottom: 15px;
      text-decoration: none;
      position: relative;
      cursor: pointer;

      @media (min-width: 720px) {
        display: inline-block;
        margin: auto;
        text-align: center;
      }

      &::before {
        background-color: var(--theme-color);
        bottom: -5px;
        content: "";
        height: 5px;
        left: 0;
        position: absolute;
        transition: width 0.25s ease-out;
        width: 0;
      }

      &:hover {
        &::before {
          width: 100%;
        }
      }

      &.router-link-exact-active {
        animation: flash 0.25s;
        animation-iteration-count: 2;

        &::before {
          width: 100%;
        }

        svg {
          transform: scale(1.1);
        }
      }
    }
  }
}

@keyframes flash {
  from { opacity: 1 }
  to { opacity: 0.5 }
}
</style>
