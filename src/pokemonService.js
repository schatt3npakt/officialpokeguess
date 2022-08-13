import pokemon from './data/pokemon.json'

export default class {
  constructor () {
    this.pokemon = pokemon
  }

  getAll (language) {
    const pokeArray = []

    for (const pokemon in this.pokemon) {
      pokeArray.push(this.pokemon[pokemon].name[language])
    }

    return pokeArray
  }

  getName (id, lang) {
    return this.pokemon[id].name[lang]
  }

  getTypes (id) {
    return this.pokemon[id].types
  }
}
