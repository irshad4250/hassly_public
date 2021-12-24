require("dotenv").config()
var fs = require("fs")

const Item = require("./models/item")
const express = require("express")
const mongoose = require("mongoose")
const { MongoClient } = require("mongodb")
const Cors = require("cors")
const BodyParser = require("body-parser")
const mdbUri = process.env.MONGODB_URI
const client = new MongoClient(mdbUri)
const app = express()
let collection

mongoose
  .connect(mdbUri)
  .then(async () => {
    console.log("Connected to MongoDB")
    try {
      await client.connect().then(() => console.log("Connected to MongoDB 2"))
      collection = client.db("hassly").collection("items")
      app.listen(process.env.PORT || 5000, () => {
        console.log("Listening on PORT 5000")
      })
    } catch (e) {
      console.log(e)
    }
  })
  .catch((err) => {
    console.log(err)
  })

app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static("public"))
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
app.use(Cors())
app.set("view engine", "ejs")


app.get("/", async (req, res) => {
  let kitchenCategory
  let electronicsCategory
  let clothingCategory

  await getOfCategory("Kitchen").then((result) => {
    kitchenCategory = result
  })
  await getOfCategory("Electronics").then((result) => {
    electronicsCategory = result
  })
  await getOfCategory("clothing").then((result) => {
    clothingCategory = result
  })

  //Getting latest category
  Item.find({})
    .sort("-createdAt")
    .limit(8)
    .exec((err, latest) => {
      res.render("index", {
        electronics: electronicsCategory,
        kitchen: kitchenCategory,
        clothing: clothingCategory,
        latest: latest,
      })
    })
})

async function getOfCategory(category) {
  //Aggregate that gets by category
  //uses mongodb atlas search indexes
  try {
    let result = await collection
      .aggregate([
        {
          $search: {
            index: "forHomeShowing",
            text: {
              query: category,
              path: {
                wildcard: "*",
              },
            },
          },
        },
        {
          $project: {
            title: 1,
            _id: 1,
            brand: 1,
            imageUrl: 1,
            price: 1,
          },
        },
      ])
      .toArray()
    return result
  } catch (e) {
    console.log(e)
  }
}

app.post("/new-item", (req, res) => {
  let tags = req.body.tags.split(" ")
  let condition = req.body.condition

  condition = capitalize(condition)
  console.log(condition)

  if (condition == "New" || condition == "Used") {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      tags: tags,
      shipping: req.body.shipping,
      price: req.body.price,
      quantity: 10,
      seller: req.body.seller,
      condition: condition,
      brand: req.body.brand,
      imageUrl: req.body.imageUrl,
    })

    item
      .save()
      .then((result) => {
        res.send("ITEM ADDED")
      })
      .catch((err) => {
        res.send("ITEM NOT ADDED")
        console.log(err)
      })
  } else {
    res.send("Condition value invalid")
  }

  function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }
})

app.get("/new-item", (req, res) => {
  res.render("create")
})

