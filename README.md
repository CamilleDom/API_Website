# 👑 GeeKingdom

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)

> Plateforme e-commerce geek moderne avec API REST, React et MySQL

---
## Requirements

### Création d’un site web de commerce en ligne
- [x] Naviguer dans les catégories de produits.
- [x] Afficher les détails d’un produit (description, prix, photos).
- [x] Gérer un panier d’achats (ajouter, modifier ou supprimer des articles)
- [x] Finaliser une commande avec un système de paiement sécurisé
### Développement d’API internes pour les fonctionnalités du site
- [x] **Gestion des produits** : récupérer, ajouter, mettre à jour ou supprimer un produit.
- [x] **Gestion des commandes** : créer, mettre à jour, annuler et suivre les commandes.
- [x] **Gestion des utilisateurs** : inscription, connexion, modification de profil, suppres-
sion de compte et consultation de l’historique des commandes.
- [x] **Gestion des stocks** : vérifier et mettre à jour les niveaux de stock après chaque
commande.
- [x] **Gestion des paiements** : traiter et suivre les transactions
- [x] **Gestion des avis clients** : consulter, ajouter ou supprimer les avis et notes des
produits.
- [x] **Recommandation de produits** : proposer des produits basés sur l’historique
d’achat et les préférences utilisateur grâce à un moteur d’IA
- [x] **Gestion des livraisons** : suivre et mettre à jour l’état des livraisons
### Intégration d’une API externe
- [x] Localiser les magasins ou points de retrait proches de l’utilisateur
- [x] Proposer des recommandations personnalisées basées sur la position géogra-
phique et les préférences
### Création d’une documentation API
- [x] Fournir une documentation détaillée pour chaque API interne
- [x] Permettre à des développeurs tiers d’utiliser ces API pour créer des applications
externes.
- [x] Utiliser des outils comme Swagger ou Postman pour générer et tester la documen-
tation

---

## Table des matieres

