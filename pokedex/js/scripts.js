let pokemonRepository = (function () {
  let pokemonList = [
    { types: ["bug"], name: "caterpie", height: ".3" },
    { types: ["grass", "poison"], name: "bellsprout", height: ".7" },
    { types: ["bug", "flying"], name: "beautifly", height: "1" },
    { types: ["rock", "ground"], name: "onix", height: "8.8" },
    { types: ["fighting"], name: "machamp", height: "1.6" },
    { types: ["electric"], name: "Pikachu", height: ".4" },
  ];
  function addListItem(pokemon) {
    let listItem = document.createElement("li");
    let ul = document.querySelector(".pokemon-list");
    let button = document.createElement("button");
    button.classList.add("poke-button");
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    ul.appendChild(listItem);
  }
  function showDetails(pokemon) {
    console.log(pokemon)
  

  }
  return {
    add: function (pokemon) {
      pokemonList.push(pokemon);
    },
    getAll: function () {
      return pokemonList;
    },
    addListItem: addListItem
  };
})();

