import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ background: '#222', padding: '1rem' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>GeeKingdom</Link>
      <Link to="/products" style={{ color: '#fff', marginRight: '1rem' }}>Produits</Link>
      <Link to="/cart" style={{ color: '#fff', marginRight: '1rem' }}>Panier</Link>
      <Link to="/login" style={{ color: '#fff' }}>Connexion</Link>
    </nav>
  );
}

export default Navbar;
