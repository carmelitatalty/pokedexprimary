let pokemonlist = [
  { types: ["bug"], name: "caterpie", height: ".3" },
  { types: ["grass", "poison"], name: "bellsprout", height: ".7" },
  { types: ["bug", "flying"], name: "beautifly", height: "1" },
  { types: ["rock", "ground"], name: "onix", height: "8.8" },
  { types: ["fighting"], name: "machamp", height: "1.6" },
  { types: ["electric"], name: "Pikachu", height: ".4" },
];
document.write("<ul>");
pokemonlist.forEach (function(pokemon)  {
  let pokemontext = `${pokemon.name} (height: ${pokemon.height})`;

  if (pokemon.height > 1) {
    pokemontext = `${pokemontext} - WOW, that's big!`;
  }
  document.write(`<li>${pokemontext}</li>`);
})
document.write("</ul>");
