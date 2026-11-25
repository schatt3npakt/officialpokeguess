/**
 * Single source of truth for generation ranges (used by the game and the Pokédex).
 * To add a generation: append it here, add the Pokémon to data/pokemon.json and the
 * artwork/icons to assets/pokemon/.
 */
export const GENS = Object.freeze(
  [
    { id: 1, start: 1, end: 151 },
    { id: 2, start: 152, end: 251 },
    { id: 3, start: 252, end: 386 },
    { id: 4, start: 387, end: 493 },
    { id: 5, start: 494, end: 649 },
    { id: 6, start: 650, end: 721 },
    { id: 7, start: 722, end: 809 },
    { id: 8, start: 810, end: 905 },
    { id: 9, start: 906, end: 1008 }
  ].map(Object.freeze)
)

export function genOf(id) {
  return GENS.find((g) => id >= g.start && id <= g.end)?.id ?? 0
}

export function idsOfGen(genId) {
  const gen = GENS.find((g) => g.id === genId)
  if (!gen) return []
  return Array.from({ length: gen.end - gen.start + 1 }, (_, i) => gen.start + i)
}
