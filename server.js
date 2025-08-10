// 📌 Import des modules nécessaires
require('dotenv').config(); // Charger les variables d'environnement depuis .env
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import du modèle utilisateur

// 📌 Initialisation de l'application Express
const app = express();

// 📌 Middleware pour lire le JSON dans les requêtes
app.use(express.json());

// 📌 Connexion à MongoDB (Atlas ou local)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur connexion MongoDB :', err));

// ================== ROUTES CRUD ================== //

// 📌 GET — Récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Récupérer tous les docs de la collection
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 POST — Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body); // Créer un nouvel utilisateur à partir du JSON reçu
        await newUser.save(); // Sauvegarder dans la base
        res.status(201).json({ message: '✅ Utilisateur ajouté', data: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 📌 PUT — Modifier un utilisateur par ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.json({ message: '✏️ Utilisateur modifié', data: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 📌 DELETE — Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.json({ message: '🗑️ Utilisateur supprimé', data: deletedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 📌 Lancer le serveur
app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${process.env.PORT}`);
});
