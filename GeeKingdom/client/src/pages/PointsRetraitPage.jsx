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
            lundi: 'Lun',
            mardi: 'Mar',
            mercredi: 'Mer',
            jeudi: 'Jeu',
            vendredi: 'Ven',
            samedi: 'Sam',
            dimanche: 'Dim'
        };

        return Object.entries(jours).map(([key, label]) => ({
            jour: label,
            horaire: horairesObj[key] || 'Fermé'
        }));
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
                <div className="points-cards-container">
                    <div className="points-count">
                        {points.length} point{points.length > 1 ? 's' : ''} disponible{points.length > 1 ? 's' : ''}
                    </div>

                    <div className="points-cards-grid">
                        {points.length === 0 ? (
                            <div className="no-points">
                                <p>❌ Aucun point de retrait trouvé</p>
                                <p className="no-points-hint">Essayez une autre recherche</p>
                            </div>
                        ) : (
                            points.map(point => (
                                <div
                                    key={point.idPointRetrait}
                                    className={`point-card ${selectedPoint?.idPointRetrait === point.idPointRetrait ? 'selected' : ''}`}
                                    onClick={() => handleCardClick(point)}
                                >
                                    <div className="card-header">
                                        <h3 className="point-name">{point.nomPoint}</h3>
                                        <span className={`point-status status-${point.statut}`}>
                      {point.statut === 'actif' ? '✓ Ouvert' :
                          point.statut === 'temporairement_ferme' ? '⚠ Temporaire' :
                              '✗ Fermé'}
                    </span>
                                    </div>

                                    <div className="card-body">
                                        <div className="point-info">
                                            <div className="info-row">
                                                <span className="info-icon">📍</span>
                                                <div className="info-text">
                                                    <p className="point-address">{point.adresse}</p>
                                                    <p className="point-city">{point.codePostal} {point.ville}</p>
                                                </div>
                                            </div>

                                            {point.telephone && (
                                                <div className="info-row">
                                                    <span className="info-icon">📞</span>
                                                    <p className="point-phone">{point.telephone}</p>
                                                </div>
                                            )}

                                            {point.distance && (
                                                <div className="info-row">
                                                    <span className="info-icon">🚗</span>
                                                    <p className="point-distance">
                                                        À {point.distance.toFixed(1)} km
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {parseHoraires(point.horairesJson) && (
                                            <div className="point-horaires-preview">
                                                <span className="horaires-icon">🕐</span>
                                                <span className="horaires-text">Voir les horaires</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <button className="btn-select">
                                            Voir sur la carte →
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="points-map-section" ref={mapRef}>
                    <div className="map-container">
                        {selectedPoint ? (
                            <>
                                <div className="map-header">
                                    <h3>📍 {selectedPoint.nomPoint}</h3>
                                    <button
                                        className="btn-close-map"
                                        onClick={() => setSelectedPoint(null)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="map-wrapper">
                                    <MapIframe
                                        latitude={parseFloat(selectedPoint.latitude)}
                                        longitude={parseFloat(selectedPoint.longitude)}
                                    />
                                </div>

                                <div className="map-details">
                                    <div className="detail-section">
                                        <h4>📍 Adresse</h4>
                                        <p>{selectedPoint.adresse}</p>
                                        <p>{selectedPoint.codePostal} {selectedPoint.ville}, {selectedPoint.pays}</p>
                                    </div>

                                    {selectedPoint.telephone && (
                                        <div className="detail-section">
                                            <h4>📞 Contact</h4>
                                            <p>{selectedPoint.telephone}</p>
                                        </div>
                                    )}

                                    {parseHoraires(selectedPoint.horairesJson) && (
                                        <div className="detail-section">
                                            <h4>🕐 Horaires d'ouverture</h4>
                                            <div className="horaires-grid">
                                                {formatHoraires(parseHoraires(selectedPoint.horairesJson))?.map((item, idx) => (
                                                    <div key={idx} className="horaire-row">
                                                        <span className="horaire-jour">{item.jour}</span>
                                                        <span className="horaire-time">{item.horaire}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPoint.capaciteMax && (
                                        <div className="detail-section">
                                            <h4>📦 Capacité</h4>
                                            <p>{selectedPoint.capaciteMax} colis maximum</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="map-placeholder">
                                <div className="placeholder-content">
                                    <span className="placeholder-icon">🗺️</span>
                                    <h3>Sélectionnez un point de retrait</h3>
                                    <p>Cliquez sur une carte pour voir sa position sur la carte</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PointsRetraitPage;