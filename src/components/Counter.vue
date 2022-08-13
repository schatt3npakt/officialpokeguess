<template>
  <div class="counter-wrapper">
    <div class="counter" :class="{day: isDay}">
      <span>{{ hours }}</span>
      <span class="counter__colon">:</span>
      <span>{{ minutes }}</span>
      <span v-if="isDay">
        <svg width="100%" height="100%" viewBox="0 0 85 86" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
          <g transform="matrix(1,0,0,1,-2242,-143)">
                <g transform="matrix(1,0,0,1,1296,0)">
                    <g id="Sun" transform="matrix(1,0,0,1,-121.333,-10)">
                        <g transform="matrix(1,0,0,1,67.6949,0)">
                            <circle cx="1041.97" cy="196.125" r="23.563"/>
                        </g>
                        <g transform="matrix(1,0,0,1,63.3615,5.20673)">
                            <path
                              d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z"/>
                        </g>
                        <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,1300.58,-850.18)">
                            <path
                              d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z"/>
                        </g>
                        <g transform="matrix(-0.707107,0.707107,-0.707107,-0.707107,1984.52,-408.725)">
                            <path
                              d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z"/>
                        </g>
                        <g transform="matrix(0.707107,0.707107,-0.707107,0.707107,504.817,-678.724)">
                            <path
                              d="M1050.64,150.752C1050.64,149.556 1049.67,148.585 1048.47,148.585L1044.14,148.585C1042.94,148.585 1041.97,149.556 1041.97,150.752L1041.97,231.085C1041.97,232.281 1042.94,233.252 1044.14,233.252L1048.47,233.252C1049.67,233.252 1050.64,232.281 1050.64,231.085L1050.64,150.752Z"/>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
      </span>
      <span v-else>
        <svg version="1.1" id="Ebene_1" xmlns:serif="http://www.serif.com/"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 25 25"
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
    </div>

    <span v-show="showNameBelowClockIsActive" class="username">{{userName}}</span>
  </div>
</template>

<script>
export default {
  computed: {
    hours () {
      return this.$store.state.hours
    },
    minutes () {
      return this.$store.state.minutes
    },
    isDay () {
      return JSON.parse(this.$store.state.isDay)
    },
    userName () {
      return this.$store.state.userName
    },
    showNameBelowClockIsActive () {
      return this.$store.state.showUserNameBelowClock === 'true'
    }
  },
  name: 'Counter'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.counter-wrapper {
  display: inline-block;
  color: var(--theme-color);
  font-size: 55px;
  font-weight: 600;
  line-height: 70px;
  margin: 0 auto;
  position: relative;

  @media (min-width: 735px) {
    font-size: 70px;
    margin: 0 auto 30px auto;
  }
}

.counter {
  position: relative;

  svg {
    width: 26px;
    height: 26px;
    position: absolute;
    right: -35px;
    top: 50%;
    transform: translateY(-50%);

    @media (min-width: 735px) {
      width: 35px;
      height: 35px;
      right: -40px;
    }

    * {
      fill: var(--theme-color);
      transition: fill 0.25s ease-out;
    }
  }

  &__colon {
    animation: blinking 2s linear infinite;
    opacity: 1;
  }

  &::after {
    position: absolute;
    content: "";
    display: block;
    height: 25px;
    width: 25px;
    background-size: 100% 100%;
    left: 50%;
    top: 50%;
    transform: translate(100px, -50%);
  }
}

.username {
  position: absolute;
  top: 38px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
}

@keyframes blinking {
  50% {
    opacity: 0;
  }
}
</style>
