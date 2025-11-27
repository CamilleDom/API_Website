import React from 'react';
import { avisAPI } from '../services/api';

function ReviewCard({ review, onUpdate }) {
  const handleUtile = async () => {
    try {
      await avisAPI.marquerUtile(review.idAvis);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-rating">
          {'⭐'.repeat(review.note)}
          {'☆'.repeat(5 - review.note)}
        </div>
        <span className="review-date">{formatDate(review.dateAvis)}</span>
      </div>
      
      <p className="review-comment">{review.commentaire}</p>
      
      <div className="review-footer">
        <button onClick={handleUtile} className="btn-utile">
          👍 Utile ({review.utileCount || 0})
        </button>
      </div>
    </div>
  );
}

export default ReviewCard;