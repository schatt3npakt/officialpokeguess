<template>
  <div>
    <div class="guess__wrapper">
      <div class="reset-layer"></div>

      <div v-show="firstPokemonLoaded === false">
        No Pokemon Loaded
      </div>

      <div class="gamewrapper" v-show="firstPokemonLoaded === true">
        <div v-if="noPokemonAvailable" class="nopokemon-layer">
          <p>{{ text.noPokemon[language] }}</p>
          <p>{{ text.checkGameOptions[language] }}</p>
        </div>

        <div v-else class="guess-wrapper-content">
          <button @mouseenter="hoverhandler()" @click="resetButtonHandler()" class="pokemon-skip-button">Skip</button>

          <div class="pokeball-overlay">
            <svg class="top" version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
            <g>
              <g>
                <path class="st2" d="M94.7,45H65.2c-2.1-6.4-8.1-11-15.2-11s-13.1,4.6-15.2,11H5.3C7.8,22.5,26.8,5,50,5S92.2,22.5,94.7,45z"/>
              </g>
            </g>
              <circle class="st2" cx="50" cy="50" r="10.1"/>
          </svg>

            <svg class="bottom" version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
            <g>
              <g>
                <path class="st0" d="M94.7,55C92.2,77.5,73.2,95,50,95S7.8,77.5,5.3,55h29.5c2.1,6.4,8.1,11,15.2,11s13.1-4.6,15.2-11H94.7z"/>
              </g>
            </g>
          </svg>
          </div>

        <div v-show="infiniteGuesses === false" class="guess-image-wrapper">
            <div :class="{danger: maxWrongGuesses - wrongGuesses === 1}" class="guess-image">
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 1">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 2">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 3">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 4">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 5">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
              <div class="guess-image-image" v-show="maxWrongGuesses - wrongGuesses >= 6">
                <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                  <path d="M98.7,43.8h-5c-0.2-1.7-0.6-3.4-1-5c-4.9-18.7-22-32.6-42.2-32.6c-20.2,0-37.3,13.9-42.2,32.6c-0.4,1.6-0.8,3.3-1,5H2.2c0.2-1.7,0.5-3.4,0.9-5c5-21.5,24.3-37.6,47.4-37.6c23.1,0,42.4,16,47.4,37.6C98.2,40.5,98.5,42.2,98.7,43.8z"/>
                  <path class="st0" d="M98.7,56.2c-0.2,1.7-0.5,3.4-0.9,5c-5.1,21.4-24.3,37.3-47.3,37.3c-23,0-42.2-15.9-47.3-37.3c-0.4-1.6-0.7-3.3-0.9-5h5c0.2,1.7,0.6,3.4,1,5c5,18.6,22,32.3,42.1,32.3c20.2,0,37.2-13.7,42.1-32.3c0.4-1.6,0.8-3.3,1-5H98.7z"/>
                  <path class="st0" d="M93.6,56.2c-0.2,1.7-0.6,3.4-1,5h-21c-4,7.6-12,12.7-21.2,12.7c-9.2,0-17.1-5.1-21.2-12.7h-21c-0.4-1.6-0.8-3.3-1-5h25.3c0.6,1.8,1.5,3.5,2.6,5c3.5,4.7,9,7.7,15.2,7.7c6.2,0,11.8-3,15.2-7.7c1.1-1.5,2-3.2,2.6-5H93.6z"/>
                  <path class="st0" d="M93.7,43.8H68.5c-0.6-1.8-1.5-3.5-2.6-5c-3.4-4.8-9.1-7.9-15.4-7.9c-6.3,0-12,3.1-15.4,7.9c-1.1,1.5-2,3.2-2.6,5H7.3c0.2-1.7,0.6-3.4,1-5h20.9c4-7.7,12-12.9,21.3-12.9c9.2,0,17.3,5.2,21.3,12.9h20.9C93.1,40.5,93.4,42.2,93.7,43.8z"/>
                  <g class="st0">
                    <path class="st1" d="M51,41.9c4.5,0,8.1,3.6,8.1,8.1s-3.6,8.1-8.1,8.1s-8.1-3.6-8.1-8.1S46.5,41.9,51,41.9 M51,36.9
                    c-7.3,0-13.1,5.9-13.1,13.1S43.7,63.1,51,63.1S64.1,57.3,64.1,50S58.3,36.9,51,36.9L51,36.9z"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <img
            class="pokeimage"
            :class="{hide: !showPokeImage, obscure0: showPartOfImage && imagePartFilter === 0, obscure1: showPartOfImage && imagePartFilter === 1, obscure2: showPartOfImage && imagePartFilter === 2, obscure3: showPartOfImage && imagePartFilter === 3, mythical: isMythical, legendary: isLegendary, show: revealCaught}"
            :src="imageURL"
            alt="" />

          <div
            :class="{hints: hintsAllowed && maxHints - hintsUsed >= 1, small: pokeNameArray.length >= 8}"
            class="name-container"
          >
            <div
              class="letter"
              @mouseenter="if(hintsAllowed) {hoverhandler()}"
              :class="{ignore: testForRevealingCharacter(letter)}"
              @click="letterClickHandler"
              v-for="(letter, index) in pokeNameArray"
              :key="index"
              :data-key-index="index"
            >{{letter}}</div>

            <button v-show="playPokemonCry" @click="playCryHandler()" @mouseenter="hoverhandler()" class="cry-hint" :class="language">
              Play Cry
            </button>

            <div v-if="showGenHint" class="gen-hint">
              Gen {{ activePokemonGeneration }}
            </div>

            <div class="hint-hint" :class="{'en': language === 'en', 'fr': language === 'fr'}" v-show="hintsAllowed">
              {{ text.hints[language] }}
              <span class="number" :class="{last: maxHints - hintsUsed === 1}">{{ maxHints - hintsUsed }}</span>
            </div>

            <div v-if="showIndexHint" class="index-hint">
              Nr. {{ String(pokemonId).padStart(3, '0') }}
            </div>

            <div v-if="showTypeHint" class="type-hint">
            <span
              :class="arrayType"
              v-for="arrayType in pokemonTypes"
              :key="arrayType"
            >
              {{ text.types[arrayType][language] }}
            </span>
            </div>

            <div class="counter-hint" :class="{short: counter <= 10}" v-if="isTimerEnabled">
              <span>00</span>
              <span class="counter__colon">:</span>
              <span>{{ counter.toString().padStart(2, '0') }}</span>
            </div>

            <div class="rarity-hint">
            <span v-if="isMythical">
              {{ text.mythical[language] }}
            </span>
              <span v-if="isLegendary">
              {{ text.legendary[language] }}
            </span>
            </div>
          </div>

          <div class="keyboard">
            <div
              class="keyboard-row"
              v-for="(row, index) of keyboards[getKeyboardType()]"
              :key="index"
            >
              <button
                @mouseenter="hoverhandler()"
                class="key"
                :id="'key' + letter"
                @click="keyClickHandler"
                v-for="letter in row"
                :key="letter"
              >{{letter}}</button>
            </div>
          </div>

          <div class="feedback-container" :key="guessFeedback">
            {{ guessFeedback }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { playFleeSound, playGuessSound, playGuessWrongSound, playPokemonSound, playResetSound, playRolloverSound } from '../../AudioService'
import PokemonService from '../../pokemonService'

const pokemonService = new PokemonService()
const timerTimeouts = []

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * ((max - min) + 1) + min)
}

