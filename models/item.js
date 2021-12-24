const mongoose = require("mongoose")
const Schema = mongoose.Schema

const itemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
    shipping: { type: Number, require: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    seller: { type: String, required: true },
    condition: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
)

const Item = mongoose.model("Item", itemSchema)
module.exports = Item
