-- ============================================
-- INSERTIONS COMPLÈTES - BASE DE DONNÉES E-COMMERCE
-- Fichier Consolidé - Toutes les Données
-- ============================================
-- 
-- Ce fichier contient TOUTES les insertions de données de ce projet :
-- 1. Données Initiales (GeekShop - 38 produits)
-- 2. Extension Catalogue (90+ nouveaux produits)
-- 3. Transactions Supplémentaires (6 commandes additionnelles)
--
-- TOTAL : 120+ produits, 10 utilisateurs, 12 commandes, 30+ avis
-- 
-- ORDRE D'EXÉCUTION :
-- 1. creation_base_donnees_ecommerce_compatible.sql (ou _avec_check.sql)
-- 2. CE FICHIER (insertions_donnees_completes_final.sql)
-- 3. validation_triggers_check.sql (optionnel, si version compatible)
--
-- DURÉE D'EXÉCUTION : ~30 secondes
-- TAILLE BASE : ~25 MB après insertions
-- ============================================

USE geekingdom_db;

-- ============================================
-- PARTIE 1 : DONNÉES INITIALES GEEKSHOP
-- 38 produits, 10 utilisateurs, 6 commandes
-- ============================================

-- ============================================
-- Script d'insertion de données pour E-commerce Geek
-- Boutique spécialisée : Jeux vidéo, Manga, Culture Pop
-- ============================================

-- ============================================
-- 1. INSERTION DES UTILISATEURS
-- ============================================

-- Mot de passe hashé pour tous les comptes (exemple: "password123")
-- En production, utiliser bcrypt ou argon2
SET @hashed_password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, adresse, ville, code_postal, pays, latitude, longitude, statut, role, preferences_json) VALUES
-- Administrateurs
('Tanaka', 'Akira', 'admin@geekshop.fr', @hashed_password, '0143526789', '42 Rue Sainte-Anne', 'Paris', '75002', 'France', 48.8685, 2.3354, 'actif', 'admin', 
 '{"langue": "fr", "notifications_email": true, "newsletter": true}'),

-- Vendeurs
('Martin', 'Sophie', 'sophie.vendeur@geekshop.fr', @hashed_password, '0675432198', '15 Avenue Jean Jaurès', 'Lyon', '69007', 'France', 45.7520, 4.8467, 'actif', 'vendeur',
 '{"langue": "fr", "notifications_email": true}'),

-- Clients passionnés
('Dubois', 'Lucas', 'lucas.dubois@email.fr', @hashed_password, '0698765432', '8 Rue des Lilas', 'Paris', '75011', 'France', 48.8629, 2.3821, 'actif', 'client',
 '{"langue": "fr", "theme_prefere": "dark", "categories_favoris": ["jeux_video", "manga"], "notifications_promo": true}'),

('Nakamura', 'Yuki', 'yuki.nakamura@email.fr', @hashed_password, '0612345678', '23 Boulevard Voltaire', 'Paris', '75011', 'France', 48.8584, 2.3737, 'actif', 'client',
 '{"langue": "fr", "theme_prefere": "light", "categories_favoris": ["manga", "figurines"], "newsletter": true}'),

('Moreau', 'Emma', 'emma.moreau@email.fr', @hashed_password, '0756789012', '10 Place Bellecour', 'Lyon', '69002', 'France', 45.7578, 4.8320, 'actif', 'client',
 '{"langue": "fr", "categories_favoris": ["jeux_video", "accessoires"], "notifications_stock": true}'),

('Bernard', 'Thomas', 'thomas.bernard@email.fr', @hashed_password, '0687654321', '5 Quai des Belges', 'Marseille', '13001', 'France', 43.2965, 5.3698, 'actif', 'client',
 '{"langue": "fr", "theme_prefere": "dark", "categories_favoris": ["cosplay", "figurines"]}'),

('Petit', 'Marie', 'marie.petit@email.fr', @hashed_password, '0634567890', '18 Rue Nationale', 'Lille', '59000', 'France', 50.6292, 3.0573, 'actif', 'client',
 '{"langue": "fr", "categories_favoris": ["manga", "livres"], "newsletter": true}'),

('Rousseau', 'Alexandre', 'alex.rousseau@email.fr', @hashed_password, '0645678901', '7 Cours Mirabeau', 'Aix-en-Provence', '13100', 'France', 43.5283, 5.4497, 'actif', 'client',
 '{"langue": "fr", "categories_favoris": ["retro_gaming", "collection"]}'),

('Laurent', 'Camille', 'camille.laurent@email.fr', @hashed_password, '0623456789', '12 Place du Capitole', 'Toulouse', '31000', 'France', 43.6047, 1.4442, 'actif', 'client',
 '{"langue": "fr", "theme_prefere": "dark", "categories_favoris": ["jeux_video", "streaming"]}'),

('Garcia', 'Hugo', 'hugo.garcia@email.fr', @hashed_password, '0678901234', '25 Rue Meyerbeer', 'Nice', '06000', 'France', 43.7034, 7.2663, 'actif', 'client',
 '{"langue": "fr", "categories_favoris": ["anime", "merchandising"]}');

-- ============================================
-- 2. INSERTION DES CATÉGORIES
-- ============================================

INSERT INTO categories (nom_categorie, description, categorie_parente_id, image_url) VALUES
-- Catégories principales
('Jeux Vidéo', 'Jeux pour toutes les plateformes', NULL, '/images/categories/jeux-video.jpg'),
('Manga & BD', 'Manga, comics et bandes dessinées', NULL, '/images/categories/manga.jpg'),
('Figurines & Collectibles', 'Figurines et objets de collection', NULL, '/images/categories/figurines.jpg'),
('Accessoires Gaming', 'Équipement et accessoires pour gamers', NULL, '/images/categories/gaming.jpg'),
('Vêtements & Cosplay', 'Vêtements et accessoires cosplay', NULL, '/images/categories/vetements.jpg'),
('Livres & Artbooks', 'Romans, artbooks et guides', NULL, '/images/categories/livres.jpg'),
('Cartes à Collectionner', 'TCG et cartes à collectionner', NULL, '/images/categories/cartes.jpg'),
('Merchandising', 'Produits dérivés et goodies', NULL, '/images/categories/merchandising.jpg');

-- Sous-catégories Jeux Vidéo
INSERT INTO categories (nom_categorie, description, categorie_parente_id, image_url) VALUES
('PlayStation 5', 'Jeux pour PS5', 1, '/images/categories/ps5.jpg'),
('Xbox Series', 'Jeux pour Xbox Series X/S', 1, '/images/categories/xbox.jpg'),
('Nintendo Switch', 'Jeux pour Nintendo Switch', 1, '/images/categories/switch.jpg'),
('PC Gaming', 'Jeux PC physiques et collectors', 1, '/images/categories/pc.jpg'),
('Rétro Gaming', 'Jeux et consoles rétro', 1, '/images/categories/retro.jpg');

-- Sous-catégories Manga
INSERT INTO categories (nom_categorie, description, categorie_parente_id, image_url) VALUES
('Shonen', 'Manga pour jeunes garçons', 2, '/images/categories/shonen.jpg'),
('Seinen', 'Manga pour adultes', 2, '/images/categories/seinen.jpg'),
('Shojo', 'Manga pour jeunes filles', 2, '/images/categories/shojo.jpg');

-- Sous-catégories Figurines
INSERT INTO categories (nom_categorie, description, categorie_parente_id, image_url) VALUES
('Nendoroid', 'Figurines Nendoroid', 3, '/images/categories/nendoroid.jpg'),
('Figma', 'Figurines Figma articulées', 3, '/images/categories/figma.jpg'),
('Scale Figures', 'Figurines à échelle', 3, '/images/categories/scale.jpg');

-- ============================================
-- 3. INSERTION DES PRODUITS
-- ============================================

-- Jeux PlayStation 5
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('The Legend of Heroes: Trails through Daybreak', 'Le dernier opus de la saga culte Trails. Incarnez Van Arkride dans une aventure RPG épique avec un système de combat révolutionné.', 59.99, 9, 'NIS America', 0.15, '17x13x1.5', 
 '["images/produits/trails-daybreak-1.jpg", "images/produits/trails-daybreak-2.jpg", "images/produits/trails-daybreak-3.jpg"]', 'disponible',
 '["rpg", "jrpg", "aventure", "falcom", "trails"]'),

('Final Fantasy XVI', 'Action RPG épique dans un monde de fantasy sombre. Combats spectaculaires et histoire mature.', 69.99, 9, 'Square Enix', 0.15, '17x13x1.5',
 '["images/produits/ff16-1.jpg", "images/produits/ff16-2.jpg"]', 'disponible',
 '["rpg", "action", "fantasy", "final_fantasy"]'),

('Persona 5 Royal', 'Édition ultime du chef-d\'œuvre JRPG. Vivez une aventure de voleur fantôme à Tokyo avec style!', 49.99, 9, 'Atlus', 0.15, '17x13x1.5',
 '["images/produits/p5r-1.jpg", "images/produits/p5r-2.jpg", "images/produits/p5r-3.jpg"]', 'disponible',
 '["rpg", "jrpg", "persona", "atlus", "simulation"]'),

('Elden Ring', 'Le chef-d\'œuvre de FromSoftware et George R.R. Martin. Souls-like open world épique.', 59.99, 9, 'Bandai Namco', 0.15, '17x13x1.5',
 '["images/produits/elden-ring-1.jpg", "images/produits/elden-ring-2.jpg"]', 'disponible',
 '["action", "rpg", "souls", "fromsoftware", "difficile"]');

-- Jeux Nintendo Switch
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('The Legend of Zelda: Tears of the Kingdom', 'Suite tant attendue de Breath of the Wild. Explorez Hyrule dans les airs et sous terre!', 69.99, 11, 'Nintendo', 0.10, '17x10.5x1',
 '["images/produits/zelda-totk-1.jpg", "images/produits/zelda-totk-2.jpg"]', 'disponible',
 '["aventure", "action", "zelda", "nintendo", "open_world"]'),

('Xenoblade Chronicles 3', 'JRPG épique avec un monde gigantesque et une histoire complexe. Plus de 100h de gameplay.', 59.99, 11, 'Nintendo', 0.10, '17x10.5x1',
 '["images/produits/xenoblade3-1.jpg", "images/produits/xenoblade3-2.jpg"]', 'disponible',
 '["rpg", "jrpg", "aventure", "monolith"]'),

('Fire Emblem Engage', 'Tactical RPG avec des combats stratégiques et un système d\'invocation unique.', 59.99, 11, 'Nintendo', 0.10, '17x10.5x1',
 '["images/produits/fe-engage-1.jpg"]', 'disponible',
 '["rpg", "tactical", "strategie", "fire_emblem"]');

-- PC Gaming
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Baldur\'s Gate 3 - Deluxe Edition', 'Édition collector du GOTY 2023. RPG ultime basé sur D&D 5e avec contenu exclusif.', 79.99, 12, 'Larian Studios', 0.20, '19x13.5x3',
 '["images/produits/bg3-deluxe-1.jpg", "images/produits/bg3-deluxe-2.jpg"]', 'disponible',
 '["rpg", "dnd", "fantasy", "crpg", "collector"]'),

('Cyberpunk 2077 - Phantom Liberty Edition', 'Edition complète avec l\'extension Phantom Liberty. Plongez dans Night City!', 59.99, 12, 'CD Projekt Red', 0.15, '19x13.5x1.5',
 '["images/produits/cyberpunk-pl-1.jpg"]', 'disponible',
 '["rpg", "action", "cyberpunk", "futur"]');

-- Manga Shonen
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('One Piece - Édition Originale Tome 105', 'Le dernier tome de l\'arc Wano! Suivez les aventures de Luffy vers le One Piece.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-105.jpg"]', 'disponible',
 '["manga", "shonen", "aventure", "pirates", "one_piece"]'),

('Jujutsu Kaisen Tome 24', 'La bataille du Culling Game continue! Manga phénomène au Japon.', 6.90, 14, 'Ki-oon', 0.17, '18x11.5x1.5',
 '["images/produits/jjk-24.jpg"]', 'disponible',
 '["manga", "shonen", "action", "sorcellerie", "jujutsu"]'),

('My Hero Academia Tome 38', 'Les héros font face à leur plus grand défi. La guerre finale approche!', 6.90, 14, 'Ki-oon', 0.17, '18x11.5x1.5',
 '["images/produits/mha-38.jpg"]', 'disponible',
 '["manga", "shonen", "super_heros", "action"]'),

('Spy x Family Tome 13', 'Les aventures hilarantes de la famille Forger continuent!', 6.90, 14, 'Kurokawa', 0.16, '18x11.5x1.5',
 '["images/produits/spyfamily-13.jpg"]', 'disponible',
 '["manga", "shonen", "comedie", "espionnage", "famille"]'),

('Chainsaw Man Tome 15', 'Le manga culte de Tatsuki Fujimoto. Violence, humour noir et émotion.', 6.90, 14, 'Kazé', 0.17, '18x11.5x1.5',
 '["images/produits/chainsawman-15.jpg"]', 'disponible',
 '["manga", "shonen", "action", "demons", "dark"]');

-- Manga Seinen
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Berserk Deluxe Edition Tome 8', 'Edition de luxe reliée du chef-d\'œuvre de Kentaro Miura.', 29.90, 15, 'Glénat', 0.85, '26x18x3',
 '["images/produits/berserk-deluxe-8.jpg"]', 'disponible',
 '["manga", "seinen", "dark_fantasy", "berserk", "miura"]'),

('Vagabond Edition Deluxe Tome 12', 'L\'œuvre magistrale de Takehiko Inoue dans une édition somptueuse.', 15.00, 15, 'Ki-oon', 0.65, '21x15x2.5',
 '["images/produits/vagabond-12.jpg"]', 'disponible',
 '["manga", "seinen", "samourai", "historique", "inoue"]'),

('Vinland Saga Tome 27', 'La saga viking épique de Makoto Yukimura arrive à sa conclusion.', 7.65, 15, 'Kurokawa', 0.19, '18x11.5x1.5',
 '["images/produits/vinland-27.jpg"]', 'disponible',
 '["manga", "seinen", "viking", "historique", "aventure"]');

-- Figurines Nendoroid
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Nendoroid Makima (Chainsaw Man)', 'Figurine articulée adorable de la Control Devil. Avec accessoires et visages interchangeables.', 59.99, 17, 'Good Smile Company', 0.25, '12x10x8',
 '["images/produits/nendo-makima-1.jpg", "images/produits/nendo-makima-2.jpg"]', 'disponible',
 '["figurine", "nendoroid", "chainsaw_man", "makima", "collection"]'),

('Nendoroid Link: Tears of the Kingdom Ver.', 'Link dans sa tenue de TotK avec Master Sword, bouclier et accessoires.', 54.99, 17, 'Good Smile Company', 0.24, '12x10x8',
 '["images/produits/nendo-link-totk.jpg"]', 'disponible',
 '["figurine", "nendoroid", "zelda", "link", "nintendo"]'),

('Nendoroid Sukuna (Jujutsu Kaisen)', 'Le Roi des Fléaux en version Nendoroid. Effets spéciaux inclus.', 59.99, 17, 'Good Smile Company', 0.25, '12x10x8',
 '["images/produits/nendo-sukuna.jpg"]', 'disponible',
 '["figurine", "nendoroid", "jujutsu_kaisen", "sukuna"]');