function getAllIndexes (arr, val) {
  const indexes = []
  const aSpecialChars = ['ä', 'à', 'á', 'â', 'ã', 'å', 'æ']
  const cSpecialChars = ['ç']
  const dSpecialChars = ['ð']
  const eSpecialChars = ['ë', 'é', 'è', 'ê']
  const iSpecialChars = ['ï', 'ì', 'í', 'î']
  const nSpecialChars = ['ñ']
  const oSpecialChars = ['ö', 'ò', 'ó', 'ô', 'õ', 'ø', 'œ']
  const sSpecialChars = ['ß', 'š']
  const tSpecialChars = ['Þ', 'þ']
  const uSpecialChars = ['ü', 'ù', 'ú', 'û']
  const ySpecialChars = ['ÿ', 'ý']

  for (let i = 0; i < arr.length; i++) {
    if (
      (aSpecialChars.includes(arr[i]) && val === 'a') ||
      (cSpecialChars.includes(arr[i]) && val === 'c') ||
      (dSpecialChars.includes(arr[i]) && val === 'd') ||
      (eSpecialChars.includes(arr[i]) && val === 'e') ||
      (iSpecialChars.includes(arr[i]) && val === 'i') ||
      (nSpecialChars.includes(arr[i]) && val === 'n') ||
      (oSpecialChars.includes(arr[i]) && val === 'o') ||
      (sSpecialChars.includes(arr[i]) && val === 's') ||
      (tSpecialChars.includes(arr[i]) && val === 't') ||
      (uSpecialChars.includes(arr[i]) && val === 'u') ||
      (ySpecialChars.includes(arr[i]) && val === 'y') ||
      arr[i] === val
    ) {
      indexes.push(i)
    }
  }
  return indexes
}

