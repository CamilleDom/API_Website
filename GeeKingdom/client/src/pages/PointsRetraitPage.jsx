import React, { useState, useEffect, useRef } from 'react';
import { pointsRetraitAPI } from '../services/api';
import Loader from '../components/Loader';
import MapIframe from '../components/MapIframe';
import '../styles/PointsRetraitPage.css';

function PointsRetraitPage() {
    const [points, setPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchVille, setSearchVille] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        fetchPoints();
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log('Géolocalisation non disponible:', error);
                }
            );
        }
    };

    const fetchPoints = async () => {
        setLoading(true);
        try {
            const data = await pointsRetraitAPI.getActifs();
            setPoints(data);
        } catch (error) {
            console.error('Erreur lors du chargement des points:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchNearby = async () => {
        if (!userLocation) {
            alert('Veuillez activer la géolocalisation');
            return;
        }

        setLoading(true);
        try {
            const data = await pointsRetraitAPI.getProximite(
                userLocation.latitude,
                userLocation.longitude,
                10
            );
            setPoints(data.map(d => d.point || d));
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchByVille = async () => {
        if (!searchVille.trim()) return;

        setLoading(true);
        try {
            const data = await pointsRetraitAPI.getByVille(searchVille);
            setPoints(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (point) => {
        setSelectedPoint(point);
        if (mapRef.current) {
            mapRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const parseHoraires = (horairesJson) => {
        if (!horairesJson) return null;
        try {
            return typeof horairesJson === 'string'
                ? JSON.parse(horairesJson)
                : horairesJson;
        } catch {
            return null;
        }
    };

    const formatHoraires = (horairesObj) => {
        if (!horairesObj) return null;

        const jours = {
            lundi: 'Lundi',
            mardi: 'Mardi',
            mercredi: 'Mercredi',
            jeudi: 'Jeudi',
            vendredi: 'Vendredi',
            samedi: 'Samedi',
            dimanche: 'Dimanche'
        };

        return Object.entries(jours).map(([key, label]) => ({
            jour: label,
            key: key,
            horaire: horairesObj[key] || 'Fermé'
        }));
    };

    // Fonction pour vérifier si le magasin est ouvert selon l'heure actuelle
    const isStoreOpen = (horairesJson) => {
        const horaires = parseHoraires(horairesJson);
        if (!horaires) return { isOpen: false, status: 'unknown', message: 'Horaires non disponibles' };

        const now = new Date();
        const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const jourActuel = joursSemaine[now.getDay()];
        const heureActuelle = now.getHours() * 60 + now.getMinutes(); // en minutes

        const horairesJour = horaires[jourActuel];

        if (!horairesJour || horairesJour.toLowerCase() === 'fermé') {
            return { isOpen: false, status: 'closed', message: 'Fermé aujourd\'hui' };
        }

        // Parser les horaires (format: "9h-19h" ou "9h00-12h00, 14h00-19h00")
        const plages = horairesJour.split(',').map(p => p.trim());

        for (const plage of plages) {
            const match = plage.match(/(\d{1,2})h?(\d{0,2})?\s*-\s*(\d{1,2})h?(\d{0,2})?/i);
            if (match) {
                const ouverture = parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
                const fermeture = parseInt(match[3]) * 60 + (parseInt(match[4]) || 0);

                if (heureActuelle >= ouverture && heureActuelle < fermeture) {
                    const minutesRestantes = fermeture - heureActuelle;
                    if (minutesRestantes <= 60) {
                        return {
                            isOpen: true,
                            status: 'closing-soon',
                            message: `Ferme dans ${minutesRestantes} min`
                        };
                    }
                    return {
                        isOpen: true,
                        status: 'open',
                        message: `Ouvert jusqu'à ${match[3]}h${match[4] || '00'}`
                    };
                }
            }
        }

        // Trouver la prochaine ouverture
        const prochainePlage = plages[0];
        const matchProchain = prochainePlage.match(/(\d{1,2})h?(\d{0,2})?/);
        if (matchProchain) {
            const prochaineOuverture = parseInt(matchProchain[1]);
            if (heureActuelle < prochaineOuverture * 60) {
                return {
                    isOpen: false,
                    status: 'closed',
                    message: `Ouvre à ${prochaineOuverture}h`
                };
            }
        }

        return { isOpen: false, status: 'closed', message: 'Fermé' };
    };

    // Obtenir le jour actuel pour le mettre en surbrillance
    const getCurrentDay = () => {
        const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        return jours[new Date().getDay()];
    };

    if (loading) return <Loader message="Chargement des points de retrait..." />;

    return (
        <section className="points-retrait-page">
            <div className="points-header">
                <h1>📍 Points de Retrait</h1>
                <p className="points-subtitle">Récupérez vos commandes près de chez vous</p>
            </div>

            <div className="search-section">
                <div className="search-controls">
                    <button
                        onClick={searchNearby}
                        disabled={!userLocation}
                        className="btn-location"
                    >
                        <span className="icon">📍</span>
                        Autour de moi
                    </button>

                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="Rechercher par ville..."
                            value={searchVille}
                            onChange={(e) => setSearchVille(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && searchByVille()}
                            className="search-input"
                        />
                        <button onClick={searchByVille} className="btn-search">
                            🔍 Rechercher
                        </button>
                    </div>

                    <button onClick={fetchPoints} className="btn-reset">
                        ↻ Tous les points
                    </button>
                </div>
            </div>

            <div className="points-content-grid">
                {/* Liste des points */}
                <div className="points-cards-container">
                    <div className="points-count">
                        {points.length} point{points.length > 1 ? 's' : ''} disponible{points.length > 1 ? 's' : ''}
                    </div>

                    <div className="points-cards-list">
                        {points.length === 0 ? (
                            <div className="no-points">
                                <p>❌ Aucun point de retrait trouvé</p>
                                <p className="no-points-hint">Essayez une autre recherche</p>
                            </div>
                        ) : (
                            points.map(point => {
                                const storeStatus = isStoreOpen(point.horairesJson);
                                return (
                                    <div
                                        key={point.idPointRetrait}
                                        className={`point-card ${selectedPoint?.idPointRetrait === point.idPointRetrait ? 'selected' : ''}`}
                                        onClick={() => handleCardClick(point)}
                                    >
                                        <div className="card-header">
                                            <h3 className="point-name">{point.nomPoint}</h3>
                                            <span className={`point-status-badge ${storeStatus.status}`}>
                                                {storeStatus.isOpen ? (
                                                    <><span className="status-dot"></span> Ouvert</>
                                                ) : (
                                                    <><span className="status-dot"></span> Fermé</>
                                                )}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <div className="info-row">
                                                <span className="info-icon">📍</span>
                                                <div className="info-content">
                                                    <span className="info-primary">{point.adresse}</span>
                                                    <span className="info-secondary">{point.codePostal} {point.ville}</span>
                                                </div>
                                            </div>

                                            {point.telephone && (
                                                <div className="info-row">
                                                    <span className="info-icon">📞</span>
                                                    <span className="info-primary">{point.telephone}</span>
                                                </div>
                                            )}

                                            {point.distance && (
                                                <div className="info-row">
                                                    <span className="info-icon">🚗</span>
                                                    <span className="info-distance">À {point.distance.toFixed(1)} km</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-footer">
                                            <button className="btn-view-map">
                                                Voir sur la carte →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Section carte et détails */}
                <div className="points-map-section" ref={mapRef}>
                    {selectedPoint ? (
                        <div className="map-details-container">
                            {/* Header avec nom et bouton fermer */}
                            <div className="map-header">
                                <div className="map-header-info">
                                    <span className="map-header-icon">📍</span>
                                    <h3>{selectedPoint.nomPoint}</h3>
                                </div>
                                <button
                                    className="btn-close-map"
                                    onClick={() => setSelectedPoint(null)}
                                    aria-label="Fermer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Carte */}
                            <div className="map-wrapper">
                                <MapIframe
                                    latitude={parseFloat(selectedPoint.latitude)}
                                    longitude={parseFloat(selectedPoint.longitude)}
                                />
                            </div>

                            {/* Détails du magasin */}
                            <div className="store-details">
                                {/* Statut actuel */}
                                {(() => {
                                    const status = isStoreOpen(selectedPoint.horairesJson);
                                    return (
                                        <div className={`store-status-banner ${status.status}`}>
                                            <span className="status-indicator"></span>
                                            <span className="status-text">
                                                {status.isOpen ? 'Actuellement ouvert' : 'Actuellement fermé'}
                                            </span>
                                            <span className="status-detail">{status.message}</span>
                                        </div>
                                    );
                                })()}

                                {/* Adresse */}
                                <div className="detail-block">
                                    <div className="detail-header">
                                        <span className="detail-icon">📍</span>
                                        <h4>Adresse</h4>
                                    </div>
                                    <div className="detail-content">
                                        <p>{selectedPoint.adresse}</p>
                                        <p>{selectedPoint.codePostal} {selectedPoint.ville}, {selectedPoint.pays || 'France'}</p>
                                    </div>
                                </div>

                                {/* Téléphone */}
                                {selectedPoint.telephone && (
                                    <div className="detail-block">
                                        <div className="detail-header">
                                            <span className="detail-icon">📞</span>
                                            <h4>Téléphone</h4>
                                        </div>
                                        <div className="detail-content">
                                            <a href={`tel:${selectedPoint.telephone}`} className="phone-link">
                                                {selectedPoint.telephone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Horaires */}
                                {parseHoraires(selectedPoint.horairesJson) && (
                                    <div className="detail-block horaires-block">
                                        <div className="detail-header">
                                            <span className="detail-icon">🕐</span>
                                            <h4>Horaires d'ouverture</h4>
                                        </div>
                                        <div className="horaires-list">
                                            {formatHoraires(parseHoraires(selectedPoint.horairesJson))?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`horaire-row ${item.key === getCurrentDay() ? 'current-day' : ''}`}
                                                >
                                                    <span className="horaire-jour">
                                                        {item.key === getCurrentDay() && <span className="today-indicator">●</span>}
                                                        {item.jour}
                                                    </span>
                                                    <span className={`horaire-time ${item.horaire.toLowerCase() === 'fermé' ? 'closed' : ''}`}>
                                                        {item.horaire}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Capacité */}
                                {selectedPoint.capaciteMax && (
                                    <div className="detail-block">
                                        <div className="detail-header">
                                            <span className="detail-icon">📦</span>
                                            <h4>Capacité</h4>
                                        </div>
                                        <div className="detail-content">
                                            <p>{selectedPoint.capaciteMax} colis maximum</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="map-placeholder">
                            <div className="placeholder-content">
                                <span className="placeholder-icon">🗺️</span>
                                <h3>Sélectionnez un point de retrait</h3>
                                <p>Cliquez sur un magasin pour voir sa position et ses détails</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default PointsRetraitPage;