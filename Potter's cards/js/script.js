
navLi = document.querySelectorAll("nav li")
iconsId = document.getElementById("icons")
nav = document.querySelector("nav")

    // MENU BURGER

iconsId.addEventListener("click", () => {
    nav.classList.toggle("active")
})

navLi.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("active")
    })
})


    // Fenêtre de Trade


const tradeWindow = document.getElementById("trade-window")
const btnTrade = document.getElementById("icon-trade")

const btnTradeClose = document.getElementById("trade-window-close")

btnTrade.addEventListener("click", () => {
    tradeWindow.style.display = "initial"
})

btnTradeClose.addEventListener("click", () => {
    tradeWindow.style.display = "none"
})