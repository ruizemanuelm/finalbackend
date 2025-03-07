// controllers/productController.js
const Product = require("../models/Productos");
const Categoria = require("../models/Categoria");

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde la URL
    const product = await Product.findById(id).populate("categoria"); // Buscar en la BD

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoria");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({ category: categoryId }).populate("categoria");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
