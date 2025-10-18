import React from 'react';

function LoginPage() {
  return (
    <section>
      <h2>Connexion</h2>
      <form>
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Mot de passe" /><br />
        <button type="submit">Se connecter</button>
      </form>
    </section>
  );
}

export default LoginPage;
