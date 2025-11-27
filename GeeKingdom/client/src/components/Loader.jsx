import React from 'react';

function Loader({ message = 'Chargement...' }) {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;