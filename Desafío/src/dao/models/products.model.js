import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  "title": String,
  "description": String,
  "price": Number,
  "code": {
    type: String,
    unique: true
  },
  "stock": Number,
  "status": Boolean,
  "category": {
    type: String,
    enum: ["Ropa", "Perfumes", "Bebida", "Electrónica"],
    default: "Ropa"
  },
  "thumbnail": String // Corregido el nombre del campo a 'thumbnail'
})

productsSchema.plugin(mongoosePaginate);

const ProductsModel = mongoose.model(productsCollection, productsSchema);

export default ProductsModel;
