/**
 * User Profile Component
 * Handles user profiles, comments, animator requests, partnership requests
 */

import { useState } from 'react';

export interface UserProfileData {
  userId: string;
  nom: string;
  prenom: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  comments: Comment[];
  animatorRequest?: AnimatorRequest;
  partnershipRequest?: PartnershipRequest;
}

export interface Comment {
  id: string;
  podcastId: number;
  text: string;
  createdAt: string;
  likes: number;
}

export interface AnimatorRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  bio: string;
  experience: string;
  genres: string[];
  requestDate: string;
  responseDate?: string;
}

export interface PartnershipRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  companyName: string;
  contactEmail: string;
  description: string;
  requestDate: string;
  responseDate?: string;
}

interface UserProfileProps {
  user: UserProfileData;
  onUpdateProfile: (data: Partial<UserProfileData>) => void;
  onSubmitAnimatorRequest: (request: Omit<AnimatorRequest, 'id' | 'requestDate'>) => void;
  onSubmitPartnershipRequest: (request: Omit<PartnershipRequest, 'id' | 'requestDate'>) => void;
}

export default function UserProfile({
  user,
  onUpdateProfile,
  onSubmitAnimatorRequest,
  onSubmitPartnershipRequest,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'comments' | 'animator' | 'partnership'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSaveProfile = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="user-profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.userId} alt={user.nom} />
        </div>
        <div className="profile-info">
          <h1>{user.prenom} {user.nom}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joindate">Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
          {!isEditing && <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>Éditer le profil</button>}
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
        <button
          className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Commentaires ({user.comments.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'animator' ? 'active' : ''}`}
          onClick={() => setActiveTab('animator')}
        >
          Devenir Animateur
        </button>
        <button
          className={`tab-button ${activeTab === 'partnership' ? 'active' : ''}`}
          onClick={() => setActiveTab('partnership')}
        >
          Partenariat
        </button>
      </div>

      {/* CONTENT */}
      <div className="profile-content">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            {isEditing ? (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Parlez-nous de vous..."
                  />
                </div>
                <div className="form-group">
                  <label>Avatar URL</label>
                  <input
                    type="text"
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>
                <div className="form-buttons">
                  <button className="btn-save" onClick={handleSaveProfile}>Sauvegarder</button>
                  <button className="btn-cancel" onClick={() => { setIsEditing(false); setFormData(user); }}>Annuler</button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="profile-field">
                  <label>Bio</label>
                  <p>{user.bio || 'Aucune bio'}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-field">
                  <label>Membre depuis</label>
                  <p>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="profile-section">
            {user.comments.length === 0 ? (
              <p className="empty-state">Vous n'avez pas encore commenté de podcasts.</p>
            ) : (
              <div className="comments-list">
                {user.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-meta">
                      <span>{new Date(comment.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span>👍 {comment.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANIMATOR REQUEST TAB */}
        {activeTab === 'animator' && (
          <div className="profile-section">
            {user.animatorRequest ? (
              <div className="request-status">
                <h3>Votre demande</h3>
                <div className={`status-badge ${user.animatorRequest.status}`}>
                  {user.animatorRequest.status === 'pending' && '⏳ En attente'}
                  {user.animatorRequest.status === 'approved' && '✅ Approuvée'}
                  {user.animatorRequest.status === 'rejected' && '❌ Rejetée'}
                </div>
                <p><strong>Bio :</strong> {user.animatorRequest.bio}</p>
                <p><strong>Expérience :</strong> {user.animatorRequest.experience}</p>
                <p><strong>Genres :</strong> {user.animatorRequest.genres.join(', ')}</p>
              </div>
            ) : (
              <AnimatorRequestForm onSubmit={onSubmitAnimatorRequest} />
            )}
          </div>
        )}

        {/* PARTNERSHIP REQUEST TAB */}
        {activeTab === 'partnership' && (
          <div className="profile-section">
            {user.partnershipRequest ? (
              <div className="request-status">
                <h3>Votre demande de partenariat</h3>
                <div className={`status-badge ${user.partnershipRequest.status}`}>
                  {user.partnershipRequest.status === 'pending' && '⏳ En attente'}
                  {user.partnershipRequest.status === 'approved' && '✅ Approuvée'}
                  {user.partnershipRequest.status === 'rejected' && '❌ Rejetée'}
                </div>
                <p><strong>Entreprise :</strong> {user.partnershipRequest.companyName}</p>
                <p><strong>Email :</strong> {user.partnershipRequest.contactEmail}</p>
                <p><strong>Description :</strong> {user.partnershipRequest.description}</p>
              </div>
            ) : (
              <PartnershipRequestForm onSubmit={onSubmitPartnershipRequest} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ANIMATOR REQUEST FORM =====
function AnimatorRequestForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    genres: [] as string[],
    status: 'pending' as const,
  });

  const genreOptions = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Électronique', 'Classique', 'Variété', 'Autre'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <h3>Demande pour devenir animateur</h3>
      
      <div className="form-group">
        <label>Bio / Présentation</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Présentez-vous et expliquez pourquoi vous souhaitez devenir animateur..."
          required
        />
      </div>

      <div className="form-group">
        <label>Expérience en radio/podcast</label>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Décrivez votre expérience..."
          required
        />
      </div>

      <div className="form-group">
        <label>Genres musicaux (sélectionnez au moins un)</label>
        <div className="checkbox-group">
          {genreOptions.map((genre) => (
            <label key={genre} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.genres.includes(genre)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, genres: [...formData.genres, genre] });
                  } else {
                    setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
                  }
                }}
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit">Envoyer la demande</button>
    </form>
  );
}

// ===== PARTNERSHIP REQUEST FORM =====
function PartnershipRequestForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    description: '',
    status: 'pending' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <h3>Demande de partenariat</h3>
      
      <div className="form-group">
        <label>Nom de l'entreprise</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Nom de votre entreprise..."
          required
        />
      </div>

      <div className="form-group">
        <label>Email de contact</label>
        <input
          type="email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          placeholder="contact@entreprise.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Description du partenariat</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Décrivez votre proposition de partenariat..."
          required
        />
      </div>

      <button type="submit" className="btn-submit">Envoyer la demande</button>
    </form>
  );
}
