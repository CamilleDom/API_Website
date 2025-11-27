import React, { useState } from 'react';
import { avisAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ReviewForm({ idProduit, onReviewAdded }) {
  const { user, isAuthenticated } = useAuth();
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated()) {
      setError('Vous devez être connecté pour laisser un avis.');
      return;
    }

    if (!commentaire.trim()) {
      setError('Veuillez écrire un commentaire.');
      return;
    }

    setLoading(true);

    try {
      await avisAPI.create({
        idProduit: parseInt(idProduit),
        idUtilisateur: user.id,
        note,
        commentaire: commentaire.trim(),
      });

      setSuccess('Votre avis a été soumis et sera publié après modération.');
      setCommentaire('');
      setNote(5);
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission de l\'avis.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="review-form-notice">
        <p>Connectez-vous pour laisser un avis.</p>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Laisser un avis</h4>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="rating-input">
        <label>Note :</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= note ? 'star active' : 'star'}
              onClick={() => setNote(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="comment-input">
        <label>Commentaire :</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          rows="4"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Soumettre l\'avis'}
      </button>
    </form>
  );
}

export default ReviewForm;