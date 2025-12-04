package com.example.demo.controllers;

import com.example.demo.models.Commande;
import com.example.demo.models.DetailCommande;
import com.example.demo.models.Stock;
import com.example.demo.models.MouvementStock;
import com.example.demo.models.Livraison;
import com.example.demo.repositories.CommandeRepository;
import com.example.demo.repositories.DetailCommandeRepository;
import com.example.demo.repositories.StockRepository;
import com.example.demo.repositories.MouvementStockRepository;
import com.example.demo.repositories.LivraisonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private DetailCommandeRepository detailRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MouvementStockRepository mouvementRepository;

    @Autowired
    private LivraisonRepository livraisonRepository;

    // ✅ LISTE TOUTES LES COMMANDES
    @GetMapping
    public List<Commande> getAll() {
        return commandeRepository.findAll();
    }

    // ✅ DÉTAIL D'UNE COMMANDE
    @GetMapping("/{id}")
    public ResponseEntity<Commande> getById(@PathVariable Integer id) {
        return commandeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ COMMANDES D'UN UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Commande> getByUtilisateur(@PathVariable Integer idUtilisateur) {
        List<Commande> commandes = commandeRepository.findByIdUtilisateur(idUtilisateur);
        // Trier par date décroissante
        commandes.sort((a, b) -> b.getDateCommande().compareTo(a.getDateCommande()));
        return commandes;
    }

    // ✅ COMMANDES PAR STATUT
    @GetMapping("/statut/{statut}")
    public List<Commande> getByStatut(@PathVariable String statut) {
        try {
            Commande.Statut statutEnum = Commande.Statut.valueOf(statut);
            return commandeRepository.findByStatut(statutEnum);
        } catch (IllegalArgumentException e) {
            return new ArrayList<>();
        }
    }

    // ✅ RECHERCHER PAR NUMÉRO DE COMMANDE
    @GetMapping("/numero/{numeroCommande}")
    public ResponseEntity<Commande> getByNumero(@PathVariable String numeroCommande) {
        return commandeRepository.findByNumeroCommande(numeroCommande)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ CRÉER UNE COMMANDE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Commande commande) {
        try {
            // Générer un numéro de commande unique
            commande.setNumeroCommande("CMD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            commande.setStatut(Commande.Statut.en_attente);
            commande.setDateCommande(LocalDateTime.now());

            Commande saved = commandeRepository.save(commande);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Erreur lors de la création de la commande",
                    "message", e.getMessage()
            ));
        }
    }

    // ✅ METTRE À JOUR UNE COMMANDE (adresse de livraison, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Commande commande) {
        return commandeRepository.findById(id)
                .map(existing -> {
                    // Vérifier que la commande peut être modifiée
                    if (existing.getStatut() == Commande.Statut.expediee ||
                            existing.getStatut() == Commande.Statut.livree ||
                            existing.getStatut() == Commande.Statut.annulee) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Impossible de modifier une commande " + existing.getStatut()
                        ));
                    }

                    // Mettre à jour les champs modifiables
                    if (commande.getAdresseLivraison() != null) {
                        existing.setAdresseLivraison(commande.getAdresseLivraison());
                    }
                    if (commande.getVilleLivraison() != null) {
                        existing.setVilleLivraison(commande.getVilleLivraison());
                    }
                    if (commande.getCodePostalLivraison() != null) {
                        existing.setCodePostalLivraison(commande.getCodePostalLivraison());
                    }
                    if (commande.getPaysLivraison() != null) {
                        existing.setPaysLivraison(commande.getPaysLivraison());
                    }

                    Commande saved = commandeRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ CHANGER LE STATUT D'UNE COMMANDE
    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String nouveauStatut = request.get("statut");

        if (nouveauStatut == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le statut est requis"));
        }

        return commandeRepository.findById(id)
                .map(commande -> {
                    try {
                        Commande.Statut statutEnum = Commande.Statut.valueOf(nouveauStatut);
                        Commande.Statut ancienStatut = commande.getStatut();

                        // Valider les transitions de statut
                        if (!isValidStatusTransition(ancienStatut, statutEnum)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "Transition de statut invalide",
                                    "statutActuel", ancienStatut.toString(),
                                    "statutDemande", statutEnum.toString()
                            ));
                        }

                        commande.setStatut(statutEnum);
                        commandeRepository.save(commande);

                        return ResponseEntity.ok(Map.of(
                                "message", "Statut mis à jour",
                                "ancienStatut", ancienStatut.toString(),
                                "nouveauStatut", statutEnum.toString()
                        ));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Statut invalide: " + nouveauStatut
                        ));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ANNULER UNE COMMANDE (avec libération du stock)
    @PostMapping("/{id}/annuler")
    public ResponseEntity<?> annuler(@PathVariable Integer id, @RequestBody(required = false) Map<String, String> request) {
        String motif = request != null ? request.get("motif") : "Annulation demandée par le client";

        return commandeRepository.findById(id)
                .map(commande -> {
                    // Vérifier que la commande peut être annulée
                    if (commande.getStatut() == Commande.Statut.expediee ||
                            commande.getStatut() == Commande.Statut.livree) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Impossible d'annuler une commande déjà " + commande.getStatut(),
                                "statut", commande.getStatut().toString()
                        ));
                    }

                    if (commande.getStatut() == Commande.Statut.annulee) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Cette commande est déjà annulée"
                        ));
                    }

                    // ✅ Libérer le stock réservé pour chaque détail de commande
                    List<DetailCommande> details = detailRepository.findByIdCommande(id);
                    int totalProduitsLiberes = 0;

                    for (DetailCommande detail : details) {
                        Optional<Stock> stockOpt = stockRepository.findByIdProduit(detail.getIdProduit());

                        if (stockOpt.isPresent()) {
                            Stock stock = stockOpt.get();
                            Integer quantiteAvant = stock.getQuantiteDisponible();

                            // Remettre le stock en disponible
                            stock.setQuantiteDisponible(quantiteAvant + detail.getQuantite());
                            stock.setQuantiteReservee(Math.max(0, stock.getQuantiteReservee() - detail.getQuantite()));
                            stockRepository.save(stock);

                            // Enregistrer le mouvement
                            MouvementStock mouvement = new MouvementStock();
                            mouvement.setIdProduit(detail.getIdProduit());
                            mouvement.setTypeMouvement(MouvementStock.TypeMouvement.liberation);
                            mouvement.setQuantite(detail.getQuantite());
                            mouvement.setQuantiteAvant(quantiteAvant);
                            mouvement.setQuantiteApres(stock.getQuantiteDisponible());
                            mouvement.setReferenceCommande(id);
                            mouvement.setCommentaire("Libération suite annulation commande - " + motif);
                            mouvementRepository.save(mouvement);

                            totalProduitsLiberes += detail.getQuantite();
                        }
                    }

                    // Mettre à jour le statut de la commande
                    Commande.Statut ancienStatut = commande.getStatut();
                    commande.setStatut(Commande.Statut.annulee);
                    commandeRepository.save(commande);

                    return ResponseEntity.ok(Map.of(
                            "message", "Commande annulée avec succès",
                            "numeroCommande", commande.getNumeroCommande(),
                            "ancienStatut", ancienStatut.toString(),
                            "motif", motif,
                            "produitsLiberes", totalProduitsLiberes
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ SUIVRE UNE COMMANDE (tracking complet)
    @GetMapping("/{id}/suivi")
    public ResponseEntity<?> suivreCommande(@PathVariable Integer id) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    // Récupérer les détails de la commande
                    List<DetailCommande> details = detailRepository.findByIdCommande(id);

                    // Récupérer les informations de livraison
                    Optional<Livraison> livraisonOpt = livraisonRepository.findByIdCommande(id);

                    // Construire l'historique du suivi
                    List<Map<String, Object>> historique = buildHistoriqueSuivi(commande, livraisonOpt.orElse(null));

                    Map<String, Object> suivi = new HashMap<>();
                    suivi.put("commande", Map.of(
                            "idCommande", commande.getIdCommande(),
                            "numeroCommande", commande.getNumeroCommande(),
                            "dateCommande", commande.getDateCommande(),
                            "statut", commande.getStatut().toString(),
                            "montantTotal", commande.getMontantTotal(),
                            "adresseLivraison", formatAdresse(commande)
                    ));
                    suivi.put("nombreArticles", details.size());
                    suivi.put("historique", historique);

                    if (livraisonOpt.isPresent()) {
                        Livraison livraison = livraisonOpt.get();
                        suivi.put("livraison", Map.of(
                                "transporteur", livraison.getTransporteur() != null ? livraison.getTransporteur() : "Non assigné",
                                "numeroSuivi", livraison.getNumeroSuivi() != null ? livraison.getNumeroSuivi() : "Non disponible",
                                "statutLivraison", livraison.getStatutLivraison().toString(),
                                "dateExpedition", livraison.getDateExpedition(),
                                "dateLivraisonEstimee", livraison.getDateLivraisonEstimee(),
                                "dateLivraisonReelle", livraison.getDateLivraisonReelle()
                        ));
                    }

                    // Étape actuelle et prochaine étape
                    suivi.put("etapeActuelle", getEtapeActuelle(commande.getStatut()));
                    suivi.put("prochaineEtape", getProchaineEtape(commande.getStatut()));
                    suivi.put("peutEtreAnnulee", peutEtreAnnulee(commande.getStatut()));
                    suivi.put("peutEtreModifiee", peutEtreModifiee(commande.getStatut()));

                    return ResponseEntity.ok(suivi);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ HISTORIQUE DES COMMANDES AVEC FILTRES
    @GetMapping("/utilisateur/{idUtilisateur}/historique")
    public ResponseEntity<?> getHistorique(
            @PathVariable Integer idUtilisateur,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String dateDebut,
            @RequestParam(required = false) String dateFin) {

        List<Commande> commandes = commandeRepository.findByIdUtilisateur(idUtilisateur);

        // Filtrer par statut si spécifié
        if (statut != null && !statut.isEmpty()) {
            try {
                Commande.Statut statutEnum = Commande.Statut.valueOf(statut);
                commandes = commandes.stream()
                        .filter(c -> c.getStatut() == statutEnum)
                        .toList();
            } catch (IllegalArgumentException e) {
                // Ignorer le filtre si statut invalide
            }
        }

        // Trier par date décroissante
        commandes = new ArrayList<>(commandes);
        commandes.sort((a, b) -> b.getDateCommande().compareTo(a.getDateCommande()));

        // Enrichir avec le nombre d'articles
        List<Map<String, Object>> result = commandes.stream().map(commande -> {
            Map<String, Object> data = new HashMap<>();
            data.put("idCommande", commande.getIdCommande());
            data.put("numeroCommande", commande.getNumeroCommande());
            data.put("dateCommande", commande.getDateCommande());
            data.put("statut", commande.getStatut().toString());
            data.put("montantTotal", commande.getMontantTotal());
            data.put("nombreArticles", detailRepository.findByIdCommande(commande.getIdCommande()).size());
            data.put("peutEtreAnnulee", peutEtreAnnulee(commande.getStatut()));
            return data;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // ✅ STATISTIQUES DES COMMANDES D'UN UTILISATEUR
    @GetMapping("/utilisateur/{idUtilisateur}/stats")
    public ResponseEntity<?> getStats(@PathVariable Integer idUtilisateur) {
        List<Commande> commandes = commandeRepository.findByIdUtilisateur(idUtilisateur);

        long totalCommandes = commandes.size();
        long commandesEnCours = commandes.stream()
                .filter(c -> c.getStatut() != Commande.Statut.livree && c.getStatut() != Commande.Statut.annulee)
                .count();
        long commandesLivrees = commandes.stream()
                .filter(c -> c.getStatut() == Commande.Statut.livree)
                .count();
        long commandesAnnulees = commandes.stream()
                .filter(c -> c.getStatut() == Commande.Statut.annulee)
                .count();

        double montantTotal = commandes.stream()
                .filter(c -> c.getStatut() != Commande.Statut.annulee)
                .mapToDouble(c -> c.getMontantTotal() != null ? c.getMontantTotal().doubleValue() : 0)
                .sum();

        return ResponseEntity.ok(Map.of(
                "totalCommandes", totalCommandes,
                "commandesEnCours", commandesEnCours,
                "commandesLivrees", commandesLivrees,
                "commandesAnnulees", commandesAnnulees,
                "montantTotalDepense", montantTotal
        ));
    }

    // ========== MÉTHODES UTILITAIRES PRIVÉES ==========

    private boolean isValidStatusTransition(Commande.Statut from, Commande.Statut to) {
        // Définir les transitions valides
        Map<Commande.Statut, List<Commande.Statut>> validTransitions = Map.of(
                Commande.Statut.en_attente, List.of(Commande.Statut.confirmee, Commande.Statut.annulee),
                Commande.Statut.confirmee, List.of(Commande.Statut.en_preparation, Commande.Statut.annulee),
                Commande.Statut.en_preparation, List.of(Commande.Statut.expediee, Commande.Statut.annulee),
                Commande.Statut.expediee, List.of(Commande.Statut.livree),
                Commande.Statut.livree, List.of(),
                Commande.Statut.annulee, List.of()
        );

        List<Commande.Statut> allowed = validTransitions.get(from);
        return allowed != null && allowed.contains(to);
    }

    private List<Map<String, Object>> buildHistoriqueSuivi(Commande commande, Livraison livraison) {
        List<Map<String, Object>> historique = new ArrayList<>();

        // Commande créée
        historique.add(Map.of(
                "etape", "Commande créée",
                "date", commande.getDateCommande(),
                "statut", "complete",
                "description", "Votre commande a été enregistrée"
        ));

        // Selon le statut actuel, ajouter les étapes
        Commande.Statut statut = commande.getStatut();

        if (statut == Commande.Statut.annulee) {
            historique.add(Map.of(
                    "etape", "Commande annulée",
                    "date", LocalDateTime.now(),
                    "statut", "cancelled",
                    "description", "La commande a été annulée"
            ));
            return historique;
        }

        // Confirmée
        if (statut.ordinal() >= Commande.Statut.confirmee.ordinal()) {
            historique.add(Map.of(
                    "etape", "Commande confirmée",
                    "date", commande.getDateCommande().plusMinutes(5),
                    "statut", "complete",
                    "description", "Paiement validé, commande confirmée"
            ));
        } else {
            historique.add(Map.of(
                    "etape", "En attente de confirmation",
                    "date", null,
                    "statut", "pending",
                    "description", "En attente de validation du paiement"
            ));
            return historique;
        }

        // En préparation
        if (statut.ordinal() >= Commande.Statut.en_preparation.ordinal()) {
            historique.add(Map.of(
                    "etape", "En préparation",
                    "date", commande.getDateCommande().plusHours(1),
                    "statut", "complete",
                    "description", "Votre commande est en cours de préparation"
            ));
        } else {
            historique.add(Map.of(
                    "etape", "En préparation",
                    "date", null,
                    "statut", "pending",
                    "description", "Prochaine étape: préparation de votre commande"
            ));
            return historique;
        }

        // Expédiée
        if (statut.ordinal() >= Commande.Statut.expediee.ordinal()) {
            historique.add(Map.of(
                    "etape", "Expédiée",
                    "date", livraison != null && livraison.getDateExpedition() != null ?
                            livraison.getDateExpedition() : commande.getDateCommande().plusDays(1),
                    "statut", "complete",
                    "description", livraison != null && livraison.getTransporteur() != null ?
                            "Expédiée via " + livraison.getTransporteur() : "Colis expédié"
            ));
        } else {
            historique.add(Map.of(
                    "etape", "Expédition",
                    "date", null,
                    "statut", "pending",
                    "description", "Prochaine étape: expédition de votre commande"
            ));
            return historique;
        }

        // Livrée
        if (statut == Commande.Statut.livree) {
            historique.add(Map.of(
                    "etape", "Livrée",
                    "date", livraison != null && livraison.getDateLivraisonReelle() != null ?
                            livraison.getDateLivraisonReelle() : LocalDateTime.now(),
                    "statut", "complete",
                    "description", "Votre commande a été livrée"
            ));
        } else {
            historique.add(Map.of(
                    "etape", "Livraison",
                    "date", livraison != null ? livraison.getDateLivraisonEstimee() : null,
                    "statut", "pending",
                    "description", "En cours d'acheminement"
            ));
        }

        return historique;
    }

    private String formatAdresse(Commande commande) {
        StringBuilder sb = new StringBuilder();
        if (commande.getAdresseLivraison() != null) sb.append(commande.getAdresseLivraison());
        if (commande.getCodePostalLivraison() != null) sb.append(", ").append(commande.getCodePostalLivraison());
        if (commande.getVilleLivraison() != null) sb.append(" ").append(commande.getVilleLivraison());
        if (commande.getPaysLivraison() != null) sb.append(", ").append(commande.getPaysLivraison());
        return sb.toString();
    }

    private int getEtapeActuelle(Commande.Statut statut) {
        return switch (statut) {
            case en_attente -> 1;
            case confirmee -> 2;
            case en_preparation -> 3;
            case expediee -> 4;
            case livree -> 5;
            case annulee -> -1;
        };
    }

    private String getProchaineEtape(Commande.Statut statut) {
        return switch (statut) {
            case en_attente -> "Confirmation du paiement";
            case confirmee -> "Préparation de la commande";
            case en_preparation -> "Expédition";
            case expediee -> "Livraison";
            case livree -> "Commande terminée";
            case annulee -> "Commande annulée";
        };
    }

    private boolean peutEtreAnnulee(Commande.Statut statut) {
        return statut == Commande.Statut.en_attente ||
                statut == Commande.Statut.confirmee ||
                statut == Commande.Statut.en_preparation;
    }

    private boolean peutEtreModifiee(Commande.Statut statut) {
        return statut == Commande.Statut.en_attente || statut == Commande.Statut.confirmee;
    }

    // ✅ SUPPRIMER UNE COMMANDE (admin seulement - à protéger)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (commandeRepository.existsById(id)) {
            // D'abord libérer le stock
            List<DetailCommande> details = detailRepository.findByIdCommande(id);
            for (DetailCommande detail : details) {
                Optional<Stock> stockOpt = stockRepository.findByIdProduit(detail.getIdProduit());
                if (stockOpt.isPresent()) {
                    Stock stock = stockOpt.get();
                    stock.setQuantiteDisponible(stock.getQuantiteDisponible() + detail.getQuantite());
                    stock.setQuantiteReservee(Math.max(0, stock.getQuantiteReservee() - detail.getQuantite()));
                    stockRepository.save(stock);
                }
            }

            commandeRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Commande supprimée"));
        }
        return ResponseEntity.notFound().build();
    }
}