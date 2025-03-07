const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  productos: [
    {
      idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productos",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
    },
  ],
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Carrito", CarritoSchema);
