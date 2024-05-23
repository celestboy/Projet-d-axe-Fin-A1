const params = new URLSearchParams(window.location.search);
const cardId = params.get("id");

async function fetchCard(id) {
  const url = `https://hp-api.lainocs.fr/characters/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  displayCard(data);
}



function displayCard(card) {
  const template = document.getElementById("card-details");

  
  template.querySelector(".card-image").src = card.image;
  template.querySelector(".card-name").textContent = card.name;
  template.querySelector(".card-actor").textContent = card.actor + " (acteur)";
  template.querySelector(".card-house").textContent = "Maison : " + card.house;
  template.querySelector(".card-wand").textContent = "Baguette magique : " + card.wand;
  template.querySelector(".card-role").textContent = "Statut : " + card.role;

  if (card.house == "") {
    template.querySelector(".card-house").textContent = "Maison : N/A";
  }
  if (card.wand == "") {
    template.querySelector(".card-wand").textContent = "Baguette magique : N/A";
  }
  if (card.role == "") {
    template.querySelector(".card-role").textContent = "Statut : N/A";
  }


  // ENVOIE A THONNY

  const url = "http://192.168.177.64:3000";
  const data = { house: card.house };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      console.log("Maison envoyée à Thonny");
    } else {
      console.error("l'envoi à Thonny échoué");
    }
  })
  .catch((error) => {
    console.error("l'envoi à Thonny échoué:", error);
  });

    // A ENVOYE A THONNY

}

fetchCard(cardId);


function goBack() {
  var previousURL = sessionStorage.getItem("previousURL");
  if (previousURL) {
    window.location.href = previousURL;
  } else {
    window.location.href = "accueil.html";
  }
}

document.getElementById("back-button").addEventListener("click", goBack);

sessionStorage.setItem("previousURL", document.referrer);