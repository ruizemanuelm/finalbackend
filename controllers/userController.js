const jwt = require("jsonwebtoken");
const User = require("../models/Usuarios");
const express = require("express");

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, email, contrasena, direccion } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El usuario ya está registrado" });
        }

        // Crear nuevo usuario
        const nuevoUsuario = new User({
            nombre,
            apellido,
            email,
            contrasena,
            direccion,
        });

        await nuevoUsuario.save();

        // Generar el JWT
        const token = jwt.sign(
            { id: nuevoUsuario._id, email: nuevoUsuario.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: "Registro exitoso",
            usuario: {
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email,
                direccion: nuevoUsuario.direccion,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        if (usuario.contrasena !== contrasena) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar el JWT
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,  // Usar la clave secreta desde las variables de entorno
            { expiresIn: '30d' } // Expiración del token: 30 días
        );

        // Devolver el token
        res.json({
            message: "Login exitoso",
            usuario: {
                nombre: usuario.nombre,
                email: usuario.email,
            },
            token, // El token JWT que se enviará al cliente
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
