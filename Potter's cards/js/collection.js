document.getElementById("span-collection-email").textContent =
  localStorage.email;

document.getElementById("span-collection-boosters").textContent =
  localStorage.boostersOuverts;
document.getElementById("span-collection-rares").textContent =
  localStorage.raresPossessed;

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");


document.addEventListener("DOMContentLoaded", async () => {

  try {
    const allCardsListing = await fetch(
      "https://hp-api.lainocs.fr/characters"
    );
    const allCardsData = await allCardsListing.json();

    const response = await fetch(
      `http://localhost:3000/user/${userId}/owned-cards`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Impossible de fetch user ownedCards");
    }
    const { ownedCards, ownedCardsLength } = await response.json();
    document.getElementById("span-collection-cards").textContent =
      ownedCardsLength;

    const userOwnedCards = allCardsData.filter((card) =>
      ownedCards.includes(card.id)
    );

    displayCards(userOwnedCards);
  } catch (error) {
    console.error("Impossible de fetch/d'afficher user ownedCards:", error);
  }
});

function displayCards(cards) {
  document.querySelector("main").innerHTML = "";

  cards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("design_cards_divs");

    const cardLink = document.createElement("a");
    cardLink.classList.add("design_cards_link");
    cardLink.href = `details.html?id=${card.slug}`;
    cardLink.textContent = "Détails";

    cardDiv.style.backgroundImage = `url(${card.image})`;

    cardDiv.appendChild(cardLink);
    document.querySelector("main").appendChild(cardDiv);
  });
}

document
  .getElementById("delete_cards_button")
  .addEventListener("click", async function () {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${userId}/delete-owned-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de supprimer ownedCards");
      }

      window.location.reload()
      const data = await response.json();
      console.log("Cartes supprimées:", data);
    } catch (error) {
      console.error("Erreur pour supprimer ownedCards:", error.message);
    }
  });
