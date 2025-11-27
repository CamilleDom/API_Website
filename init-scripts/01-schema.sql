USE geekingdom_db;

-- ============================================
-- TABLE: utilisateurs
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    pays VARCHAR(100) DEFAULT 'France',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_derniere_connexion TIMESTAMP NULL,
    statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
    role ENUM('client', 'admin', 'vendeur') DEFAULT 'client',
    preferences_json JSON,
    
    INDEX idx_email (email),
    INDEX idx_statut (statut),
    INDEX idx_localisation (latitude, longitude)
);

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom_categorie VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    categorie_parente_id INT,
    image_url VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_categorie_parente (categorie_parente_id),
    
    CONSTRAINT fk_categorie_parente 
        FOREIGN KEY (categorie_parente_id) 
        REFERENCES categories(id_categorie)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: produits
-- ============================================
CREATE TABLE IF NOT EXISTS produits (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom_produit VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    id_categorie INT NOT NULL,
    marque VARCHAR(100),
    poids DECIMAL(8,2),
    dimensions VARCHAR(50),
    images_json JSON,
    statut ENUM('disponible', 'rupture', 'archive') DEFAULT 'disponible',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    note_moyenne DECIMAL(3,2) DEFAULT 0.00,
    nombre_avis INT DEFAULT 0,
    tags_json JSON,
    
    INDEX idx_categorie (id_categorie),
    INDEX idx_prix (prix),
    INDEX idx_statut (statut),
    INDEX idx_note (note_moyenne),
    
    CONSTRAINT fk_produit_categorie 
        FOREIGN KEY (id_categorie) 
        REFERENCES categories(id_categorie)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: stocks
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT NOT NULL UNIQUE,
    quantite_disponible INT NOT NULL DEFAULT 0,
    quantite_reservee INT NOT NULL DEFAULT 0,
    seuil_alerte INT NOT NULL DEFAULT 10,
    emplacement VARCHAR(100),
    date_derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_quantite (quantite_disponible),
    INDEX idx_alerte (seuil_alerte),
    
    CONSTRAINT fk_stock_produit 
        FOREIGN KEY (id_produit) 
        REFERENCES produits(id_produit)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: mouvements_stock
-- ============================================
CREATE TABLE IF NOT EXISTS mouvements_stock (
    id_mouvement INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT NOT NULL,
    type_mouvement ENUM('entree', 'sortie', 'reservation', 'liberation', 'ajustement') NOT NULL,
    quantite INT NOT NULL,
    quantite_avant INT NOT NULL,
    quantite_apres INT NOT NULL,
    reference_commande INT,
    commentaire TEXT,
    id_utilisateur INT,
    date_mouvement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_produit (id_produit),
    INDEX idx_type (type_mouvement),
    INDEX idx_date (date_mouvement),
    INDEX idx_reference (reference_commande),
    
    CONSTRAINT fk_mouvement_produit 
        FOREIGN KEY (id_produit) 
        REFERENCES produits(id_produit)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_mouvement_utilisateur 
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: commandes
-- ============================================
CREATE TABLE IF NOT EXISTS commandes (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    numero_commande VARCHAR(50) NOT NULL UNIQUE,
    montant_total DECIMAL(10,2) NOT NULL,
    montant_livraison DECIMAL(10,2) DEFAULT 0.00,
    montant_taxe DECIMAL(10,2) DEFAULT 0.00,
    statut ENUM('en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee') DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    code_postal_livraison VARCHAR(10) NOT NULL,
    pays_livraison VARCHAR(100) DEFAULT 'France',
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    commentaires TEXT,
    code_promo VARCHAR(50),
    reduction DECIMAL(10,2) DEFAULT 0.00,
    
    INDEX idx_utilisateur (id_utilisateur),
    INDEX idx_numero (numero_commande),
    INDEX idx_statut (statut),
    INDEX idx_date (date_commande),
    
    CONSTRAINT fk_commande_utilisateur 
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: details_commande
-- ============================================
CREATE TABLE IF NOT EXISTS details_commande (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT NOT NULL,
    id_produit INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    
    INDEX idx_commande (id_commande),
    INDEX idx_produit (id_produit),
    
    CONSTRAINT fk_detail_commande 
        FOREIGN KEY (id_commande) 
        REFERENCES commandes(id_commande)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_detail_produit 
        FOREIGN KEY (id_produit) 
        REFERENCES produits(id_produit)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: paiements
-- ============================================
CREATE TABLE IF NOT EXISTS paiements (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    methode_paiement ENUM('carte_bancaire', 'paypal', 'virement', 'especes', 'cheque') NOT NULL,
    statut_paiement ENUM('en_attente', 'reussi', 'echoue', 'rembourse') DEFAULT 'en_attente',
    transaction_id VARCHAR(100) UNIQUE,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    informations_json JSON,
    
    INDEX idx_commande (id_commande),
    INDEX idx_statut (statut_paiement),
    INDEX idx_transaction (transaction_id),
    INDEX idx_date (date_paiement),
    
    CONSTRAINT fk_paiement_commande 
        FOREIGN KEY (id_commande) 
        REFERENCES commandes(id_commande)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: livraisons
-- ============================================
CREATE TABLE IF NOT EXISTS livraisons (
    id_livraison INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT NOT NULL,
    transporteur VARCHAR(100),
    numero_suivi VARCHAR(100) UNIQUE,
    statut_livraison ENUM('en_attente', 'en_transit', 'en_cours_de_livraison', 'livree', 'echec', 'retournee') DEFAULT 'en_attente',
    date_expedition TIMESTAMP NULL,
    date_livraison_estimee DATE,
    date_livraison_reelle TIMESTAMP NULL,
    signature_destinataire VARCHAR(255),
    commentaires TEXT,
    
    INDEX idx_commande (id_commande),
    INDEX idx_statut (statut_livraison),
    INDEX idx_numero_suivi (numero_suivi),
    
    CONSTRAINT fk_livraison_commande 
        FOREIGN KEY (id_commande) 
        REFERENCES commandes(id_commande)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_date_livraison 
        CHECK (date_livraison_reelle IS NULL OR date_expedition IS NULL OR date_livraison_reelle >= date_expedition)
);

-- ============================================
-- TABLE: panier
-- ============================================
CREATE TABLE IF NOT EXISTS panier (
    id_panier INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    id_produit INT NOT NULL,
    quantite INT NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_utilisateur (id_utilisateur),
    INDEX idx_produit (id_produit),
    UNIQUE INDEX unique_panier (id_utilisateur, id_produit),
    
    CONSTRAINT fk_panier_utilisateur 
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_panier_produit 
        FOREIGN KEY (id_produit) 
        REFERENCES produits(id_produit)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: avis_produits
-- ============================================
CREATE TABLE IF NOT EXISTS avis_produits (
    id_avis INT AUTO_INCREMENT PRIMARY KEY,
    id_produit INT NOT NULL,
    id_utilisateur INT NOT NULL,
    note INT NOT NULL,
    commentaire TEXT,
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut_moderation ENUM('en_attente', 'approuve', 'rejete') DEFAULT 'en_attente',
    utile_count INT DEFAULT 0,
    
    INDEX idx_produit (id_produit),
    INDEX idx_utilisateur (id_utilisateur),
    INDEX idx_note (note),
    INDEX idx_statut (statut_moderation),
    UNIQUE INDEX unique_avis (id_produit, id_utilisateur),
    
    CONSTRAINT fk_avis_produit 
        FOREIGN KEY (id_produit) 
        REFERENCES produits(id_produit)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_avis_utilisateur 
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- ============================================
-- TABLE: points_retrait
-- ============================================
CREATE TABLE IF NOT EXISTS points_retrait (
    id_point_retrait INT AUTO_INCREMENT PRIMARY KEY,
    nom_point VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    pays VARCHAR(100) DEFAULT 'France',
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    telephone VARCHAR(20),
    horaires_json JSON,
    statut ENUM('actif', 'inactif', 'temporairement_ferme') DEFAULT 'actif',
    capacite_max INT DEFAULT 100,
    
    INDEX idx_localisation (latitude, longitude),
    INDEX idx_statut (statut),
    INDEX idx_ville (ville)
);
