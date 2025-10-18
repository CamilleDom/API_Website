import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CategoriesPage() {
  const [categories, setCategories] = useState([]); // par défaut un tableau

  useEffect(() => {
    fetch('/api/java/categories')
      .then(res => res.json())
      .then(data => {
        // Si ton API renvoie { categories: [...] }, il faut faire :
        // setCategories(data.categories);
        // Sinon si c’est déjà un tableau : setCategories(data);
        setCategories(Array.isArray(data) ? data : data.categories || []);
      })
      .catch(err => {
        console.error(err);
        setCategories([]); // fallback
      });
  }, []);

  if (!categories.length) return <p>Aucune catégorie trouvée.</p>;

  return (
    <section>
      <h2>Catégories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <Link to={`/products?category=${cat.id}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoriesPage;
