const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: String, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
  stock: Number,
  imagen: String,
  imagenes: [String],
  marca: String
}, { timestamps: true });

module.exports = mongoose.model("Productos", ProductSchema);
