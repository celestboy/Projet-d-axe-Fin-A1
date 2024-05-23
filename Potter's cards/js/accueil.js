const boostersDispoSpan = document.getElementById("boosters_dispo_span");
const openBoosterBtn = document.getElementById("open_booster_btn");
const userId = localStorage.userId;
let boostersDispo = 0;
let deck = [];


// if (!localStorage.getItem("lastOpening")) {
//   boostersDispo = 1;
//   boostersDispoSpan.textContent = "1";
// } else {
//   boostersDispoSpan.textContent = "0";
// }

function openBoosterBtnActivated() {
  if (boostersDispo == 0 || !boostersDispo) {
    openBoosterBtn.style.background = "rgba(80, 80, 80, 0.7)";
    openBoosterBtn.style.color = "rgb(50, 50, 50)";
    openBoosterBtn.textContent = "Indisponible";
  } else {
    openBoosterBtn.style.background = "";
    openBoosterBtn.style.color = "";
    openBoosterBtn.textContent = "Ouvrir un booster";
  }
}

// timer
async function timeLeftFunction() {
  const lastOpening = await fetchTimerFromBackend(userId);

  if (
    !lastOpening ||
    Date.now() - new Date(lastOpening).getTime() > 24 * 60 * 60 * 1000
  ) {
    boostersDispo = 1;
  } else {
    const timeLeft =
      24 * 60 * 60 * 1000 - (Date.now() - new Date(lastOpening).getTime());

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

    openBoosterBtnActivated();
    boostersDispo = 0

    document.getElementById(
      "time-left-p"
    ).textContent = `Temps restant : ${hours} heures, ${minutes} minutes, ${seconds} secondes.`;
  }

  boostersDispoSpan.textContent = boostersDispo;  
  setTimeout(timeLeftFunction, 1000);
}
timeLeftFunction();

// Algorithme génération de booster
function getRandom(nbCartes = 29) {
  let nbChoisi;
  let nbCartesRares = 0;
  let cartesDejaPrises = [];

  for (let i = 0; i < 5; i++) {
    nbChoisi = Math.round(Math.random() * (nbCartes - 1) + 1);

    while (cartesDejaPrises.includes(nbChoisi)) {
      nbChoisi = Math.round(Math.random() * (nbCartes - 1) + 1);
    }

    cartesDejaPrises.push(nbChoisi);
    deck.push(nbChoisi);

    if (nbChoisi >= 20) {
      nbCartesRares++;
    }

    if (nbCartesRares > 0) {
      nbCartes = 19;
    }
  }
  return deck;
}

// Ouverture de booster
openBoosterBtn.addEventListener("click", async () => {
  if (boostersDispo > 0) {
    const deck = getRandom();

    await sendDeckToBackend(userId, deck);

    if (!localStorage.boostersOuverts) {
      localStorage.setItem("boostersOuverts", 0);
    }

    let totalBoostersOuverts = JSON.parse(localStorage.boostersOuverts) + 1;
    localStorage.setItem("boostersOuverts", totalBoostersOuverts);
    

    const currentDate = new Date();

    const dateString = currentDate.toISOString();
    localStorage.setItem("lastOpening", dateString);
    await sendTimerToBackend(userId, dateString);
    timeLeftFunction();
    boostersDispo = 0;
    openBoosterBtnActivated();

    document.querySelector("swiper-container").style.display = "flex";

    for (let i = 0; i < deck.length; i++) {
      let swiperContainerCreator = document.createElement("swiper-slide");
      document
        .querySelector("swiper-container")
        .appendChild(swiperContainerCreator);

      let imgSwiperCreator = document.createElement("img");
      swiperContainerCreator.appendChild(imgSwiperCreator);

      let closeSwiperText = document.createElement("p");
      swiperContainerCreator.appendChild(closeSwiperText);
      closeSwiperText.classList.add("close_swiper_text");
      closeSwiperText.textContent = "fermer";

      async function fetchCards() {
        const url = `https://hp-api.lainocs.fr/characters`;
        const response = await fetch(url);
        const data = await response.json();
        displayCards(data);
      }

      function displayCards(cards) {
        cards.forEach((card) => {
          let numCarte = deck[i];
          if (card.id == numCarte) {
            imgSwiperCreator.src = card.image;
          }
        });
      }

      fetchCards();

      closeSwiperText.addEventListener("click", () => {
        document.querySelector("swiper-container").style.display = "none";
      });
    }
  } else {
    alert("vous n'avez plus de boosters disponibles!");
  }
  boostersDispoSpan.textContent = boostersDispo;
});

async function sendDeckToBackend(userId, deck) {
  try {
    const response = await fetch(
      `http://localhost:3000/user/${userId}/obtained-cards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deck: JSON.stringify(deck) }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur dans l'envoi de deck au serveur");
    }

    const data = await response.json();
    console.log("Deck envoyé au serveur:", data);
  } catch (error) {
    console.error("Erreur dans l'envoi de deck au serveur:", error.message);
  }
}

async function sendTimerToBackend(userId, timeLeft) {
  const data = JSON.stringify({ timeLeft });

  fetch(`http://localhost:3000/user/${userId}/actual-timer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Mauvaise réponse du serveur");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Erreur dans l'envoi du timer au serveur:", error);
    });
}

