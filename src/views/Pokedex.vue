<template>
  <div class="inner">
    <div class="bottom-elements pokedex">
      <Pokedex />
    </div>
  </div>
</template>

<script>
import Pokedex from '../components/Pokedex.vue'

export default {
  name: 'App',
  components: {
    Pokedex
  }
}
</script>

<style lang="scss">
.bottom-elements.pokedex {
  height: auto;
  margin: 0;
  width: 100%;
  max-width: none;
  overflow: auto;
}
</style>
