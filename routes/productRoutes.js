const express = require("express");
const Product = require("../models/Productos");

const router = express.Router();

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID desde la URL
        const producto = await Product.findById(id).populate("categoria"); // Buscar en la BD

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const productos = await Product.find().populate("categoria");
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener productos por categoría
router.get("/category/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId; // Obtener el ID de la categoría de los parámetros de la ruta
        const productos = await Product.find({ categoria: categoryId }).populate("categoria");
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un producto
router.post("/", async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
