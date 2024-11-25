import mongoose from "mongoose"

const productsSchema = mongoose.Schema({
    name : String,
    price : Number,
    description : String
  })

  const Products = mongoose.model("products", productsSchema)

  export default Products