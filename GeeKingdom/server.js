import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Configurer EJS comme moteur de rendu
app.set('view engine', 'ejs');

//Servir les fichiers statiques (CSS,JS clients)
app.use(express.static('public'));

//Page d'accueil
app.get('/', (req, res) => {
    res.render('index', { title: 'Bienvenue à GeeKingdom' });
});

// Route pour appeler l'API Spring Boot
app.get('/api/data', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8080/api/data');
        const data = await response.json();
        res.render('api', { data });
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
        res.status(500).send('Erreur serveur');
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
