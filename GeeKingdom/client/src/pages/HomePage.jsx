import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section style={{ textAlign: 'center' }}>
      <h1>Bienvenue sur GeeKingdom</h1>
      <p>Découvrez nos meilleurs produits geek 🔥</p>
      <Link to="/products">Voir les produits</Link>
    </section>
  );
}

export default HomePage;
