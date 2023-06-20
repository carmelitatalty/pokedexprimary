let pokemonRepository = (function () {
  let pokemonList = [
    { types: ["bug"], name: "caterpie", height: ".3" },
    { types: ["grass", "poison"], name: "bellsprout", height: ".7" },
    { types: ["bug", "flying"], name: "beautifly", height: "1" },
    { types: ["rock", "ground"], name: "onix", height: "8.8" },
    { types: ["fighting"], name: "machamp", height: "1.6" },
    { types: ["electric"], name: "Pikachu", height: ".4" },
  ];
  return {
    add: function (pokemon) {
      pokemonList.push(pokemon);
    },
    getAll: function () {
      return pokemonList;
    },
  };
})();

document.write("<ul>");
pokemonRepository.getAll().forEach(function (pokemon) {
  let pokemontext = `${pokemon.name} (height: ${pokemon.height})`;

  if (pokemon.height > 1) {
    pokemontext = `${pokemontext} - WOW, that's big!`;
  }
  document.write(`<li>${pokemontext}</li>`);
});
document.write("</ul>");

//   console.log(pokemonRepository.getAll()); // []
//   pokemonRepository.add({ name: 'Pikachu' });
//   console.log(pokemonRepository.getAll()); // [ { name: 'Pikachu' } ]
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // Other functions remain here

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList
  };
})();

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});