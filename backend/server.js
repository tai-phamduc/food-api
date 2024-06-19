const express = require("express")
const app = express()
const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")

mongoose.connect("mongodb+srv://admin:123@supportdesk.ergkcm6.mongodb.net/?retryWrites=true&w=majority&appName=supportdesk")
  .then(() => console.log("Successfully connect to mongod"))
  .catch((err) => console.log("Cannot connect to mongod", err))

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true},
  avatar: { type: String, required: true},
  photos: { type: Array, required: true},
  type: { type: String, required: true, enum: ["$", "$$", "$$$"]},
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true}
})
const FoodModel = mongoose.model("Food", FoodSchema)

const authHandler = ( req, res, next) => {
  let token
  if (req.headers.authorization) {
    token = req.headers.authorization.toString().split(" ")[1]
    if (token != "youtube") {
      console.log("Youtube")
      res.status(401)
      throw new Error("Not authorized")
    }
  }
  if (!token) {
    res.status(401)
    throw new Error("Not authorized")
  }
  next()
}

app.get("/api/foods", authHandler, asyncHandler(async (req, res) => {
  const foods = await FoodModel.find({})
  res.status(200).json(foods)
}))

const errorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500
  res.status(status)
  res.json({ message: err.message})
}

app.use(errorHandler)

app.listen(5000, () => {
  console.log("Port 5000 has been started")
})

module.exports = app