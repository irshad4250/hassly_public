//Contains only functions linked to styling
//home.js contains functional

function searchBoxDesignManager() {
  let searchli = document.getElementsByClassName("searchli")[0]
  let searchScreen = document.querySelector(".searchScreen")

  let opened = false
  let openedQ = false

  searchli.addEventListener("click", () => {
    if (opened == false) {
      opened = true
      searchScreen.style.transform = "translateY(0)"
      searchli.innerText = "Close"
    } else {
      closeQueryBox()
      openedQ = false
      opened = false
      searchScreen.style.transform = "translateY(-100%)"
      searchli.innerText = "Search"
    }
  })

  function closeQueryBox() {
    let queryBox = document.getElementsByClassName("queryBox")[0]
    queryBox.style.transform = "translateX(110%)"
    setTimeout(() => {
      queryBox.style.display = "none"
    }, 500)
    openedQ = false
  }

  function openQueryBox() {
    let queryBox = document.getElementsByClassName("queryBox")[0]
    queryBox.style.display = "flex"
    setTimeout(() => {
      queryBox.style.transform = "translateX(0)"
    }, 50)
    openedQ = true
  }

  let closeQueryButton = document.getElementsByClassName("closeQueryButton")[0]
  closeQueryButton.addEventListener("click", () => {
    closeQueryBox()
  })

  let filterButton = document.getElementsByClassName("filterButton")[0]
  filterButton.addEventListener("click", () => {
    if (openedQ) {
      closeQueryBox()
    } else {
      openQueryBox()
    }
  })
}
searchBoxDesignManager()

function chooseCondition() {
  let conditionBox = document.getElementsByClassName("conditionInput")[0]
  let selectionBox = document.getElementsByClassName("conditionSelection")[0]
  conditionBox.addEventListener("click", () => {
    selectionBox.style.display = "flex"
    selectionBox.style.transform = "scale(1)"
  })

  let anyButton = selectionBox.querySelectorAll("li")[0]
  let newButton = selectionBox.querySelectorAll("li")[1]
  let usedButton = selectionBox.querySelectorAll("li")[2]

  anyButton.onclick = () => {
    closeBox("Any")
  }
  newButton.onclick = () => {
    closeBox("New")
  }
  usedButton.onclick = () => {
    closeBox("Used")
  }

  function closeBox(choice) {
    selectionBox.style.transform = "scale(0)"
    document.getElementsByClassName("conditionInput")[0].innerText = choice
    setTimeout(() => {
      selectionBox.style.display = "none"
    }, 200)
  }
}
chooseCondition()

function showingsCode(imageUrl, title, price) {
  return ` 
        <div class="itemBox">
          <div class="itemBoxFlex">
            <div class="itemBoxPicture">
              <img
                class="itemBoxImg"
                src="${imageUrl}"
              />
            </div>
            <div class="itemBoxTitle">
              ${title}
            </div>
            <div class="itemBoxPrice">${price}</div>
          </div>
        </div>

  `
}

function addShowings(imageUrl, title, price, addto) {
  let frag = document
    .createRange()
    .createContextualFragment(showingsCode(imageUrl, title, price))

  let box = document.getElementById(addto)

  box.appendChild(frag)
}

function doToastMessage(text) {
  let toastMessageBox = document.getElementsByClassName("toastMessage")[0]
  toastMessageBox.innerText = text
  toastMessageBox.style.opacity = "1"
  toastMessageBox.style.bottom = "30px"

  setTimeout(() => {
    toastMessageBox.style.opacity = "0"
    toastMessageBox.style.bottom = "-35px"
  }, 2500)
}

function ShowToastMessage(text) {
  let toastMessageBox = document.getElementsByClassName("toastMessage")[0]
  toastMessageBox.innerText = text
  toastMessageBox.style.opacity = "1"
  toastMessageBox.style.bottom = "30px"
}

function hideToastMessage() {
  let toastMessageBox = document.getElementsByClassName("toastMessage")[0]
  toastMessageBox.style.opacity = "0"
  toastMessageBox.style.bottom = "-35px"
}

function categoryWarning() {
  let category = document.querySelector(".categoryInput")

  category.addEventListener("click", () => {
    if (category.checked) {
      ShowToastMessage("You are searching by category")
    } else {
      hideToastMessage()
    }
  })
}
categoryWarning()