export default {
  computed: {
    isTimerEnabled () {
      return this.$store.state.guessModule.gameOptions.timerMode
    },
    counter () {
      return this.$store.state.guessModule.gameState.counter
    },
    isMythical () {
      return this.$store.state.guessModule.gameState.specialPokemon === 'mythical'
    },
    isLegendary () {
      return this.$store.state.guessModule.gameState.specialPokemon === 'legendary'
    },
    keyboardType () {
      return this.$store.state.guessModule.gameOptions.keyboardType
    },
    keyboards () {
      return this.$store.state.guessModule.keyboards
    },
    activePokemonGenerations () {
      return this.$store.state.guessModule.gameOptions.activeGens
    },
    activePokemonGeneration () {
      return this.$store.state.guessModule.gameState.currentGen
    },
    gameOptionsIsOpen () {
      return this.$store.state.gameOptionsIsOpen
    },
    gameSupportIsOpen () {
      return this.$store.state.gameSupportIsOpen
    },
    guessFeedback () {
      return this.$store.state.guessModule.gameState.guessFeedback
    },
    hintsAllowed () {
      return this.$store.state.guessModule.gameOptions.hintsAllowed
    },
    imageURL: function () {
      return 'https://pokeguess.bitheart.de/pokemon/' + this.$store.state.guessModule.gameState.pokeId + '.png'
    },
    language () {
      return this.$store.state.language
    },
    letters () {
      return this.$store.state.guessModule.letters
    },
    maxWrongGuesses () {
      return this.$store.state.guessModule.gameOptions.maxWrongGuesses
    },
    maxHints () {
      return this.$store.state.guessModule.gameOptions.maxHints
    },
    hintsUsed () {
      return this.$store.state.guessModule.gameState.hintsUsed
    },
    menuIsOpen () {
      return this.$store.state.menuIsOpen
    },
    pokemonId () {
      return this.$store.state.guessModule.gameState.pokeId
    },
    pokemonName () {
      return this.$store.state.guessModule.gameState.pokeName
    },
    pokemonLowerLimit () {
      return this.$store.state.guessModule.gens[(Math.min(...this.$store.state.guessModule.gameOptions.activeGens) - 1)].start
    },
    pokeNameArray () {
      return Array.from(this.$store.state.guessModule.gameState.pokeName)
    },
    pokemonUpperLimit () {
      return this.$store.state.guessModule.gens[(Math.max(...this.$store.state.guessModule.gameOptions.activeGens) - 1)].end
    },
    pokemonGenerations () {
      return this.$store.state.guessModule.gens
    },
    pokemonTypes () {
      return this.$store.state.guessModule.gameState.types
    },
    playerInfo () {
      return this.$store.state.guessModule.playerInfo
    },
    revealCaught () {
      return this.$store.state.guessModule.gameState.pokemonAlreadyCaught
    },
    showGenHint () {
      return this.$store.state.guessModule.gameOptions.showGenHint
    },
    showTypeHint () {
      return this.$store.state.guessModule.gameOptions.showTypeHint
    },
    showIndexHint () {
      return this.$store.state.guessModule.gameOptions.showIndexHint
    },
    showPokeImage () {
      return this.$store.state.guessModule.gameOptions.showPokeImage
    },
    wrongGuesses () {
      return this.$store.state.guessModule.gameState.wrongGuesses
    },
    noPokemonAvailable () {
      return this.$store.state.guessModule.gameState.noPokemonAvailable
    },
    firstPokemonLoaded () {
      return this.$store.state.guessModule.gameState.firstPokemonLoaded
    },
    infiniteGuesses () {
      return this.$store.state.guessModule.gameOptions.infiniteGuesses
    },
    showPartOfImage () {
      return this.$store.state.guessModule.gameOptions.showPartOfImage
    },
    imagePartFilter () {
      return this.$store.state.guessModule.gameOptions.imagePartFilter
    },
    showPokemonOnFlee () {
      return this.$store.state.guessModule.gameOptions.showPokemonOnFlee
    },
    playPokemonCry () {
      return this.$store.state.muteAudioIsActive === false && this.$store.state.guessModule.gameOptions.showPokemonCry
    }
  },
  data: function () {
    return {
      text: require('../../lang/Guess.json'),
      badgeImage: 'https://via.placeholder.com/200',
      badgeId: '0'
    }
  },
  methods: {
    resetButtonHandler () {
      playFleeSound()
      this.resetPokemon(false)
    },
    hoverhandler () {
      playRolloverSound()
    },
    getKeyboardType () {
      if (this.$store.state.guessModule.gameOptions.useAlphabeticalKeyboard) {
        return 'alphabetical'
      } else {
        if (this.language === 'en') {
          return 'qwerty'
        } else {
          return 'qwertz'
        }
      }
    },
    constructPokemonObject () {
      const state = this.$store.state.guessModule
      const date = new Date().getTime()

      return {
        gen: state.gameState.currentGen,
        id: this.pokemonId,
        isPerfect: state.gameState.wrongGuesses === 0,
        timeStamp: date
      }
    },
    playCryHandler () {
      playPokemonSound(this.pokemonId)
    },
    testForRevealingCharacter (char) {
      const regEx = new RegExp('[0-9\' :.,♂♀-♀♂]')
      return regEx.test(char)
    },
    resetPokemon (initialDelay = true) {
      this.$store.commit('resetPokemon', initialDelay)
      this.$store.state.guessModule.gameState.hintsUsed = 0
      this.$store.state.guessModule.gameState.counter = 20

      if (this.isTimerEnabled) {
        for (const timeout of timerTimeouts) {
          if (timeout) {
            clearTimeout(timeout)
          }
        }

        window.setTimeout(() => {
          this.reduceTimer()
        }, 3000)
      }
    },
    checkForWin () {
      const pokeimage = document.querySelector('.pokeimage')
      const pokeBallOverlay = document.querySelector('.pokeball-overlay')
      const letters = document.querySelectorAll('.letter:not(.ignore)')
      const keys = document.querySelectorAll('.key')
      const revealedLetters = document.querySelectorAll('.letter.reveal')
      const gameState = this.$store.state.guessModule.gameState

      if (letters.length === revealedLetters.length) {
        for (const timeout of timerTimeouts) {
          if (timeout) {
            clearTimeout(timeout)
          }
        }

        pokeimage.classList.add('reveal')
        window.setTimeout(() => {
          playPokemonSound(this.pokemonId)
        }, 500)

        for (const item of keys) {
          item.classList.add('disabled')
        }

        if (gameState.wrongGuesses === 0) {
          gameState.guessFeedback = pokemonService.getName(this.pokemonId, this.language) + this.text.feedbackOptions.perfect[this.language]
        } else {
          gameState.guessFeedback = pokemonService.getName(this.pokemonId, this.language) + this.text.feedbackOptions.win[this.language]
        }

        if (this.isLegendary) {
          this.$store.commit('setPlayerProperty', {
            propertyKey: 'legendaryPokemonCaught',
            propertyValue: 1
          })
        } else if (this.isMythical) {
          this.$store.commit('setPlayerProperty', {
            propertyKey: 'mythicalPokemonCaught',
            propertyValue: 1
          })
        }

        this.$store.commit('setPlayerProperty', {
          propertyKey: 'pokemonCaught',
          propertyValue: this.constructPokemonObject()
        })
        this.$store.commit('setPlayerProperty', {
          propertyKey: 'pokemonCaughtId',
          propertyValue: this.pokemonId
        })
        this.$store.commit('setPlayerProperty', {
          propertyKey: 'catchingStreak',
          propertyValue: 1
        })
        this.$store.commit('setPlayerProperty', {
          propertyKey: 'pokemonMet',
          propertyValue: this.pokemonId
        })

        window.setTimeout(() => {
          playResetSound()
          pokeBallOverlay.classList.add('revealed')
          this.resetPokemon()
        }, 4200)
      }
    },
    checkForFail () {
      const pokeimage = document.querySelector('.pokeimage')
      const letters = document.querySelectorAll('.letter:not(.ignore)')
      const keys = document.querySelectorAll('.key')
      const revealedLetters = document.querySelectorAll('.letter.reveal')
      const gameState = this.$store.state.guessModule.gameState
      const gameOptions = this.$store.state.guessModule.gameOptions

      if (letters.length !== revealedLetters.length && gameState.wrongGuesses >= gameOptions.maxWrongGuesses) {
        for (const timeout of timerTimeouts) {
          if (timeout) {
            clearTimeout(timeout)
          }
        }

        if (this.showPokemonOnFlee === false) {
          pokeimage.classList.add('flee')
          gameState.guessFeedback = this.text.feedbackOptions.fail[this.language]
          window.setTimeout(() => {
            playPokemonSound(this.pokemonId)
          }, 500)
        } else {
          pokeimage.classList.add('flee-reveal')
          gameState.guessFeedback = pokemonService.getName(this.pokemonId, this.language) + this.text.feedbackOptions.failReveal[this.language]

          const letters = document.querySelectorAll('.letter')
          for (const element of letters) {
            element.classList.add('reveal')
          }
        }

        for (const item of keys) {
          item.classList.add('disabled')
        }

        this.$store.state.guessModule.playerInfo.catchingStreak = []
        localStorage.setItem('catchingStreak', JSON.stringify([]))

        this.$store.commit('setPlayerProperty', {
          propertyKey: 'pokemonMet',
          propertyValue: this.pokemonId
        })

        window.setTimeout(() => {
          playResetSound()
          this.resetPokemon()
        }, 1000)
      }
    },
    letterClickHandler (e) {
      if (!this.hintsAllowed || this.maxHints - this.hintsUsed <= 0) {
        return
      }

      this.$store.state.guessModule.gameState.hintsUsed++
      const gameOptions = this.$store.state.guessModule.gameOptions
      if (gameOptions.hintsAllowed === false) {
        return
      }

      playGuessSound()

      const target = e.target
      target.classList.add('reveal')
      this.checkForWin()
    },
    keyClickHandler (e) {
      const target = e.target
      this.checkForCorrectGuess(target, target.innerHTML)
    },
    checkForCorrectGuess (target, key) {
      const gameState = this.$store.state.guessModule.gameState

      if (gameState.guessedLetters.includes(key)) {
        playGuessWrongSound()
        gameState.guessFeedback = this.text.feedbackOptions.duplicate[this.language]
        return
      } else {
        gameState.guessedLetters.push(key)
      }

      const letters = document.querySelectorAll('.letter')
      const foundIndex = getAllIndexes(this.pokeNameArray, key)
      for (const index of foundIndex) {
        letters[index].classList.add('reveal')
        gameState.guessFeedback = this.text.feedbackOptions.right[getRandomInt(0, 2)][this.language]
      }

      target.classList.add('disabled')
      gameState.guesses++
      if (foundIndex.length === 0) {
        playGuessWrongSound()
        target.classList.add('false')
        if (this.infiniteGuesses === false) {
          gameState.wrongGuesses++
        }
        gameState.guessFeedback = this.text.feedbackOptions.wrong[getRandomInt(0, 2)][this.language]
      } else {
        playGuessSound()
      }

      this.checkForWin()
      this.checkForFail()
    },
    reduceTimer () {
      if (this.counter === 0) {
        this.resetPokemon(false)
        return
      }

      this.$store.state.guessModule.gameState.counter--

      const timeOutId = window.setTimeout(() => {
        this.reduceTimer()
      }, 1000)

      timerTimeouts.push(timeOutId)
    }
  },
  mounted: function () {
    this.$store.state.guessModule.gameState.counter = 20
    if (this.isTimerEnabled) {
      for (const timeout of timerTimeouts) {
        if (timeout) {
          clearTimeout(timeout)
        }
      }

      this.reduceTimer()
    }

    if (this.$store.state.guessModule.gameState.resetPokemonFromGameMode) {
      this.resetPokemon(false)
      this.$store.state.guessModule.gameState.resetPokemonFromGameMode = false
    }

    if (this.$store.state.guessModule.gameState.pokeId === 0) {
      this.$store.commit('getRandomPokemon')
    }

    const pokemonImage = document.querySelector('.pokeimage')
    const guessWrapper = document.querySelector('.guess__wrapper')
    const observer = new MutationObserver((changes) => {
      changes.forEach(change => {
        if (change.attributeName.includes('src')) {
          guessWrapper.classList.add('guess__wrapper--loading')
        }
      })
    })
    observer.observe(pokemonImage, { attributes: true })

    pokemonImage.onload = function () {
      guessWrapper.classList.remove('guess__wrapper--loading')
    }

    const keys = document.querySelectorAll('.key')

    window.onkeypress = (evt) => {
      evt = evt || window.eventq

      if (isCharacterKeyPress(evt)) {
        if (window.location.href.indexOf('player') === -1 && window.location.href.indexOf('pokedex') === -1 && this.$store.state.optionsIsOpen === false) {
          for (const key of keys) {
            if (key.innerHTML === evt.key) {
              this.checkForCorrectGuess(key, evt.key)
            }
          }
        }
      }
    }

    function isCharacterKeyPress (evt) {
      if (typeof evt.which === 'number' && evt.which > 0) {
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which !== 8
      }
      return false
    }

    // Check if characters were already guessed
    const letters = document.querySelectorAll('.letter')
    for (const letter of this.$store.state.guessModule.gameState.guessedLetters) {
      const foundIndex = getAllIndexes(this.pokeNameArray, letter)
      for (const index of foundIndex) {
        letters[index].classList.add('reveal')
      }

      const letterElement = document.getElementById('key' + letter)
      letterElement.classList.add('disabled')
      if (foundIndex.length === 0) {
        letterElement.classList.add('false')
      }
    }
  },
  name: 'Guess'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nopokemon-layer {
  max-width: 480px;
  margin: auto;
  color: var(--theme-color);
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.pokemon-skip-button {
  border: none;
  background-color: var(--theme-color);
  color: var(--contrast-color);
  padding: 5px;
  position: fixed;
  top: 55px;
  left: 15px;
  border-radius: 50px;
  font-size: 10px;
  cursor: pointer;
  min-width: 50px;
  border: none;
  transform: scale(1);
  transition: transform 0.25s ease-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 720px) {
    top: 75px;
    padding: 8px;
    font-size: 14px;
    min-width: 60px;
  }
}

.guess-wrapper-content {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  opacity: 1;
}

.guess {
  &__wrapper {
    position: relative;

    &--loading {
      .pokeimage {
        opacity: 0;
      }

      .gamewrapper {
        opacity: 0.5;
        pointer-events: none;
      }

      &::after {
        position: fixed;
        top: 50%;
        left: 50%;
        content: "";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid var(--theme-color);
        border-color: var(--theme-color) transparent var(--theme-color) transparent;
        animation: lds-dual-ring 1.2s linear infinite;
        transform: translate(-50%, -50%);
        transform-origin: top left;
      }
    }

    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg) translate(-50%, -50%);;
      }

      100% {
        transform: rotate(360deg) translate(-50%, -50%);;
      }
    }

    .badge-layer {
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 5;
      padding: 50px;
      opacity: 0;
      pointer-events: none;

      &.show {
        animation: reveal-badge-layer 7s ease-in-out forwards;

        img {
          animation: reveal-badge 3s ease-in-out forwards;
          animation-delay: 0.25s;
          filter:
            brightness(1)
            drop-shadow(1px 0px 0px var(--theme-color))
            drop-shadow(-1px 0px 0px var(--theme-color))
            drop-shadow(0px 1px 0px var(--theme-color))
            drop-shadow(0px -1px 0px var(--theme-color));
        }
      }

      .badge-text,
      .badge-title {
        color: var(--theme-color);
        text-align: center;
        max-width: 480px;
        font-weight: 600;
        margin: 0 auto 20px auto;
      }

      .badge-text {
        font-size: 30px;
      }

      .badge-title {
        font-size: 40px;
      }

      img {
        display: block;
        height: 200px;
        width: auto;
        margin: 0 auto 40px auto;
        filter:
          brightness(0)
          drop-shadow(1px 0px 0px var(--theme-color))
          drop-shadow(-1px 0px 0px var(--theme-color))
          drop-shadow(0px 1px 0px var(--theme-color))
          drop-shadow(0px -1px 0px var(--theme-color));
      }
    }

    &.resetting {
      .reset-layer {
        animation: fade-left 2s ease-in-out forwards;
        display: block;
        position: fixed;
        top: 75px;
        left: 0;
        background-color: var(--theme-color);
        content: "";
        height: 100vh;
        width: 100vw;
        z-index: 2;
        overflow: hidden;

        @media (min-width: 720px) {
          top: 150px;
        }

        &::after {
          animation: pokefade 2s ease-in-out infinite;
          background-image: url("/img/icons/pokeloader-var(--contrast-color).svg");
          background-size: 100% 100%;
          display: block;
          position: fixed;
          top: 50%;
          left: 50%;
          content: "";
          height: 100px;
          width: 100px;
          transform: translate(-50%, -50%);
          z-index: 4;
        }
      }
    }

    .pokeball-overlay {
      width: 200px;
      height: 200px;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: block;
      margin-bottom: 100px;
      top: 120px;
      pointer-events: none;

      @media (max-width: 720px) and (orientation: landscape) {
        left: 100px;
        width: 180px;
        height: 180px;
      }

      @media (min-width: 720px) {
        top: 180px;
        width: 150px;
        height: 150px;
      }

      @media (min-width: 1200px) {
        top: 180px;
        width: 200px;
        height: 200px;
      }

      @media (min-width: 1700px) {
        top: 180px;
        width: 300px;
        height: 300px;
      }

      .bottom,
      .top {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        transition: transform 0.25s ease 0.25s, opacity 0.25s ease;
      }

      .bottom {
        transform: translateX(-50%) translateY(10%);
      }

      .top {
        transform: translateX(-50%) translateY(-10%);
      }

      &.revealed {
        pointer-events: auto;

        .bottom,
        .top {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      svg {
        width: 100%;
        height: auto;

        * {
          fill: var(--theme-color)
        }
      }
    }

    .guess-image {
      position: fixed;
      right: 15px;

      @for $i from 1 through 6 {
        &:nth-child(#{$i}) {
          top: $i * 45px + 25px;

          @media (min-width: 735px) {
            top: $i * 95px + 60px;
          }
        }
      }

      .guess-image-image {
        animation: rotate-and-fade 0.25s ease-in-out forwards;
        opacity: 0;
      }

      &.danger {
        .guess-image-image {
          animation: danger-flash 0.25s ease-in-out infinite;
        }
      }

      svg {
        display: block;
        width: 100%;
        height: auto;
        max-width: 20px;
        margin-top: 5px;

        @media (min-width: 735px) {
          max-width: 60px;
          margin-top: 10px;
        }

        * {
          fill: var(--theme-color);
        }
      }
    }

    .feedback-container {
      animation: fade-in-from-bottom 2.5s ease-in-out forwards;
      position: fixed;
      bottom: 15px;
      font-size: 15px;
      left: 50%;
      color: var(--theme-color);
      font-weight: 600;;
      z-index: 2;
      transform: translateX(-50%);
      background: rgb(45,52,54);
      background: linear-gradient(0deg, rgba(var(--contrast-color), 0) 30%, rgba(var(--contrast-color), 1) 100%);
      text-align: center;
      padding: 10px 0;
      width: 100vw;

      @media (min-width: 720px) {
        font-size: 22px;
      }
    }

    .pokeimage {
      display: block;
      width: auto;
      height: 100%;
      margin-bottom: 100px;
      position: fixed;
      top: 120px;
      max-height: 180px;
      left: 50%;
      transform: translateX(-50%);
      transition: clip-path 0.25s ease-out;
      filter:
        brightness(0)
        drop-shadow(1px 0px 0px var(--theme-color))
        drop-shadow(-1px 0px 0px var(--theme-color))
        drop-shadow(0px 1px 0px var(--theme-color))
        drop-shadow(0px -1px 0px var(--theme-color));

      .gameboy {
        filter:
          brightness(0)
          drop-shadow(1px 0px 0px #081820)
          drop-shadow(-1px 0px 0px #081820)
          drop-shadow(0px 1px 0px #081820)
          drop-shadow(0px -1px 0px #081820);
      }

      &.obscure0 {
        clip-path: inset(50% -10px -10px -10px);
      }

      &.obscure1 {
        clip-path: inset(-10px -10px 50% -10px);
      }

      &.obscure2 {
        clip-path: inset(-10px 50% -10px -10px);
      }

      &.obscure3 {
        clip-path: inset(-10px -10px -10px 50%);
      }

      @media (max-width: 720px) and (orientation: landscape) {
        left: 100px;
      }

      @media (min-width: 720px) {
        top: 180px;
        max-height: 160px;

        filter:
          brightness(0)
          drop-shadow(2px 0px 0px var(--theme-color))
          drop-shadow(-2px 0px 0px var(--theme-color))
          drop-shadow(0px 2px 0px var(--theme-color))
          drop-shadow(0px -2px 0px var(--theme-color));
      }

       @media (min-width: 1200px) {
        max-height: 230px;
      }

      @media (min-width: 1700px) {
        max-height: 400px;
      }

      @media (max-height: 500px) {
        max-height: 110px;
      }

      .app:not(.day) &.mythical:not(.reveal) {
        animation: glow-mythical 5s infinite ease-in-out;
        filter:
          brightness(0)
          drop-shadow(1px 0px 0px var(--theme-color))
          drop-shadow(-1px 0px 0px var(--theme-color))
          drop-shadow(0px 1px 0px var(--theme-color))
          drop-shadow(0px -1px 0px var(--theme-color))
          drop-shadow(0 0 2px rgb(238,232,170));
      }

      .app:not(.day) &.legendary:not(.reveal) {
        animation: glow-legendary 5s infinite ease-in-out;
        filter:
          brightness(0)
          drop-shadow(1px 0px 0px var(--theme-color))
          drop-shadow(-1px 0px 0px var(--theme-color))
          drop-shadow(0px 1px 0px var(--theme-color))
          drop-shadow(0px -1px 0px var(--theme-color))
          drop-shadow(0 0 2px rgb(192,192,192));
      }

      &.show {
        filter:
          brightness(1)
          drop-shadow(2px 0px 0px var(--theme-color))
          drop-shadow(-2px 0px 0px var(--theme-color))
          drop-shadow(0px 2px 0px var(--theme-color))
          drop-shadow(0px -2px 0px var(--theme-color)) !important;
      }

      &.hide {
        opacity: 0;
        transition: opacity 0.25s ease-out;

        &.reveal {
          opacity: 1;
        }
      }

      &.reveal {
        animation:
            reveal-and-bounce 2s ease forwards,
            minify-pokemon 0.5s ease 3.75s forwards;

        &.obscure0 {
          clip-path: inset(-10px -10px -10px -10px);
        }

        &.obscure1 {
          clip-path: inset(-10px -10px -10px -10px);
        }

        &.obscure2 {
          clip-path: inset(-10px -10px -10px -10px);
        }

        &.obscure3 {
          clip-path: inset(-10px -10px -10px -10px);
        }
      }

      &.flee {
        animation:
          pokemon-flee 2s ease forwards
      }

      &.flee-reveal {
        animation:
          pokemon-flee-reveal 2s ease forwards
      }
    }

    .name-container {
      font-size: 20px;
      font-weight: 600;;
      color: var(--theme-color);
      display: flex;
      margin: auto;
      gap: 10px;
      position: relative;
      min-width: 210px;
      justify-content: center;

      @media (max-width: 720px) and (orientation: landscape) {
        position: fixed;
        bottom: 160px;
        left: 50%;
        transform: translateX(-50%);
      }

      @media (min-width: 720px) {
        font-size: 50px;
        gap: 15px;
      }

      &.small {
        font-size: 20px;

        @media (min-width: 720px) {
          font-size: 50px;
          gap: 15px;
        }

        .letter {
          width: 20px;

          @media (min-width: 720px) {
            width: 55px;
          }
        }
      }

      .gen-hint {
        position: absolute;
        top: -25px;
        right: 0;
        font-size: 12px;

        @media (min-width: 720px) {
          font-size: 20px;
          right: -65px;
          top: 0;
        }
      }

      .hint-hint {
        font-size: 12px;
        position: absolute;
        top: 170px;
        right: 50%;
        transform: translateX(50%);

        @media (min-width: 325px) {
          top: 160px;
        }

        @media (min-width: 450px) {
          top: 180px;
        }

        @media (min-width: 720px) {
          font-size: 20px;
          right: -122px;
          top: 45px;
          transform: none;
        }

        @media (max-width: 720px) and (orientation: landscape) {
          top: -25px;
        }

        &.en {
          @media (min-width: 720px) {
            right: -85px;
          }
        }

        &.fr {
          @media (min-width: 720px) {
            right: -105px;
          }
        }

        .number {
          &.last {
            animation: danger-fade 0.25s ease-in-out infinite;
          }
        }
      }

      .cry-hint {
        background-color: var(--theme-color);
        color: var(--contrast-color);
        border: none;
        padding: 2px;
        border-radius: 10px;
        position: absolute;
        top: -25px;
        left: 0;
        font-size: 10px;
        display: none;

        @media (min-width: 720px) {
          display: block;
          padding: 5px 10px;
          font-size: 16px;
          left: -97px;
          top: 35px;
          cursor: pointer;
          transform: scale(1);
          transition: transform 0.25s ease-out;

          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .index-hint {
        position: absolute;
        top: -25px;
        left: 0;
        font-size: 12px;

        @media (min-width: 720px) {
          font-size: 20px;
          left: -80px;
          top: 0;
        }
      }

      .counter-hint {
        position: absolute;
        top: -40px;
        left: 50%;
        font-size: 12px;
        text-transform: uppercase;
        transform: translateX(-50%);
        transition: color 0.25s ease-in-out;

        @media (min-width: 720px) {
          font-size: 30px;
          top: -85px;
        }

        &.short {
          color: #C22E28;
        }
      }

      .type-hint {
        position: absolute;
        top: -40px;
        left: 0;
        font-size: 12px;
        text-transform: uppercase;

        @media (min-width: 720px) {
          font-size: 20px;
          top: -35px;
        }

        span {
          &:not(:last-child) {
            &:after {
              content: "/";
              margin: 0 3px;
            }
          }
        }
      }

      .rarity-hint {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 12px;
        text-transform: uppercase;

        @media (min-width: 720px) {
          font-size: 20px;
          top: -35px;
        }
      }

      .number-hint {
        position: absolute;
        top: -25px;
        left: 0;
        font-size: 12px;

        @media (min-width: 720px) {
          font-size: 20px;
          left: -80px;
          top: 0;
        }
      }

      .letter {
        display: block;
        position: relative;
        padding-bottom: 5px;
        width: 20px;
        text-align: center;
        text-transform: uppercase;
        overflow: hidden;
        transform: scale(1);
        transition: transform 0.25s ease;

        @media (min-width: 720px) {
          width: 55px;
        }

        &:not(.ignore) {
          &::before {
            content: "";
            display: block;
            height: 100%;
            width: 100%;
            background-color: var(--theme-color);
            position: absolute;
            bottom: 0;
            border-radius: 5px;
          }
        }

        &.reveal {
          pointer-events: none;

          &::before {
            animation: bounce 1s forwards;
          }

          &::after {
            opacity: 1;
          }
        }
      }

      &.hints {
        .letter:not(.ignore) {
          &::after {
            color: var(--contrast-color);
            content: "?";
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, calc(-50% + 100%));
            border-radius: 5px;
            opacity: 1;
            transition: opacity 0.25s ease, transform 0.25s ease;
          }

          &:not(.reveal) {
            &:hover {
              cursor: pointer;
              transform: scale(1.1);

              &::after {
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }

    .keyboard {
      margin-top: 20px;
      width: 100%;

      @media (max-width: 720px) and (orientation: landscape) {
        bottom: 50px;
        left: 50%;
        position: fixed;
        transform: translateX(-50%);
        margin: unset;
      }
    }

    .keyboard-row {
      display: flex;
      justify-content: center;
      flex-flow: row wrap;
      gap: 10px;
      margin-bottom: 10px;

      @media (max-width: 720px) and (orientation: landscape) {
        gap: 8px;
      }

      .key {
        text-transform: uppercase;
        cursor: pointer;
        text-align: center;
        background: var(--theme-color);
        border-radius: 5px;
        font-size: 10px;
        font-weight: 600;
        color: var(--contrast-color);
        border: none;
        width: 22px;
        height: 28px;
        transition: opacity 0.25s ease, transform 0.25s ease;
        transform: scale(1);

        @media (min-width: 450px) {
          font-size: 16px;
          width: 30px;
          height: 30px;
        }

        @media (min-width: 720px) {
          border-radius: 5px;
          font-size: 20px;
          width: 40px;
          height: 40px;
        }

        @media (max-width: 720px) and (orientation: landscape) {
          height: 26px;
          width: 26px;
        }

        &:not(.disabled) {
          &:hover {
            transform: scale(1.1);
          }
        }

        &.disabled,
        .keyboard-disabled & {
          pointer-events: none;
          cursor: not-allowed;
          transform: scale(0.9);
          opacity: 0.5;

          &.false {
            filter: grayscale(1);
          }
        }
      }
    }
  }
}

@keyframes bounce {
  0% { height: 100%}
  15% { height: calc(100% + 10px)}
  100% { height: 5px}
}

@keyframes reveal-and-bounce {
  0% {
    transform: translateX(-50%) scale(1);
    filter:
      brightness(0)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  15% {
    transform: translateX(-50%) scale(0.9);
    filter:
      brightness(0)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  85% {
    transform: translateX(-50%) scale(1.1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  100% {
    transform: translateX(-50%) scale(1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }
}

@keyframes reveal-badge-layer {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes glow-legendary {
  50% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 10px rgb(169,169,169));
  }
}

@keyframes glow-mythical {
  50% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 10px rgb(238,232,170));
  }
}

@keyframes reveal-badge {
  0% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 2px rgb(238,232,170));
  }

  20% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 10px rgb(238,232,170));
  }

  40% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 2px rgb(238,232,170));
  }

  60% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 15px rgb(238,232,170));
  }

  80% {
    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 2px rgb(238,232,170));
  }

  100% {
    filter:
      brightness(1)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color))
      drop-shadow(0 0 20px rgb(238,232,170));
  }
}

@keyframes pokemon-flee {
  0% {
    transform: translateX(-50%) scale(1);
    filter:
      brightness(0)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  50% {
    opacity: 1;
    transform: translateX(-70%) scale(0.9);
    filter:
      brightness(0)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  100% {
    opacity: 0;
    transform: translateX(100%) scale(1);
    filter:
      brightness(0)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }
}

@keyframes pokemon-flee-reveal {
  0% {
    transform: translateX(-50%) scale(1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  50% {
    opacity: 1;
    transform: translateX(-70%) scale(0.9);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  100% {
    opacity: 0;
    transform: translateX(100%) scale(1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }
}

@keyframes minify-pokemon {
  0% {
    transform: translateX(-50%) scale(1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  50% {
    transform: translateX(-50%) scale(1.1);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  90% {
    opacity: 1;
    transform: translateX(-50%) scale(0.2);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) scale(0.2);
    filter:
      brightness(1)
      drop-shadow(2px 0px 0px var(--theme-color))
      drop-shadow(-2px 0px 0px var(--theme-color))
      drop-shadow(0px 2px 0px var(--theme-color))
      drop-shadow(0px -2px 0px var(--theme-color));
  }
}

@keyframes fade-in-from-bottom {
  0% {
    transform: translateX(-50%) translateY(100px);
  }

  15% {
    transform: translateX(-50%) translateY(0);
  }

  85% {
    transform: translateX(-50%) translateY(0);
  }

  100% {
    transform: translateX(-50%) translateY(100px);
  }
}

@keyframes pokefade {
  0% {
    transform: translate(calc(100vw - 50%), -50%);
  }

  15% {
    transform: scale(1) translate(-50%, -50%);
  }

  85% {
    transform: scale(1) translate(-50%, -50%);
  }

  100% {
    transform: rotate(360deg) translate(calc(-100vw - 50%), -50%);
  }
}

@keyframes rotate-and-fade {
  0% {
    opacity: 0;
    transform: rotate(0);
  }

  100% {
    opacity: 1;
    transform: rotate(360deg);
  }
}

@keyframes fade-left {
  0% {
    transform: translateX(-100vw);
  }

  15% {
    transform: translateX(0);
  }

  85% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100vw);
  }
}

@keyframes danger-flash {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes danger-fade {
  50% {
    opacity: 0.5;
  }
}
</style>
