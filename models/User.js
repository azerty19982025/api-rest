const mongoose = require('mongoose');

// 📌 Définition du schéma utilisateur
const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
});

// 📌 Export du modèle pour pouvoir l'utiliser dans server.js
module.exports = mongoose.model('User', UserSchema);