app.get("/search", async (req, res) => {
  let searchVal = req.query.val

  //validation -- starts
  let minPrice = req.query.minPrice
  minPrice === "null" || minPrice === undefined
    ? (minPrice = null)
    : (minPrice = minPrice)

  let maxPrice = req.query.maxPrice
  maxPrice === "null" || maxPrice === undefined
    ? (maxPrice = null)
    : (maxPrice = maxPrice)

  let brand = req.query.brand
  brand === "null" || brand === undefined
    ? (brand = null)
    : (brand = capitalize(brand))

  function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }

  let category = req.query.category
  category === "null" || category === undefined
    ? (category = null)
    : (category = category)

  let condition = req.query.condition
  condition === "null" || condition === "Any" || condition === undefined
    ? (condition = null)
    : (condition = condition)

  let maxShip = req.query.maxShip
  maxShip === "null" || maxShip === undefined
    ? (maxShip = null)
    : (maxShip = maxShip)

  let val = req.query.val
  val === "null" || val === undefined ? (val = null) : (val = val)

  if (category != null && category != undefined) {
    val = null
  }
  //validation -- end

  //Where all the magic happpens
  //basically the project's heart

  let JSONarr = createJSON(
    minPrice,
    maxPrice,
    brand,
    category,
    condition,
    maxShip,
    val
  )



  let JSONnoUndefined = JSONarr.filter((a) => (a != undefined ? true : false))

  try {
    let result = await collection.aggregate(JSONnoUndefined).toArray()

    res.render("searchRes", {
      result: result,
      searchVal: searchVal,
      filters: {
        minPrice: minPrice,
        maxPrice: maxPrice,
        maxShip: maxShip,
        brand: brand,
        category: category,
        condition: condition,
      },
    })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }



  function getByCategorySearch(category) {
    if (category == null) {
      return
    }

    let JSON = {
      $search: {
        index: "forHomeShowing",
        text: {
          query: category,
          path: {
            wildcard: "*",
          },
          fuzzy: {},
        },
      },
    }

    return JSON
  }

  function getJSONforSearch(searchVal) {
    if (searchVal == null) {
      return
    }

    let JSON = {
      $search: {
        index: "hasslyNoFilterSearch",
        text: {
          query: searchVal,
          path: {
            wildcard: "*",
          },
          fuzzy: {
            maxEdits: 2,
            prefixLength: 4,
          },
        },
      },
    }

    return JSON
  }

  //the filter functions will return a $match JSON
  //else if the parameter is null it returns undefined

  //for filter
  function getJSONStringForBrand(brand) {
    if (brand == null) {
      return
    }

    let JSON = {
      $match: {
        brand: brand,
      },
    }

    return JSON
  }

  //for filter
  function getPricingJSON(min, max) {
    if (max == null || min == null) {
      return
    }

    let minPrice = parseInt(min)
    let maxPrice = parseInt(max)

    let JSON = {
      $match: {
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      },
    }

    return JSON
  }

  //for filter
  function maxShippingJSON(max) {
    if (max == null) {
      return
    }

    let maxPrice = parseInt(max)

    let JSON = {
      $match: {
        shipping: {
          $lte: maxPrice,
        },
      },
    }

    return JSON
  }

  //for filter
  function conditionJSON(cond) {
    if (cond == null) {
      return
    }

    let JSON = {
      $match: {
        condition: cond,
      },
    }

    return JSON
  }

  function createJSON(
    minPrice,
    maxPrice,
    brand,
    category,
    condition,
    maxShip,
    searchVal
  ) {
    let JSONFINAL = []

    JSONFINAL.push(getJSONforSearch(searchVal))
    JSONFINAL.push(getByCategorySearch(category))
    JSONFINAL.push(getJSONStringForBrand(brand))
    JSONFINAL.push(getPricingJSON(minPrice, maxPrice))
    JSONFINAL.push(maxShippingJSON(maxShip))
    JSONFINAL.push(conditionJSON(condition))

    return JSONFINAL
  }
})

app.get("/view/:id", async (req, res) => {
  let id = req.params.id
  try {
    let object = await Item.findById(id)
    res.render("viewItem", { result: object })
  } catch {
    res.render("404")
  }
})

app.post("/axiosautocomplete", async (req, res) => {
  if (req.body.val == "" || req.body.val.length < 3) {
    res.send([])
  } else {
    let result = await collection
      .aggregate([
        {
          $search: {
            index: "hasslyAutoComplete",
            autocomplete: {
              query: req.body.val,
              path: "title",
              tokenOrder: "sequential",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 18,
              },
            },
          },
        },
        { $limit: 10 },
      ])
      .toArray()

    res.send(result)
  }


})

app.get("/write", async (req, res) => {
  let result = await Item.find()
  fs.writeFileSync("products.txt", "")
  result.forEach((ress, i) => {
    fs.appendFileSync(
      "products.txt",
      i + 1 + ". " + "Title: " + ress.title + "\n"
    )
    fs.appendFileSync("products.txt", "Categories: ")
    ress.tags.forEach((tag) => {
      fs.appendFileSync("products.txt", tag + ",")
    })
    fs.appendFileSync("products.txt", "\n\n")
  })
  res.send("Wrote")
})

app.get("*", function (req, res) {
  res.status(404).render("404")
})
