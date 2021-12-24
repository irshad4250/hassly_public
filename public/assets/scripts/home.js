//Contains navbar and search scripts for every screen
//Should have been named as navbar.js
let choice = "Any"

function conditionSelection() {
  let selectionBox = document.getElementsByClassName("conditionSelection")[0]

  let anyButton = selectionBox.querySelectorAll("li")[0]
  let newButton = selectionBox.querySelectorAll("li")[1]
  let usedButton = selectionBox.querySelectorAll("li")[2]

  anyButton.addEventListener("click", () => {
    choice = "Any"
  })
  newButton.addEventListener("click", () => {
    choice = "New"
  })
  usedButton.addEventListener("click", () => {
    choice = "Used"
  })
  //Condition choice from selection Box
}
conditionSelection()

function autocompleteEventListener() {
  let searchBox = document.querySelector(".searchInput")

  searchBox.addEventListener("input", fetchAutocomplete)
}
autocompleteEventListener()

function autocompleteCode(id, autocomplete) {
  let li = document.createElement("li")
  li.innerText = autocomplete
  li.setAttribute("id", id)

  return li
}

function addAutocompleteSingle(autocomplete) {
  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0]

  let id = makeid(6)
  let code = autocompleteCode(id, autocomplete)
  autocompleteBox.appendChild(code)
  let selected = document.getElementById(id)
  selected.addEventListener("click", () => {
    window.location.href = createUrlSearchQuery(autocomplete)
  })
}

function makeid(length) {
  let result = ""
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function fetchAutocomplete() {
  let inputBox = document.querySelector(".searchInput")
  let inputVal = inputBox.value

  axios
    .post("http://localhost:5000/axiosautocomplete", { val: inputVal })
    .then((res) => {
      useArrayAddAutoComplete(res)
    })
}

function useArrayAddAutoComplete(array) {
  let arrayData = array.data

  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0]
  autocompleteBox.innerHTML = ""

  for (let i = 0; i < arrayData.length; i++) {
    const title = arrayData[i].title
    addAutocompleteSingle(title)
  }
}

function carrySearch() {
  //SELECTING CONDTION

  let searchButton = document.querySelector(".searchRealButton")
  let searchInput = document.querySelector(".searchInput")

  searchButton.addEventListener("click", doSearch)

  searchInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      doSearch()
    }
  })

  function doSearch() {
    let val = searchInput.value
    if (val == "") {
      return
    }
    window.location.href = createUrlSearchQuery(val)
  }
}
carrySearch()

function createUrlSearchQuery(searchValToPut) {
  let minPrice = document.querySelector(".minPrice").value
  minPrice === "" ? (minPrice = "null") : (minPrice = minPrice)

  let maxPrice = document.querySelector(".maxPrice").value
  maxPrice === "" ? (maxPrice = "null") : (maxPrice = maxPrice)

  let maxShip = document.querySelector(".maxShippingInput").value
  maxShip === "" ? (maxShip = "null") : (maxShip = maxShip)

  let brand = document.querySelector(".brandInput").value
  brand === "" ? (brand = "null") : (brand = brand)

  let category = document.querySelector(".categoryInput").checked

  category === false ? (category = "null") : (category = searchValToPut)

  let url = `search?val=${searchValToPut}&minPrice=${minPrice}&maxPrice=${maxPrice}&maxShip=${maxShip}&condition=${choice}&brand=${brand}&category=${category}`

  return url
}