-- Figurines Scale
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('2B (NieR: Automata) 1/7 Scale Figure', 'Magnifique figurine de 2B par Square Enix. Détails exceptionnels, pose dynamique.', 249.99, 19, 'Square Enix', 1.20, '35x25x15',
 '["images/produits/2b-scale-1.jpg", "images/produits/2b-scale-2.jpg", "images/produits/2b-scale-3.jpg"]', 'disponible',
 '["figurine", "scale", "nier", "2b", "premium", "collection"]'),

('Miku Hatsune: Racing 2023 Ver. 1/7', 'Miku en tenue de course Racing 2023. Edition limitée.', 189.99, 19, 'Good Smile Racing', 0.95, '32x22x14',
 '["images/produits/miku-racing.jpg"]', 'disponible',
 '["figurine", "scale", "vocaloid", "miku", "racing"]');

-- Accessoires Gaming
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Clavier Mécanique RGB Razer BlackWidow V3', 'Clavier gaming mécanique avec switches verts Razer. RGB Chroma et repose-poignet.', 129.99, 4, 'Razer', 1.30, '45x15x4',
 '["images/produits/razer-blackwidow.jpg"]', 'disponible',
 '["accessoire", "clavier", "gaming", "rgb", "mecanique"]'),

('Souris Gaming Logitech G Pro X Superlight', 'Souris ultra-légère sans fil pour l\'esport. 25 600 DPI, capteur HERO 2.', 149.99, 4, 'Logitech', 0.06, '12.5x6.5x4',
 '["images/produits/gpro-superlight.jpg"]', 'disponible',
 '["accessoire", "souris", "gaming", "esport", "wireless"]'),

('Casque Audio SteelSeries Arctis Nova Pro', 'Casque gaming premium avec son spatial et suppression active du bruit.', 349.99, 4, 'SteelSeries', 0.35, '20x18x10',
 '["images/produits/arctis-nova-pro.jpg"]', 'disponible',
 '["accessoire", "casque", "gaming", "audio", "premium"]'),

('Tapis de Souris XXL Gaming', 'Tapis géant 900x400mm avec bords cousus. Design One Piece Going Merry.', 29.99, 4, 'GeekPad', 0.45, '90x40x0.3',
 '["images/produits/tapis-onepiece.jpg"]', 'disponible',
 '["accessoire", "tapis", "gaming", "one_piece", "xxl"]');

-- T-shirts & Vêtements
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('T-shirt Premium "Akatsuki" (Naruto)', 'T-shirt 100% coton bio avec logo Akatsuki brodé. Qualité supérieure.', 34.99, 5, 'GeekClothing', 0.20, 'Taille: S-XXL',
 '["images/produits/tshirt-akatsuki.jpg"]', 'disponible',
 '["vetement", "tshirt", "naruto", "akatsuki", "anime"]'),

('Hoodie Oversize "Attack on Titan"', 'Sweat à capuche oversize avec Wings of Freedom. Ultra confortable.', 59.99, 5, 'Crunchyroll Store', 0.65, 'Taille: S-XXL',
 '["images/produits/hoodie-aot.jpg"]', 'disponible',
 '["vetement", "hoodie", "attack_on_titan", "snk"]'),

('Perruque Cosplay Gojo Satoru (JJK)', 'Perruque blanche haute qualité style Gojo. Idéale pour cosplay.', 44.99, 5, 'CosplayPro', 0.30, 'Taille unique',
 '["images/produits/wig-gojo.jpg"]', 'disponible',
 '["cosplay", "perruque", "jujutsu_kaisen", "gojo"]');

-- Artbooks et Livres
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('The Art of Elden Ring', 'Artbook officiel de 400 pages. Illustrations, concept arts et interviews exclusives.', 49.99, 6, 'Dark Horse', 1.80, '30x23x3.5',
 '["images/produits/artbook-eldenring.jpg"]', 'disponible',
 '["artbook", "livre", "elden_ring", "fromsoftware", "art"]'),

('Zelda: Tears of the Kingdom - Guide Officiel Complet', 'Guide officiel deluxe avec carte géante. Solution complète et secrets.', 39.99, 6, 'Piggyback', 1.50, '28x21x3',
 '["images/produits/guide-zelda-totk.jpg"]', 'disponible',
 '["guide", "livre", "zelda", "nintendo", "solution"]'),

('Hyrule Historia', 'Livre collector sur l\'histoire et la chronologie de la saga Zelda.', 34.99, 6, 'Soleil', 1.20, '26x19x2.5',
 '["images/produits/hyrule-historia.jpg"]', 'disponible',
 '["livre", "zelda", "histoire", "nintendo", "collector"]');

-- Cartes Pokémon
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Pokémon Écarlate et Violet 151 - Booster Box', 'Display de 36 boosters de la série 151. Cartes à collectionner.', 149.99, 7, 'The Pokémon Company', 1.20, '21x14x8',
 '["images/produits/pokemon-151-box.jpg"]', 'disponible',
 '["tcg", "pokemon", "cartes", "booster", "collection"]'),

('Pokémon Premium Collection Charizard ex', 'Coffret premium avec carte promo Charizard ex et 10 boosters.', 79.99, 7, 'The Pokémon Company', 0.80, '30x22x6',
 '["images/produits/pokemon-charizard-box.jpg"]', 'disponible',
 '["tcg", "pokemon", "cartes", "charizard", "premium"]');

-- Merchandising & Goodies
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Mug Thermoréactif Dragon Ball Z', 'Mug magique qui révèle Goku Super Saiyan avec la chaleur.', 19.99, 8, 'ABYstyle', 0.35, '12x10x10',
 '["images/produits/mug-dbz.jpg"]', 'disponible',
 '["merchandising", "mug", "dragon_ball", "goodies"]'),

('Poster Métallique Cyberpunk 2077', 'Plaque métal 30x40cm. Design V et Johnny Silverhand. Coins arrondis.', 24.99, 8, 'Displate', 0.60, '40x30x0.1',
 '["images/produits/poster-cyberpunk.jpg"]', 'disponible',
 '["merchandising", "poster", "cyberpunk", "deco"]'),

('Peluche Pikachu Géante 60cm', 'Peluche officielle Pokémon Center. Ultra douce et câline.', 69.99, 8, 'Pokémon Center', 0.80, '60x40x35',
 '["images/produits/peluche-pikachu.jpg"]', 'disponible',
 '["merchandising", "peluche", "pokemon", "pikachu", "officiel"]'),

('Lampe LED One Piece - Going Merry', 'Lampe d\'ambiance LED avec bateau Going Merry en 3D. 7 couleurs.', 39.99, 8, 'GeekLights', 0.50, '25x20x10',
 '["images/produits/lampe-merry.jpg"]', 'disponible',
 '["merchandising", "lampe", "one_piece", "led", "deco"]');

-- ============================================
-- 4. INSERTION DES STOCKS (automatique via trigger)
-- Inserts pour la table stocks
-- Basé sur les produits de la table produits (id_produit 1 à 123)
-- Structure: id_stock, id_produit, quantite_disponible, quantite_reservee, seuil_alerte, emplacement, date_derniere_maj

INSERT INTO `stocks` (`id_stock`, `id_produit`, `quantite_disponible`, `quantite_reservee`, `seuil_alerte`, `emplacement`, `date_derniere_maj`) VALUES
-- Jeux PlayStation (id 1-4)
(1, 1, 25, 2, 5, 'A1-01', '2025-12-03 10:00:00'),
(2, 2, 30, 3, 5, 'A1-02', '2025-12-03 10:00:00'),
(3, 3, 40, 5, 8, 'A1-03', '2025-12-03 10:00:00'),
(4, 4, 35, 4, 5, 'A1-04', '2025-12-03 10:00:00'),

-- Jeux Nintendo Switch (id 5-7)
(5, 5, 20, 6, 5, 'A2-01', '2025-12-03 10:00:00'),
(6, 6, 18, 2, 5, 'A2-02', '2025-12-03 10:00:00'),
(7, 7, 22, 1, 5, 'A2-03', '2025-12-03 10:00:00'),

-- Jeux PC (id 8-9)
(8, 8, 15, 3, 3, 'A3-01', '2025-12-03 10:00:00'),
(9, 9, 28, 2, 5, 'A3-02', '2025-12-03 10:00:00'),

-- Mangas Shonen (id 10-14)
(10, 10, 100, 10, 20, 'B1-01', '2025-12-03 10:00:00'),
(11, 11, 85, 8, 15, 'B1-02', '2025-12-03 10:00:00'),
(12, 12, 75, 5, 15, 'B1-03', '2025-12-03 10:00:00'),
(13, 13, 90, 12, 20, 'B1-04', '2025-12-03 10:00:00'),
(14, 14, 80, 7, 15, 'B1-05', '2025-12-03 10:00:00'),

-- Mangas Seinen (id 15-17)
(15, 15, 25, 3, 5, 'B2-01', '2025-12-03 10:00:00'),
(16, 16, 20, 2, 5, 'B2-02', '2025-12-03 10:00:00'),
(17, 17, 30, 4, 8, 'B2-03', '2025-12-03 10:00:00'),

-- Nendoroids (id 18-20)
(18, 18, 12, 2, 3, 'C1-01', '2025-12-03 10:00:00'),
(19, 19, 0, 0, 3, 'C1-02', '2025-12-03 10:00:00'),
(20, 20, 15, 3, 3, 'C1-03', '2025-12-03 10:00:00'),

-- Figurines Scale (id 21-22)
(21, 21, 5, 1, 2, 'C2-01', '2025-12-03 10:00:00'),
(22, 22, 8, 2, 2, 'C2-02', '2025-12-03 10:00:00'),

-- Accessoires Gaming (id 23-26)
(23, 23, 20, 2, 5, 'D1-01', '2025-12-03 10:00:00'),
(24, 24, 15, 3, 4, 'D1-02', '2025-12-03 10:00:00'),
(25, 25, 10, 1, 3, 'D1-03', '2025-12-03 10:00:00'),
(26, 26, 35, 5, 10, 'D1-04', '2025-12-03 10:00:00'),

-- Vêtements (id 27-29)
(27, 27, 50, 8, 10, 'E1-01', '2025-12-03 10:00:00'),
(28, 28, 40, 6, 8, 'E1-02', '2025-12-03 10:00:00'),
(29, 29, 25, 3, 5, 'E1-03', '2025-12-03 10:00:00'),

-- Artbooks/Livres (id 30-32)
(30, 30, 18, 2, 5, 'F1-01', '2025-12-03 10:00:00'),
(31, 31, 22, 4, 5, 'F1-02', '2025-12-03 10:00:00'),
(32, 32, 15, 1, 4, 'F1-03', '2025-12-03 10:00:00'),

-- Cartes Pokémon (id 33-34)
(33, 33, 30, 10, 8, 'G1-01', '2025-12-03 10:00:00'),
(34, 34, 20, 5, 5, 'G1-02', '2025-12-03 10:00:00'),

-- Merchandising (id 35-38)
(35, 35, 45, 5, 10, 'H1-01', '2025-12-03 10:00:00'),
(36, 36, 15, 2, 4, 'H1-02', '2025-12-03 10:00:00'),
(37, 37, 12, 3, 3, 'H1-03', '2025-12-03 10:00:00'),
(38, 38, 25, 4, 5, 'H1-04', '2025-12-03 10:00:00'),

-- Jeux Indie (id 39-48)
(39, 39, 20, 2, 5, 'A4-01', '2025-12-03 10:00:00'),
(40, 40, 15, 3, 4, 'A4-02', '2025-12-03 10:00:00'),
(41, 41, 18, 1, 5, 'A4-03', '2025-12-03 10:00:00'),
(42, 42, 22, 4, 5, 'A4-04', '2025-12-03 10:00:00'),
(43, 43, 25, 3, 5, 'A4-05', '2025-12-03 10:00:00'),
(44, 44, 20, 2, 5, 'A4-06', '2025-12-03 10:00:00'),
(45, 45, 16, 2, 4, 'A4-07', '2025-12-03 10:00:00'),
(46, 46, 12, 1, 3, 'A3-03', '2025-12-03 10:00:00'),
(47, 47, 14, 2, 4, 'A3-04', '2025-12-03 10:00:00'),
(48, 48, 30, 3, 8, 'A3-05', '2025-12-03 10:00:00'),

-- One Piece Collection (id 49-61)
(49, 49, 60, 5, 15, 'B3-01', '2025-12-03 10:00:00'),
(50, 50, 55, 4, 12, 'B3-02', '2025-12-03 10:00:00'),
(51, 51, 50, 3, 12, 'B3-03', '2025-12-03 10:00:00'),
(52, 52, 48, 4, 10, 'B3-04', '2025-12-03 10:00:00'),
(53, 53, 52, 3, 12, 'B3-05', '2025-12-03 10:00:00'),
(54, 54, 15, 2, 4, 'B3-06', '2025-12-03 10:00:00'),
(55, 55, 12, 1, 3, 'B3-07', '2025-12-03 10:00:00'),
(56, 56, 10, 2, 3, 'B3-08', '2025-12-03 10:00:00'),
(57, 57, 10, 1, 3, 'B3-09', '2025-12-03 10:00:00'),
(58, 58, 8, 1, 2, 'B3-10', '2025-12-03 10:00:00'),
(59, 59, 8, 2, 2, 'B3-11', '2025-12-03 10:00:00'),
(60, 60, 10, 1, 3, 'B3-12', '2025-12-03 10:00:00'),
(61, 61, 12, 3, 3, 'B3-13', '2025-12-03 10:00:00'),

-- Jujutsu Kaisen Collection (id 62-64)
(62, 62, 18, 4, 5, 'B4-01', '2025-12-03 10:00:00'),
(63, 63, 15, 3, 4, 'B4-02', '2025-12-03 10:00:00'),
(64, 64, 20, 5, 5, 'B4-03', '2025-12-03 10:00:00'),

-- Attack on Titan Collection (id 65-68)
(65, 65, 8, 2, 2, 'B5-01', '2025-12-03 10:00:00'),
(66, 66, 12, 2, 3, 'B5-02', '2025-12-03 10:00:00'),
(67, 67, 10, 1, 3, 'B5-03', '2025-12-03 10:00:00'),
(68, 68, 10, 2, 3, 'B5-04', '2025-12-03 10:00:00'),

-- Tokyo Revengers (id 69-71)
(69, 69, 14, 2, 4, 'B6-01', '2025-12-03 10:00:00'),
(70, 70, 12, 1, 3, 'B6-02', '2025-12-03 10:00:00'),
(71, 71, 35, 4, 8, 'B6-03', '2025-12-03 10:00:00'),

-- Demon Slayer Collection (id 72-74)
(72, 72, 10, 3, 3, 'B7-01', '2025-12-03 10:00:00'),
(73, 73, 15, 2, 4, 'B7-02', '2025-12-03 10:00:00'),
(74, 74, 12, 2, 3, 'B7-03', '2025-12-03 10:00:00'),

-- Death Note & FMA (id 75-77)
(75, 75, 18, 3, 5, 'B8-01', '2025-12-03 10:00:00'),
(76, 76, 10, 1, 3, 'B8-02', '2025-12-03 10:00:00'),
(77, 77, 6, 1, 2, 'B8-03', '2025-12-03 10:00:00'),

