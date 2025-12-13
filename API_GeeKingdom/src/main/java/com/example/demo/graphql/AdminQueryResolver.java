// src/main/java/com/example/demo/graphql/AdminQueryResolver.java

package com.example.demo.graphql;

import com.example.demo.graphql.types.*;
import com.example.demo.models.*;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class AdminQueryResolver {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private AvisProduitRepository avisRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    // ============================================
    // DASHBOARD STATS
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminStats adminStats() {
        AdminStats stats = new AdminStats();

        // Utilisateurs
        List<Utilisateur> allUsers = utilisateurRepository.findAll();
        stats.setTotalUtilisateurs((int) allUsers.size());
        stats.setUtilisateursActifs((int) allUsers.stream()
                .filter(u -> u.getStatut() == Utilisateur.Statut.actif).count());
        stats.setUtilisateursSuspendus((int) allUsers.stream()
                .filter(u -> u.getStatut() == Utilisateur.Statut.suspendu).count());

        // Produits
        List<Produit> allProducts = produitRepository.findAll();
        stats.setTotalProduits(allProducts.size());
        stats.setProduitsDisponibles((int) allProducts.stream()
                .filter(p -> p.getStatut() == Produit.Statut.disponible).count());
        stats.setProduitsEnRupture((int) allProducts.stream()
                .filter(p -> p.getStatut() == Produit.Statut.rupture).count());

        // Commandes
        List<Commande> allOrders = commandeRepository.findAll();
        stats.setTotalCommandes(allOrders.size());
        stats.setCommandesEnAttente((int) allOrders.stream()
                .filter(c -> c.getStatut() == Commande.Statut.en_attente).count());
        stats.setCommandesExpediees((int) allOrders.stream()
                .filter(c -> c.getStatut() == Commande.Statut.expediee).count());
        stats.setCommandesLivrees((int) allOrders.stream()
                .filter(c -> c.getStatut() == Commande.Statut.livree).count());

        // Chiffre d'affaires (commandes livrées)
        BigDecimal ca = allOrders.stream()
                .filter(c -> c.getStatut() == Commande.Statut.livree)
                .map(Commande::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setChiffreAffaires(ca.doubleValue());

        // Avis en attente
        stats.setAvisEnAttente(avisRepository.findByStatutModeration(
                AvisProduit.StatutModeration.en_attente).size());

        // Stocks en alerte
        stats.setStocksEnAlerte(stockRepository.findProduitsEnAlerte().size());

        return stats;
    }

    // ============================================
    // UTILISATEURS
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResult<Utilisateur> utilisateurs(
            @Argument Integer page,
            @Argument Integer size) {
        
        PageRequest pageRequest = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 20,
                Sort.by(Sort.Direction.DESC, "dateInscription")
        );
        
        Page<Utilisateur> pageResult = utilisateurRepository.findAll(pageRequest);
        return new PaginatedResult<>(pageResult);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Utilisateur utilisateur(@Argument Integer id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Utilisateur> utilisateursByStatut(@Argument Utilisateur.Statut statut) {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getStatut() == statut)
                .collect(Collectors.toList());
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Utilisateur> utilisateursByRole(@Argument Utilisateur.Role role) {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .collect(Collectors.toList());
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Utilisateur> searchUtilisateurs(@Argument String query) {
        String lowerQuery = query.toLowerCase();
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getNom().toLowerCase().contains(lowerQuery) ||
                        u.getPrenom().toLowerCase().contains(lowerQuery) ||
                        u.getEmail().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    // ============================================
    // PRODUITS
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResult<Produit> produits(
            @Argument Integer page,
            @Argument Integer size) {
        
        PageRequest pageRequest = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 20,
                Sort.by(Sort.Direction.DESC, "dateCreation")
        );
        
        Page<Produit> pageResult = produitRepository.findAll(pageRequest);
        return new PaginatedResult<>(pageResult);
    }

    @QueryMapping
    public Produit produit(@Argument Integer id) {
        return produitRepository.findById(id).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Produit> produitsByStatut(@Argument Produit.Statut statut) {
        return produitRepository.findByStatut(statut);
    }

    @QueryMapping
    public List<Produit> produitsByCategorie(@Argument Integer idCategorie) {
        return produitRepository.findByIdCategorie(idCategorie);
    }

    // ============================================
    // COMMANDES
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResult<Commande> commandes(
            @Argument Integer page,
            @Argument Integer size,
            @Argument CommandeFilterInput filter) {
        
        PageRequest pageRequest = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 20,
                Sort.by(Sort.Direction.DESC, "dateCommande")
        );

        Page<Commande> pageResult;
        
        if (filter != null && filter.getStatut() != null) {
            // Filtrer par statut si fourni
            List<Commande> filtered = commandeRepository.findByStatut(filter.getStatut());
            int start = (int) pageRequest.getOffset();
            int end = Math.min(start + pageRequest.getPageSize(), filtered.size());
            
            return new PaginatedResult<>(
                    filtered.subList(start, end),
                    filtered.size(),
                    pageRequest.getPageNumber(),
                    pageRequest.getPageSize()
            );
        }
        
        pageResult = commandeRepository.findAll(pageRequest);
        return new PaginatedResult<>(pageResult);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Commande commande(@Argument Integer id) {
        return commandeRepository.findById(id).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Commande commandeByNumero(@Argument String numero) {
        return commandeRepository.findByNumeroCommande(numero).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Commande> commandesByStatut(@Argument Commande.Statut statut) {
        return commandeRepository.findByStatut(statut);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Commande> commandesRecentes(@Argument Integer limit) {
        return commandeRepository.findRecentOrders(LocalDateTime.now().minusDays(30))
                .stream()
                .limit(limit != null ? limit : 10)
                .collect(Collectors.toList());
    }

    // ============================================
    // AVIS / MODÉRATION
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResult<AvisProduit> avisEnAttente(
            @Argument Integer page,
            @Argument Integer size) {
        
        List<AvisProduit> avis = avisRepository.findByStatutModeration(
                AvisProduit.StatutModeration.en_attente);
        
        int pageNum = page != null ? page : 0;
        int pageSize = size != null ? size : 20;
        int start = pageNum * pageSize;
        int end = Math.min(start + pageSize, avis.size());
        
        return new PaginatedResult<>(
                avis.subList(start, end),
                avis.size(),
                pageNum,
                pageSize
        );
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PaginatedResult<AvisProduit> avisParStatut(
            @Argument AvisProduit.StatutModeration statut,
            @Argument Integer page,
            @Argument Integer size) {
        
        List<AvisProduit> avis = avisRepository.findByStatutModeration(statut);
        
        int pageNum = page != null ? page : 0;
        int pageSize = size != null ? size : 20;
        int start = pageNum * pageSize;
        int end = Math.min(start + pageSize, avis.size());
        
        return new PaginatedResult<>(
                avis.subList(start, end),
                avis.size(),
                pageNum,
                pageSize
        );
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AvisProduit avis(@Argument Integer id) {
        return avisRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<AvisProduit> avisProduit(@Argument Integer idProduit) {
        return avisRepository.findByIdProduitAndStatutModeration(
                idProduit, AvisProduit.StatutModeration.approuve);
    }

    // ============================================
    // STOCKS
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Stock> stocks() {
        return stockRepository.findAll();
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StockAlert> stocksEnAlerte() {
        return stockRepository.findProduitsEnAlerte().stream()
                .map(stock -> {
                    Produit produit = produitRepository.findById(stock.getIdProduit()).orElse(null);
                    String alertLevel = stock.getQuantiteDisponible() == 0 ? "CRITIQUE" :
                            stock.getQuantiteDisponible() <= stock.getSeuilAlerte() / 2 ? "ÉLEVÉ" : "MODÉRÉ";
                    return new StockAlert(produit, stock, alertLevel);
                })
                .collect(Collectors.toList());
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Stock> stocksEnRupture() {
        return stockRepository.findProduitsEnRupture();
    }

    @QueryMapping
    public Stock stockProduit(@Argument Integer idProduit) {
        return stockRepository.findByIdProduit(idProduit).orElse(null);
    }

    // ============================================
    // CATÉGORIES
    // ============================================

    @QueryMapping
    public List<Categorie> categories() {
        return categorieRepository.findAll();
    }

    @QueryMapping
    public Categorie categorie(@Argument Integer id) {
        return categorieRepository.findById(id).orElse(null);
    }

    // ============================================
    // PAIEMENTS
    // ============================================

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Paiement> paiementsCommande(@Argument Integer idCommande) {
        return paiementRepository.findByIdCommande(idCommande);
    }

    // ============================================
    // SCHEMA MAPPINGS (Relations)
    // ============================================

    @SchemaMapping(typeName = "Commande", field = "utilisateur")
    public Utilisateur getCommandeUtilisateur(Commande commande) {
        return utilisateurRepository.findById(commande.getIdUtilisateur()).orElse(null);
    }

    @SchemaMapping(typeName = "AvisProduit", field = "utilisateur")
    public Utilisateur getAvisUtilisateur(AvisProduit avis) {
        return utilisateurRepository.findById(avis.getIdUtilisateur()).orElse(null);
    }

    @SchemaMapping(typeName = "AvisProduit", field = "produit")
    public Produit getAvisProduit(AvisProduit avis) {
        return produitRepository.findById(avis.getIdProduit()).orElse(null);
    }

    @SchemaMapping(typeName = "Stock", field = "produit")
    public Produit getStockProduit(Stock stock) {
        return produitRepository.findById(stock.getIdProduit()).orElse(null);
    }
}