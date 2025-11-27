import React, { useEffect, useState } from 'react';
import { pointsRetraitAPI } from '../services/api';
import MapIframe from '../components/MapIframe';
import Loader from '../components/Loader';

function PointsRetraitPage() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchVille, setSearchVille] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchPoints();
    getUserLocation();
  }, []);

  const fetchPoints = async () => {
    try {
      const data = await pointsRetraitAPI.getActifs();
      setPoints(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

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
          console.log('Géolocalisation non disponible');
        }
      );
    }
  };

  const searchNearby = async () => {
    if (!userLocation) {
      alert('La géolocalisation n\'est pas disponible.');
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

  const parseHoraires = (horairesJson) => {
    if (!horairesJson) return null;
    try {
      return JSON.parse(horairesJson);
    } catch {
      return null;
    }
  };

  if (loading) return <Loader message="Chargement des points de retrait..." />;

  return (
    <section className="points-retrait-page">
      <h2>📍 Points de Retrait</h2>

      {/* Recherche */}
      <div className="search-section">
        <div className="search-by-location">
          <button onClick={searchNearby} disabled={!userLocation}>
            📍 Autour de moi
          </button>
        </div>
        
        <div className="search-by-ville">
          <input
            type="text"
            placeholder="Rechercher par ville..."
            value={searchVille}
            onChange={(e) => setSearchVille(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchByVille()}
          />
          <button onClick={searchByVille}>Rechercher</button>
        </div>

        <button onClick={fetchPoints} className="btn-reset">
          Voir tous les points
        </button>
      </div>

      <div className="points-content">
        {/* Liste des points */}
        <div className="points-list">
          {points.length === 0 ? (
            <p>Aucun point de retrait trouvé.</p>
          ) : (
            points.map(point => (
              <div 
                key={point.idPointRetrait} 
                className={`point-card ${selectedPoint?.idPointRetrait === point.idPointRetrait ? 'selected' : ''}`}
                onClick={() => setSelectedPoint(point)}
              >
                <h3>{point.nomPoint}</h3>
                <p className="point-address">
                  {point.adresse}<br />
                  {point.codePostal} {point.ville}
                </p>
                
                {point.telephone && (
                  <p className="point-phone">📞 {point.telephone}</p>
                )}

                {point.distance && (
                  <p className="point-distance">
                    📍 À {point.distance.toFixed(1)} km
                  </p>
                )}

                <span className={`point-status status-${point.statut}`}>
                  {point.statut === 'actif' ? '✓ Ouvert' : 
                   point.statut === 'temporairement_ferme' ? '⚠ Temporairement fermé' : 
                   '✗ Fermé'}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Carte */}
        <div className="points-map">
          {selectedPoint ? (
            <>
              <MapIframe 
                latitude={parseFloat(selectedPoint.latitude)} 
                longitude={parseFloat(selectedPoint.longitude)}
              />
              <div className="selected-point-details">
                <h3>{selectedPoint.nomPoint}</h3>
                <p>{selectedPoint.adresse}</p>
                <p>{selectedPoint.codePostal} {selectedPoint.ville}</p>
                
                {parseHoraires(selectedPoint.horairesJson) && (
                  <div className="horaires">
                    <h4>Horaires d'ouverture</h4>
                    {/* Afficher les horaires */}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="map-placeholder">
              <p>Sélectionnez un point de retrait pour voir sa position sur la carte.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PointsRetraitPage;