-- Nendoroids Suite (id 78-84)
(78, 78, 14, 2, 4, 'C1-04', '2025-12-03 10:00:00'),
(79, 79, 16, 3, 4, 'C1-05', '2025-12-03 10:00:00'),
(80, 80, 10, 2, 3, 'C1-06', '2025-12-03 10:00:00'),
(81, 81, 12, 1, 3, 'C1-07', '2025-12-03 10:00:00'),
(82, 82, 8, 2, 2, 'C1-08', '2025-12-03 10:00:00'),
(83, 83, 10, 1, 3, 'C1-09', '2025-12-03 10:00:00'),
(84, 84, 12, 2, 3, 'C1-10', '2025-12-03 10:00:00'),

-- Scale Figures Suite (id 85-87)
(85, 85, 4, 1, 2, 'C2-03', '2025-12-03 10:00:00'),
(86, 86, 3, 0, 2, 'C2-04', '2025-12-03 10:00:00'),
(87, 87, 5, 1, 2, 'C2-05', '2025-12-03 10:00:00'),

-- Posters (id 88-93)
(88, 88, 60, 8, 15, 'I1-01', '2025-12-03 10:00:00'),
(89, 89, 55, 6, 12, 'I1-02', '2025-12-03 10:00:00'),
(90, 90, 50, 5, 12, 'I1-03', '2025-12-03 10:00:00'),
(91, 91, 45, 7, 10, 'I1-04', '2025-12-03 10:00:00'),
(92, 92, 30, 4, 8, 'I1-05', '2025-12-03 10:00:00'),
(93, 93, 20, 2, 5, 'I1-06', '2025-12-03 10:00:00'),

-- Porte-clés & Pins (id 94-98)
(94, 94, 40, 6, 10, 'J1-01', '2025-12-03 10:00:00'),
(95, 95, 35, 4, 8, 'J1-02', '2025-12-03 10:00:00'),
(96, 96, 25, 5, 6, 'J1-03', '2025-12-03 10:00:00'),
(97, 97, 50, 8, 12, 'J1-04', '2025-12-03 10:00:00'),
(98, 98, 30, 3, 8, 'J1-05', '2025-12-03 10:00:00'),

-- Sacs & Pochettes (id 99-102)
(99, 99, 15, 2, 4, 'K1-01', '2025-12-03 10:00:00'),
(100, 100, 18, 3, 5, 'K1-02', '2025-12-03 10:00:00'),
(101, 101, 25, 4, 6, 'K1-03', '2025-12-03 10:00:00'),
(102, 102, 30, 5, 8, 'K1-04', '2025-12-03 10:00:00'),

-- Décoration (id 103-107)
(103, 103, 12, 2, 3, 'L1-01', '2025-12-03 10:00:00'),
(104, 104, 18, 3, 5, 'L1-02', '2025-12-03 10:00:00'),
(105, 105, 10, 1, 3, 'L1-03', '2025-12-03 10:00:00'),
(106, 106, 45, 8, 10, 'L1-04', '2025-12-03 10:00:00'),
(107, 107, 8, 1, 2, 'L1-05', '2025-12-03 10:00:00'),

-- Vêtements Suite (id 108-113)
(108, 108, 35, 5, 8, 'E2-01', '2025-12-03 10:00:00'),
(109, 109, 30, 4, 8, 'E2-02', '2025-12-03 10:00:00'),
(110, 110, 25, 6, 6, 'E2-03', '2025-12-03 10:00:00'),
(111, 111, 20, 3, 5, 'E2-04', '2025-12-03 10:00:00'),
(112, 112, 12, 2, 3, 'E2-05', '2025-12-03 10:00:00'),
(113, 113, 40, 5, 10, 'E2-06', '2025-12-03 10:00:00'),

-- Jeux de Société (id 114-118)
(114, 114, 15, 3, 4, 'M1-01', '2025-12-03 10:00:00'),
(115, 115, 12, 2, 3, 'M1-02', '2025-12-03 10:00:00'),
(116, 116, 35, 6, 8, 'M1-03', '2025-12-03 10:00:00'),
(117, 117, 20, 4, 5, 'M1-04', '2025-12-03 10:00:00'),
(118, 118, 18, 2, 5, 'M1-05', '2025-12-03 10:00:00'),

-- Art & Prints (id 119-123)
(119, 119, 8, 1, 2, 'N1-01', '2025-12-03 10:00:00'),
(120, 120, 12, 2, 3, 'N1-02', '2025-12-03 10:00:00'),
(121, 121, 10, 1, 3, 'N1-03', '2025-12-03 10:00:00'),
(122, 122, 5, 1, 2, 'N1-04', '2025-12-03 10:00:00'),
(123, 123, 3, 0, 1, 'N1-05', '2025-12-03 10:00:00');
-- Nous allons maintenant mettre à jour les quantités
-- ============================================

-- Mise à jour des stocks pour les jeux vidéo (bon stock)
UPDATE stocks SET quantite_disponible = 50, seuil_alerte = 10 WHERE id_produit IN (1, 2, 3, 4, 5, 6, 7, 8, 9);

-- Mise à jour des stocks pour les manga (très bon stock)
UPDATE stocks SET quantite_disponible = 100, seuil_alerte = 20 WHERE id_produit IN (10, 11, 12, 13, 14, 15, 16, 17);

-- Mise à jour des stocks pour les figurines (stock limité - produits premium)
UPDATE stocks SET quantite_disponible = 15, seuil_alerte = 5 WHERE id_produit IN (18, 19, 20, 21, 22);

-- Mise à jour des stocks pour les accessoires gaming
UPDATE stocks SET quantite_disponible = 30, seuil_alerte = 10 WHERE id_produit IN (23, 24, 25, 26);

-- Mise à jour des stocks pour les vêtements
UPDATE stocks SET quantite_disponible = 40, seuil_alerte = 10 WHERE id_produit IN (27, 28, 29);

-- Mise à jour des stocks pour les livres
UPDATE stocks SET quantite_disponible = 25, seuil_alerte = 8 WHERE id_produit IN (30, 31, 32);

-- Mise à jour des stocks pour les cartes Pokémon (stock moyen - forte demande)
UPDATE stocks SET quantite_disponible = 20, seuil_alerte = 8 WHERE id_produit IN (33, 34);

-- Mise à jour des stocks pour le merchandising
UPDATE stocks SET quantite_disponible = 60, seuil_alerte = 15 WHERE id_produit IN (35, 36, 37, 38);

-- Un produit en rupture (exemple)
UPDATE stocks SET quantite_disponible = 0, seuil_alerte = 5 WHERE id_produit = 19;
UPDATE produits SET statut = 'rupture' WHERE id_produit = 19;

-- ============================================
-- 5. INSERTION DES POINTS DE RETRAIT
-- ============================================

INSERT INTO points_retrait (nom_point, adresse, ville, code_postal, pays, latitude, longitude, telephone, horaires_json, statut, capacite_max) VALUES
('GeekShop Store Paris Opéra', '42 Rue Sainte-Anne', 'Paris', '75002', 'France', 48.8685, 2.3354, '0143526789',
 '{"lundi": "10:00-20:00", "mardi": "10:00-20:00", "mercredi": "10:00-20:00", "jeudi": "10:00-20:00", "vendredi": "10:00-21:00", "samedi": "10:00-21:00", "dimanche": "11:00-19:00"}',
 'actif', 200),

('GeekShop Store Lyon Part-Dieu', '15 Avenue Jean Jaurès', 'Lyon', '69007', 'France', 45.7520, 4.8467, '0478901234',
 '{"lundi": "10:00-19:30", "mardi": "10:00-19:30", "mercredi": "10:00-19:30", "jeudi": "10:00-19:30", "vendredi": "10:00-20:00", "samedi": "10:00-20:00", "dimanche": "Fermé"}',
 'actif', 150),

('Relais Pickup Paris 11', '30 Boulevard Voltaire', 'Paris', '75011', 'France', 48.8584, 2.3737, '0156789012',
 '{"lundi": "09:00-12:30,14:00-19:00", "mardi": "09:00-12:30,14:00-19:00", "mercredi": "09:00-12:30,14:00-19:00", "jeudi": "09:00-12:30,14:00-19:00", "vendredi": "09:00-12:30,14:00-19:00", "samedi": "09:00-13:00", "dimanche": "Fermé"}',
 'actif', 80),

('Mondial Relay Lyon Bellecour', '10 Place Bellecour', 'Lyon', '69002', 'France', 45.7578, 4.8320, '0472334455',
 '{"lundi": "08:30-12:00,14:00-18:30", "mardi": "08:30-12:00,14:00-18:30", "mercredi": "08:30-12:00,14:00-18:30", "jeudi": "08:30-12:00,14:00-18:30", "vendredi": "08:30-12:00,14:00-18:30", "samedi": "09:00-12:00", "dimanche": "Fermé"}',
 'actif', 100),

('Bureau de Poste Marseille Vieux-Port', '5 Quai des Belges', 'Marseille', '13001', 'France', 43.2965, 5.3698, '0491223344',
 '{"lundi": "09:00-18:00", "mardi": "09:00-18:00", "mercredi": "09:00-18:00", "jeudi": "09:00-18:00", "vendredi": "09:00-18:00", "samedi": "09:00-12:00", "dimanche": "Fermé"}',
 'actif', 120);

-- ============================================
-- 6. INSERTION DES COMMANDES
-- ============================================

-- Commande 1 : Lucas achète des jeux et manga
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut, 
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison, 
                       date_commande, commentaires) VALUES
(3, 'CMD-2025-00001', 143.77, 5.99, 23.78, 'livree',
 '8 Rue des Lilas', 'Paris', '75011', 'France',
 '2025-01-15 14:32:00', 'Livraison avant 18h si possible');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(1, 3, 1, 49.99, 49.99),  -- Persona 5 Royal
(1, 10, 2, 6.90, 13.80),   -- One Piece Tome 105 x2
(1, 11, 1, 6.90, 6.90),    -- Jujutsu Kaisen
(1, 26, 1, 29.99, 29.99),  -- Tapis de souris
(1, 35, 2, 19.99, 39.98);  -- Mug DBZ x2

-- Commande 2 : Yuki achète des figurines et manga
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande, code_promo, reduction) VALUES
(4, 'CMD-2025-00002', 126.87, 0.00, 20.97, 'expediee',
 '23 Boulevard Voltaire', 'Paris', '75011', 'France',
 '2025-02-10 10:15:00', 'MANGA10', 7.20);

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(2, 18, 1, 59.99, 59.99),  -- Nendoroid Makima
(2, 12, 1, 6.90, 6.90),    -- My Hero Academia
(2, 13, 1, 6.90, 6.90),    -- Spy x Family
(2, 14, 5, 6.90, 34.50),   -- Chainsaw Man x5
(2, 37, 1, 69.99, 69.99);  -- Peluche Pikachu

-- Commande 3 : Emma achète du gaming
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(5, 'CMD-2025-00003', 534.96, 7.99, 88.49, 'en_preparation',
 '10 Place Bellecour', 'Lyon', '69002', 'France',
 '2025-03-01 16:45:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(3, 1, 1, 59.99, 59.99),   -- Trails through Daybreak
(3, 24, 1, 149.99, 149.99),-- Souris Logitech
(3, 25, 1, 349.99, 349.99);-- Casque SteelSeries

-- Commande 4 : Thomas collectionneur
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(6, 'CMD-2025-00004', 523.86, 9.99, 86.64, 'confirmee',
 '5 Quai des Belges', 'Marseille', '13001', 'France',
 '2025-03-10 11:20:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(4, 21, 1, 249.99, 249.99), -- Figurine 2B Scale
(4, 15, 1, 29.90, 29.90),   -- Berserk Deluxe
(4, 30, 1, 49.99, 49.99),   -- Artbook Elden Ring
(4, 33, 1, 149.99, 149.99); -- Pokémon Display

-- Commande 5 : Marie achète des manga
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(7, 'CMD-2025-00005', 52.48, 3.99, 8.68, 'livree',
 '18 Rue Nationale', 'Lille', '59000', 'France',
 '2025-02-25 09:30:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(5, 10, 1, 6.90, 6.90),
(5, 11, 1, 6.90, 6.90),
(5, 12, 1, 6.90, 6.90),
(5, 13, 1, 6.90, 6.90),
(5, 14, 1, 6.90, 6.90),
(5, 16, 1, 15.00, 15.00);

-- Commande 6 : En attente de paiement
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(8, 'CMD-2025-00006', 195.97, 5.99, 32.40, 'en_attente',
 '7 Cours Mirabeau', 'Aix-en-Provence', '13100', 'France',
 '2025-03-15 20:15:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(6, 8, 1, 79.99, 79.99),   -- Baldur's Gate 3
(6, 23, 1, 129.99, 129.99);-- Clavier Razer

-- ============================================
-- 7. INSERTION DES PAIEMENTS
-- ============================================

-- Paiements pour les commandes confirmées/livrées/expédiées
INSERT INTO paiements (id_commande, montant, methode_paiement, statut_paiement, transaction_id, date_paiement, informations_json) VALUES
(1, 143.77, 'carte_bancaire', 'reussi', 'TXN-2025-15-001-4532', '2025-01-15 14:33:45',
 '{"carte_type": "Visa", "derniers_chiffres": "4532", "banque": "Crédit Mutuel"}'),

(2, 126.87, 'paypal', 'reussi', 'PAYPAL-2025-40-234', '2025-02-10 10:16:23',
 '{"email_paypal": "y***i@email.fr"}'),

(3, 534.96, 'carte_bancaire', 'reussi', 'TXN-2025-60-002-8891', '2025-03-01 16:46:12',
 '{"carte_type": "Mastercard", "derniers_chiffres": "8891", "banque": "LCL"}'),

(4, 523.86, 'carte_bancaire', 'reussi', 'TXN-2025-75-003-2341', '2025-03-10 11:21:05',
 '{"carte_type": "Visa", "derniers_chiffres": "2341", "banque": "BNP Paribas"}'),

(5, 52.48, 'carte_bancaire', 'reussi', 'TXN-2025-55-004-7823', '2025-02-25 09:31:20',
 '{"carte_type": "Visa", "derniers_chiffres": "7823", "banque": "Société Générale"}');

-- Paiement en attente
INSERT INTO paiements (id_commande, montant, methode_paiement, statut_paiement, date_paiement) VALUES
(6, 195.97, 'carte_bancaire', 'en_attente', '2025-03-15 20:15:30');

-- ============================================
-- 8. INSERTION DES LIVRAISONS
-- ============================================

-- Livraison 1 : Livrée
INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison, 
                        date_expedition, date_livraison_estimee, date_livraison_reelle, 
                        signature_destinataire, commentaires) VALUES
(1, 'Colissimo', '6A12345678901FR', 'livree',
 '2025-01-16 09:00:00', '2025-01-18', '2025-01-17 15:23:00',
 'L.Dubois', 'Livré en boîte aux lettres');

-- Livraison 2 : En transit
INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison,
                        date_expedition, date_livraison_estimee, commentaires) VALUES
(2, 'Chronopost', 'CH98765432109FR', 'en_transit',
 '2025-03-11 08:30:00', '2025-03-13', 'Livraison express 24h');

-- Livraison 3 : En préparation (pas encore expédiée)
INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison,
                        date_livraison_estimee, commentaires) VALUES
(3, 'UPS', 'UPS123456789FR', 'en_attente',
 '2025-03-18', 'Colis volumineux - Livraison sur RDV');

-- Livraison 4 : En préparation
INSERT INTO livraisons (id_commande, transporteur, statut_livraison, date_livraison_estimee) VALUES
(4, 'Colissimo', 'en_attente', '2025-03-20');

-- Livraison 5 : Livrée
INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison,
                        date_expedition, date_livraison_estimee, date_livraison_reelle,
                        signature_destinataire) VALUES
