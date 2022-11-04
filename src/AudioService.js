import { Howl } from 'howler'

function playSound (sound) {
  const clickSound = new Howl({
    src: [sound],
    volume: 0.5
  })

  clickSound.play()
}

export function playToggleOnSound () {
  playSound('/sfx/toggleOn.ogg')
}

export function playToggleOffSound () {
  playSound('/sfx/toggleOff.ogg')
}

export function playRolloverSound () {
  playSound('/sfx/rollover.ogg')
}

export function playTypingSound () {
  playSound('/sfx/typing.ogg')
}

export function playConfirmSound () {
  playSound('/sfx/confirm.ogg')
}

export function playMinimizeSound () {
  playSound('/sfx/minimize.ogg')
}

export function playMaximizeSound () {
  playSound('/sfx/maximize.ogg')
}

export function playFleeSound () {
  playSound('/sfx/flee.wav')
}

export function playGuessSound () {
  playSound('/sfx/guess.ogg')
}

export function playGuessWrongSound () {
  playSound('/sfx/guess-wrong.ogg')
}

export function playResetSound () {
  playSound('/sfx/reset.ogg')
}

export function playBgm () {
  // const clickSound = new Howl({
  //   src: ['/sfx/bgm.ogg'],
  //   loop: true
  // })

  // if (localStorage.getItem('muteAudioIsActive') === 'false') {
  //   clickSound.play()
  // }
}

export function playPokemonSound (id) {
  if (id >= 890) {
    return
  }

  playSound('/pokemon/sounds/' + id + '.mp3')
}
