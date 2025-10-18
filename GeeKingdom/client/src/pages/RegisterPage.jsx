import React from 'react';

function RegisterPage() {
  return (
    <section>
      <h2>Inscription</h2>
      <form>
        <input type="text" placeholder="Nom complet" /><br />
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Mot de passe" /><br />
        <button type="submit">Créer un compte</button>
      </form>
    </section>
  );
}

export default RegisterPage;
