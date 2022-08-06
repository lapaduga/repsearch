document.addEventListener("DOMContentLoaded", () => {
  function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
  }

  const hint = document.querySelector(".app__hint");
  const list = document.querySelector(".app__list");
  const tempArr = [];
  const storageArr = [];

  async function getData(value) {
    let data = await fetch(
      `https://api.github.com/search/repositories?q=${value}`
    );
    let response = await data.json();
    let output = "";

    for (let i = 0; i < 5; i++) {
      const element = response.items[i];
      if (element) {
        output += `<a href="#" data-id="${element.id}">${element.name}</a>`;
        tempArr[i] = {
          id: element.id,
          name: element.name,
          owner: element.owner.login,
          stars: element.stargazers_count,
        };
      }
    }

    hint.innerHTML = output;
    hint.style.display = "block";

    if (response.items.length === 0) {
      hint.innerHTML = "";
      hint.style.display = "none";
    }
  }

  const debounceData = debounce(getData, 1000);

  const input = document.getElementById("search-input");

  input.addEventListener("keyup", (event) => {
    if (event.target.value) {
      debounceData(event.target.value);
    } else {
      hint.innerHTML = "";
      hint.style.display = "none";
      return;
    }
  });

  hint.addEventListener("click", (event) => {
    event.preventDefault();
    let rep = event.target.closest("a");

    if (!rep) return;

    if (storageArr.length === 0) {
      list.textContent = "";
    }

    tempArr.forEach((element) => {
      if (+rep.dataset.id === element.id) {
        list.insertAdjacentHTML(
          "afterbegin",
          `<li class="app__item" data-id="${element.id}">
						<div class="app__info">
							<p>Name: ${element.name}</p>
							<p>Owner: ${element.owner}</p>
							<p>Stars: ${element.stars}</p>
						</div>
						<button class="app__del">Delete</button>
					</li>`
        );
        storageArr.push(element);
        input.value = "";
        hint.innerHTML = "";
        hint.style.display = "none";
      }
    });
  });

  list.addEventListener("click", (event) => {
    event.preventDefault();
    let delBtn = event.target.closest(".app__del");

    if (!delBtn) return;
    storageArr.forEach((element, i) => {
      if (+delBtn.closest(".app__item").dataset.id === element.id) {
        storageArr.splice(i, 1);
        delBtn.closest(".app__item").remove();
      }
    });

    if (storageArr.length === 0) {
      list.textContent = "Список пуст";
    }
  });
});