- [Description](#description)
- [Fonctionnalites](#fonctionnalites)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Prerequis](#prerequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [API Documentation](#api-documentation)
- [Base de donnees](#base-de-donnees)
- [Frontend](#frontend)
- [Securite](#securite)
- [Scripts disponibles](#scripts-disponibles)
- [Resolution des problemes](#resolution-des-problemes)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Description

**GeeKingdom** est une plateforme e-commerce complete dediee aux produits geek. Elle offre une experience d'achat moderne avec gestion des utilisateurs, panier, commandes, paiements, avis et points de retrait.

### Objectifs du projet

- Creer une API REST robuste avec Spring Boot
- Developper une interface utilisateur reactive avec React
- Implementer un systeme d'authentification JWT securise
- Gerer efficacement les stocks et les commandes
- Offrir une experience utilisateur fluide et moderne

---

## Fonctionnalites

### Utilisateurs
- Inscription et connexion securisees
- Gestion du profil utilisateur
- Geolocalisation pour points de retrait
- Historique des commandes

### Produits
- Catalogue de produits par categories
- Recherche et filtres
- Fiches produits detaillees
- Gestion des stocks en temps reel
- Systeme de notation et avis

### Panier et Commandes
- Panier persistant (localStorage + API)
- Processus de commande en etapes
- Multiples methodes de paiement
- Suivi des livraisons

### Points de Retrait
- Recherche par ville
- Geolocalisation
- Affichage sur carte interactive

### Administration
- Gestion des produits et categories
- Suivi des commandes
- Gestion des stocks
- Moderation des avis

---

## Technologies

### Backend

| Technologie | Version | Description |
|-------------|---------|-------------|
| Java | 17 | Langage de programmation |
| Spring Boot | 3.5.6 | Framework backend |
| Spring Security | 6.x | Securite et authentification |
| Spring Data JPA | 3.x | Acces aux donnees |
| Hibernate | 6.x | ORM |
| JWT | - | Tokens d'authentification |
| Maven | 3.x | Gestionnaire de dependances |

### Frontend

| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.x | Bibliotheque UI |
| React Router | 6.x | Routage SPA |
| Context API | - | Gestion d'etat |
| CSS3 | - | Styles personnalises |

### Base de donnees

| Technologie | Version | Description |
|-------------|---------|-------------|
| MySQL | 8.0 | Base de donnees relationnelle |
| Docker | Latest | Conteneurisation |
| phpMyAdmin | Latest | Interface de gestion BDD |

### Outils

| Outil | Description |
|-------|-------------|
| Docker Desktop | Environnement de conteneurs |
| Node.js | Runtime JavaScript |
| npm | Gestionnaire de paquets |
| Git | Controle de version |

---

## Architecture

```
Project/
│
├── API_GeeKingdom/                 # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/demo/
│   │   │   │   ├── controllers/    # Controleurs REST
│   │   │   │   ├── models/         # Entites JPA
│   │   │   │   ├── repositories/   # Repositories Spring Data
│   │   │   │   ├── security/       # Configuration securite
│   │   │   │   └── ApiGeeKingdomApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── GeeKingdom/                     # Frontend et Serveur Node
│   ├── client/                     # Application React
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/         # Composants React
│   │   │   ├── context/            # Contextes (Auth, Cart)
│   │   │   ├── pages/              # Pages de l'application
│   │   │   ├── services/           # Services API
│   │   │   ├── styles/             # Fichiers CSS
│   │   │   ├── App.jsx
│   │   │   └── index.js
│   │   └── package.json
│   ├── server.js                   # Serveur Node.js
│   └── package.json
│
├── init-scripts/                   # Scripts SQL d'initialisation
│   └── init.sql
│
├── docker-compose.yml              # Configuration Docker
├── start-all.bat                   # Script de demarrage
├── stop-all.bat                    # Script d'arret
├── restart-all.bat                 # Script de redemarrage
├── status.bat                      # Script de statut
├── LICENSE                         # Licence MIT
└── README.md                       # Ce fichier
```

---

## Prerequis

Avant de commencer, assurez-vous d'avoir installe :

| Logiciel | Version minimale | Lien de telechargement |
|----------|------------------|------------------------|
| Java JDK | 17+ | https://adoptium.net/temurin/releases/?version=17 |
| Node.js | 18+ | https://nodejs.org/ |
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Git | Latest | https://git-scm.com/ |

### Verification des prerequis

```bash
# Verifier Java
java -version
# Attendu: openjdk version "17.x.x"

# Verifier Node.js
node -version
# Attendu: v18.x.x ou superieur

# Verifier Docker
docker --version
# Attendu: Docker version 24.x.x

# Verifier npm
npm -version
# Attendu: 9.x.x ou superieur
```

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/geekingdom.git
cd geekingdom
```

### 2. Configuration de la base de donnees

Le fichier docker-compose.yml est deja configure. Les identifiants par defaut sont :

| Parametre | Valeur |
|-----------|--------|
| Host | localhost |
| Port | 3306 |
| Database | geekingdom_db |
| User | geekingdom_user |
| Password | Api_Bdml_2025 |
| Root Password | root_password_change_me |

### 3. Installation des dependances

#### Backend (automatique avec Maven Wrapper)

```bash
cd API_GeeKingdom
mvnw.cmd clean install -DskipTests
cd ..
```

#### Frontend

```bash
cd GeeKingdom/client
npm install
cd ../..
```

#### Serveur Node.js

```bash
cd GeeKingdom
npm install
cd ..
```

### 4. Configuration de l'API

Verifiez le fichier API_GeeKingdom/src/main/resources/application.properties :

```properties
# Configuration MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/geekingdom_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=geekingdom_user
spring.datasource.password=Api_Bdml_2025

# Configuration JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## Lancement

### Methode rapide (Windows)

Double-cliquez sur start-all.bat ou executez :

```batch
start-all.bat
```

### Methode manuelle

#### Terminal 1 - Base de donnees (Docker)

```bash
docker-compose up -d
```

#### Terminal 2 - API Spring Boot

```bash
cd API_GeeKingdom
mvnw.cmd spring-boot:run
```

#### Terminal 3 - Serveur Node.js (optionnel)

```bash
cd GeeKingdom
node server.js
```

#### Terminal 4 - Client React

```bash
cd GeeKingdom/client
npm start
```

#### Terminal API - Alternative

```bash
fix_and_start_api.bat
```

### URLs d'acces

| Service         | URL | Description                 |
|-----------------|-----|-----------------------------|
| React           | http://localhost:3000 | Interface utilisateur       |
| API Spring Boot | http://localhost:8080 | API REST                    |
| Node.js         | http://localhost:5000 | Serveur intermediaire       |
| MySQL           | localhost:3306 | Base de donnees             |
| phpMyAdmin      | http://localhost:8081 | Gestion BDD                 |
| Swagger UI      | http://localhost:8080/swagger-ui/index.html#/ | Interface documentation API |
---

## API Documentation

### Authentification

| Endpoint | Methode | Description | Auth |
|----------|---------|-------------|------|
| /auth/register | POST | Inscription | Non |
| /auth/login | POST | Connexion | Non |
| /auth/profile/{id} | GET | Profil utilisateur | Oui |
| /auth/profile/{id} | PUT | Modifier profil | Oui |

#### Exemple - Inscription

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "motDePasse": "password123"
  }'
```

#### Exemple - Connexion

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "password123"
  }'
```

#### Exemple - Test Connexion web (Client)

```bash

    "email": lucas.dubois@email.fr,
    "password": qG9SuKXx2ng9X52
  }'
```

#### Exemple - Test Connexion web (Admin)

```bash
    email: admin@geekshop.fr,
    password: qG9SuKXx2ng9X52
```

### Categories

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/categories | GET | Liste des categories |
| /api/categories/{id} | GET | Details categorie |
| /api/categories | POST | Creer categorie |
| /api/categories/{id} | PUT | Modifier categorie |
| /api/categories/{id} | DELETE | Supprimer categorie |

### Produits

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/produits | GET | Liste des produits |
| /api/produits?categorie={id} | GET | Produits par categorie |
| /api/produits/{id} | GET | Details produit |
| /api/produits | POST | Creer produit |
| /api/produits/{id} | PUT | Modifier produit |
| /api/produits/{id} | DELETE | Supprimer produit |

### Panier

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/panier/utilisateur/{id} | GET | Panier utilisateur |
| /api/panier | POST | Ajouter au panier |
| /api/panier/{id} | PUT | Modifier quantite |
| /api/panier/{id} | DELETE | Retirer du panier |
| /api/panier/utilisateur/{id}/vider | DELETE | Vider le panier |

### Commandes

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/commandes | GET | Liste commandes |
| /api/commandes/{id} | GET | Details commande |
| /api/commandes/utilisateur/{id} | GET | Commandes utilisateur |
| /api/commandes | POST | Creer commande |
| /api/commandes/{id} | PUT | Modifier commande |

### Paiements

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/paiements | GET | Liste paiements |
| /api/paiements/{id} | GET | Details paiement |
| /api/paiements/commande/{id} | GET | Paiements commande |
| /api/paiements | POST | Creer paiement |
| /api/paiements/{id}/traiter | POST | Traiter paiement |
| /api/paiements/{id}/rembourser | POST | Rembourser |
| /api/paiements/stats | GET | Statistiques |

### Avis

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/avis | GET | Liste avis |
| /api/avis/produit/{id} | GET | Avis d'un produit |
| /api/avis/utilisateur/{id} | GET | Avis d'un utilisateur |
| /api/avis/moderation | GET | Avis en attente |
| /api/avis | POST | Creer avis |
| /api/avis/{id}/approuver | PUT | Approuver avis |
| /api/avis/{id}/rejeter | PUT | Rejeter avis |
| /api/avis/{id}/utile | POST | Marquer utile |

### Stocks

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/stocks | GET | Liste stocks |
| /api/stocks/produit/{id} | GET | Stock d'un produit |
| /api/stocks/rupture | GET | Produits en rupture |
| /api/stocks/alerte | GET | Produits sous seuil |
| /api/stocks | POST | Creer stock |
| /api/stocks/approvisionner | POST | Approvisionner |
| /api/stocks/reserver | POST | Reserver stock |
| /api/stocks/liberer | POST | Liberer stock |

### Points de Retrait

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/points-retrait | GET | Liste points |
| /api/points-retrait/actifs | GET | Points actifs |
| /api/points-retrait/{id} | GET | Details point |
| /api/points-retrait/ville/{ville} | GET | Points par ville |
| /api/points-retrait/proximite | GET | Points a proximite |
| /api/points-retrait | POST | Creer point |
| /api/points-retrait/{id}/statut | PUT | Changer statut |

### Livraisons

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/livraisons | GET | Liste livraisons |
| /api/livraisons/{id} | GET | Details livraison |
| /api/livraisons/commande/{id} | GET | Livraison commande |
| /api/livraisons/suivi/{numero} | GET | Suivi par numero |
| /api/livraisons | POST | Creer livraison |
| /api/livraisons/{id}/expedier | PUT | Expedier |
| /api/livraisons/{id}/livrer | PUT | Marquer livre |

### Mouvements Stock

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/mouvements-stock | GET | Liste mouvements |
| /api/mouvements-stock/produit/{id} | GET | Mouvements d'un produit |
| /api/mouvements-stock/type/{type} | GET | Par type de mouvement |
| /api/mouvements-stock/commande/{id} | GET | Mouvements d'une commande |
| /api/mouvements-stock/periode | GET | Par periode |
| /api/mouvements-stock/stats/produit/{id} | GET | Statistiques produit |

### Details Commande

| Endpoint | Methode | Description |
|----------|---------|-------------|
| /api/details-commande | GET | Liste details |
| /api/details-commande/commande/{id} | GET | Details d'une commande |
| /api/details-commande/produit/{id} | GET | Par produit |
| /api/details-commande/commande/{id}/total | GET | Total commande |
| /api/details-commande/stats/best-sellers | GET | Produits plus vendus |
| /api/details-commande | POST | Creer detail |

---

## Base de donnees

### Schema relationnel

```
utilisateurs ──────┐
                   │
                   ▼
              commandes ◄─── details_commande ───► produits
                   │                                   │
                   ├──────► paiements                  │
                   │                                   ▼
                   └──────► livraisons              stocks
                                                       │
                                                       ▼
                                              mouvements_stock

categories ──────► produits ◄─── avis_produits ───► utilisateurs

panier ──────► utilisateurs
       ──────► produits

points_retrait (independant)
```

### Tables principales

| Table | Description |
|-------|-------------|
| utilisateurs | Comptes utilisateurs |
| categories | Categories de produits |
| produits | Catalogue de produits |
| stocks | Gestion des stocks |
| mouvements_stock | Historique des mouvements |
| commandes | Commandes clients |
| details_commande | Lignes de commande |
| paiements | Transactions de paiement |
| livraisons | Suivi des livraisons |
| panier | Paniers utilisateurs |
| avis_produits | Avis et notes |
| points_retrait | Points de retrait |

### Acces phpMyAdmin

| Parametre | Valeur |
|-----------|--------|
| URL | http://localhost:8081 |
| Serveur | mysql |
| Utilisateur | geekingdom_user |
| Mot de passe | Api_Bdml_2025 |

---

## Frontend

### Structure des composants React

```
src/
├── components/
│   ├── Footer.jsx          # Pied de page
│   ├── Layout.jsx          # Layout principal
│   ├── Loader.jsx          # Indicateur de chargement
│   ├── MapIframe.jsx       # Carte OpenStreetMap
│   ├── Navbar.jsx          # Barre de navigation
│   ├── ProductCard.jsx     # Carte produit
│   ├── ProtectedRoute.jsx  # Route protegee
│   ├── ReviewCard.jsx      # Carte d'avis
│   └── ReviewForm.jsx      # Formulaire d'avis
│
├── context/
│   ├── AuthContext.jsx     # Contexte d'authentification
│   └── CartContext.jsx     # Contexte du panier
│
├── pages/
│   ├── HomePage.jsx        # Page d'accueil
│   ├── CategoriesPage.jsx  # Liste des categories
│   ├── ProductsPage.jsx    # Liste des produits
│   ├── ProductDetailPage.jsx # Detail produit
│   ├── CartPage.jsx        # Panier
│   ├── CheckoutPage.jsx    # Paiement
│   ├── LoginPage.jsx       # Connexion
│   ├── RegisterPage.jsx    # Inscription
│   ├── ProfilePage.jsx     # Profil utilisateur
│   ├── OrdersPage.jsx      # Mes commandes
│   ├── PointsRetraitPage.jsx # Points de retrait
│   └── NotFoundPage.jsx    # Page 404
│
├── services/
│   └── api.js              # Service API centralise
│
└── styles/
    ├── index.css           # Styles principaux
    ├── variables.css       # Variables CSS
    ├── components.css      # Styles composants
    └── animations.css      # Animations
```

### Routes de l'application

| Route | Page | Protection |
|-------|------|------------|
| / | HomePage | Non |
| /categories | CategoriesPage | Non |
| /products | ProductsPage | Non |
| /product/:id | ProductDetailPage | Non |
| /cart | CartPage | Non |
| /checkout | CheckoutPage | Oui |
| /login | LoginPage | Non |
| /register | RegisterPage | Non |
| /profile | ProfilePage | Oui |
| /orders | OrdersPage | Oui |
| /points-retrait | PointsRetraitPage | Non |

---

## Securite

### Authentification JWT

Le systeme utilise des tokens JWT (JSON Web Tokens) pour l'authentification :

1. L'utilisateur se connecte avec email/mot de passe
2. L'API genere un token JWT signe
3. Le token est stocke cote client (localStorage)
4. Chaque requete inclut le token dans le header Authorization

### Flux d'authentification

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Client  │         │   API   │         │   BDD   │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │  POST /auth/login │                   │
     │──────────────────►│                   │
     │                   │  Verification     │
     │                   │──────────────────►│
     │                   │◄──────────────────│
     │                   │                   │
     │   Token JWT       │                   │
     │◄──────────────────│                   │
     │                   │                   │
     │  GET /api/...     │                   │
     │  + Bearer Token   │                   │
     │──────────────────►│                   │
     │                   │  Validation JWT   │
     │                   │                   │
     │   Donnees         │                   │
     │◄──────────────────│                   │
     │                   │                   │
```

### Configuration des filtres de securite

```
Ordre des filtres:
1. RateLimitFilter    - Limitation du debit (5 req/min)
2. ApiKeyFilter       - Verification cle API (optionnel)
3. JwtFilter          - Validation du token JWT
```

### Endpoints publics

Les endpoints suivants sont accessibles sans authentification :

```
/auth/register
/auth/login
```

### Rate Limiting

Protection contre les abus avec limitation a 5 requetes par minute par IP.

---

## Scripts disponibles

### Windows (.bat)

| Script | Description | Commande |
|--------|-------------|----------|
| start-all.bat | Demarre tous les services | Double-clic |
| stop-all.bat | Arrete tous les services | Double-clic |
| restart-all.bat | Redemarre tous les services | Double-clic |
| status.bat | Affiche le statut des services | Double-clic |

### npm scripts (Frontend)

```bash
# Dans GeeKingdom/client/
npm start       # Demarre le serveur de developpement (port 3000)
npm run build   # Cree le build de production
npm test        # Lance les tests
npm run eject   # Ejecte la configuration (irreversible)
```

### Maven (Backend)

```bash
# Dans API_GeeKingdom/
mvnw.cmd spring-boot:run      # Demarre l'API (port 8080)
mvnw.cmd clean install        # Build le projet
mvnw.cmd clean install -DskipTests  # Build sans tests
mvnw.cmd test                 # Lance les tests
mvnw.cmd package              # Cree le JAR
```

### Docker

```bash
docker-compose up -d          # Demarre MySQL et phpMyAdmin en arriere-plan
docker-compose down           # Arrete les conteneurs
docker-compose logs -f        # Affiche les logs en temps reel
docker-compose ps             # Liste les conteneurs actifs
docker-compose restart        # Redemarre les conteneurs
```

---

## Resolution des problemes

### L'API ne demarre pas

```bash
# Verifier Java
java -version
# Doit afficher: openjdk version "17.x.x"

# Si Java 8 s'affiche, installer Java 17:
# https://adoptium.net/temurin/releases/?version=17

# Nettoyer et reconstruire
cd API_GeeKingdom
mvnw.cmd clean install -DskipTests
mvnw.cmd spring-boot:run
```

### MySQL ne repond pas

```bash
# Verifier que Docker est lance
docker --version
docker info

# Verifier les conteneurs
docker ps

# Redemarrer les conteneurs
docker-compose down
docker-compose up -d

# Verifier les logs MySQL
docker logs geekingdom_mysql
```

### Erreur de connexion a la base de donnees

```bash
# Verifier que MySQL est accessible
docker exec -it geekingdom_mysql mysql -u geekingdom_user -pApi_Bdml_2025 -e "SHOW DATABASES;"

# Verifier application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/geekingdom_db
```

### Erreur CORS

Si vous obtenez des erreurs CORS dans la console du navigateur :

1. Verifiez que l'API autorise les requetes cross-origin
2. Utilisez le proxy Node.js comme intermediaire
3. Configurez le proxy dans package.json du client React

### Port deja utilise

```bash
# Windows - Trouver le processus sur le port 8080
netstat -ano | findstr :8080

# Tuer le processus (remplacer <pid> par le numero)
taskkill /PID <pid> /F

# Ou pour le port 3000
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### Java 17 non detecte

```bash
# Verifier les versions Java installees
dir "C:\Program Files\Eclipse Adoptium" /b

# Si Java 17 n'apparait pas, l'installer:
# https://adoptium.net/temurin/releases/?version=17

# Cocher les options lors de l'installation:
# - Add to PATH
# - Set JAVA_HOME variable
# - JavaSoft registry keys
```

### npm install echoue

```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et reinstaller
rd /s /q node_modules
del package-lock.json
npm install
```

### Le client React ne se connecte pas a l'API

1. Verifier que l'API est lancee sur http://localhost:8080
2. Verifier le fichier src/services/api.js
3. La constante API_BASE_URL doit etre 'http://localhost:8080'

---

## Tests

### Test de l'API avec cURL

```bash
# Test d'inscription
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nom\":\"Test\",\"prenom\":\"User\",\"email\":\"test@test.com\",\"motDePasse\":\"123456\"}"

# Test de connexion
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"

# Test liste categories (avec token)
curl -X GET http://localhost:8080/api/categories \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Test avec Postman

1. Telecharger Postman: https://www.postman.com/downloads/
2. Creer une nouvelle requete
3. Configurer l'URL et la methode
4. Pour les endpoints proteges, ajouter le header:
   - Key: Authorization
   - Value: Bearer VOTRE_TOKEN_JWT

---

## Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### Etapes pour contribuer

1. **Fork** le projet sur GitHub
2. **Clonez** votre fork localement
   ```bash
   git clone https://github.com/votre-username/geekingdom.git
   ```
3. **Creez** une branche pour votre fonctionnalite
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
4. **Commitez** vos changements
   ```bash
   git commit -m "Ajout de ma nouvelle fonctionnalite"
   ```
5. **Pushez** sur votre fork
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
6. **Ouvrez** une Pull Request

### Conventions de code

- **Java** : Suivre les conventions Google Java Style
- **JavaScript/React** : Utiliser ESLint avec la configuration React
- **CSS** : Utiliser les variables CSS definies dans variables.css
- **Commits** : Messages clairs et descriptifs en francais ou anglais

### Structure des commits

```
type(scope): description courte

Description detaillee si necessaire

Fixes #123
```

Types: feat, fix, docs, style, refactor, test, chore

---

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de details.

```
MIT License

Copyright (c) 2024 GeeKingdom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Auteurs

- **Dommergue Camille** - Developpeur Full Stack
- **Benmessaoud Sedik** - Developpeur Full Stack

---

## Remerciements

- [Spring Boot](https://spring.io/projects/spring-boot) - Framework backend
- [React](https://reactjs.org/) - Bibliotheque frontend
- [Docker](https://www.docker.com/) - Conteneurisation
- [MySQL](https://www.mysql.com/) - Base de donnees
- [OpenStreetMap](https://www.openstreetmap.org/) - Cartes
- [Adoptium](https://adoptium.net/) - Distribution Java

---

## Contact

- **Email** : sedik.benmessaoud@efrei.net / camille.dommergue@efrei.net
- **GitHub** : https://github.com/SDK-Bmd / https://github.com/CamilleDom
- **LinkedIn** : https://linkedin.com/in/sedik-benmessaoud-data-scientist / https://linkedin.com/in/camille-dommergue-7bb642251/

---

<div>

**Fait avec ❤️ par l'equipe GeeKingdom**

© 2025 GeeKingdom - Tous droits reserves

</div>