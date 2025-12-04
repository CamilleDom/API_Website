import React, { useState } from 'react';
import { avisAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ReviewCard({ review, onUpdate }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editNote, setEditNote] = useState(review.note);
    const [editCommentaire, setEditCommentaire] = useState(review.commentaire);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Vérifier si l'utilisateur connecté est le propriétaire de l'avis
    const isOwner = user && user.id === review.idUtilisateur;

    const handleUtile = async () => {
        try {
            await avisAPI.marquerUtile(review.idAvis);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // ✅ NOUVEAU : Gérer la modification
    const handleEdit = async () => {
        if (!editCommentaire.trim()) {
            setError('Le commentaire ne peut pas être vide.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await avisAPI.update(review.idAvis, {
                idUtilisateur: user.id,
                note: editNote,
                commentaire: editCommentaire.trim(),
            });
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.message || 'Erreur lors de la modification.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ NOUVEAU : Gérer la suppression
    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
            return;
        }

        setLoading(true);
        try {
            await avisAPI.delete(review.idAvis);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Mode édition
    if (isEditing) {
        return (
            <div className="review-card editing">
                <h4>Modifier votre avis</h4>

                {error && <p className="error-message">{error}</p>}

                <div className="rating-input">
                    <label>Note :</label>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= editNote ? 'star active' : 'star'}
                                onClick={() => setEditNote(star)}
                            >
                ★
              </span>
                        ))}
                    </div>
                </div>

                <div className="comment-input">
          <textarea
              value={editCommentaire}
              onChange={(e) => setEditCommentaire(e.target.value)}
              rows="4"
          />
                </div>

                <div className="edit-actions">
                    <button onClick={handleEdit} disabled={loading} className="btn-save">
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn-cancel">
                        Annuler
                    </button>
                </div>
            </div>
        );
    }

    // Mode affichage normal
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

            {error && <p className="error-message">{error}</p>}

            <div className="review-footer">
                <button onClick={handleUtile} className="btn-utile">
                    👍 Utile ({review.utileCount || 0})
                </button>

                {/* ✅ NOUVEAU : Boutons Edit/Delete pour le propriétaire */}
                {isOwner && (
                    <div className="owner-actions">
                        <button onClick={() => setIsEditing(true)} className="btn-edit">
                            ✏️ Modifier
                        </button>
                        <button onClick={handleDelete} disabled={loading} className="btn-delete">
                            🗑️ Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewCard;