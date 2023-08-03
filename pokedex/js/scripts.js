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

  function add(pokemon) {
    pokemonList.push(pokemon);
  }
  return {
    add: add,
    getAll: function () {
      return pokemonList;
    },

    loadList: loadList,
  };
})();

let pokemonUI = (function () {
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

  let modalContainer = document.querySelector("#modal-container");
  function showModal(pokemon) {
    modalContainer.innerHTML = "";
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let container = document.querySelector("#image-container");

    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "Close";
    closeButtonElement.addEventListener("click", hideModal);
    modalContainer.addEventListener("click", (e) => {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
    window.addEventListener("keydown", (e) => {
      let modalContainer = document.querySelector("#modal-container");
      if (
        e.key === "Escape" &&
        modalContainer.classList.contains("is-visible")
      ) {
        hideModal();
      }
    });

    let dialogPromiseReject;
    function hideModal() {
      modalContainer.classList.remove("is-visible");
      if (dialogPromiseReject) {
        dialogPromiseReject();
        dialogPromiseReject = null;
      }
    }

    let titleElement = document.createElement("h1");
    titleElement.innerText = pokemon.name;

    let heightElement = document.createElement("div");
    heightElement.innerText = `Height:  ` + pokemon.height;

    let typesHeaderElement = document.createElement("div");
    typesHeaderElement.innerText = `Type`;

    let typesElement = document.createElement("ul");
    pokemon.types.forEach(function (type) {
      let typeElement = document.createElement("li");
      typeElement.innerText = type.type.name;
      typesElement.appendChild(typeElement);
    });

    let myImage = document.createElement("img");
    myImage.src = pokemon.imageUrl;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(heightElement);

    modal.appendChild(typesHeaderElement);
    modal.appendChild(typesElement);

    modalContainer.appendChild(modal);

    modal.appendChild(myImage);
    console.log(pokemon);
    modalContainer.classList.add("is-visible");
  }
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function (response) {
      showModal(pokemon);
    });
  }
  function loadDetails(pokemon) {
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return {
    addListItem: addListItem,
    loadDetails: loadDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonUI.addListItem(pokemon);
  });
});
