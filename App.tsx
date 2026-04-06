import { useEffect, useState } from 'react';
import './index.css';

// ===== TYPES =====
interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  avatar?: string;
  createdAt: string;
}

interface Animateur {
  id: number;
  nom: string;
  email: string;
  pwd: string;
  photo: string;
  badge: boolean;
}

interface Podcast {
  id: number;
  titre: string;
  animateurId: number;
  lien: string;
  desc: string;
  date: string;
}

interface Message {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  date: string;
}

interface Commentaire {
  id: string;
  podcastId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  contenu: string;
  date: string;
}

interface Database {
  adminPwd: string;
  animateurs: Animateur[];
  podcasts: Podcast[];
  messages: Message[];
  commentaires: Commentaire[];
  users: User[];
  logo: string;
  nextId: number;
}

// ===== GLOBAL STATE =====
let DB: Database = {
  adminPwd: 'NioraRadioOfficiel',
  animateurs: [
    {
      id: 1,
      nom: 'ALEX MOREAU',
      email: 'alex@nioraradio.com',
      pwd: 'password123',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      badge: true,
    },
    {
      id: 2,
      nom: 'MARIE DUPONT',
      email: 'marie@nioraradio.com',
      pwd: 'password123',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      badge: true,
    },
  ],
  podcasts: [
    {
      id: 1,
      titre: 'Les Hits du Moment',
      animateurId: 1,
      lien: 'https://radioking.io/nioraradio',
      desc: 'Découvrez les meilleures chansons de la semaine',
      date: new Date().toLocaleDateString('fr-FR'),
    },
  ],
  messages: [],
  commentaires: [],
  users: [],
  logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NR',
  nextId: 3,
};

