import React from 'react';

function Footer() {
  return (
    <footer style={{ background: '#222', color: '#fff', textAlign: 'center', padding: '1rem' }}>
      © {new Date().getFullYear()} GeeKingdom — Tous droits réservés
    </footer>
  );
}

export default Footer;