(5, 'Mondial Relay', 'MR789456123FR', 'livree',
 '2025-02-26 10:00:00', '2025-02-28', '2025-02-27 14:45:00',
 'M.Petit');

-- ============================================
-- 9. INSERTION DES PANIERS (clients avec panier actif)
-- ============================================

-- Panier de Camille
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(9, 5, 1, '2025-03-14 18:30:00'),  -- Xenoblade Chronicles 3
(9, 19, 1, '2025-03-14 18:35:00'), -- Nendoroid Link
(9, 27, 1, '2025-03-15 10:20:00'); -- T-shirt Akatsuki

-- Panier de Hugo
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(10, 4, 1, '2025-03-15 16:00:00'),  -- Elden Ring
(10, 20, 1, '2025-03-15 16:05:00'),  -- Nendoroid Sukuna
(10, 38, 2, '2025-03-15 16:10:00');  -- Lampe One Piece x2

-- Panier d'Alexandre (hésitant)
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(8, 22, 1, '2025-03-10 12:00:00'),  -- Figurine Miku Scale
(8, 32, 1, '2025-03-12 15:30:00');  -- Hyrule Historia

-- ============================================
-- 10. INSERTION DES AVIS PRODUITS
-- ============================================

-- Avis sur Persona 5 Royal
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(3, 3, 5, 'Chef-d\'œuvre absolu ! Plus de 120h de jeu et je ne m\'en lasse pas. L\'histoire est captivante, les personnages attachants et le gameplay est parfait. Un must-have pour tout fan de JRPG !', 
 '2025-01-20 16:45:00', 'approuve', 15),

(3, 5, 5, 'Incroyable ! La version Royal ajoute tellement de contenu. Le nouveau semestre et les nouveaux personnages sont excellents. Le meilleur Persona pour moi.',
 '2025-02-05 11:30:00', 'approuve', 8);

-- Avis sur Elden Ring
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(4, 6, 5, 'FromSoftware au sommet de son art. L\'open world est magnifique et regorge de secrets. Difficulté élevée mais juste. Masterpiece.',
 '2025-02-15 14:20:00', 'approuve', 22),

(4, 8, 4, 'Excellent jeu mais vraiment difficile pour les débutants. Prenez votre temps et explorez, ça vaut le coup ! Les boss sont épiques.',
 '2025-03-01 09:15:00', 'approuve', 5);

-- Avis sur Zelda TOTK
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(5, 9, 5, 'Nintendo a encore frappé fort ! Les nouvelles mécaniques (Emprise, Assemblage) sont géniales. Le jeu est encore plus vaste que BOTW. Perfection !',
 '2025-02-20 20:30:00', 'approuve', 18);

-- Avis sur les manga
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(10, 7, 5, 'Arc Wano qui arrive à son apogée ! Oda est au top de sa forme. Les révélations s\'enchaînent. Vivement le prochain tome !',
 '2025-03-01 13:00:00', 'approuve', 12),

(11, 4, 5, 'Jujutsu Kaisen ne déçoit jamais ! Le Culling Game est intense. Les combats sont spectaculaires. Gege Akutami est un génie.',
 '2025-02-15 17:45:00', 'approuve', 9),

(13, 7, 5, 'Adorable et hilarant ! La famille Forger est attachante. Parfait mélange d\'action, comédie et émotion. Accessible à tous.',
 '2025-03-02 10:20:00', 'approuve', 7);

-- Avis sur figurines
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(18, 4, 5, 'Nendoroid de qualité exceptionnelle ! Les détails sont parfaits, les accessoires nombreux. Makima est magnifique en version chibi.',
 '2025-02-18 15:30:00', 'approuve', 11),

(21, 6, 5, 'Figurine scale absolument sublime ! Les détails sont incroyables, la peinture impeccable, la pose dynamique. Cher mais ça vaut le prix. Un must pour les fans de NieR.',
 '2025-03-12 19:00:00', 'approuve', 14);

-- Avis sur accessoires gaming
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(24, 5, 5, 'Meilleure souris gaming que j\'ai testée ! Ultra légère, capteur précis, batterie qui dure longtemps. Parfaite pour le FPS compétitif.',
 '2025-03-05 21:30:00', 'approuve', 6),

(23, 3, 4, 'Excellent clavier mais un peu bruyant avec les switches verts. RGB magnifique, construction solide. Je recommande !',
 '2025-02-10 12:45:00', 'approuve', 4);

-- Avis sur livres
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(30, 6, 5, 'Artbook somptueux ! 400 pages d\'illustrations époustouflantes. Indispensable pour tout fan d\'Elden Ring. La qualité d\'impression est top.',
 '2025-03-13 16:20:00', 'approuve', 8);

-- Avis merchandising
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
(37, 4, 5, 'Peluche énorme et ultra douce ! Pikachu est adorable. Qualité Pokémon Center officielle. Mon enfant l\'adore !',
 '2025-02-20 14:00:00', 'approuve', 10),

(35, 3, 5, 'Mug thermoréactif génial ! L\'effet de transformation fonctionne parfaitement. Fait son effet à chaque fois. Cadeau idéal !',
 '2025-01-25 11:15:00', 'approuve', 5);

-- Quelques avis en attente de modération
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation) VALUES
(2, 9, 4, 'Jeu action RPG très bon mais l\'histoire est un peu courte. Les combats sont spectaculaires par contre !',
 '2025-03-14 18:00:00', 'en_attente'),

(27, 10, 5, 'T-shirt de super qualité ! Le logo Akatsuki est bien brodé. Taille parfaitement.',
 '2025-03-15 12:00:00', 'en_attente');

-- ============================================
-- 11. MOUVEMENTS DE STOCK MANUELS
-- (en plus de ceux créés automatiquement)
-- ============================================

-- Réception de nouvelle marchandise
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, commentaire, id_utilisateur, date_mouvement) VALUES
(1, 'entree', 30, 50, 80, 'Réapprovisionnement - Arrivage nouvelle livraison', 1, '2025-03-10 09:00:00'),
(10, 'entree', 50, 100, 150, 'Réapprovisionnement manga One Piece - forte demande', 2, '2025-03-08 10:30:00'),
(33, 'entree', 15, 20, 35, 'Réception Display Pokémon 151', 1, '2025-03-05 14:00:00');

-- Réservations pour commandes
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
(3, 'reservation', -1, 50, 49, 1, 'Réservation pour commande CMD-2025-00001', '2025-01-15 14:33:00'),
(24, 'reservation', -1, 30, 29, 3, 'Réservation pour commande CMD-2025-00003', '2025-03-01 16:46:00'),
(21, 'reservation', -1, 15, 14, 4, 'Réservation pour commande CMD-2025-00004', '2025-03-10 11:21:00');

-- Sorties après expédition
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
(3, 'sortie', -1, 49, 48, 1, 'Expédition commande CMD-2025-00001', '2025-01-16 09:00:00'),
(10, 'sortie', -2, 100, 98, 1, 'Expédition commande CMD-2025-00001 - 2 exemplaires', '2025-01-16 09:00:00'),
(18, 'sortie', -1, 15, 14, 2, 'Expédition commande CMD-2025-00002', '2025-03-11 08:30:00');

-- Ajustement inventaire
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, commentaire, id_utilisateur, date_mouvement) VALUES
(26, 'ajustement', 2, 28, 30, 'Correction inventaire - 2 unités retrouvées en stock', 2, '2025-03-01 17:00:00');

-- ============================================
-- RÉSUMÉ DES INSERTIONS
-- ============================================

SELECT 'Données insérées avec succès !' AS Message;

SELECT 
    'Utilisateurs' AS Type, COUNT(*) AS Nombre FROM utilisateurs
UNION ALL
SELECT 'Catégories', COUNT(*) FROM categories
UNION ALL
SELECT 'Produits', COUNT(*) FROM produits
UNION ALL
SELECT 'Stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'Commandes', COUNT(*) FROM commandes
UNION ALL
SELECT 'Détails commande', COUNT(*) FROM details_commande
UNION ALL
SELECT 'Paiements', COUNT(*) FROM paiements
UNION ALL
SELECT 'Livraisons', COUNT(*) FROM livraisons
UNION ALL
SELECT 'Paniers actifs', COUNT(*) FROM panier
UNION ALL
SELECT 'Avis produits', COUNT(*) FROM avis_produits
UNION ALL
SELECT 'Points de retrait', COUNT(*) FROM points_retrait
UNION ALL
SELECT 'Mouvements stock', COUNT(*) FROM mouvements_stock;

-- Affichage de quelques statistiques
SELECT 
    'Statistiques' AS Type,
    'Informations' AS Détails;

SELECT 
    'Produits par catégorie' AS Information,
    c.nom_categorie AS Catégorie,
    COUNT(p.id_produit) AS Nombre_Produits
FROM categories c
LEFT JOIN produits p ON c.id_categorie = p.id_categorie
WHERE c.categorie_parente_id IS NULL
GROUP BY c.id_categorie, c.nom_categorie
ORDER BY Nombre_Produits DESC;

SELECT 
    'Chiffre d\'affaires total' AS Information,
    CONCAT(ROUND(SUM(montant_total), 2), ' €') AS Montant
FROM commandes
WHERE statut NOT IN ('annulee');

SELECT
    'Valeur stock total' AS Information,
    CONCAT(ROUND(SUM(p.prix * s.quantite_disponible), 2), ' €') AS Valeur
FROM produits p
JOIN stocks s ON p.id_produit = s.id_produit;

-- ============================================
-- PARTIE 2 : EXTENSION CATALOGUE
-- 90+ nouveaux produits (jeux indie, manga complets, merchandising)
-- ============================================

-- ============================================
-- Script d'extension des données - GeekShop Paradise
-- Ajout de jeux indie, manga complets, merchandising varié
-- ============================================

-- ============================================
-- AJOUT DE NOUVELLES SOUS-CATÉGORIES
-- ============================================

INSERT INTO categories (nom_categorie, description, categorie_parente_id, image_url) VALUES
-- Sous-catégories Jeux Vidéo
('Jeux Indépendants', 'Jeux indie et créations originales', 1, '/images/categories/indie-games.jpg'),
('Jeux Rétro', 'Classiques rétro et remakes', 1, '/images/categories/retro-gaming.jpg'),

-- Sous-catégories Manga détaillées
('Josei', 'Manga pour femmes adultes', 2, '/images/categories/josei.jpg'),
('Kodomo', 'Manga pour enfants', 2, '/images/categories/kodomo.jpg'),

-- Sous-catégories Merchandising
('Posters & Affiches', 'Posters, affiches et art prints', 8, '/images/categories/posters.jpg'),
('Porte-clés & Pin\'s', 'Petits accessoires de collection', 8, '/images/categories/keychains.jpg'),
('Sacs & Accessoires', 'Sacs à dos, pochettes, etc.', 8, '/images/categories/bags.jpg'),
('Décoration', 'Objets de décoration geek', 8, '/images/categories/decoration.jpg'),

-- Nouvelles catégories principales
('Art & Créations Originales', 'Créations artistiques originales et commissions', NULL, '/images/categories/original-art.jpg'),
('Jeux de Société', 'Jeux de plateau et cartes', NULL, '/images/categories/board-games.jpg');

-- ============================================
-- INSERTION DES JEUX INDÉPENDANTS
-- ============================================

INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
-- Jeux Indie sur Switch
('Undertale - Physical Edition', 'Le RPG culte où personne n\'a besoin de mourir. Édition physique collector avec livret.', 34.99, 20, 'Fangamer', 0.12, '17x10.5x1',
 '["images/produits/undertale-switch.jpg", "images/produits/undertale-collector.jpg"]', 'disponible',
 '["rpg", "indie", "undertale", "toby_fox", "retro_style"]'),

('Hollow Knight - Collector\'s Edition', 'Metroidvania atmosphérique dans un royaume d\'insectes oublié. Edition physique rare.', 39.99, 20, 'Team Cherry', 0.12, '17x10.5x1',
 '["images/produits/hollow-knight-switch.jpg"]', 'disponible',
 '["metroidvania", "indie", "action", "hollow_knight", "difficile"]'),

('Celeste', 'Platformer exigeant et émouvant sur l\'acceptation de soi. Avec livret de développement.', 29.99, 20, 'Extremely OK Games', 0.10, '17x10.5x1',
 '["images/produits/celeste-switch.jpg"]', 'disponible',
 '["platformer", "indie", "celeste", "precision", "story"]'),

('Stardew Valley - Collector\'s Edition', 'Simulation de ferme addictive. Édition avec guide officiel et graines bonus.', 44.99, 20, 'ConcernedApe', 0.15, '17x10.5x1.5',
 '["images/produits/stardew-valley.jpg"]', 'disponible',
 '["simulation", "farming", "rpg", "indie", "relaxant"]'),

('Hades', 'Roguelike mythologique addictif des créateurs de Bastion. Narration exceptionnelle.', 29.99, 20, 'Supergiant Games', 0.10, '17x10.5x1',
 '["images/produits/hades-switch.jpg"]', 'disponible',
 '["roguelike", "action", "indie", "mythologie", "supergiant"]'),

('Dead Cells', 'Roguevania brutal et addictif. Action fluide et rejouabilité infinie.', 24.99, 20, 'Motion Twin', 0.10, '17x10.5x1',
 '["images/produits/dead-cells.jpg"]', 'disponible',
 '["roguelike", "metroidvania", "action", "indie", "difficile"]'),

('Ori and the Will of the Wisps', 'Metroidvania visuellement époustouflant avec histoire émouvante.', 29.99, 20, 'Moon Studios', 0.10, '17x10.5x1',
 '["images/produits/ori-wisps.jpg"]', 'disponible',
 '["metroidvania", "platformer", "indie", "beautiful", "story"]'),

-- Jeux Indie PC
('Disco Elysium - The Final Cut', 'RPG narratif révolutionnaire. Enquête policière philosophique unique en son genre.', 39.99, 12, 'ZA/UM', 0.15, '19x13.5x1.5',
 '["images/produits/disco-elysium.jpg"]', 'disponible',
 '["rpg", "indie", "narrative", "detective", "unique"]'),

('Outer Wilds', 'Exploration spatiale dans une boucle temporelle. Expérience inoubliable.', 24.99, 12, 'Mobius Digital', 0.12, '19x13.5x1',
 '["images/produits/outer-wilds.jpg"]', 'disponible',
 '["exploration", "indie", "space", "puzzle", "mystery"]'),

('A Short Hike', 'Aventure relaxante dans un parc provincial. Parfait pour décompresser.', 9.99, 12, 'adamgryu', 0.08, '14x12.5x0.5',
 '["images/produits/short-hike.jpg"]', 'disponible',
 '["aventure", "indie", "relaxant", "exploration", "court"]');

-- ============================================
-- INSERTION DE TOUS LES TOMES - ONE PIECE
-- ============================================

-- One Piece Tomes 1-10
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('One Piece Tome 1 - À l\'Aube d\'une Grande Aventure', 'Le début de la légende ! Luffy part à la conquête de Grand Line.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-01.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "debut"]'),
 
