import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section style={{ textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page non trouvée 😢</p>
      <Link to="/">Retour à l’accueil</Link>
    </section>
  );
}

export default NotFoundPage;
