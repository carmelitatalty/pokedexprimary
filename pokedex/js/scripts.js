let pokemonRepository = (function () {
  let pokemonList = [];
  let offset = 1;
  let limit = 150;
  let totalCount = 0;

  function loadPagedList(_offset = 1, _limit = 150) {
    offset = _offset;
    limit = _limit;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    console.log(url);

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        totalCount = json.count;
        pokemonList = [];
        console.log(json);
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          pokemonList.push(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  return {
    getAll: function () {
      return pokemonList;
    },

    loadPagedList: loadPagedList,
    getOffset: function () {
      return offset;
    },
    getLimit: function () {
      return limit;
    },
    getTotalCount: function () {
      return totalCount;
    },
  };
})();

let pokemonUI = (function () {
  function loadUpdatedMenu() {
    let dropdownMenu = document.querySelector("#poke-page-dropdown");
    while (dropdownMenu.firstChild) {
      dropdownMenu.removeChild(dropdownMenu.firstChild);
    }

    let count = pokemonRepository.getTotalCount();
    let offset = pokemonRepository.getOffset();
    let limit = pokemonRepository.getLimit();
    while (offset < count) {
      console.log(offset);
      let max = offset + limit;

      if (max > count) {
        max = count;
      }

      let li = document.createElement("li");
      li.classList.add("nav-item");
      li.textContent = `${offset + 1} - ${max}`;
      let _offset = offset;
      li.addEventListener("click", () => {
        pokemonApp.loadPokemon(_offset, limit);
      });

      dropdownMenu.appendChild(li);
      offset += limit;
    }
  }

  function addListItem(pokemon) {
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    let ul = document.querySelector(".list-group");

    let button = document.createElement("button");

    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#exampleModal");
    button.setAttribute("data-pokemon-name", pokemon.name);
    button.setAttribute("data-pokemon-url", pokemon.detailsUrl);
    console.log(JSON.stringify(pokemon));

    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("text-capitalize");
    button.innerText = `${pokemon.name}`;
    listItem.appendChild(button);

    let pokemonListDiv = $("#pokemon-list");
    let pokemonItem = $('<div class="poke-item"></div>');
    let pokeballButton = $(
      `<button type="button" class="img-fluid poke-button btn btn-link" data-toggle="modal" data-target="#exampleModal" data-pokemon-name="${pokemon.name}" data-pokemon-url="${pokemon.detailsUrl}"></button>`
    );

    pokemonItem.append(pokeballButton);

    let pokeballImg = $(
      `<img class="img-fluid pokeball" src="img/one018e_51_e01.jpg" alt="${pokemon.name}" />`
    );
    pokeballButton.append(pokeballImg);

    let pokeName = $(
      `<div class="pokeball-name text-capitalize text-center">${pokemon.name}</div>`
    );

    pokeballButton.append(pokeName);

    pokemonListDiv.append(pokemonItem);
  }
  let loadUpdatedList = function () {
    $(".list-group").empty();
    $("#pokemon-list").empty();

    let pokemonList = pokemonRepository.getAll();
    console.log(pokemonList);
    pokemonList.forEach(function (pokemon) {
      pokemonUI.addListItem(pokemon);
    });
  };

  return {
    addListItem: addListItem,
    loadUpdatedMenu: loadUpdatedMenu,
    loadUpdatedList: loadUpdatedList,
  };
})();

let pokemonApp = (function () {
  let menuLoaded = false;

  let loadPokemon = function (offset = 0, limit = 150) {
    console.log(`Loading pokemon ${offset}: ${limit}`);
    pokemonRepository.loadPagedList(offset, limit).then(() => {
      pokemonUI.loadUpdatedList();

      if (!menuLoaded) {
        pokemonUI.loadUpdatedMenu();
        menuLoaded = true;
      }
    });
  };

  return {
    loadPokemon,
  };
})();

pokemonApp.loadPokemon();

$("#exampleModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var pokemonName = button.data("pokemon-name");
  var url = button.data("pokemon-url");
  console.log(JSON.stringify(url));
  var modal = $(this);
  modal.find(".modal-title").text("" + pokemonName);

  var pokemonHeight = modal.find("#pokemon-height");
  var pokemonTypes = modal.find("#pokemon-types");
  var pokemonImg = modal.find("#pokemon-img");

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then((pokemon) => {
      pokemonHeight.text(pokemon.height);
      pokemonTypes.empty();

      pokemon.types.forEach(function (type) {
        let typeElement = document.createElement("li");
        typeElement.innerText = type.type.name;
        pokemonTypes.append(typeElement);
      });

      pokemonImg.attr("src", pokemon.sprites.front_default);
    });
});
