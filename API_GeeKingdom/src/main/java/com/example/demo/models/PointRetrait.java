package com.example.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "points_retrait")
public class PointRetrait {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_point_retrait")
    private Integer idPointRetrait;

    @Column(name = "nom_point", nullable = false)
    private String nomPoint;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String adresse;

    @Column(nullable = false, length = 100)
    private String ville;

    @Column(name = "code_postal", nullable = false, length = 10)
    private String codePostal;

    @Column(length = 100)
    private String pays = "France";

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(length = 20)
    private String telephone;

    @Column(name = "horaires_json", columnDefinition = "JSON")
    private String horairesJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.actif;

    @Column(name = "capacite_max")
    private Integer capaciteMax = 100;

    // Enum
    public enum Statut {
        actif, inactif, temporairement_ferme
    }

    // Constructeurs
    public PointRetrait() {}

    // Méthode utilitaire : calculer distance avec un point (formule de Haversine)
    public double distanceFrom(BigDecimal lat, BigDecimal lon) {
        double R = 6371; // Rayon de la Terre en km
        
        double lat1 = Math.toRadians(this.latitude.doubleValue());
        double lat2 = Math.toRadians(lat.doubleValue());
        double deltaLat = Math.toRadians(lat.doubleValue() - this.latitude.doubleValue());
        double deltaLon = Math.toRadians(lon.doubleValue() - this.longitude.doubleValue());

        double a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                   Math.cos(lat1) * Math.cos(lat2) *
                   Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }

    // Getters et Setters
    public Integer getIdPointRetrait() { return idPointRetrait; }
    public void setIdPointRetrait(Integer idPointRetrait) { this.idPointRetrait = idPointRetrait; }

    public String getNomPoint() { return nomPoint; }
    public void setNomPoint(String nomPoint) { this.nomPoint = nomPoint; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }

    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getHorairesJson() { return horairesJson; }
    public void setHorairesJson(String horairesJson) { this.horairesJson = horairesJson; }

    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }

    public Integer getCapaciteMax() { return capaciteMax; }
    public void setCapaciteMax(Integer capaciteMax) { this.capaciteMax = capaciteMax; }
}