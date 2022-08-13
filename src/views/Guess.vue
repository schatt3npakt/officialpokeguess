<template>
  <div class="inner">
    <div class="bottom-elements guess">
      <Guess />
    </div>
  </div>
</template>

<script>
import Guess from '../components/GuessWrapper.vue'

export default {
  name: 'App',
  components: {
    Guess
  }
}
</script>

<style lang="scss">
.bottom-elements.guess {
  max-width: none;
  margin-top: auto;
}
</style>
