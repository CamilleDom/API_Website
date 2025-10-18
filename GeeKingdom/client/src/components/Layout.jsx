import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet /> {/* Ici s'afficheront toutes les pages enfants */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