('One Piece Tome 2 - Contre Tout Buggy', 'Luffy affronte le clown Buggy et recrute Nami.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-02.jpg"]', 'disponible', '["manga", "shonen", "one_piece"]'),
 
('One Piece Tome 3 - Une Vérité Qui Blesse', 'L\'histoire de Nami se dévoile. Arc du Village de Kokoyashi.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-03.jpg"]', 'disponible', '["manga", "shonen", "one_piece"]'),
 
('One Piece Tome 4 - Un Chemin en Pente Raide', 'Début de l\'arc Baratie. Rencontre avec Sanji.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-04.jpg"]', 'disponible', '["manga", "shonen", "one_piece"]'),
 
('One Piece Tome 5 - Pour Qui Sonne le Glas', 'Sanji rejoint l\'équipage. Direction East Blue.', 6.90, 14, 'Glénat', 0.18, '18x11.5x1.5',
 '["images/produits/onepiece-05.jpg"]', 'disponible', '["manga", "shonen", "one_piece"]'),

('One Piece Pack Tomes 6-15', 'Pack économique des tomes 6 à 15. Arc Arlong Park et début Alabasta.', 65.00, 14, 'Glénat', 1.80, '18x11.5x15',
 '["images/produits/onepiece-pack-6-15.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 16-25', 'Pack tomes 16-25. Arc Alabasta complet avec Crocodile.', 65.00, 14, 'Glénat', 1.80, '18x11.5x15',
 '["images/produits/onepiece-pack-16-25.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 26-35', 'Pack tomes 26-35. Arc Skypiea et Water Seven.', 65.00, 14, 'Glénat', 1.80, '18x11.5x15',
 '["images/produits/onepiece-pack-26-35.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 36-45', 'Pack tomes 36-45. Enies Lobby et Thriller Bark.', 65.00, 14, 'Glénat', 1.80, '18x11.5x15',
 '["images/produits/onepiece-pack-36-45.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 46-60', 'Pack tomes 46-60. Sabaody, Impel Down et Marineford.', 97.50, 14, 'Glénat', 2.70, '18x11.5x22.5',
 '["images/produits/onepiece-pack-46-60.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 61-75', 'Pack tomes 61-75. Post-timeskip, Fishman Island, Punk Hazard, Dressrosa.', 97.50, 14, 'Glénat', 2.70, '18x11.5x22.5',
 '["images/produits/onepiece-pack-61-75.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 76-90', 'Pack tomes 76-90. Zou, Whole Cake Island, Reverie.', 97.50, 14, 'Glénat', 2.70, '18x11.5x22.5',
 '["images/produits/onepiece-pack-76-90.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]'),

('One Piece Pack Tomes 91-104', 'Pack tomes 91-104. Arc Wano complet jusqu\'à maintenant.', 91.00, 14, 'Glénat', 2.52, '18x11.5x21',
 '["images/produits/onepiece-pack-91-104.jpg"]', 'disponible', '["manga", "shonen", "one_piece", "pack"]');

-- ============================================
-- SÉRIES COMPLÈTES - JUJUTSU KAISEN
-- ============================================

INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Jujutsu Kaisen - Intégrale Tomes 1-10', 'Les 10 premiers tomes du phénomène sorcellerie. Découvrez l\'univers de Yuji Itadori.', 65.00, 14, 'Ki-oon', 1.70, '18x11.5x15',
 '["images/produits/jjk-pack-1-10.jpg"]', 'disponible', '["manga", "shonen", "jujutsu_kaisen", "pack"]'),

('Jujutsu Kaisen - Tomes 11-20', 'Suite de l\'arc du Goodwill Event et début du Shibuya Incident.', 65.00, 14, 'Ki-oon', 1.70, '18x11.5x15',
 '["images/produits/jjk-pack-11-20.jpg"]', 'disponible', '["manga", "shonen", "jujutsu_kaisen", "pack"]'),

('Jujutsu Kaisen - Tomes 21-24', 'Arc Shibuya et Culling Game. Les derniers tomes disponibles.', 27.60, 14, 'Ki-oon', 0.68, '18x11.5x6',
 '["images/produits/jjk-pack-21-24.jpg"]', 'disponible', '["manga", "shonen", "jujutsu_kaisen", "pack"]');

-- ============================================
-- NOUVELLES SÉRIES MANGA COMPLÈTES
-- ============================================

-- Attack on Titan (L'Attaque des Titans) - Série complète
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('L\'Attaque des Titans - Coffret Intégrale Tomes 1-34', 'La série culte complète ! L\'humanité contre les Titans. Box collector avec poster exclusif.', 225.00, 15, 'Pika', 6.80, '25x18x20',
 '["images/produits/aot-complete-box.jpg"]', 'disponible', '["manga", "seinen", "attack_on_titan", "snk", "collector", "complet"]'),

('L\'Attaque des Titans Pack Tomes 1-10', 'Découverte de l\'univers des Titans. Le début épique.', 65.00, 15, 'Pika', 2.00, '18x11.5x15',
 '["images/produits/aot-pack-1-10.jpg"]', 'disponible', '["manga", "seinen", "attack_on_titan", "pack"]'),

('L\'Attaque des Titans Pack Tomes 11-22', 'Les mystères se dévoilent. Arc politique et révélations.', 78.00, 15, 'Pika', 2.40, '18x11.5x18',
 '["images/produits/aot-pack-11-22.jpg"]', 'disponible', '["manga", "seinen", "attack_on_titan", "pack"]'),

('L\'Attaque des Titans Pack Tomes 23-34 (Final)', 'La guerre finale. Conclusion épique de la saga.', 78.00, 15, 'Pika', 2.40, '18x11.5x18',
 '["images/produits/aot-pack-23-34.jpg"]', 'disponible', '["manga", "seinen", "attack_on_titan", "pack"]');

-- Tokyo Revengers - Série en cours
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Tokyo Revengers Pack Tomes 1-10', 'Voyages dans le temps et gangs de Tokyo. Thriller captivant.', 68.00, 14, 'Glénat', 1.70, '18x11.5x15',
 '["images/produits/tokyo-revengers-1-10.jpg"]', 'disponible', '["manga", "shonen", "tokyo_revengers", "time_travel", "pack"]'),

('Tokyo Revengers Pack Tomes 11-20', 'Modification du passé. Les batailles s\'intensifient.', 68.00, 14, 'Glénat', 1.70, '18x11.5x15',
 '["images/produits/tokyo-revengers-11-20.jpg"]', 'disponible', '["manga", "shonen", "tokyo_revengers", "pack"]'),

('Tokyo Revengers Tome 31', 'Dernier tome disponible. La saga touche à sa fin.', 6.80, 14, 'Glénat', 0.17, '18x11.5x1.5',
 '["images/produits/tokyo-revengers-31.jpg"]', 'disponible', '["manga", "shonen", "tokyo_revengers"]');

-- Demon Slayer (Kimetsu no Yaiba) - Série complète
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Demon Slayer - Coffret Intégral 23 Tomes', 'La série phénomène complète dans un coffret collector. Tanjiro vs Muzan.', 155.00, 14, 'Panini', 4.60, '25x18x15',
 '["images/produits/demon-slayer-coffret.jpg"]', 'disponible', '["manga", "shonen", "demon_slayer", "kimetsu", "collector", "complet"]'),

('Demon Slayer Pack Tomes 1-12', 'Formation et premières missions. Arc Spider Mountain.', 82.00, 14, 'Panini', 2.04, '18x11.5x18',
 '["images/produits/demon-slayer-1-12.jpg"]', 'disponible', '["manga", "shonen", "demon_slayer", "pack"]'),

('Demon Slayer Pack Tomes 13-23', 'Les piliers, Mugen Train et bataille finale.', 75.00, 14, 'Panini', 1.87, '18x11.5x16.5',
 '["images/produits/demon-slayer-13-23.jpg"]', 'disponible', '["manga", "shonen", "demon_slayer", "pack"]');

-- Death Note - Classique complet
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Death Note - Intégrale Black Edition', 'Le thriller psychologique culte. 6 tomes format deluxe.', 65.00, 14, 'Kana', 2.40, '21x15x10',
 '["images/produits/death-note-black.jpg"]', 'disponible', '["manga", "shonen", "death_note", "thriller", "collector"]'),

('Death Note - Coffret All in One', 'Tous les chapitres en 1 volume géant ! Edition collector ultime.', 89.00, 14, 'Kana', 3.50, '25x18x5',
 '["images/produits/death-note-all-in-one.jpg"]', 'disponible', '["manga", "shonen", "death_note", "collector", "unique"]');

-- Fullmetal Alchemist - Série complète
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Fullmetal Alchemist - Perfect Edition Coffret', 'Les 27 tomes en édition perfect. Chef-d\'œuvre d\'Hiromu Arakawa.', 185.00, 14, 'Kurokawa', 8.10, '30x22x20',
 '["images/produits/fma-perfect-box.jpg"]', 'disponible', '["manga", "shonen", "fullmetal_alchemist", "fma", "collector", "complet"]');

-- ============================================
-- MERCHANDISING MANGA/ANIME VARIÉ
-- ============================================

-- Figurines supplémentaires
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Nendoroid Tanjiro Kamado (Demon Slayer)', 'Tanjiro avec épée Nichirin et effets d\'eau. Accessoires variés.', 59.99, 17, 'Good Smile Company', 0.25, '12x10x8',
 '["images/produits/nendo-tanjiro.jpg"]', 'disponible', '["figurine", "nendoroid", "demon_slayer", "tanjiro"]'),

('Nendoroid Nezuko Kamado (Demon Slayer)', 'Nezuko avec bambou et forme démoniaque. Adorable et détaillée.', 59.99, 17, 'Good Smile Company', 0.25, '12x10x8',
 '["images/produits/nendo-nezuko.jpg"]', 'disponible', '["figurine", "nendoroid", "demon_slayer", "nezuko"]'),

('Nendoroid Levi Ackerman (Attack on Titan)', 'Le soldat le plus fort de l\'humanité en version chibi avec équipement 3D.', 64.99, 17, 'Good Smile Company', 0.26, '12x10x8',
 '["images/produits/nendo-levi.jpg"]', 'disponible', '["figurine", "nendoroid", "attack_on_titan", "levi"]'),

('Nendoroid Eren Yeager (Attack on Titan)', 'Eren avec transformation Titan. Plusieurs expressions.', 59.99, 17, 'Good Smile Company', 0.25, '12x10x8',
 '["images/produits/nendo-eren.jpg"]', 'disponible', '["figurine", "nendoroid", "attack_on_titan", "eren"]'),

('Nendoroid Gojo Satoru DX Ver. (JJK)', 'Version deluxe avec bandeau, lunettes et domaine infini.', 74.99, 17, 'Good Smile Company', 0.28, '12x10x8',
 '["images/produits/nendo-gojo-dx.jpg"]', 'disponible', '["figurine", "nendoroid", "jujutsu_kaisen", "gojo", "deluxe"]'),

('Nendoroid Sans (Undertale)', 'Le squelette le plus cool en version Nendoroid. Avec hotdog et effets.', 54.99, 17, 'Good Smile Company', 0.24, '12x10x8',
 '["images/produits/nendo-sans.jpg"]', 'disponible', '["figurine", "nendoroid", "undertale", "sans"]'),

('Nendoroid The Knight (Hollow Knight)', 'Le petit héros de Hallownest avec clous et charmes.', 54.99, 17, 'Good Smile Company', 0.24, '12x10x8',
 '["images/produits/nendo-hollow-knight.jpg"]', 'disponible', '["figurine", "nendoroid", "hollow_knight", "indie"]');

-- Figurines Scale supplémentaires
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Tanjiro Kamado 1/8 Scale (Hinokami Kagura)', 'Tanjiro exécutant la Danse du Dieu du Feu. Effets de flammes spectaculaires.', 189.99, 19, 'Aniplex', 1.10, '35x25x15',
 '["images/produits/tanjiro-scale.jpg"]', 'disponible', '["figurine", "scale", "demon_slayer", "tanjiro", "premium"]'),

('Levi Ackerman 1/8 Scale (Cleaning Ver.)', 'Levi version nettoyage. Qualité exceptionnelle et détails parfaits.', 179.99, 19, 'Kotobukiya', 1.05, '32x22x14',
 '["images/produits/levi-scale.jpg"]', 'disponible', '["figurine", "scale", "attack_on_titan", "levi", "unique"]'),

('Asuna Yuuki 1/7 Scale (SAO Alicization)', 'Asuna dans sa tenue Alicization. Pose dynamique avec rapière.', 199.99, 19, 'Aniplex', 1.15, '35x25x15',
 '["images/produits/asuna-scale.jpg"]', 'disponible', '["figurine", "scale", "sword_art_online", "asuna", "premium"]');

-- Posters et Affiches
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Poster One Piece - Équipage au Grand Complet', 'Poster A1 premium (60x84cm) avec tous les Chapeaux de Paille. Papier glacé haute qualité.', 19.99, 24, 'ABYstyle', 0.15, '84x60x0.1',
 '["images/produits/poster-onepiece-crew.jpg"]', 'disponible', '["poster", "one_piece", "equipage", "deco"]'),

('Poster Attack on Titan - Survey Corps', 'Poster A2 (42x60cm) du Bataillon d\'Exploration. Design épique.', 14.99, 24, 'Great Eastern', 0.10, '60x42x0.1',
 '["images/produits/poster-aot-survey.jpg"]', 'disponible', '["poster", "attack_on_titan", "survey_corps", "deco"]'),

('Poster Demon Slayer - Tanjiro vs Rui', 'Poster A2 combat épique. Effets d\'eau magnifiques.', 14.99, 24, 'GE Animation', 0.10, '60x42x0.1',
 '["images/produits/poster-ds-tanjiro-rui.jpg"]', 'disponible', '["poster", "demon_slayer", "combat", "deco"]'),

('Poster Jujutsu Kaisen - Team Tokyo', 'Poster A1 des élèves de Tokyo Jujutsu High. Design dynamique.', 19.99, 24, 'Crunchyroll Store', 0.15, '84x60x0.1',
 '["images/produits/poster-jjk-tokyo.jpg"]', 'disponible', '["poster", "jujutsu_kaisen", "equipe", "deco"]'),

('Set de 3 Posters Hollow Knight', 'Trois posters A3 (30x42cm). Hollow Knight, Hornet et le Radiance.', 29.99, 24, 'Fangamer', 0.18, '42x30x0.3',
 '["images/produits/poster-set-hollow-knight.jpg"]', 'disponible', '["poster", "hollow_knight", "indie", "set", "deco"]'),

('Poster Métallique Undertale - Cast Complet', 'Plaque métal 40x30cm. Tous les personnages d\'Undertale. Coins arrondis.', 29.99, 24, 'Displate', 0.65, '40x30x0.1',
 '["images/produits/poster-metal-undertale.jpg"]', 'disponible', '["poster", "metal", "undertale", "personnages", "deco"]');

-- Porte-clés et Pin's
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Porte-clés Acrylique One Piece - Set Mugiwara', 'Set de 9 porte-clés acrylique de l\'équipage. Haute qualité 6cm.', 24.99, 25, 'Ichiban Kuji', 0.12, '6x6x0.5',
 '["images/produits/keychain-set-onepiece.jpg"]', 'disponible', '["porte_cles", "acrylique", "one_piece", "set"]'),