async function fetchTimerFromBackend(userId) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}/get-timer`);
    if (!response.ok) {
      throw new Error("Mauvaise réponse du serveur");
    }
    const data = await response.json();
    return data.timer;
  } catch (error) {
    console.error(
      "Erreur dans la récupération du timer depuis le serveur:",
      error
    );
  }
}







// Listing des cartes
async function fetchCards() {
  const url = `https://hp-api.lainocs.fr/characters`;
  const response = await fetch(url);
  const data = await response.json();
  displayAllCards(data);
}

function displayAllCards(cards) {
  let cardsListed = [];
  let cardsFavoritedTempo = [];
  if (localStorage.cardsFavorited) {
    cardsFavoritedTempo = JSON.parse(localStorage.cardsFavorited);
  }

  function favorisFunction() {
    localStorage.setItem("cardsFavorited", JSON.stringify(cardsFavoritedTempo));
  }

  document.getElementById("main-container").innerHTML = "";

  let favoritedCards = [];
  if (localStorage.cardsFavorited) {
    try {
      favoritedCards = JSON.parse(localStorage.cardsFavorited);
    } catch (error) {
      console.error(
        "Erreur pdt l'analyse du JSON dans localStorage.cardsFavorited:",
        error
      );
    }
  }

  cards.forEach((card) => {
    if (favoritedCards.includes(card.id)) {
      cardsListed.push(card.id);
    }
  });

  cards.forEach((card) => {
    if (!favoritedCards.includes(card.id)) {
      cardsListed.push(card.id);
    }
  });

  function affichageCartes() {
    cardsListed.forEach((e) => {
      let card = cards[e - 1];
      let createDiv = document.createElement("div");
      document.getElementById("main-container").appendChild(createDiv);
      createDiv.classList.add("design_cards_divs");

      let createLink = document.createElement("a");
      createDiv.appendChild(createLink);
      createLink.classList.add("design_cards_links");
      createLink.href = `details.html?id=${card.slug}`;
      createLink.textContent = "détails";

      let createStarContainer = document.createElement("div");
      createStarContainer.classList.add("design_cards_star-container");
      createDiv.appendChild(createStarContainer);

      let isFavorited = cardsFavoritedTempo.includes(card.id);

      createStarContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">${
        isFavorited
          ? `<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>`
          : `<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1.1"/>`
      }
      </svg>`;

      createStarContainer.addEventListener("click", () => {
        if (!cardsFavoritedTempo.includes(card.id)) {
          cardsFavoritedTempo.push(card.id);
          isFavorited = true;
        } else {
          const index = cardsFavoritedTempo.indexOf(card.id);
          if (index > -1) {
            cardsFavoritedTempo.splice(index, 1);
            isFavorited = false;
          }
        }

        createStarContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">${
          isFavorited
            ? `<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>`
            : `<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1.1"/></svg>`
        }</svg>`;

        favorisFunction();
        displayAllCards(cards);
      });

      createDiv.style.backgroundImage = `url(${card.image})`;

      if (card.house === "Gryffindor") {
        createDiv.style.border = "solid 4px rgb(222, 35, 35)";
      } else if (card.house === "Slytherin") {
        createDiv.style.border = "solid 4px rgb(34, 175, 34)";
      } else if (card.house === "Hufflepuff") {
        createDiv.style.border = "solid 4px rgb(255, 255, 11)";
      } else if (card.house === "Ravenclaw") {
        createDiv.style.border = "solid 4px rgb(0, 119, 255)";
      } else {
        createDiv.style.border = "solid 4px grey";
      }
    });
  }

  affichageCartes();

  //boutons filtres maisons
  document.querySelectorAll(".filtre-house-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("main-container").innerHTML = "";
      cardsListed = [];
      const house = button.dataset.house;

      for (let i = 0; i < cards.length - 2; i++) {
        let card = cards[i];

        if (card.house == house) {
          if (localStorage.cardsFavorited.includes(card.id)) {
            cardsListed.unshift(card.id);
          } else {
            cardsListed.push(card.id);
          }
        }
      }
      affichageCartes();
    });
  });
  //bouton réinitialise filtre maisons
  document
    .getElementById("filtre-house-btn-all")
    .addEventListener("click", () => {
      document.getElementById("main-container").innerHTML = "";
      fetchCards();
    });

  //searchbar
  document.getElementById("searchbar").addEventListener("input", () => {
    let cardsListedTempo = [];

    let recherche = document.getElementById("searchbar").value.toLowerCase();
    for (let i = 0; i < cards.length - 2; i++) {
      let card = cards[i];
      if (card.name.toLowerCase().includes(recherche)) {
        if (localStorage.cardsFavorited.includes(card.id)) {
          cardsListedTempo.unshift(card.id);
        } else {
          cardsListedTempo.push(card.id);
        }
      }
    }
    cardsListed = cardsListedTempo;
    document.getElementById("main-container").innerHTML = "";
    affichageCartes();
  });
}

fetchCards();
