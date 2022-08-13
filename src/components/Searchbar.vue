<template>
  <div class="searchbar">
    <input v-model="inputValue"  type="text" :placeholder="text.searchPlaceholder[language]"/>

    <a :href="generateURL" target="_blank">
      <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
        <polygon class="st0" points="39.3,54.8 39.3,41.2 26.8,41.2 26.5,10.4 84.1,48 26.5,85.6 26.8,54.8 "/>
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.state.language
    },
    generateURL () {
      return 'https://www.google.com/search?q=' + this.inputValue
    }
  },
  data: function () {
    return {
      inputValue: '',
      text: require('../lang/Search.json')
    }
  },
  name: 'Searchbar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.searchbar {
  display: flex;
  font-weight: 600;

  a {
    background-color: var(--theme-color);
    animation: pop-in 0.25s ease forwards;
    animation-delay: 0.5s;
    border: none;
    border-radius: 15px;
    display: block;
    height: 54px;
    margin-left: 10px;
    width: 54px;
    transform: scale(0);
    position: relative;

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 80%;
      transform: translate(-50%, -50%);

      * {
        fill: var(--contrast-color);
      }
    }
  }

  input {
    animation: pop-in 0.25s ease forwards;
    animation-delay: 0.25s;
    background-color: var(--theme-color);
    border: none;
    border-radius: 15px;
    color: var(--contrast-color);
    font-size: 18px;
    padding: 15px;
    transform: scale(0);
    width: calc(100% - 64px);
    font-weight: 600;

    &::placeholder {
      color: var(--contrast-color);
    }

    &:focus,
    &:hover {
      border: none;
      box-shadow: none;
      outline: none;
    }
  }
}

@keyframes pop-in {
  from { transform: scale(0)}
  to { transform: scale(1)}
}
</style>