('Porte-clés Métal Hollow Knight - Knight', 'Porte-clés en métal émaillé du Knight. Finition premium.', 12.99, 25, 'Fangamer', 0.08, '5x4x0.5',
 '["images/produits/keychain-hollow-knight.jpg"]', 'disponible', '["porte_cles", "metal", "hollow_knight", "premium"]'),

('Set de Pin\'s Jujutsu Kaisen', '6 pin\'s émaillés : Yuji, Megumi, Nobara, Gojo, Sukuna, Toge. Qualité collector.', 34.99, 25, 'Crunchyroll Store', 0.10, '3x3x0.8',
 '["images/produits/pins-set-jjk.jpg"]', 'disponible', '["pins", "jujutsu_kaisen", "enamel", "set", "collector"]'),

('Pin\'s Demon Slayer - Nichirin Sword', 'Pin\'s épée Nichirin de Tanjiro. Émail dur avec paillettes.', 9.99, 25, 'Hot Topic', 0.04, '4x1.5x0.5',
 '["images/produits/pin-nichirin-sword.jpg"]', 'disponible', '["pins", "demon_slayer", "epee", "enamel"]'),

('Porte-clés Attack on Titan - Survey Corps Emblem', 'Emblème 3D du Bataillon. Métal robuste avec chaîne.', 14.99, 25, 'Great Eastern', 0.09, '5x5x1',
 '["images/produits/keychain-survey-corps.jpg"]', 'disponible', '["porte_cles", "attack_on_titan", "embleme", "3d"]');

-- Sacs et Accessoires
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Sac à Dos Attack on Titan - Survey Corps', 'Sac à dos gris et vert avec ailes de liberté brodées. Compartiment laptop.', 49.99, 26, 'Bioworld', 0.65, '45x30x15',
 '["images/produits/backpack-aot-survey.jpg"]', 'disponible', '["sac", "sac_a_dos", "attack_on_titan", "survey_corps"]'),

('Sac Messenger One Piece - Thousand Sunny', 'Sacoche bandoulière avec le Sunny. Design élégant et pratique.', 39.99, 26, 'ABYstyle', 0.45, '35x28x8',
 '["images/produits/messenger-bag-onepiece.jpg"]', 'disponible', '["sac", "messenger", "one_piece", "sunny"]'),

('Pochette Hollow Knight - Elderbug', 'Petite pochette zippée adorable. Parfaite pour accessoires.', 19.99, 26, 'Fangamer', 0.12, '20x15x3',
 '["images/produits/pouch-hollow-knight.jpg"]', 'disponible', '["pochette", "hollow_knight", "elderbug", "cute"]'),

('Trousse Demon Slayer - Motif Tanjiro', 'Trousse scolaire avec motif haori de Tanjiro. Double compartiment.', 24.99, 26, 'GE Animation', 0.18, '22x10x8',
 '["images/produits/pencil-case-demon-slayer.jpg"]', 'disponible', '["trousse", "demon_slayer", "tanjiro", "scolaire"]');

-- Décorations diverses
INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Lampe LED Attack on Titan - Titan Colossal', 'Lampe 3D illusion du Titan Colossal. 7 couleurs changeantes.', 44.99, 27, 'AnimeLight', 0.55, '25x20x10',
 '["images/produits/lamp-aot-colossal.jpg"]', 'disponible', '["lampe", "led", "attack_on_titan", "titan", "deco"]'),

('Coussin Peluche Demon Slayer - Nezuko Chibi', 'Coussin 40cm en forme de Nezuko chibi. Ultra doux.', 34.99, 27, 'Banpresto', 0.40, '40x35x15',
 '["images/produits/cushion-nezuko.jpg"]', 'disponible', '["coussin", "peluche", "demon_slayer", "nezuko", "deco"]'),

('Horloge Murale Jujutsu Kaisen - Domain Expansion', 'Horloge 30cm avec design Domain Expansion. Silencieuse.', 39.99, 27, 'GeekClocks', 0.50, '30x30x5',
 '["images/produits/clock-jjk-domain.jpg"]', 'disponible', '["horloge", "jujutsu_kaisen", "domain", "murale", "deco"]'),

('Stickers Undertale - Pack de 50', 'Pack de 50 stickers waterproof de tous les personnages. Haute qualité.', 12.99, 27, 'Redbubble', 0.08, '15x10x0.5',
 '["images/produits/stickers-undertale-pack.jpg"]', 'disponible', '["stickers", "undertale", "pack", "waterproof"]'),

('Tapis de Sol Hollow Knight - Hallownest Map', 'Tapis 60x90cm avec carte de Hallownest. Anti-dérapant.', 34.99, 27, 'Fangamer', 0.55, '90x60x0.5',
 '["images/produits/rug-hollow-knight-map.jpg"]', 'disponible', '["tapis", "hollow_knight", "carte", "deco"]');

-- ============================================
-- T-SHIRTS ET VÊTEMENTS SUPPLÉMENTAIRES
-- ============================================

INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('T-shirt Attack on Titan - Survey Corps Logo', 'T-shirt noir premium avec logo brodé. 100% coton bio.', 34.99, 5, 'Crunchyroll Store', 0.22, 'Taille: S-XXL',
 '["images/produits/tshirt-aot-survey.jpg"]', 'disponible', '["vetement", "tshirt", "attack_on_titan", "survey_corps"]'),

('T-shirt Demon Slayer - Tanjiro Haori Pattern', 'T-shirt all-over print motif haori. Design unique et authentique.', 39.99, 5, 'Hot Topic', 0.23, 'Taille: S-XXL',
 '["images/produits/tshirt-ds-haori.jpg"]', 'disponible', '["vetement", "tshirt", "demon_slayer", "tanjiro", "haori"]'),

('Hoodie Jujutsu Kaisen - Tokyo Jujutsu High', 'Sweat à capuche bleu marine école de Tokyo. Broderie qualité.', 64.99, 5, 'Crunchyroll Store', 0.70, 'Taille: S-XXL',
 '["images/produits/hoodie-jjk-school.jpg"]', 'disponible', '["vetement", "hoodie", "jujutsu_kaisen", "school"]'),

('Hoodie Hollow Knight - Shade Cloak', 'Hoodie noir avec design Shade Cloak. Capuche avec cornes.', 69.99, 5, 'Fangamer', 0.75, 'Taille: S-XXL',
 '["images/produits/hoodie-hollow-knight-shade.jpg"]', 'disponible', '["vetement", "hoodie", "hollow_knight", "shade"]'),

('Veste Bomber One Piece - Équipage Personnalisable', 'Veste style bomber avec patch Mugiwara. Doublure satinée.', 89.99, 5, 'SuperGroupies', 0.85, 'Taille: S-XXL',
 '["images/produits/bomber-onepiece.jpg"]', 'disponible', '["vetement", "veste", "one_piece", "bomber", "premium"]'),

('T-shirt Undertale - Determination', 'T-shirt gris avec âme rouge et texte DETERMINATION. Style minimaliste.', 29.99, 5, 'Fangamer', 0.20, 'Taille: S-XXL',
 '["images/produits/tshirt-undertale-determination.jpg"]', 'disponible', '["vetement", "tshirt", "undertale", "determination"]');

-- ============================================
-- JEUX DE SOCIÉTÉ
-- ============================================

INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Monopoly One Piece Edition', 'Monopoly officiel One Piece. Parcourez Grand Line et devenez Roi des Pirates !', 49.99, 29, 'Winning Moves', 1.20, '40x27x5',
 '["images/produits/monopoly-onepiece.jpg"]', 'disponible', '["jeu", "plateau", "monopoly", "one_piece", "famille"]'),

('Cluedo Attack on Titan', 'Qui a laissé entrer les Titans ? Enquête au sein des Murs. Plateau et personnages custom.', 44.99, 29, 'Winning Moves', 1.10, '40x27x5',
 '["images/produits/cluedo-aot.jpg"]', 'disponible', '["jeu", "plateau", "cluedo", "attack_on_titan", "enquete"]'),

('Uno Demon Slayer', 'UNO officiel avec cartes spéciales techniques de respiration. Règles exclusives.', 14.99, 29, 'Mattel', 0.25, '15x10x3',
 '["images/produits/uno-demon-slayer.jpg"]', 'disponible', '["jeu", "cartes", "uno", "demon_slayer", "famille"]'),

('Jeu de Cartes Jujutsu Kaisen Battle', 'Jeu de cartes stratégique officiel. Affrontez les fléaux avec vos techniques !', 24.99, 29, 'Bandai', 0.35, '18x13x4',
 '["images/produits/card-game-jjk.jpg"]', 'disponible', '["jeu", "cartes", "jujutsu_kaisen", "battle", "strategie"]'),

('Puzzle 1000 pièces - One Piece Wanted Posters', 'Puzzle des avis de recherche de l\'équipage. Haute qualité 70x50cm.', 24.99, 29, 'Ensky', 0.70, '37x27x6',
 '["images/produits/puzzle-onepiece-wanted.jpg"]', 'disponible', '["puzzle", "one_piece", "wanted", "1000_pieces"]');

-- ============================================
-- ART & CRÉATIONS ORIGINALES
-- ============================================

INSERT INTO produits (nom_produit, description, prix, id_categorie, marque, poids, dimensions, images_json, statut, tags_json) VALUES
('Art Print "Hollow Knight - City of Tears"', 'Impression d\'art originale par Team Cherry. Édition limitée signée et numérotée.', 49.99, 28, 'Fangamer', 0.15, '30x40x0.1',
 '["images/produits/art-print-hk-tears.jpg"]', 'disponible', '["art", "print", "hollow_knight", "original", "limite"]'),

('Art Book Indie Gems Volume 1', 'Artbook collector sur les jeux indie. Celeste, Hades, Hollow Knight, Ori. 200 pages.', 39.99, 28, 'IndieBox', 1.00, '30x23x2',
 '["images/produits/artbook-indie-gems.jpg"]', 'disponible', '["artbook", "indie", "collection", "celeste", "hades"]'),

('Print Set "Undertale Souls Collection"', 'Set de 7 prints (20x20cm) des 7 âmes. Papier premium mat. Édition limitée.', 59.99, 28, 'Fangamer', 0.20, '20x20x1',
 '["images/produits/print-set-undertale-souls.jpg"]', 'disponible', '["art", "print", "undertale", "souls", "set", "limite"]'),

('Lithographie One Piece "Going Merry Farewell"', 'Lithographie officielle scène d\'adieux au Merry. 40x30cm numérotée /500.', 79.99, 28, 'Toei Animation', 0.25, '40x30x0.2',
 '["images/produits/litho-onepiece-merry.jpg"]', 'disponible', '["art", "lithographie", "one_piece", "merry", "limite", "officiel"]'),

('Commission Artwork - Portrait Personnage', 'Commission d\'art personnalisée de votre personnage favori. Style anime/manga.', 120.00, 28, 'GeekShop Artists', 0.10, 'A3',
 '["images/produits/commission-portrait.jpg"]', 'disponible', '["art", "commission", "personnalise", "portrait", "unique"]');

-- Mise à jour des stocks pour les nouveaux produits
UPDATE stocks SET quantite_disponible = 40, seuil_alerte = 10 
WHERE id_produit IN (SELECT id_produit FROM produits WHERE id_categorie = 20 LIMIT 20);

UPDATE stocks SET quantite_disponible = 80, seuil_alerte = 20 
WHERE id_produit IN (SELECT id_produit FROM produits WHERE marque LIKE '%Pack%' OR nom_produit LIKE '%Pack%' LIMIT 20);

UPDATE stocks SET quantite_disponible = 20, seuil_alerte = 5 
WHERE id_produit IN (SELECT id_produit FROM produits WHERE id_categorie IN (19, 28) LIMIT 20);

UPDATE stocks SET quantite_disponible = 60, seuil_alerte = 15 
WHERE id_produit IN (SELECT id_produit FROM produits WHERE id_categorie IN (24, 25, 26, 27) LIMIT 30);

UPDATE stocks SET quantite_disponible = 35, seuil_alerte = 10 
WHERE id_produit IN (SELECT id_produit FROM produits WHERE id_categorie = 29 LIMIT 10);

-- ============================================
-- RÉSUMÉ DES AJOUTS
-- ============================================

SELECT 'Extension des données terminée !' AS Message;

SELECT 
    'Statistiques mises à jour' AS Type,
    'Nouveaux produits ajoutés' AS Info;

SELECT 
    c.nom_categorie AS Catégorie,
    COUNT(p.id_produit) AS Nombre_Produits,
    CONCAT(MIN(p.prix), ' - ', MAX(p.prix), ' €') AS Fourchette_Prix
FROM categories c
LEFT JOIN produits p ON c.id_categorie = p.id_categorie
WHERE c.categorie_parente_id IS NULL OR c.id_categorie IN (20, 21, 24, 25, 26, 27, 28, 29)
GROUP BY c.id_categorie, c.nom_categorie
ORDER BY Nombre_Produits DESC;

SELECT 
    'Total produits' AS Métrique,
    COUNT(*) AS Valeur
FROM produits
UNION ALL
SELECT 
    'Total catégories',
    COUNT(*)
FROM categories
UNION ALL
SELECT 
    'Valeur stock totale',
    CONCAT(ROUND(SUM(p.prix * s.quantite_disponible), 2), ' €')
FROM produits p
JOIN stocks s ON p.id_produit = s.id_produit;

-- ============================================
-- PARTIE 3 : TRANSACTIONS SUPPLÉMENTAIRES
-- 6 nouvelles commandes, 15+ nouveaux avis
-- ============================================

-- ============================================
-- Script de transactions supplémentaires
-- Commandes, avis, paniers pour les nouveaux produits
-- ============================================

-- ============================================
-- NOUVELLES COMMANDES
-- ============================================

-- Commande 7 : Client passionné d'indie games
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande, commentaires) VALUES
(9, 'CMD-2025-00007', 154.95, 5.99, 25.62, 'confirmee',
 '12 Place du Capitole', 'Toulouse', '31000', 'France',
 '2025-03-16 14:25:00', 'Fan d\'indie ! Hâte de découvrir ces jeux');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 1, 34.99, 34.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight%' LIMIT 1), 1, 39.99, 39.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Celeste%' LIMIT 1), 1, 29.99, 29.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Stardew Valley%' LIMIT 1), 1, 44.99, 44.99);

-- Commande 8 : Collectionneur manga Demon Slayer
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande, code_promo, reduction) VALUES
(4, 'CMD-2025-00008', 146.55, 0.00, 24.25, 'en_preparation',
 '23 Boulevard Voltaire', 'Paris', '75011', 'France',
 '2025-03-17 10:30:00', 'MANGA15', 13.45);

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(8, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 1, 155.00, 155.00);

-- Commande 9 : Merchandising Attack on Titan
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(6, 'CMD-2025-00009', 219.95, 7.99, 36.38, 'expediee',
 '5 Quai des Belges', 'Marseille', '13001', 'France',
 '2025-03-14 16:45:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 1, 64.99, 64.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Eren%' LIMIT 1), 1, 59.99, 59.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Sac à Dos Attack on Titan%' LIMIT 1), 1, 49.99, 49.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster Attack on Titan%' LIMIT 1), 3, 14.99, 44.97);

-- Commande 10 : Intégrale One Piece
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(7, 'CMD-2025-00010', 454.50, 0.00, 75.15, 'confirmee',
 '18 Rue Nationale', 'Lille', '59000', 'France',
 '2025-03-15 13:20:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 6-15' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 16-25' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 26-35' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 36-45' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 46-60' LIMIT 1), 1, 97.50, 97.50),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 61-75' LIMIT 1), 1, 97.50, 97.50);

