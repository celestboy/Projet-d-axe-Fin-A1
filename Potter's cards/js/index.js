
btnConnexion = document.getElementById("btn_connexion");
btnInscription = document.getElementById("btn_inscription");
connexionForm = document.getElementById("connexion_form");
inscriptionForm = document.getElementById("inscription_form");

connexionReturn = document.getElementById("connexion_return");
inscriptionReturn = document.getElementById("inscription_return");


if (localStorage.getItem("email")) {
  document.getElementById("email_connexion").value =
    localStorage.getItem("email");
}
// BUTTONS CONNEXION / INSCRIPTION

btnConnexion.addEventListener("click", () => {
  btnConnexion.style.display = "none";
  btnInscription.style.display = "none";

  connexionForm.style.display = "initial";
});

btnInscription.addEventListener("click", () => {
  btnConnexion.style.display = "none";
  btnInscription.style.display = "none";

  inscriptionForm.style.display = "initial";
});

connexionReturn.addEventListener("click", () => {
  btnConnexion.style.display = "block";
  btnInscription.style.display = "block";
  connexionForm.style.display = "none";
});
inscriptionReturn.addEventListener("click", () => {
  btnConnexion.style.display = "block";
  btnInscription.style.display = "block";
  inscriptionForm.style.display = "none";
});




// Code connexion:

const formulaireConnection = document.getElementById("connexion_form");

formulaireConnection.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email_connexion").value;
  const password = document.getElementById("password_connexion").value;

  if (!email || !password) {
    alert("Veuillez compléter votre email & mdp");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("Login response data:", data);

    if (response.ok) {
      const token = data.token;
      const userId = data.user.id;
      console.log("Storing userId:", userId);

      localStorage.setItem("email", email);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      window.location.href = "collection.html";
    } else {
      alert(
        "Erreur de connexion : " +
          (data.error || "Données de connexion invalides")
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Erreur de connexion : Une erreur s'est produite");
  }
});



// Code inscription

const formulaireInscription = document.getElementById("inscription_form");

formulaireInscription.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email_inscription").value;
  const name = document.getElementById("pseudo_inscription").value;
  const password = document.getElementById("password_inscription").value;

  if (!email || !name || !password) {
    alert("Veuillez compléter tous les champs");
    return;
  }

  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (response.ok) {
    alert("Inscription réussie !");
    window.location.href = "index.html";
  } else {
    const errorMessage =
      data.message || "Une erreur s'est produite lors de l'inscription";
    alert(errorMessage);
  }
});
