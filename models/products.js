import mongoose from "mongoose"

const productsSchema = mongoose.Schema({
    name : String,
    price : Number,
    description : String,
    discount : Number,
    lastPrice : Number
  })

  const Products = mongoose.model("products", productsSchema)

  export default Products