// server.js (ES Module)
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Exemple de route pour tester le back-end Node
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur Express fonctionne !' });
});

// === Proxy vers ton API Java Spring Boot ===
app.get('/api/java/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const response = await fetch(`http://localhost:8080/${endpoint}`); // ton API Java
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la communication avec l’API Java' });
  }
});

// === Production: servir le build React ===
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Serveur Node en écoute sur http://localhost:${PORT}`);
});
