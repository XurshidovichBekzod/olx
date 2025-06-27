const API_URL = "https://6852a7200594059b23ce857f.mockapi.io"
const wrapperEl = document.querySelector(".wrapper")
const formEl = document.querySelector(".popUp")
const openModalBtn = document.querySelector(".car")
const closeModalBtn = document.querySelector(".cancle")

const inputNameEl = document.querySelector("#CarName")
const inputBrandEl = document.querySelector("#CarBrand")
const inputColorEl = document.querySelector("#CarClour")
const inputPriceEl = document.querySelector("#CarPrice")



async function fetchData(endpoint, callback) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, { method: "GET" })
        const data = await response.json()
        callback(data)
    } catch (err) {
        console.error(err)
    }
}

function createCard(data) {
    wrapperEl.innerHTML = ""
    const fr = document.createDocumentFragment()
    data.forEach((car) => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `
            <img src=${car.image} alt="">
            <div class="text">
                <h3 class="carName">${car.name}</h3>
                <p class="carBrand">Brand: ${car.brand}</p>
                <p class="carColor">Color: ${car.color}</p>
                <p class="carPrice">Price: ${car.price}$</p>
                <button data-id="${car.id}" name="delete-btn" class="btn">O'chirish</button>
            </div>
        `
        fr.appendChild(div)
    })
    wrapperEl.appendChild(fr)
}

window.onload = () => {
    fetchData("/car", createCard)
}

openModalBtn.addEventListener("click", () => {
    formEl.classList.remove("active")
})

closeModalBtn.addEventListener("click", () => {
    formEl.classList.add("active")
})

formEl.addEventListener("submit", (event) => {
    event.preventDefault()

    const newCar = {
        name: inputNameEl.value,
        brand: inputBrandEl.value,
        color: inputColorEl.value,
        price: Number(inputPriceEl.value)
    }

    fetch(`${API_URL}/car`, {
        method: "POST",
        body: JSON.stringify(newCar),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        inputNameEl.value = ""
        inputBrandEl.value = ""
        inputColorEl.value = ""
        inputPriceEl.value = ""
        formEl.classList.add("active")
        fetchData("/car", createCard)
    })
    .catch(err => console.error(err))
})
wrapperEl.addEventListener("click", (event) => {
    if (event.target.name === "delete-btn") {
        const id = event.target.dataset.id

        fetch(`${API_URL}/car/${id}`, { method: "DELETE" })
            .then(() => {
                wrapperEl.innerHTML = null
                fetchData("/car", createCard)
            })
            .catch(err => console.error(err))
    }
})
