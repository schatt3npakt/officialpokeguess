<template>
  <div class="toggle-wrapper">
    <span class="label" v-if="toggleLabel">{{toggleLabel}}</span>

    <button
      v-if="type === 'daytime'"
      class="toggle daytoggle"
      :class="{on: isOn}"
    >
      <span class="on-text" v-if="isOn">
        <svg width="100%" height="100%" viewBox="0 0 85 86" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
          <g transform="matrix(1,0,0,1,-2242,-143)">
            <g transform="matrix(1,0,0,1,1296,0)">
              <g id="Sun" transform="matrix(1,0,0,1,-121.333,-10)">
                <g transform="matrix(1,0,0,1,67.6949,0)">
                  <circle cx="1041.97" cy="196.125" r="23.563" />
                </g>
                <g transform="matrix(1,0,0,1,63.3615,5.20673)">
                  <path d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z" />
                </g>
                <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,1300.58,-850.18)">
                  <path d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z" />
                </g>
                <g transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,1984.52,-408.725)">
                  <path d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z" />
                </g>
                <g transform="matrix(0.707107,0.707107,-0.707107,0.707107,504.817,-678.724)">
                  <path d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </span>

      <span class="off-text" v-else>
        <svg version="1.1" id="Ebene_1" xmlns:serif="http://www.serif.com/"
             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25 25"
             style="enable-background:new 0 0 25 25;" xml:space="preserve">
          <g transform="matrix(1,0,0,1,-3542,-131)">
            <g transform="matrix(1,0,0,1,2576,0)">
              <g id="mond" transform="matrix(1,0,0,1,-30,-25.3966)">
                <g transform="matrix(1,0,0,1,-1280,0)">
                  <path class="st0" d="M2296.9,167.8c0,5.5-4.4,9.9-9.9,9.9c-3.9,0-7.3-2.3-8.9-5.6c1.3,0.6,2.8,1,4.3,1c5.5,0,9.9-4.4,9.9-9.9
                    c0-1.5-0.4-3-1-4.3C2294.6,160.5,2296.9,163.9,2296.9,167.8z"/>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </span>
    </button>

    <button
      v-else
      class="toggle"
      :class="{on: isOn}"
    >
      <span class="on-text" v-show="isOn" v-if="onText">{{onText}}</span>
      <span class="on-text" v-show="isOn" v-else>{{text.on[language]}}</span>

      <span class="off-text" v-show="!isOn" v-if="offText">{{offText}}</span>
      <span class="off-text" v-show="!isOn" v-else>{{text.off[language]}}</span>
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.state.language
    }
  },
  name: 'Toggle',
  data: function () {
    return {
      text: require('../../lang/Guess.json')
    }
  },
  props: {
    toggleLabel: String,
    offText: String,
    onText: String,
    isOn: Boolean,
    type: String
  }
}
</script>

<style lang="scss">
.toggle-wrapper {
  display: block;
  position: relative;
  text-align: center;

  &.disabled {
    .toggle.on {
      cursor: not-allowed;
      opacity: 0.25;
    }
  }

  .toggle {
    background-color: var(--contrast-color);
    border-radius: 30px;
    border: 1px solid var(--theme-color);
    cursor: pointer;
    display: inline-block;
    font-size: 0;
    height: 28px;
    margin-bottom: 5px;
    position: relative;
    transition: background-color 0.25s ease, opacity 0.25s ease;
    width: 50px;

    @media (min-width: 735px) {
      border: 1px solid var(--theme-color);
      border-radius: 40px;
      height: 35px;
      width: 60px;
    }

    .day & {
      background-color: var(--contrast-color);
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

      svg {
        * {
          fill: var(--contrast-color);
        }
      }

      span {
        color: var(--contrast-color);
      }
    }

    &::after {
      background-color: var(--theme-color);
      border-radius: 40px;
      border: 1px solid var(--theme-color);
      content: "";
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

    svg {
      height: 15px;
      width: 15px;

      @media (min-width: 735px) {
        height: 18px;
        width: 18px;
      }

      * {
        fill: var(--theme-color);
        transition: fill 0.25s ease-out;
      }
    }

    span {
      color: var(--theme-color);
      font-size: 8px;
      font-weight: 600;;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      @media (min-width: 735px) {
        font-size: 9px;
      }

      &.on-text {
        left: 6px;

        @media (min-width: 735px) {
          left: 8px;
        }
      }

      &.off-text {
        right: 6px;

        @media (min-width: 735px) {
          right: 8px;
        }
      }
    }
  }

  .label {
    color: var(--theme-color);
    display: block;
    text-align: center;
    margin-bottom: 5px;
  }
}
</style>