// ===== MAIN APP =====
export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'login' | 'register' | 'admin' | 'profile'>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPanel, setAdminPanel] = useState('dashboard');

  // Initialize
  useEffect(() => {
    loadData();
    const savedUser = localStorage.getItem('nioraCurrentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // ===== DATA MANAGEMENT =====
  const loadData = () => {
    const stored = localStorage.getItem('nioraDB');
    if (stored) {
      try {
        DB = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  };

  const saveData = () => {
    localStorage.setItem('nioraDB', JSON.stringify(DB));
  };

  // ===== AUTHENTICATION =====
  const handleRegister = (email: string, password: string, nom: string, prenom: string) => {
    if (DB.users.find(u => u.email === email)) {
      showToast('Cet email est déjà utilisé');
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      nom,
      prenom,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
    };
    DB.users.push(newUser);
    saveData();
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setCurrentPage('main');
    localStorage.setItem('nioraCurrentUser', JSON.stringify(newUser));
    showToast('Bienvenue ' + nom + '!');
  };

  const handleLogin = (email: string, password: string) => {
    const user = DB.users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentPage('main');
      localStorage.setItem('nioraCurrentUser', JSON.stringify(user));
      showToast('Connecté!');
    } else {
      showToast('Email ou mot de passe incorrect');
    }
  };

  const handleAdminLogin = (pwd: string) => {
    if (pwd === DB.adminPwd) {
      setIsAdmin(true);
      setCurrentPage('admin');
      showToast('Connecté en tant qu\'administrateur');
    } else {
      showToast('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage('main');
    setAdminPanel('dashboard');
    localStorage.removeItem('nioraCurrentUser');
    showToast('Déconnecté');
  };

  // ===== RENDER FUNCTIONS =====
  const renderAll = () => {
    // This would trigger re-renders in a real React app
    // For now, we'll use state management
  };

  const renderAdminAll = () => {
    // Update stats and render admin panels
  };

  const showToast = (msg: string) => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  };

  // ===== COMMENTAIRES & LOGO =====
  const addCommentaire = (podcastId: number, contenu: string) => {
    if (!currentUser) {
      showToast('Vous devez être connecté pour commenter');
      return;
    }
    if (!contenu.trim()) {
      showToast('Le commentaire ne peut pas être vide');
      return;
    }
    DB.commentaires.push({
      id: Math.random().toString(36).substr(2, 9),
      podcastId,
      userId: currentUser.id,
      userName: currentUser.nom + ' ' + currentUser.prenom,
      userAvatar: currentUser.avatar,
      contenu,
      date: new Date().toLocaleDateString('fr-FR'),
    });
    saveData();
    showToast('Commentaire ajouté!');
  };

  const deleteCommentaire = (id: string) => {
    if (confirm('Supprimer ce commentaire ?')) {
      DB.commentaires = DB.commentaires.filter(c => c.id !== id);
      saveData();
      showToast('Commentaire supprimé.');
    }
  };

  const updateLogo = (logoUrl: string) => {
    DB.logo = logoUrl;
    saveData();
    showToast('Logo mis à jour!');
  };

  // ===== CRUD OPERATIONS =====
  const saveAnimateur = (nom: string, email: string, pwd: string, photo: string, badge: boolean, editId?: number) => {
    if (!nom) {
      showToast('Le nom est requis.');
      return;
    }

    if (editId) {
      const idx = DB.animateurs.findIndex(a => a.id === editId);
      if (idx > -1) {
        DB.animateurs[idx] = {
          ...DB.animateurs[idx],
          nom: nom.toUpperCase(),
          email,
          pwd: pwd || DB.animateurs[idx].pwd,
          photo: photo || DB.animateurs[idx].photo,
          badge,
        };
      }
    } else {
      DB.animateurs.push({
        id: DB.nextId++,
        nom: nom.toUpperCase(),
        email,
        pwd,
        photo: photo || '',
        badge,
      });
    }
    saveData();
    showToast('Animateur sauvegardé !');
  };

  const deleteAnimateur = (id: number) => {
    if (confirm('Supprimer cet animateur ?')) {
      DB.animateurs = DB.animateurs.filter(a => a.id !== id);
      saveData();
      showToast('Animateur supprimé.');
    }
  };

  const savePodcast = (titre: string, animateurId: number, lien: string, desc: string, editId?: number) => {
    if (!titre) {
      showToast('Le titre est requis.');
      return;
    }

    const date = new Date().toLocaleDateString('fr-FR');

    if (editId) {
      const idx = DB.podcasts.findIndex(p => p.id === editId);
      if (idx > -1) {
        DB.podcasts[idx] = { ...DB.podcasts[idx], titre, animateurId, lien, desc };
      }
    } else {
      DB.podcasts.unshift({ id: DB.nextId++, titre, animateurId, lien, desc, date });
    }
    saveData();
    showToast('Podcast sauvegardé !');
  };

  const deletePodcast = (id: number) => {
    if (confirm('Supprimer ce podcast ?')) {
      DB.podcasts = DB.podcasts.filter(p => p.id !== id);
      saveData();
      showToast('Podcast supprimé.');
    }
  };

  const submitContact = (nom: string, email: string, sujet: string, message: string) => {
    DB.messages.push({
      nom,
      email,
      sujet,
      message,
      date: new Date().toLocaleDateString('fr-FR'),
    });
    saveData();
    showToast('Message envoyé ! Merci 🎙');
  };

  // ===== RENDER PAGES =====
  return (
    <div>
      {/* MAIN PAGE */}
      {currentPage === 'main' && (
        <MainPage
          onAdminClick={() => setCurrentPage('login')}
          onContactSubmit={submitContact}
          db={DB}
        />
      )}

      {/* LOGIN PAGE */}
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleAdminLogin}
          onBack={() => setCurrentPage('main')}
        />
      )}

      {/* ADMIN PAGE */}
      {currentPage === 'admin' && isLoggedIn && (
        <AdminPage
          adminPanel={adminPanel}
          setAdminPanel={setAdminPanel}
          onLogout={handleLogout}
          db={DB}
          onSaveAnimateur={saveAnimateur}
          onDeleteAnimateur={deleteAnimateur}
          onSavePodcast={savePodcast}
          onDeletePodcast={deletePodcast}
          onSaveData={saveData}
        />
      )}

      {/* TOAST */}
      <div id="toast"></div>

      {/* LOADING OVERLAY */}
      <div id="loading-overlay" style={{ display: 'none' }}>
        <img src="" id="loading-logo" style={{ height: '60px' }} alt="Niora Radio" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: '#ff007f', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#ff007f', borderRadius: '50%', animation: 'pulse 1s ease-in-out 0.2s infinite' }}></div>
          <div style={{ width: '8px', height: '8px', background: '#ff007f', borderRadius: '50%', animation: 'pulse 1s ease-in-out 0.4s infinite' }}></div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '4px', fontSize: '14px', color: '#888' }}>CHARGEMENT EN COURS...</div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE COMPONENT =====
function MainPage({ onAdminClick, onContactSubmit, db }: any) {
  const [activeSection, setActiveSection] = useState('accueil');

  return (
    <div id="page-main" className="active">
      {/* NAVIGATION */}
      <nav>
        <div className="nav-inner">
          <div className="nav-logo">
            <img src="https://api.dicebear.com/7.x/initials/svg?seed=NR" alt="Niora Radio" />
          </div>
          <div className="nav-links">
            <button className={`nav-link ${activeSection === 'accueil' ? 'active' : ''}`} onClick={() => setActiveSection('accueil')}>Accueil</button>
            <button className={`nav-link ${activeSection === 'animateurs' ? 'active' : ''}`} onClick={() => setActiveSection('animateurs')}>Animateurs</button>
            <button className={`nav-link ${activeSection === 'podcasts' ? 'active' : ''}`} onClick={() => setActiveSection('podcasts')}>Podcasts</button>
            <button className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setActiveSection('contact')}>Contact</button>
          </div>
          <div className="nav-right">
            <div className="live-badge">
              <div className="live-dot"></div>
              EN DIRECT
            </div>
            <button className="btn-admin-nav" onClick={onAdminClick}>Admin</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      {activeSection === 'accueil' && (
        <div className="hero">
          <div className="hero-title">NIORA <span>RADIO</span></div>
          <div className="hero-sub">Musique, infos et bonne humeur en continu</div>
          <div className="waveform">
            {[...Array(9)].map((_, i) => <div key={i} className="wave-bar"></div>)}
          </div>
        </div>
      )}

      {/* PLAYER SECTION */}
      {activeSection === 'accueil' && (
        <div className="player-section">
          <div className="section-inner">
            <div className="player-grid">
              <div className="player-wrapper">
                <div className="player-card">
                  <div className="player-label">En écoute</div>
                  <iframe
                    src="https://player.radioking.io/nioraradio/?c=%23FF007F&c2=%23FFFFFF&f=v&i=0&p=1&s=1&alb=1&li=1&popup=1&plc=0&h=365&l=275&v=2"
                    style={{ borderRadius: '5px', width: '100%', height: '365px', display: 'block' }}
                    frameBorder="0"
                    allow="autoplay"
                    scrolling="no"
                  ></iframe>
                  <button className="btn-listen">▶ ÉCOUTER EN DIRECT</button>
                </div>
              </div>

              <div>
                <div className="section-title">Derniers <span>Podcasts</span></div>
                <div className="posts-grid">
                  {db.podcasts.slice(0, 3).map((pod: any, idx: number) => {
                    const anim = db.animateurs.find((a: any) => a.id === pod.animateurId);
                    return (
                      <div key={pod.id} className="post-card">
                        <div className="post-num">{String(idx + 1).padStart(2, '0')}</div>
                        <div className="post-info">
                          <div className="post-title">{pod.titre}</div>
                          <div className="post-meta">
                            {anim && (
                              <span className="post-author-badge">
                                <img src={anim.photo} alt={anim.nom} />
                                {anim.nom}
                                {anim.badge && <span className="badge-anim">🎙 ANIMATEUR</span>}
                              </span>
                            )}
                            <span>{pod.date}</span>
                          </div>
                        </div>
                        <div className="post-play" onClick={() => pod.lien && window.open(pod.lien, '_blank')}>
                          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATEURS */}
      {activeSection === 'animateurs' && (
        <div className="player-section">
          <div className="section-inner">
            <div className="section-title">Nos <span>Animateurs</span></div>
            <div className="animateurs-grid">
              {db.animateurs.map((anim: any) => (
                <div key={anim.id} className="animateur-card">
                  <img src={anim.photo} alt={anim.nom} className="animateur-photo" />
                  <div className="animateur-info">
                    <div className="animateur-name">{anim.nom}</div>
                    <div className="animateur-role">{anim.email}</div>
                    {anim.badge && <div className="badge-animateur">🎙 ANIMATEUR</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PODCASTS */}
      {activeSection === 'podcasts' && (
        <div className="player-section">
          <div className="section-inner">
            <div className="section-title">Tous les <span>Podcasts</span></div>
            <div className="posts-grid">
              {db.podcasts.map((pod: any, idx: number) => {
                const anim = db.animateurs.find((a: any) => a.id === pod.animateurId);
                return (
                  <div key={pod.id} className="post-card">
                    <div className="post-num">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="post-info">
                      <div className="post-title">{pod.titre}</div>
                      <div className="post-meta">
                        {anim && (
                          <span className="post-author-badge">
                            <img src={anim.photo} alt={anim.nom} />
                            {anim.nom}
                            {anim.badge && <span className="badge-anim">🎙 ANIMATEUR</span>}
                          </span>
                        )}
                        <span>{pod.date}</span>
                      </div>
                    </div>
                    <div className="post-play" onClick={() => pod.lien && window.open(pod.lien, '_blank')}>
                      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT */}
      {activeSection === 'contact' && (
        <div className="contact-section">
          <div className="section-inner">
            <div className="section-title">Nous <span>Contacter</span></div>
            <form className="contact-form" onSubmit={(e) => {
              e.preventDefault();
              const inputs = e.currentTarget.querySelectorAll('input, textarea');
              onContactSubmit(
                (inputs[0] as HTMLInputElement).value,
                (inputs[1] as HTMLInputElement).value,
                (inputs[2] as HTMLInputElement).value,
                (inputs[3] as HTMLTextAreaElement).value
              );
              e.currentTarget.reset();
            }}>
              <input type="text" placeholder="Votre nom" required />
              <input type="email" placeholder="Votre email" required />
              <input type="text" placeholder="Sujet" />
              <textarea placeholder="Votre message..."></textarea>
              <button type="submit" className="btn-submit">ENVOYER</button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <img src="https://api.dicebear.com/7.x/initials/svg?seed=NR" alt="Niora Radio" />
        <p>© 2025 Niora Radio — Musique, infos et bonne humeur en continu</p>
      </footer>
    </div>
  );
}

// ===== LOGIN PAGE COMPONENT =====
function LoginPage({ onLogin, onBack }: any) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }
    onLogin(password);
    setPassword('');
    setError('');
  };

  return (
    <div id="page-login" className="active">
      <div className="login-box">
        <div className="login-logo">
          <img src="https://api.dicebear.com/7.x/initials/svg?seed=NR" alt="Niora Radio" />
        </div>
        <div className="login-title">Panel Administrateur</div>
        {error && <div className="login-error" style={{ display: 'block' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <button type="submit" className="btn-login">CONNEXION</button>
        </form>
        <div className="back-to-site">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>← Retour au site</a>
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN PAGE COMPONENT =====
function AdminPage({ adminPanel, setAdminPanel, onLogout, db, onSaveAnimateur, onDeleteAnimateur, onSavePodcast, onDeletePodcast, onSaveData }: any) {
  const [animForm, setAnimForm] = useState({ id: '', nom: '', email: '', pwd: '', photo: '', badge: false });
  const [podForm, setPodForm] = useState({ id: '', titre: '', animateurId: '', lien: '', desc: '' });
  const [modalOpen, setModalOpen] = useState('');

  return (
    <div id="page-admin" className="active">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="https://api.dicebear.com/7.x/initials/svg?seed=NR" alt="Niora Radio" />
          <div className="sidebar-label">Panel Admin</div>
        </div>
        <nav className="sidebar-nav">
          <button className={`sidebar-item ${adminPanel === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminPanel('dashboard')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm0 10h8v8H3zM13 3h8v8h-8zm0 10h8v8h-8z" /></svg>
            Tableau de bord
          </button>
          <button className={`sidebar-item ${adminPanel === 'animateurs' ? 'active' : ''}`} onClick={() => setAdminPanel('animateurs')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
            Animateurs
          </button>
          <button className={`sidebar-item ${adminPanel === 'podcasts' ? 'active' : ''}`} onClick={() => setAdminPanel('podcasts')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm-1 13V8l6 4-6 4z" /></svg>
            Podcasts
          </button>
          <button className={`sidebar-item ${adminPanel === 'messages' ? 'active' : ''}`} onClick={() => setAdminPanel('messages')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
            Messages
          </button>
          <button className={`sidebar-item ${adminPanel === 'parametres' ? 'active' : ''}`} onClick={() => setAdminPanel('parametres')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
            Paramètres
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={onLogout}>⬅ Déconnexion</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            {adminPanel === 'dashboard' && 'TABLEAU DE BORD'}
            {adminPanel === 'animateurs' && 'GESTION ANIMATEURS'}
            {adminPanel === 'podcasts' && 'GESTION PODCASTS'}
            {adminPanel === 'messages' && 'MESSAGES'}
            {adminPanel === 'parametres' && 'PARAMÈTRES'}
          </div>
          <div style={{ fontSize: '13px', color: '#888' }}>Connecté en tant que <span style={{ color: '#ff007f' }}>Niora Radio</span></div>
        </div>

        <div className="admin-content">
          {/* DASHBOARD */}
          {adminPanel === 'dashboard' && (
            <div className="admin-panel-section active">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-num">{db.animateurs.length}</div>
                  <div className="stat-label">Animateurs</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">{db.podcasts.length}</div>
                  <div className="stat-label">Podcasts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">{db.messages.length}</div>
                  <div className="stat-label">Messages</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num" style={{ color: '#fff' }}>EN DIRECT</div>
                  <div className="stat-label">Statut Radio</div>
                </div>
              </div>
              <div className="section-title">Activité <span>Récente</span></div>
              <div style={{ color: '#888', fontSize: '14px', padding: '20px', background: '#111', border: '1px solid #444' }}>
                Aucune activité récente.
              </div>
            </div>
          )}

          {/* ANIMATEURS */}
          {adminPanel === 'animateurs' && (
            <div className="admin-panel-section active">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div className="section-title" style={{ margin: 0 }}>Gestion <span>Animateurs</span></div>
                <button className="btn-primary" onClick={() => { setAnimForm({ id: '', nom: '', email: '', pwd: '', photo: '', badge: false }); setModalOpen('animateur'); }}>+ Ajouter</button>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Badge Animateur</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.animateurs.map((a: any) => (
                      <tr key={a.id}>
                        <td><img className="user-avatar-sm" src={a.photo} alt={a.nom} /></td>
                        <td><strong>{a.nom}</strong></td>
                        <td style={{ color: '#888' }}>{a.email}</td>
                        <td>
                          <div className="toggle-wrap">
                            <label className="toggle">
                              <input type="checkbox" checked={a.badge} onChange={(e) => {
                                a.badge = e.target.checked;
                                onSaveData();
                              }} />
                              <span className="toggle-slider"></span>
                            </label>
                            {a.badge ? <span className="badge-animateur" style={{ marginTop: 0 }}>🎙 ANIMATEUR</span> : <span style={{ color: '#888', fontSize: '12px' }}>Inactif</span>}
                          </div>
                        </td>
                        <td>
                          <button className="btn-sm gray" onClick={() => { setAnimForm({ id: String(a.id), nom: a.nom, email: a.email, pwd: a.pwd, photo: a.photo, badge: a.badge }); setModalOpen('animateur'); }} style={{ marginRight: '6px' }}>Modifier</button>
                          <button className="btn-sm red" onClick={() => onDeleteAnimateur(a.id)}>Supprimer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PODCASTS */}
          {adminPanel === 'podcasts' && (
            <div className="admin-panel-section active">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div className="section-title" style={{ margin: 0 }}>Gestion <span>Podcasts</span></div>
                <button className="btn-primary" onClick={() => { setPodForm({ id: '', titre: '', animateurId: db.animateurs[0]?.id || '', lien: '', desc: '' }); setModalOpen('podcast'); }}>+ Ajouter</button>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Titre</th>
                      <th>Animateur</th>
                      <th>Lien</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.podcasts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: '#888', textAlign: 'center', padding: '30px' }}>Aucun podcast. Cliquez sur "+ Ajouter".</td>
                      </tr>
                    ) : (
                      db.podcasts.map((p: any, i: number) => {
                        const anim = db.animateurs.find((a: any) => a.id === p.animateurId);
                        return (
                          <tr key={p.id}>
                            <td style={{ color: '#ff007f' }}>{String(i + 1).padStart(2, '0')}</td>
                            <td><strong>{p.titre}</strong></td>
                            <td>{anim ? anim.nom : '—'}</td>
                            <td>{p.lien ? <a href={p.lien} target="_blank" rel="noreferrer" style={{ color: '#ff007f', fontSize: '12px' }}>Ouvrir ↗</a> : '—'}</td>
                            <td style={{ color: '#888' }}>{p.date || '—'}</td>
                            <td>
                              <button className="btn-sm gray" onClick={() => { setPodForm({ id: String(p.id), titre: p.titre, animateurId: String(p.animateurId), lien: p.lien, desc: p.desc }); setModalOpen('podcast'); }} style={{ marginRight: '6px' }}>Modifier</button>
                              <button className="btn-sm red" onClick={() => onDeletePodcast(p.id)}>Supprimer</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {adminPanel === 'messages' && (
            <div className="admin-panel-section active">
              <div className="section-title">Messages <span>Reçus</span></div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.messages.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ color: '#888', textAlign: 'center', padding: '30px' }}>Aucun message reçu.</td>
                      </tr>
                    ) : (
                      db.messages.map((m: any, i: number) => (
                        <tr key={i}>
                          <td>{m.nom}</td>
                          <td style={{ color: '#888' }}>{m.email}</td>
                          <td>{m.sujet || '—'}</td>
                          <td style={{ color: '#888', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                          <td>
                            <button className="btn-sm red" onClick={() => {
                              db.messages.splice(i, 1);
                              onSaveData();
                            }}>Supprimer</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PARAMETRES */}
          {adminPanel === 'parametres' && (
            <div className="admin-panel-section active">
              <div className="section-title">Paramètres <span>Système</span></div>
              <div style={{ background: '#111', border: '1px solid #444', padding: '25px', maxWidth: '600px' }}>
                <div className="form-group">
                  <label>Mot de passe administrateur</label>
                  <input type="password" placeholder="Nouveau mot de passe (optionnel)" onChange={(e) => {
                    if (e.target.value) {
                      db.adminPwd = e.target.value;
                      onSaveData();
                    }
                  }} />
                </div>
                <button className="btn-primary" onClick={() => alert('Paramètres sauvegardés !')}>Sauvegarder</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {modalOpen === 'animateur' && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setModalOpen('')}>
          <div className="modal-content">
            <div className="modal-title">Animateur</div>
            <div className="modal-form">
              <div>
                <label>Nom</label>
                <input type="text" value={animForm.nom} onChange={(e) => setAnimForm({ ...animForm, nom: e.target.value })} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={animForm.email} onChange={(e) => setAnimForm({ ...animForm, email: e.target.value })} />
              </div>
              <div>
                <label>Mot de passe</label>
                <input type="password" value={animForm.pwd} onChange={(e) => setAnimForm({ ...animForm, pwd: e.target.value })} />
              </div>
              <div>
                <label>Photo URL</label>
                <input type="text" value={animForm.photo} onChange={(e) => setAnimForm({ ...animForm, photo: e.target.value })} />
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={animForm.badge} onChange={(e) => setAnimForm({ ...animForm, badge: e.target.checked })} />
                  Badge Animateur
                </label>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-save" onClick={() => {
                onSaveAnimateur(animForm.nom, animForm.email, animForm.pwd, animForm.photo, animForm.badge, animForm.id ? parseInt(animForm.id) : undefined);
                setModalOpen('');
              }}>Sauvegarder</button>
              <button className="btn-cancel" onClick={() => setModalOpen('')}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen === 'podcast' && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setModalOpen('')}>
          <div className="modal-content">
            <div className="modal-title">Podcast</div>
            <div className="modal-form">
              <div>
                <label>Titre</label>
                <input type="text" value={podForm.titre} onChange={(e) => setPodForm({ ...podForm, titre: e.target.value })} />
              </div>
              <div>
                <label>Animateur</label>
                <select value={podForm.animateurId} onChange={(e) => setPodForm({ ...podForm, animateurId: e.target.value })}>
                  {db.animateurs.map((a: any) => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              <div>
                <label>Lien</label>
                <input type="text" value={podForm.lien} onChange={(e) => setPodForm({ ...podForm, lien: e.target.value })} />
              </div>
              <div>
                <label>Description</label>
                <textarea value={podForm.desc} onChange={(e) => setPodForm({ ...podForm, desc: e.target.value })}></textarea>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-save" onClick={() => {
                onSavePodcast(podForm.titre, parseInt(podForm.animateurId), podForm.lien, podForm.desc, podForm.id ? parseInt(podForm.id) : undefined);
                setModalOpen('');
              }}>Sauvegarder</button>
              <button className="btn-cancel" onClick={() => setModalOpen('')}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== REGISTER PAGE COMPONENT =====
function RegisterPage({ onRegister, onBack, onLoginClick }: any) {
  const [formData, setFormData] = React.useState({ email: '', password: '', nom: '', prenom: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.nom || !formData.prenom) {
      alert('Tous les champs sont requis');
      return;
    }
    onRegister(formData.email, formData.password, formData.nom, formData.prenom);
  };

  return (
    <div id="page-login" className="active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff' }}>Créer un compte</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ff007f', background: '#1a1a1a', color: '#fff' }} />
          <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ff007f', background: '#1a1a1a', color: '#fff' }} />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ff007f', background: '#1a1a1a', color: '#fff' }} />
          <input type="password" placeholder="Mot de passe" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ff007f', background: '#1a1a1a', color: '#fff' }} />
          <button type="submit" className="btn-admin-nav" style={{ padding: '10px', cursor: 'pointer' }}>S'inscrire</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>Déjà inscrit? <button onClick={onLoginClick} style={{ background: 'none', border: 'none', color: '#ff007f', cursor: 'pointer', textDecoration: 'underline' }}>Se connecter</button></p>
        <button onClick={onBack} className="btn-admin-nav" style={{ width: '100%', marginTop: '10px', background: '#333' }}>Retour</button>
      </div>
    </div>
  );
}

// ===== PROFILE PAGE COMPONENT =====
function ProfilePage({ user, onBack, onLogout, commentaires, podcasts, animateurs }: any) {
  return (
    <div id="page-profile" className="active" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: '#ff007f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '30px' }}>← Retour</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '10px' }}>
          <img src={user.avatar} alt={user.nom} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <div>
            <h1>{user.prenom} {user.nom}</h1>
            <p style={{ color: '#888' }}>{user.email}</p>
            <button onClick={onLogout} style={{ background: '#ff007f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>Déconnexion</button>
          </div>
        </div>
        <h2 style={{ marginBottom: '20px' }}>Mes commentaires ({commentaires.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {commentaires.length === 0 ? (
            <p style={{ color: '#888' }}>Aucun commentaire pour le moment</p>
          ) : (
            commentaires.map((com: any) => {
              const podcast = podcasts.find((p: any) => p.id === com.podcastId);
              return (
                <div key={com.id} style={{ padding: '15px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #ff007f' }}>
                  <p style={{ color: '#ff007f', marginBottom: '5px' }}>{podcast?.titre}</p>
                  <p>{com.contenu}</p>
                  <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>{com.date}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
