let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  function addListItem(pokemon) {
    let listItem = document.createElement("li");
    let ul = document.querySelector(".pokemon-list");
    let button = document.createElement("button");
    button.addEventListener("click", function (event) {
      showDetails(pokemon);
    });
    button.classList.add("poke-button");
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    ul.appendChild(listItem);
  }
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function (response) {
      console.log(pokemon);
    });
  }
  function loadDetails(pokemon) {
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // Now we add the details to the item
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  function add(pokemon){
        pokemonList.push(pokemon);
  }
  return {
    add: add,   
    getAll: function () {
      return pokemonList;
    },
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
