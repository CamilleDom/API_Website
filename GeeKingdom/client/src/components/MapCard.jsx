import React from 'react';

function MapIframe({ latitude = 48.8566, longitude = 2.3522, zoom = 13 }) {
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', width: '400px', height: '300px', margin: '1rem auto' }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={mapSrc}
        title="Carte OpenStreetMap"
      ></iframe>
    </div>
  );
}

export default MapIframe;