-- Commande 11 : Setup complet Jujutsu Kaisen fan
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(10, 'CMD-2025-00011', 349.92, 7.99, 57.89, 'en_attente',
 '25 Rue Meyerbeer', 'Nice', '06000', 'France',
 '2025-03-18 11:00:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Gojo Satoru DX%' LIMIT 1), 1, 74.99, 74.99),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Intégrale Tomes 1-10' LIMIT 1), 1, 65.00, 65.00),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Tomes 11-20' LIMIT 1), 1, 65.00, 65.00),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Jujutsu Kaisen%' LIMIT 1), 1, 64.99, 64.99),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster Jujutsu Kaisen%' LIMIT 1), 2, 19.99, 39.98),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Horloge%Jujutsu%' LIMIT 1), 1, 39.99, 39.99);

-- Commande 12 : Collection Hollow Knight
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(8, 'CMD-2025-00012', 214.92, 5.99, 35.55, 'confirmee',
 '7 Cours Mirabeau', 'Aix-en-Provence', '13100', 'France',
 '2025-03-17 19:30:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight - Collector%' LIMIT 1), 1, 39.99, 39.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid The Knight%' LIMIT 1), 1, 54.99, 54.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Set de 3 Posters Hollow Knight%' LIMIT 1), 1, 29.99, 29.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Hollow Knight%' LIMIT 1), 1, 69.99, 69.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Porte-clés Métal Hollow Knight%' LIMIT 1), 1, 12.99, 12.99);

-- ============================================
-- PAIEMENTS POUR NOUVELLES COMMANDES
-- ============================================

INSERT INTO paiements (id_commande, montant, methode_paiement, statut_paiement, transaction_id, date_paiement, informations_json) VALUES
(7, 154.95, 'carte_bancaire', 'reussi', 'TXN-2025-16-005-9821', '2025-03-16 14:26:30',
 '{"carte_type": "Visa", "derniers_chiffres": "9821", "banque": "Caisse d\'Épargne"}'),

(8, 146.55, 'paypal', 'reussi', 'PAYPAL-2025-17-456', '2025-03-17 10:31:15',
 '{"email_paypal": "y***i@email.fr"}'),

(9, 219.95, 'carte_bancaire', 'reussi', 'TXN-2025-14-006-4567', '2025-03-14 16:46:20',
 '{"carte_type": "Mastercard", "derniers_chiffres": "4567", "banque": "Boursorama"}'),

(10, 454.50, 'carte_bancaire', 'reussi', 'TXN-2025-15-007-1122', '2025-03-15 13:21:45',
 '{"carte_type": "Visa", "derniers_chiffres": "1122", "banque": "La Banque Postale"}'),

(11, 349.92, 'carte_bancaire', 'en_attente', NULL, '2025-03-18 11:00:45', NULL),

(12, 214.92, 'carte_bancaire', 'reussi', 'TXN-2025-17-008-8899', '2025-03-17 19:31:30',
 '{"carte_type": "Visa", "derniers_chiffres": "8899", "banque": "CIC"}');

-- ============================================
-- LIVRAISONS POUR NOUVELLES COMMANDES
-- ============================================

INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison,
                        date_expedition, date_livraison_estimee, commentaires) VALUES
(7, 'Colissimo', '6A98765432101FR', 'en_attente',
 NULL, '2025-03-20', 'En attente de préparation'),

(8, 'Chronopost', 'CH11223344556FR', 'en_attente',
 NULL, '2025-03-22', 'Gros colis - Coffret manga'),

(9, 'UPS', 'UPS987654321FR', 'en_transit',
 '2025-03-15 09:00:00', '2025-03-19', 'En transit vers Marseille'),

(10, 'Geodis', 'GEO456789123FR', 'en_attente',
 NULL, '2025-03-25', 'Colis lourd - Plusieurs packs manga'),

(12, 'Colissimo', '6A55667788990FR', 'en_preparation',
 NULL, '2025-03-21', 'Préparation en cours');

-- ============================================
-- AVIS CLIENTS SUR NOUVEAUX PRODUITS
-- ============================================

-- Avis sur Undertale
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 9, 5, 
 'Chef-d\'œuvre absolu ! L\'histoire m\'a fait pleurer. Les choix ont vraiment de l\'impact et la musique est inoubliable. Un jeu que tout le monde devrait expérimenter au moins une fois.', 
 '2025-03-16 20:00:00', 'approuve', 18);

-- Avis sur Hollow Knight
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight - Collector%' LIMIT 1), 8, 5,
 'Metroidvania parfait ! L\'atmosphère de Hallownest est envoûtante. Très difficile mais juste. L\'édition collector vaut vraiment le coup avec ses bonus. 100h de jeu facilement.',
 '2025-03-18 15:30:00', 'approuve', 14);

-- Avis sur Celeste
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Celeste%' LIMIT 1), 5, 5,
 'Platformer exigeant mais avec un message magnifique sur l\'acceptation de soi. Les contrôles sont parfaits. Challenging mais jamais frustrant car on sait que c\'est notre faute.',
 '2025-02-28 18:45:00', 'approuve', 9);

-- Avis sur Stardew Valley
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Stardew Valley%' LIMIT 1), 3, 5,
 'Addictif au possible ! "Juste une journée de plus"... et voilà qu\'il est 3h du matin. Simulation de ferme ultra complète avec romance, exploration, combat. Un jeu parfait pour se détendre.',
 '2025-03-05 22:15:00', 'approuve', 16);

-- Avis sur Hades
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hades%' LIMIT 1), 6, 5,
 'Roguelike parfait ! Chaque run est différent. La narration progressive est brillante. Les personnages sont attachants et les combats super satisfaisants. Supergiant au top de sa forme.',
 '2025-03-10 14:20:00', 'approuve', 12);

-- Avis sur Demon Slayer Coffret
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 4, 5,
 'Coffret magnifique ! Avoir toute la série d\'un coup est génial. L\'histoire de Tanjiro est incroyable du début à la fin. Les combats sont épiques et l\'émotion est au rendez-vous.',
 '2025-03-18 16:00:00', 'approuve', 11);

-- Avis sur Attack on Titan Intégrale
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'L\'Attaque des Titans - Coffret Intégrale%' LIMIT 1), 6, 5,
 'Une des meilleures séries manga jamais écrites ! Les rebondissements, l\'univers complexe, les personnages... tout est parfait. La box collector est superbe et vaut vraiment l\'investissement.',
 '2025-03-12 19:30:00', 'approuve', 20);

-- Avis sur Tokyo Revengers
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Tokyo Revengers Pack Tomes 1-10' LIMIT 1), 10, 4,
 'Très bon manga sur les voyages temporels et les gangs. L\'histoire est addictive même si parfois un peu répétitive. Les personnages sont attachants. Hâte de lire la suite !',
 '2025-03-15 11:00:00', 'approuve', 7);

-- Avis sur Nendoroid Demon Slayer
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Tanjiro%' LIMIT 1), 6, 5,
 'Nendoroid de très haute qualité ! Les détails sont incroyables, les accessoires nombreux. La technique de respiration de l\'eau est magnifiquement représentée. Perfect pour ma collection.',
 '2025-03-15 17:00:00', 'approuve', 8);

-- Avis sur figurines Attack on Titan
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 6, 5,
 'Levi en version chibi est juste parfait ! L\'équipement tridimensionnel est détaillé, les lames sont incluses. Pose très cool. Mon Nendoroid préféré de ma collection SNK.',
 '2025-03-16 10:30:00', 'approuve', 10);

-- Avis sur merchandi Hollow Knight
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Hollow Knight%' LIMIT 1), 8, 5,
 'Hoodie ultra confortable et design subtil mais reconnaissable. La capuche avec les petites cornes est adorable. Qualité Fangamer au top comme toujours !',
 '2025-03-18 12:00:00', 'approuve', 6);

-- Avis sur art prints
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Art Print%Hollow Knight%' LIMIT 1), 8, 5,
 'Print magnifique ! La City of Tears est sublime. Papier de qualité premium, les couleurs sont fidèles. Parfait pour décorer ma gaming room. Édition limitée signée en plus !',
 '2025-03-18 20:00:00', 'approuve', 5);

-- Avis sur jeu de société
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Monopoly One Piece%' LIMIT 1), 7, 4,
 'Monopoly sympa pour les fans ! Les règles adaptées à l\'univers One Piece sont cool. Par contre toujours aussi long à jouer. Parfait pour une soirée entre amis fans de OP.',
 '2025-03-08 21:30:00', 'approuve', 4);

-- Avis sur posters
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster One Piece%Grand Complet%' LIMIT 1), 3, 5,
 'Poster A1 sublime avec tout l\'équipage ! Les couleurs sont éclatantes, la qualité d\'impression est top. Parfait pour ma chambre. Chapeaux de Paille au complet !',
 '2025-03-01 15:00:00', 'approuve', 7);

-- ============================================
-- PANIERS ACTIFS SUPPLÉMENTAIRES
-- ============================================

-- Panier utilisateur 3 (Lucas) - Découverte indie
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(3, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Disco Elysium%' LIMIT 1), 1, '2025-03-18 10:00:00'),
(3, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Outer Wilds%' LIMIT 1), 1, '2025-03-18 10:05:00');

-- Panier utilisateur 4 (Yuki) - Suite collection JJK
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(4, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Tomes 21-24' LIMIT 1), 1, '2025-03-18 14:30:00'),
(4, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Set de Pin%Jujutsu Kaisen%' LIMIT 1), 1, '2025-03-18 14:35:00');

-- Panier utilisateur 5 (Emma) - Merchandising Demon Slayer
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Nezuko%' LIMIT 1), 1, '2025-03-17 18:00:00'),
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%T-shirt Demon Slayer%' LIMIT 1), 1, '2025-03-17 18:10:00'),
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Trousse Demon Slayer%' LIMIT 1), 1, '2025-03-17 18:15:00');

-- Panier utilisateur 7 (Marie) - Suite One Piece
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 76-90' LIMIT 1), 1, '2025-03-18 09:00:00'),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 91-104' LIMIT 1), 1, '2025-03-18 09:01:00'),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Sac Messenger One Piece%' LIMIT 1), 1, '2025-03-18 09:10:00');

-- ============================================
-- MOUVEMENTS DE STOCK POUR NOUVEAUX PRODUITS
-- ============================================

-- Réceptions de marchandises
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, commentaire, id_utilisateur, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 'entree', 50, 40, 90, 'Réapprovisionnement jeux indie - Forte demande', 2, '2025-03-12 09:00:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight%' LIMIT 1), 'entree', 40, 40, 80, 'Nouvelle édition collector reçue', 2, '2025-03-12 09:30:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 'entree', 30, 20, 50, 'Réassort coffrets - Série complète', 1, '2025-03-10 10:00:00');

-- Réservations pour commandes
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 'reservation', -1, 90, 89, 7, 'Réservation CMD-2025-00007', '2025-03-16 14:26:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 'reservation', -1, 20, 19, 9, 'Réservation CMD-2025-00009', '2025-03-14 16:46:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 'reservation', -1, 50, 49, 8, 'Réservation CMD-2025-00008', '2025-03-17 10:31:00');

-- Sorties après expédition
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 'sortie', -1, 19, 18, 9, 'Expédition CMD-2025-00009', '2025-03-15 09:00:00');

-- ============================================
-- NOUVELLES COMMANDES
-- ============================================

-- Commande 7 : Client passionné d'indie games
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande, commentaires) VALUES
(9, 'CMD-2025-00007', 154.95, 5.99, 25.62, 'confirmee',
 '12 Place du Capitole', 'Toulouse', '31000', 'France',
 '2025-03-16 14:25:00', 'Fan d\'indie ! Hâte de découvrir ces jeux');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 1, 34.99, 34.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight%' LIMIT 1), 1, 39.99, 39.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Celeste%' LIMIT 1), 1, 29.99, 29.99),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Stardew Valley%' LIMIT 1), 1, 44.99, 44.99);

-- Commande 8 : Collectionneur manga Demon Slayer
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande, code_promo, reduction) VALUES
(4, 'CMD-2025-00008', 146.55, 0.00, 24.25, 'en_preparation',
 '23 Boulevard Voltaire', 'Paris', '75011', 'France',
 '2025-03-17 10:30:00', 'MANGA15', 13.45);

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(8, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 1, 155.00, 155.00);

-- Commande 9 : Merchandising Attack on Titan
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(6, 'CMD-2025-00009', 219.95, 7.99, 36.38, 'expediee',
 '5 Quai des Belges', 'Marseille', '13001', 'France',
 '2025-03-14 16:45:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 1, 64.99, 64.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Eren%' LIMIT 1), 1, 59.99, 59.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Sac à Dos Attack on Titan%' LIMIT 1), 1, 49.99, 49.99),
(9, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster Attack on Titan%' LIMIT 1), 3, 14.99, 44.97);

-- Commande 10 : Intégrale One Piece
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(7, 'CMD-2025-00010', 454.50, 0.00, 75.15, 'confirmee',
 '18 Rue Nationale', 'Lille', '59000', 'France',
 '2025-03-15 13:20:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 6-15' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 16-25' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 26-35' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 36-45' LIMIT 1), 1, 65.00, 65.00),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 46-60' LIMIT 1), 1, 97.50, 97.50),
(10, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 61-75' LIMIT 1), 1, 97.50, 97.50);

-- Commande 11 : Setup complet Jujutsu Kaisen fan
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(10, 'CMD-2025-00011', 349.92, 7.99, 57.89, 'en_attente',
 '25 Rue Meyerbeer', 'Nice', '06000', 'France',
 '2025-03-18 11:00:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Gojo Satoru DX%' LIMIT 1), 1, 74.99, 74.99),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Intégrale Tomes 1-10' LIMIT 1), 1, 65.00, 65.00),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Tomes 11-20' LIMIT 1), 1, 65.00, 65.00),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Jujutsu Kaisen%' LIMIT 1), 1, 64.99, 64.99),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster Jujutsu Kaisen%' LIMIT 1), 2, 19.99, 39.98),
