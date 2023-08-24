let pokemonRepository = (function () {
  let pokemonList = [];
  let offset = 1;
  let limit = 150;
  let totalCount = 0;

  function loadPagedList(_offset = 1, _limit = 150) {
    offset = _offset;
    limit = _limit;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        totalCount = json.count;
        pokemonList = [];
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
  let numOfPages = 0;
  function loadUpdatedMenu() {
    let pagingList = $("#paging-list");

    let prev = $(
      '<li class="btn btn-light page-item page-link" id="paging-prev">Previous</a></li>'
    );
    
    prev.on('click', function() {
      pokemonApp.loadPrev()
    })

    pagingList.append(prev);

    let count = pokemonRepository.getTotalCount();
    let offset = pokemonRepository.getOffset();
    let limit = pokemonRepository.getLimit();
    let pageNumber = 1;
    while (offset < count) {
      const pNumber = pageNumber;
      let max = offset + limit;

      if (max > count) {
        max = count;
      }
      let li = $(`<li class="btn btn-light page-item page-link" id="paging-${pageNumber}">${pageNumber++}</li>`)
      pagingList.append(li)
      li.on('click', function() {
        pokemonApp.loadPokemon(pNumber, limit)
      })

      offset += limit;
    }
    numOfPages=pageNumber;

    let next = $(
      '<li class="btn btn-light page-item page-link" id="paging-next">Next</li>'
    );
    
    next.on('click', function() {
      pokemonApp.loadNext()
    })
    pagingList.append(next);
  }

  function updateMenuPage(pageNumber) {
    console.log(`Update page to ${pageNumber}`)
    let prevButton = $('#paging-prev');
    if (pageNumber === 1) {
      prevButton.addClass('disabled')
    } else {
      prevButton.removeClass('disabled')
      const pNumber = pageNumber - 1;
      prevButton.attr('data-page', pNumber)
      prevButton.data('page', pNumber)
    }

    let nextButton = $('#paging-next')
    if (pageNumber === numOfPages -1) { 
      nextButton.addClass('disabled')
    } else {
      nextButton.removeClass('disabled')
      const pNumber = pageNumber + 1;
      nextButton.attr('data-page', pNumber)
      nextButton.data('page', pNumber)
    }

    for (let i = 1; i < numOfPages+1; i++) {
      let pageButton = $(`#paging-${i}`)
      if (i == pageNumber) {
        pageButton.addClass('active')
      } else {
        pageButton.removeClass('active')
      }
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
      `<img class="img-fluid pokeball" src="img/pokeball.svg" alt="${pokemon.name}" />`
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
    pokemonList.forEach(function (pokemon) {
      pokemonUI.addListItem(pokemon);
    });
  };

  return {
    addListItem: addListItem,
    loadUpdatedMenu: loadUpdatedMenu,
    loadUpdatedList: loadUpdatedList,
    updateMenuPage: updateMenuPage
  };
})();

let pokemonApp = (function () {
  let menuLoaded = false;

  let loadPokemon = function (page = 1, limit = 150) {
    let offset = (page - 1) * limit;
    console.log(`Loading pokemon ${page} ${offset}: ${limit}`);
    pokemonRepository.loadPagedList(offset, limit).then(() => {
      pokemonUI.loadUpdatedList();

      if (!menuLoaded) {
        pokemonUI.loadUpdatedMenu();
        menuLoaded = true;
      }
      pokemonUI.updateMenuPage(page)
    });
  };

  let loadPrev = function() {
    const pNumber = $('#paging-prev').data('page')
    console.log(`prev: ${pNumber}`)
    loadPokemon(pNumber)
  }

  let loadNext = function() {
    const pNumber = $('#paging-next').data('page')
    console.log(`next: ${pNumber}`)
    loadPokemon(pNumber)
  }

  return {
    loadPokemon, loadPrev, loadNext
  };
})();

pokemonApp.loadPokemon();

$("#exampleModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var pokemonName = button.data("pokemon-name");
  var url = button.data("pokemon-url");
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
      let height = pokemon.height / 10;
      pokemonHeight.text(`${height} m`);
      pokemonTypes.empty();

      pokemon.types.forEach(function (type) {
        let typeElement = document.createElement("li");
        typeElement.innerText = type.type.name;
        pokemonTypes.append(typeElement);
      });

      pokemonImg.attr("src", pokemon.sprites.front_default);
    });
});
