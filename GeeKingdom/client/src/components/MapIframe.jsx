import React from 'react';

function MapIframe({ latitude = 48.8566, longitude = 2.3522, zoom = 15 }) {
  // Calcul de la bounding box pour OpenStreetMap
  const delta = 0.005; // Ajuster pour le zoom
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="300"
        frameBorder="0"
        scrolling="no"
        src={mapSrc}
        title="Carte OpenStreetMap"
        loading="lazy"
      ></iframe>
      <small>
        <a 
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir sur OpenStreetMap
        </a>
      </small>
    </div>
  );
}

export default MapIframe;