(11, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Horloge%Jujutsu%' LIMIT 1), 1, 39.99, 39.99);

-- Commande 12 : Collection Hollow Knight
INSERT INTO commandes (id_utilisateur, numero_commande, montant_total, montant_livraison, montant_taxe, statut,
                       adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison,
                       date_commande) VALUES
(8, 'CMD-2025-00012', 214.92, 5.99, 35.55, 'confirmee',
 '7 Cours Mirabeau', 'Aix-en-Provence', '13100', 'France',
 '2025-03-17 19:30:00');

INSERT INTO details_commande (id_commande, id_produit, quantite, prix_unitaire, prix_total) VALUES
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight - Collector%' LIMIT 1), 1, 39.99, 39.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid The Knight%' LIMIT 1), 1, 54.99, 54.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Set de 3 Posters Hollow Knight%' LIMIT 1), 1, 29.99, 29.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Hollow Knight%' LIMIT 1), 1, 69.99, 69.99),
(12, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Porte-clés Métal Hollow Knight%' LIMIT 1), 1, 12.99, 12.99);

-- ============================================
-- PAIEMENTS POUR NOUVELLES COMMANDES
-- ============================================

INSERT INTO paiements (id_commande, montant, methode_paiement, statut_paiement, transaction_id, date_paiement, informations_json) VALUES
(7, 154.95, 'carte_bancaire', 'reussi', 'TXN-2025-16-005-9821', '2025-03-16 14:26:30',
 '{"carte_type": "Visa", "derniers_chiffres": "9821", "banque": "Caisse d\'Épargne"}'),

(8, 146.55, 'paypal', 'reussi', 'PAYPAL-2025-17-456', '2025-03-17 10:31:15',
 '{"email_paypal": "y***i@email.fr"}'),

(9, 219.95, 'carte_bancaire', 'reussi', 'TXN-2025-14-006-4567', '2025-03-14 16:46:20',
 '{"carte_type": "Mastercard", "derniers_chiffres": "4567", "banque": "Boursorama"}'),

(10, 454.50, 'carte_bancaire', 'reussi', 'TXN-2025-15-007-1122', '2025-03-15 13:21:45',
 '{"carte_type": "Visa", "derniers_chiffres": "1122", "banque": "La Banque Postale"}'),

(11, 349.92, 'carte_bancaire', 'en_attente', NULL, '2025-03-18 11:00:45', NULL),

(12, 214.92, 'carte_bancaire', 'reussi', 'TXN-2025-17-008-8899', '2025-03-17 19:31:30',
 '{"carte_type": "Visa", "derniers_chiffres": "8899", "banque": "CIC"}');

-- ============================================
-- LIVRAISONS POUR NOUVELLES COMMANDES
-- ============================================

INSERT INTO livraisons (id_commande, transporteur, numero_suivi, statut_livraison,
                        date_expedition, date_livraison_estimee, commentaires) VALUES
(7, 'Colissimo', '6A98765432101FR', 'en_attente',
 NULL, '2025-03-20', 'En attente de préparation'),

(8, 'Chronopost', 'CH11223344556FR', 'en_attente',
 NULL, '2025-03-22', 'Gros colis - Coffret manga'),

(9, 'UPS', 'UPS987654321FR', 'en_transit',
 '2025-03-15 09:00:00', '2025-03-19', 'En transit vers Marseille'),

(10, 'Geodis', 'GEO456789123FR', 'en_attente',
 NULL, '2025-03-25', 'Colis lourd - Plusieurs packs manga'),

(12, 'Colissimo', '6A55667788990FR', 'en_preparation',
 NULL, '2025-03-21', 'Préparation en cours');

-- ============================================
-- AVIS CLIENTS SUR NOUVEAUX PRODUITS
-- ============================================

-- Avis sur Undertale
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 9, 5, 
 'Chef-d\'œuvre absolu ! L\'histoire m\'a fait pleurer. Les choix ont vraiment de l\'impact et la musique est inoubliable. Un jeu que tout le monde devrait expérimenter au moins une fois.', 
 '2025-03-16 20:00:00', 'approuve', 18);

-- Avis sur Hollow Knight
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight - Collector%' LIMIT 1), 8, 5,
 'Metroidvania parfait ! L\'atmosphère de Hallownest est envoûtante. Très difficile mais juste. L\'édition collector vaut vraiment le coup avec ses bonus. 100h de jeu facilement.',
 '2025-03-18 15:30:00', 'approuve', 14);

-- Avis sur Celeste
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Celeste%' LIMIT 1), 5, 5,
 'Platformer exigeant mais avec un message magnifique sur l\'acceptation de soi. Les contrôles sont parfaits. Challenging mais jamais frustrant car on sait que c\'est notre faute.',
 '2025-02-28 18:45:00', 'approuve', 9);

-- Avis sur Stardew Valley
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Stardew Valley%' LIMIT 1), 3, 5,
 'Addictif au possible ! "Juste une journée de plus"... et voilà qu\'il est 3h du matin. Simulation de ferme ultra complète avec romance, exploration, combat. Un jeu parfait pour se détendre.',
 '2025-03-05 22:15:00', 'approuve', 16);

-- Avis sur Hades
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hades%' LIMIT 1), 6, 5,
 'Roguelike parfait ! Chaque run est différent. La narration progressive est brillante. Les personnages sont attachants et les combats super satisfaisants. Supergiant au top de sa forme.',
 '2025-03-10 14:20:00', 'approuve', 12);

-- Avis sur Demon Slayer Coffret
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 4, 5,
 'Coffret magnifique ! Avoir toute la série d\'un coup est génial. L\'histoire de Tanjiro est incroyable du début à la fin. Les combats sont épiques et l\'émotion est au rendez-vous.',
 '2025-03-18 16:00:00', 'approuve', 11);

-- Avis sur Attack on Titan Intégrale
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'L\'Attaque des Titans - Coffret Intégrale%' LIMIT 1), 6, 5,
 'Une des meilleures séries manga jamais écrites ! Les rebondissements, l\'univers complexe, les personnages... tout est parfait. La box collector est superbe et vaut vraiment l\'investissement.',
 '2025-03-12 19:30:00', 'approuve', 20);

-- Avis sur Tokyo Revengers
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Tokyo Revengers Pack Tomes 1-10' LIMIT 1), 10, 4,
 'Très bon manga sur les voyages temporels et les gangs. L\'histoire est addictive même si parfois un peu répétitive. Les personnages sont attachants. Hâte de lire la suite !',
 '2025-03-15 11:00:00', 'approuve', 7);

-- Avis sur Nendoroid Demon Slayer
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Tanjiro%' LIMIT 1), 6, 5,
 'Nendoroid de très haute qualité ! Les détails sont incroyables, les accessoires nombreux. La technique de respiration de l\'eau est magnifiquement représentée. Perfect pour ma collection.',
 '2025-03-15 17:00:00', 'approuve', 8);

-- Avis sur figurines Attack on Titan
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 6, 5,
 'Levi en version chibi est juste parfait ! L\'équipement tridimensionnel est détaillé, les lames sont incluses. Pose très cool. Mon Nendoroid préféré de ma collection SNK.',
 '2025-03-16 10:30:00', 'approuve', 10);

-- Avis sur merchandi Hollow Knight
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hoodie Hollow Knight%' LIMIT 1), 8, 5,
 'Hoodie ultra confortable et design subtil mais reconnaissable. La capuche avec les petites cornes est adorable. Qualité Fangamer au top comme toujours !',
 '2025-03-18 12:00:00', 'approuve', 6);

-- Avis sur art prints
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Art Print%Hollow Knight%' LIMIT 1), 8, 5,
 'Print magnifique ! La City of Tears est sublime. Papier de qualité premium, les couleurs sont fidèles. Parfait pour décorer ma gaming room. Édition limitée signée en plus !',
 '2025-03-18 20:00:00', 'approuve', 5);

-- Avis sur jeu de société
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Monopoly One Piece%' LIMIT 1), 7, 4,
 'Monopoly sympa pour les fans ! Les règles adaptées à l\'univers One Piece sont cool. Par contre toujours aussi long à jouer. Parfait pour une soirée entre amis fans de OP.',
 '2025-03-08 21:30:00', 'approuve', 4);

-- Avis sur posters
INSERT INTO avis_produits (id_produit, id_utilisateur, note, commentaire, date_avis, statut_moderation, utile_count) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Poster One Piece%Grand Complet%' LIMIT 1), 3, 5,
 'Poster A1 sublime avec tout l\'équipage ! Les couleurs sont éclatantes, la qualité d\'impression est top. Parfait pour ma chambre. Chapeaux de Paille au complet !',
 '2025-03-01 15:00:00', 'approuve', 7);

-- ============================================
-- PANIERS ACTIFS SUPPLÉMENTAIRES
-- ============================================

-- Panier utilisateur 3 (Lucas) - Découverte indie
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(3, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Disco Elysium%' LIMIT 1), 1, '2025-03-18 10:00:00'),
(3, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Outer Wilds%' LIMIT 1), 1, '2025-03-18 10:05:00');

-- Panier utilisateur 4 (Yuki) - Suite collection JJK
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(4, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'Jujutsu Kaisen - Tomes 21-24' LIMIT 1), 1, '2025-03-18 14:30:00'),
(4, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Set de Pin%Jujutsu Kaisen%' LIMIT 1), 1, '2025-03-18 14:35:00');

-- Panier utilisateur 5 (Emma) - Merchandising Demon Slayer
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Nezuko%' LIMIT 1), 1, '2025-03-17 18:00:00'),
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%T-shirt Demon Slayer%' LIMIT 1), 1, '2025-03-17 18:10:00'),
(5, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Trousse Demon Slayer%' LIMIT 1), 1, '2025-03-17 18:15:00');

-- Panier utilisateur 7 (Marie) - Suite One Piece
INSERT INTO panier (id_utilisateur, id_produit, quantite, date_ajout) VALUES
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 76-90' LIMIT 1), 1, '2025-03-18 09:00:00'),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE 'One Piece Pack Tomes 91-104' LIMIT 1), 1, '2025-03-18 09:01:00'),
(7, (SELECT id_produit FROM produits WHERE nom_produit LIKE '%Sac Messenger One Piece%' LIMIT 1), 1, '2025-03-18 09:10:00');

-- ============================================
-- MOUVEMENTS DE STOCK POUR NOUVEAUX PRODUITS
-- ============================================

-- Réceptions de marchandises
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, commentaire, id_utilisateur, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 'entree', 50, 40, 90, 'Réapprovisionnement jeux indie - Forte demande', 2, '2025-03-12 09:00:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Hollow Knight%' LIMIT 1), 'entree', 40, 40, 80, 'Nouvelle édition collector reçue', 2, '2025-03-12 09:30:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 'entree', 30, 20, 50, 'Réassort coffrets - Série complète', 1, '2025-03-10 10:00:00');

-- Réservations pour commandes
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Undertale%' LIMIT 1), 'reservation', -1, 90, 89, 7, 'Réservation CMD-2025-00007', '2025-03-16 14:26:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 'reservation', -1, 20, 19, 9, 'Réservation CMD-2025-00009', '2025-03-14 16:46:00'),
((SELECT id_produit FROM produits WHERE nom_produit LIKE 'Demon Slayer - Coffret%' LIMIT 1), 'reservation', -1, 50, 49, 8, 'Réservation CMD-2025-00008', '2025-03-17 10:31:00');

-- Sorties après expédition
INSERT INTO mouvements_stock (id_produit, type_mouvement, quantite, quantite_avant, quantite_apres, reference_commande, commentaire, date_mouvement) VALUES
((SELECT id_produit FROM produits WHERE nom_produit LIKE '%Nendoroid Levi%' LIMIT 1), 'sortie', -1, 19, 18, 9, 'Expédition CMD-2025-00009', '2025-03-15 09:00:00');

-- ============================================
-- STATISTIQUES FINALES
-- ============================================

SELECT 'Transactions supplémentaires ajoutées avec succès !' AS Message;

SELECT 
    'Nouvelles commandes' AS Type,
    COUNT(*) AS Nombre
FROM commandes
WHERE id_commande > 6
UNION ALL
SELECT 
    'Nouveaux avis',
    COUNT(*)
FROM avis_produits
WHERE date_avis >= '2025-02-28'
UNION ALL
SELECT
    'Paniers actifs totaux',
    COUNT(DISTINCT id_utilisateur)
FROM panier;

-- Top 5 des produits les plus populaires (par avis)
SELECT 
    'Top Produits' AS Info,
    p.nom_produit AS Produit,
    COUNT(a.id_avis) AS Nombre_Avis,
    ROUND(AVG(a.note), 2) AS Note_Moyenne
FROM produits p
LEFT JOIN avis_produits a ON p.id_produit = a.id_produit
WHERE a.statut_moderation = 'approuve'
GROUP BY p.id_produit, p.nom_produit
ORDER BY Nombre_Avis DESC, Note_Moyenne DESC
LIMIT 5;

-- Chiffre d'affaires par catégorie principale
SELECT 
    'CA par Catégorie' AS Info,
    c.nom_categorie AS Catégorie,
    CONCAT(ROUND(SUM(dc.prix_total), 2), ' €') AS Chiffre_Affaires,
    COUNT(DISTINCT dc.id_commande) AS Nombre_Commandes
FROM categories c
JOIN produits p ON c.id_categorie = p.id_categorie
JOIN details_commande dc ON p.id_produit = dc.id_produit
JOIN commandes cmd ON dc.id_commande = cmd.id_commande
WHERE cmd.statut NOT IN ('annulee') AND c.categorie_parente_id IS NULL
GROUP BY c.id_categorie, c.nom_categorie
ORDER BY SUM(dc.prix_total) DESC;


-- ============================================
-- STATISTIQUES FINALES
-- ============================================

SELECT 'Transactions supplémentaires ajoutées avec succès !' AS Message;

SELECT 
    'Nouvelles commandes' AS Type,
    COUNT(*) AS Nombre
FROM commandes
WHERE id_commande > 6
UNION ALL
SELECT 
    'Nouveaux avis',
    COUNT(*)
FROM avis_produits
WHERE date_avis >= '2025-02-28'
UNION ALL
SELECT
    'Paniers actifs totaux',
    COUNT(DISTINCT id_utilisateur)
FROM panier;

-- Top 5 des produits les plus populaires (par avis)
SELECT 
    'Top Produits' AS Info,
    p.nom_produit AS Produit,
    COUNT(a.id_avis) AS Nombre_Avis,
    ROUND(AVG(a.note), 2) AS Note_Moyenne
FROM produits p
LEFT JOIN avis_produits a ON p.id_produit = a.id_produit
WHERE a.statut_moderation = 'approuve'
GROUP BY p.id_produit, p.nom_produit
ORDER BY Nombre_Avis DESC, Note_Moyenne DESC
LIMIT 5;

-- Chiffre d'affaires par catégorie principale
SELECT 
    'CA par Catégorie' AS Info,
    c.nom_categorie AS Catégorie,
    CONCAT(ROUND(SUM(dc.prix_total), 2), ' €') AS Chiffre_Affaires,
    COUNT(DISTINCT dc.id_commande) AS Nombre_Commandes
FROM categories c
JOIN produits p ON c.id_categorie = p.id_categorie
JOIN details_commande dc ON p.id_produit = dc.id_produit
JOIN commandes cmd ON dc.id_commande = cmd.id_commande
WHERE cmd.statut NOT IN ('annulee') AND c.categorie_parente_id IS NULL
GROUP BY c.id_categorie, c.nom_categorie
ORDER BY SUM(dc.prix_total) DESC;

-- ============================================
-- FIN DES INSERTIONS
-- ============================================

-- Vérifications finales
SELECT '✅ Insertions complètes terminées !' AS Status;

SELECT 'Statistiques de la base de données :' AS Info;

SELECT COUNT(*) AS 'Nombre de Produits' FROM produits;
SELECT COUNT(*) AS 'Nombre d''Utilisateurs' FROM utilisateurs;
SELECT COUNT(*) AS 'Nombre de Commandes' FROM commandes;
SELECT COUNT(*) AS 'Nombre d''Avis' FROM avis_produits;
SELECT COUNT(*) AS 'Nombre de Catégories' FROM categories;

SELECT 
    c.nom_categorie,
    COUNT(p.id_produit) as nombre_produits
FROM categories c
LEFT JOIN produits p ON c.id_categorie = p.id_categorie
GROUP BY c.id_categorie
ORDER BY nombre_produits DESC;

SELECT '🎉 Base de données GeekShop Paradise prête à l''emploi !' AS Message;
