import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, BookOpen, PenTool, FileText, Settings, Plus, Edit2, Trash2,
  Save, X, Upload, Download, Search, Phone, Mail, MessageCircle, ChevronDown,
  Camera, Palette, Award, TrendingUp, BarChart3, Printer, FileSpreadsheet,
  Moon, Sun, Sparkles, GraduationCap, Star, AlertTriangle, CheckCircle,
  Info, XCircle, Menu, ChevronRight, Eye, EyeOff, RefreshCw, HelpCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useStore, getAppreciation, calculateMoyenne, Eleve, Matiere, Note, Mention } from './store';

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, ArcElement
);

// Types locaux
type TabType = 'dashboard' | 'eleves' | 'matieres' | 'notes' | 'bulletins' | 'settings';
type Trimestre = 1 | 2 | 3;

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function App() {
  const store = useStore();
  const [trimestre, setTrimestre] = useState<Trimestre>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactMenu, setShowContactMenu] = useState(false);
  
  // Appliquer le thème
  useEffect(() => {
    document.body.className = `theme-${store.settings.theme}`;
  }, [store.settings.theme]);

  const tabs = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'eleves', label: 'Élèves', icon: Users },
    { id: 'matieres', label: 'Matières', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: PenTool },
    { id: 'bulletins', label: 'Bulletins', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white pb-24 relative overflow-hidden">
      {/* Bulles décoratives */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />

      {/* Notifications */}
      <NotificationContainer />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.settings.ecoleLogo ? (
              <img src={store.settings.ecoleLogo} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-2xl">
                🫧
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold gradient-text">{store.settings.ecoleNom}</h1>
              <p className="text-xs text-white/60">{store.settings.ecoleSlogan}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sélecteur de trimestre */}
            <select
              value={trimestre}
              onChange={(e) => setTrimestre(Number(e.target.value) as Trimestre)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
            >
              <option value={1}>Trimestre 1</option>
              <option value={2}>Trimestre 2</option>
              <option value={3}>Trimestre 3</option>
            </select>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={store.currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {store.currentTab === 'dashboard' && <Dashboard trimestre={trimestre} />}
            {store.currentTab === 'eleves' && <ElevesPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
            {store.currentTab === 'matieres' && <MatieresPage />}
            {store.currentTab === 'notes' && <NotesPage trimestre={trimestre} />}
            {store.currentTab === 'bulletins' && <BulletinsPage trimestre={trimestre} />}
            {store.currentTab === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => store.setCurrentTab(tab.id)}
                className={`nav-item flex-1 ${store.currentTab === tab.id ? 'active' : 'text-white/60'}`}
              >
                <tab.icon size={20} />
                <span className="text-xs mt-1 hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bouton contact flottant */}
      <div className="fixed bottom-24 right-4 z-50">
        <AnimatePresence>
          {showContactMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 flex flex-col gap-2"
            >
              <a
                href="https://wa.me/22949114951"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-all"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href="mailto:codjosamuelstein@gmail.com"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all"
              >
                <Mail size={20} />
                <span className="text-sm font-medium">Email</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowContactMenu(!showContactMenu)}
          className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg glow-primary"
        >
          <motion.div animate={{ rotate: showContactMenu ? 45 : 0 }}>
            {showContactMenu ? <X size={24} /> : <HelpCircle size={24} />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}

// ============================================
// NOTIFICATIONS
// ============================================
function NotificationContainer() {
  const { notifications, removeNotification } = useStore();

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-yellow-500 to-orange-600',
    info: 'from-blue-500 to-indigo-600',
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notif) => {
          const Icon = icons[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`relative bg-gradient-to-r ${colors[notif.type]} rounded-xl p-4 pr-10 shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm font-medium">{notif.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="absolute top-2 right-2 text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ trimestre }: { trimestre: Trimestre }) {
  const { eleves, matieres, notes, settings } = useStore();
  
  const notesTrimestreActuel = notes.filter(n => n.trimestre === trimestre);
  const moyenneClasse = eleves.length > 0 
    ? eleves.reduce((sum, e) => {
        const notesEleve = notesTrimestreActuel.filter(n => n.eleveId === e.id);
        return sum + calculateMoyenne(notesEleve, matieres);
      }, 0) / eleves.length
    : 0;

  const stats = [
    { label: 'Élèves', value: eleves.length, icon: Users, color: 'from-pink-500 to-fuchsia-600' },
    { label: 'Matières', value: matieres.length, icon: BookOpen, color: 'from-lime-400 to-green-500' },
    { label: 'Notes', value: notesTrimestreActuel.length, icon: PenTool, color: 'from-cyan-400 to-blue-500' },
    { label: 'Moyenne', value: moyenneClasse.toFixed(2), icon: TrendingUp, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      {settings.heroImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden h-48"
        >
          <img src={settings.heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{settings.ecoleNom}</h2>
              <p className="text-white/70">{settings.ecoleSlogan}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            <p className="text-white/60 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Répartition des moyennes */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            Répartition des moyennes
          </h3>
          <div className="h-64">
            <Bar
              data={{
                labels: ['0-9', '10-13', '14-16', '17-20'],
                datasets: [{
                  label: 'Nombre d\'élèves',
                  data: [
                    eleves.filter(e => {
                      const m = calculateMoyenne(notesTrimestreActuel.filter(n => n.eleveId === e.id), matieres);
                      return m < 10;
                    }).length,
                    eleves.filter(e => {
                      const m = calculateMoyenne(notesTrimestreActuel.filter(n => n.eleveId === e.id), matieres);
                      return m >= 10 && m < 14;
                    }).length,
                    eleves.filter(e => {
                      const m = calculateMoyenne(notesTrimestreActuel.filter(n => n.eleveId === e.id), matieres);
                      return m >= 14 && m < 17;
                    }).length,
                    eleves.filter(e => {
                      const m = calculateMoyenne(notesTrimestreActuel.filter(n => n.eleveId === e.id), matieres);
                      return m >= 17;
                    }).length,
                  ],
                  backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
                  borderRadius: 8,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  x: { ticks: { color: '#fff' }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Top 5 élèves */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="text-secondary" size={20} />
            Top 5 Élèves
          </h3>
          <div className="space-y-3">
            {eleves
              .map(e => ({
                ...e,
                moyenne: calculateMoyenne(notesTrimestreActuel.filter(n => n.eleveId === e.id), matieres)
              }))
              .sort((a, b) => b.moyenne - a.moyenne)
              .slice(0, 5)
              .map((eleve, i) => (
                <div key={eleve.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-yellow-500 text-black' :
                    i === 1 ? 'bg-gray-300 text-black' :
                    i === 2 ? 'bg-orange-400 text-black' :
                    'bg-white/10 text-white'
                  }`}>
                    {i + 1}
                  </div>
                  {eleve.photo ? (
                    <img src={eleve.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {eleve.prenom[0]}{eleve.nom[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{eleve.prenom} {eleve.nom}</p>
                    <p className="text-sm text-white/60">{eleve.classe}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold gradient-text">{eleve.moyenne.toFixed(2)}</p>
                    <p className="text-xs text-white/60">{getAppreciation(eleve.moyenne).text}</p>
                  </div>
                </div>
              ))}
            {eleves.length === 0 && (
              <p className="text-center text-white/40 py-8">Aucun élève inscrit</p>
            )}
          </div>
        </div>
      </div>

      {/* Carte contact */}
      <div className="card card-primary">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="text-secondary" size={20} />
          Besoin d'aide ?
        </h3>
        <p className="text-white/70 mb-4">
          Contactez le support technique de Stein Technology pour toute question.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/22949114951"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex items-center gap-2"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <a
            href="mailto:codjosamuelstein@gmail.com"
            className="btn btn-secondary flex items-center gap-2"
          >
            <Mail size={18} />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE ÉLÈVES
// ============================================
function ElevesPage({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const { eleves, addEleve, updateEleve, deleteEleve, notify } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingEleve, setEditingEleve] = useState<Eleve | null>(null);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', dateNaissance: '', sexe: 'M' as 'M' | 'F',
    classe: '', photo: '', nomParent: '', telParent: '', adresse: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredEleves = eleves.filter(e =>
    `${e.prenom} ${e.nom} ${e.classe}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.prenom) {
      notify('error', 'Veuillez remplir le nom et prénom');
      return;
    }
    if (editingEleve) {
      updateEleve(editingEleve.id, formData);
    } else {
      addEleve(formData);
    }
    setShowModal(false);
    setEditingEleve(null);
    setFormData({ nom: '', prenom: '', dateNaissance: '', sexe: 'M', classe: '', photo: '', nomParent: '', telParent: '', adresse: '' });
  };

  const openEdit = (eleve: Eleve) => {
    setEditingEleve(eleve);
    setFormData({
      nom: eleve.nom, prenom: eleve.prenom, dateNaissance: eleve.dateNaissance,
      sexe: eleve.sexe, classe: eleve.classe, photo: eleve.photo || '',
      nomParent: eleve.nomParent, telParent: eleve.telParent, adresse: eleve.adresse
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Users size={28} />
          Gestion des Élèves
        </h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Ajouter un élève
        </button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Rechercher un élève..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-12"
        />
      </div>

      {/* Liste des élèves */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEleves.map((eleve) => (
          <motion.div
            key={eleve.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card hover:border-primary/50"
          >
            <div className="flex items-start gap-4">
              {eleve.photo ? (
                <img src={eleve.photo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-primary/30" />
              ) : (
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-white text-xl font-bold">
                  {eleve.prenom[0]}{eleve.nom[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{eleve.prenom} {eleve.nom}</h3>
                <p className="text-sm text-white/60">{eleve.classe}</p>
                <p className="text-xs text-white/40 mt-1">Mat: {eleve.matricule}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openEdit(eleve)} className="flex-1 btn btn-outline text-sm py-2">
                <Edit2 size={16} className="inline mr-1" /> Modifier
              </button>
              <button
                onClick={() => {
                  if (confirm('Supprimer cet élève ?')) deleteEleve(eleve.id);
                }}
                className="btn bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-sm py-2 px-3"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEleves.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aucun élève trouvé</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal onClose={() => { setShowModal(false); setEditingEleve(null); }}>
            <h3 className="text-xl font-bold mb-6 gradient-text">
              {editingEleve ? 'Modifier l\'élève' : 'Nouvel élève'}
            </h3>
            
            {/* Photo */}
            <div className="flex justify-center mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-white/40" />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Prénom *"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Nom *"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="input"
              />
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="input"
              />
              <select
                value={formData.sexe}
                onChange={(e) => setFormData({ ...formData, sexe: e.target.value as 'M' | 'F' })}
                className="input"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
              <input
                type="text"
                placeholder="Classe"
                value={formData.classe}
                onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Nom du parent"
                value={formData.nomParent}
                onChange={(e) => setFormData({ ...formData, nomParent: e.target.value })}
                className="input"
              />
              <input
                type="tel"
                placeholder="Téléphone parent"
                value={formData.telParent}
                onChange={(e) => setFormData({ ...formData, telParent: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="input sm:col-span-2"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingEleve(null); }} className="flex-1 btn btn-outline">
                Annuler
              </button>
              <button onClick={handleSubmit} className="flex-1 btn btn-primary">
                <Save size={18} className="inline mr-2" />
                {editingEleve ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// PAGE MATIÈRES
// ============================================
function MatieresPage() {
  const { matieres, addMatiere, updateMatiere, deleteMatiere, notify } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [formData, setFormData] = useState({
    nom: '', coefficient: 1, couleur: '#FF00FF',
    categorie: 'principal' as Matiere['categorie'], ordre: 1
  });

  const categories = [
    { value: 'principal', label: 'Principal', color: '#FF00FF' },
    { value: 'secondaire', label: 'Secondaire', color: '#CCFF00' },
    { value: 'langue', label: 'Langue', color: '#00FFFF' },
    { value: 'sport', label: 'Sport', color: '#45B7D1' },
    { value: 'art', label: 'Art', color: '#DDA0DD' },
  ];

  const handleSubmit = () => {
    if (!formData.nom) {
      notify('error', 'Veuillez entrer le nom de la matière');
      return;
    }
    if (editingMatiere) {
      updateMatiere(editingMatiere.id, formData);
    } else {
      addMatiere({ ...formData, ordre: matieres.length + 1 });
    }
    setShowModal(false);
    setEditingMatiere(null);
    setFormData({ nom: '', coefficient: 1, couleur: '#FF00FF', categorie: 'principal', ordre: 1 });
  };

  const openEdit = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setFormData({
      nom: matiere.nom, coefficient: matiere.coefficient, couleur: matiere.couleur,
      categorie: matiere.categorie, ordre: matiere.ordre
    });
    setShowModal(true);
  };

  const groupedMatieres = categories.map(cat => ({
    ...cat,
    matieres: matieres.filter(m => m.categorie === cat.value).sort((a, b) => a.ordre - b.ordre)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <BookOpen size={28} />
          Gestion des Matières
        </h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Ajouter une matière
        </button>
      </div>

      {/* Liste par catégorie */}
      <div className="space-y-6">
        {groupedMatieres.map((group) => (
          <div key={group.value} className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }} />
              {group.label}
              <span className="text-sm text-white/40 font-normal">({group.matieres.length})</span>
            </h3>
            
            {group.matieres.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.matieres.map((matiere) => (
                  <div
                    key={matiere.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: matiere.couleur }}
                    >
                      {matiere.nom.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{matiere.nom}</p>
                      <p className="text-sm text-white/60">Coef. {matiere.coefficient}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(matiere)}
                        className="p-2 rounded-lg hover:bg-primary/20 text-primary"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette matière ?')) deleteMatiere(matiere.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center py-4">Aucune matière dans cette catégorie</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal onClose={() => { setShowModal(false); setEditingMatiere(null); }}>
            <h3 className="text-xl font-bold mb-6 gradient-text">
              {editingMatiere ? 'Modifier la matière' : 'Nouvelle matière'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de la matière *"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="input"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Coefficient</label>
                  <select
                    value={formData.coefficient}
                    onChange={(e) => setFormData({ ...formData, coefficient: Number(e.target.value) })}
                    className="input"
                  >
                    {[1, 2, 3, 4, 5].map(c => (
                      <option key={c} value={c}>Coef. {c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Couleur</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.couleur}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.couleur}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Catégorie</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFormData({ ...formData, categorie: cat.value as Matiere['categorie'] })}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        formData.categorie === cat.value
                          ? 'bg-primary text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingMatiere(null); }} className="flex-1 btn btn-outline">
                Annuler
              </button>
              <button onClick={handleSubmit} className="flex-1 btn btn-primary">
                <Save size={18} className="inline mr-2" />
                {editingMatiere ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// PAGE NOTES
// ============================================
function NotesPage({ trimestre }: { trimestre: Trimestre }) {
  const { eleves, matieres, notes, addNote, deleteNote, notify } = useStore();
  const [selectedEleve, setSelectedEleve] = useState<string>('');
  const [selectedMatiere, setSelectedMatiere] = useState<string>('');
  const [noteValue, setNoteValue] = useState<string>('');
  const [noteType, setNoteType] = useState<Note['type']>('controle');

  const handleAddNote = () => {
    if (!selectedEleve || !selectedMatiere) {
      notify('error', 'Sélectionnez un élève et une matière');
      return;
    }
    const value = parseFloat(noteValue);
    if (isNaN(value) || value < 0 || value > 20) {
      notify('error', 'La note doit être entre 0 et 20');
      return;
    }
    addNote({
      eleveId: selectedEleve,
      matiereId: selectedMatiere,
      valeur: value,
      type: noteType,
      trimestre,
      date: new Date().toISOString().split('T')[0],
    });
    setNoteValue('');
  };

  const numPad = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];

  const handleNumPad = (key: string) => {
    if (key === '⌫') {
      setNoteValue(noteValue.slice(0, -1));
    } else if (key === '.' && noteValue.includes('.')) {
      return;
    } else {
      const newValue = noteValue + key;
      if (parseFloat(newValue) <= 20) {
        setNoteValue(newValue);
      }
    }
  };

  const recentNotes = notes
    .filter(n => n.trimestre === trimestre)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
        <PenTool size={28} />
        Saisie des Notes - T{trimestre}
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulaire de saisie */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Nouvelle note</h3>
          
          <div className="space-y-4">
            <select
              value={selectedEleve}
              onChange={(e) => setSelectedEleve(e.target.value)}
              className="input"
            >
              <option value="">Sélectionner un élève</option>
              {eleves.map(e => (
                <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
              ))}
            </select>

            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="input"
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              {(['controle', 'examen', 'devoir', 'interrogation'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all capitalize ${
                    noteType === type ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Affichage de la note */}
            <div className="text-center py-6 bg-white/5 rounded-xl">
              <span className="text-5xl font-bold gradient-text">
                {noteValue || '0'}
              </span>
              <span className="text-2xl text-white/40">/20</span>
            </div>

            {/* Pavé numérique */}
            <div className="grid grid-cols-3 gap-2">
              {numPad.map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumPad(key)}
                  className="h-14 rounded-xl text-xl font-semibold bg-white/10 hover:bg-primary/30 active:scale-95 transition-all"
                >
                  {key}
                </button>
              ))}
            </div>

            <button onClick={handleAddNote} className="w-full btn btn-primary text-lg">
              <Save size={20} className="inline mr-2" />
              Enregistrer la note
            </button>
          </div>
        </div>

        {/* Notes récentes */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Notes récentes</h3>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {recentNotes.map(note => {
              const eleve = eleves.find(e => e.id === note.eleveId);
              const matiere = matieres.find(m => m.id === note.matiereId);
              const appreciation = getAppreciation(note.valeur);
              
              return (
                <div key={note.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: matiere?.couleur || '#666' }}
                  >
                    {note.valeur}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{eleve?.prenom} {eleve?.nom}</p>
                    <p className="text-sm text-white/60">{matiere?.nom} • {note.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${appreciation.color}30`, color: appreciation.color }}>
                      {appreciation.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            
            {recentNotes.length === 0 && (
              <p className="text-center text-white/40 py-8">Aucune note pour ce trimestre</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE BULLETINS
// ============================================
function BulletinsPage({ trimestre }: { trimestre: Trimestre }) {
  const store = useStore();
  const { eleves, matieres, notes, mentions, commentaires, settings, setCommentaire, notify } = store;
  const [selectedEleve, setSelectedEleve] = useState<string>('');
  const [showBulletin, setShowBulletin] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedMention, setSelectedMention] = useState<string>('');
  const bulletinRef = useRef<HTMLDivElement>(null);

  const eleve = eleves.find(e => e.id === selectedEleve);
  const notesEleve = notes.filter(n => n.eleveId === selectedEleve && n.trimestre === trimestre);
  const moyenne = calculateMoyenne(notesEleve, matieres);

  // Calcul du rang
  const classement = eleves
    .map(e => ({
      id: e.id,
      moyenne: calculateMoyenne(notes.filter(n => n.eleveId === e.id && n.trimestre === trimestre), matieres)
    }))
    .sort((a, b) => b.moyenne - a.moyenne);
  const rang = classement.findIndex(c => c.id === selectedEleve) + 1;

  // Charger le commentaire existant
  useEffect(() => {
    const existing = commentaires.find(c => c.eleveId === selectedEleve && c.trimestre === trimestre);
    if (existing) {
      setComment(existing.commentaire);
      setSelectedMention(existing.mentionId || '');
    } else {
      setComment('');
      setSelectedMention('');
    }
  }, [selectedEleve, trimestre, commentaires]);

  const saveComment = () => {
    if (selectedEleve) {
      setCommentaire(selectedEleve, trimestre, comment, selectedMention || undefined);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!bulletinRef.current || !eleve) return;
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(12);
      pdf.text(`Bulletin de ${eleve.prenom} ${eleve.nom} - T${trimestre}`, 20, 20);
      pdf.text(`Moyenne: ${moyenne.toFixed(2)}/20`, 20, 30);
      pdf.text(`Rang: ${rang}/${eleves.length}`, 20, 40);
      pdf.save(`bulletin_${eleve.nom}_${eleve.prenom}_T${trimestre}.pdf`);
      notify('success', 'PDF exporté avec succès!');
    } catch (error) {
      notify('error', 'Erreur lors de l\'export PDF');
    }
  };

  const handleExportExcel = () => {
    if (!eleve) return;
    
    const data = matieres.map(m => {
      const notesMatiere = notesEleve.filter(n => n.matiereId === m.id);
      const moyenneMatiere = notesMatiere.length > 0
        ? notesMatiere.reduce((sum, n) => sum + n.valeur, 0) / notesMatiere.length
        : 0;
      return {
        Matière: m.nom,
        Coefficient: m.coefficient,
        Notes: notesMatiere.map(n => n.valeur).join(', '),
        Moyenne: moyenneMatiere.toFixed(2),
        Appréciation: getAppreciation(moyenneMatiere).text,
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bulletin');
    XLSX.writeFile(wb, `bulletin_${eleve.nom}_${eleve.prenom}_T${trimestre}.xlsx`);
    notify('success', 'Excel exporté avec succès!');
  };

  // Données pour le graphique radar
  const radarData = {
    labels: matieres.slice(0, 8).map(m => m.nom),
    datasets: [{
      label: 'Moyenne',
      data: matieres.slice(0, 8).map(m => {
        const notesM = notesEleve.filter(n => n.matiereId === m.id);
        return notesM.length > 0 ? notesM.reduce((s, n) => s + n.valeur, 0) / notesM.length : 0;
      }),
      backgroundColor: 'rgba(255, 0, 255, 0.2)',
      borderColor: '#FF00FF',
      borderWidth: 2,
      pointBackgroundColor: '#CCFF00',
    }],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
        <FileText size={28} />
        Bulletins Scolaires - T{trimestre}
      </h2>

      {/* Sélection élève */}
      <div className="card">
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            value={selectedEleve}
            onChange={(e) => { setSelectedEleve(e.target.value); setShowBulletin(false); }}
            className="input"
          >
            <option value="">Sélectionner un élève</option>
            {eleves.map(e => (
              <option key={e.id} value={e.id}>{e.prenom} {e.nom} - {e.classe}</option>
            ))}
          </select>
          
          {selectedEleve && (
            <button onClick={() => setShowBulletin(true)} className="btn btn-primary">
              <Eye size={18} className="inline mr-2" />
              Afficher le bulletin
            </button>
          )}
        </div>
      </div>

      {/* Aperçu du bulletin */}
      {selectedEleve && eleve && showBulletin && (
        <>
          {/* Options d'export */}
          <div className="flex flex-wrap gap-3 no-print">
            <button onClick={handlePrint} className="btn btn-primary">
              <Printer size={18} className="inline mr-2" />
              Imprimer
            </button>
            <button onClick={handleExportPDF} className="btn btn-secondary">
              <Download size={18} className="inline mr-2" />
              Export PDF
            </button>
            <button onClick={handleExportExcel} className="btn btn-outline">
              <FileSpreadsheet size={18} className="inline mr-2" />
              Export Excel
            </button>
          </div>

          {/* Commentaire et mention */}
          <div className="card no-print">
            <h3 className="text-lg font-semibold mb-4">Commentaire & Mention</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Mention</label>
                <select
                  value={selectedMention}
                  onChange={(e) => setSelectedMention(e.target.value)}
                  className="input"
                >
                  <option value="">Aucune mention</option>
                  {mentions.map(m => (
                    <option key={m.id} value={m.id}>{m.icone} {m.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Commentaire de l'enseignant</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="input min-h-[80px] resize-none"
                />
              </div>
            </div>
            
            <button onClick={saveComment} className="btn btn-primary">
              <Save size={18} className="inline mr-2" />
              Enregistrer
            </button>
          </div>

          {/* Bulletin imprimable */}
          <div ref={bulletinRef} className="card print-bulletin bg-white text-black" id="bulletin">
            {/* En-tête */}
            <div className="bulletin-header flex justify-between items-center border-b-2 border-[#FF00FF] pb-4 mb-4">
              <div className="flex items-center gap-3">
                {settings.ecoleLogo ? (
                  <img src={settings.ecoleLogo} alt="Logo" className="bulletin-logo w-16 h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#CCFF00] flex items-center justify-center text-3xl">
                    🫧
                  </div>
                )}
                <div>
                  <h1 className="bulletin-title text-xl font-bold text-[#FF00FF]">{settings.ecoleNom}</h1>
                  <p className="bulletin-subtitle text-sm text-gray-600">{settings.ecoleSlogan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Année scolaire {settings.anneeDebut}-{settings.anneeFin}</p>
                <p className="text-[#FF00FF] font-bold">Bulletin du {trimestre}ème Trimestre</p>
              </div>
            </div>

            {/* Infos élève */}
            <div className="bulletin-student-info grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              {settings.bulletin.afficherPhoto && eleve.photo ? (
                <img src={eleve.photo} alt="" className="bulletin-student-photo w-20 h-24 object-cover rounded-lg" />
              ) : (
                <div className="w-20 h-24 bg-gradient-to-br from-[#FF00FF] to-[#CCFF00] rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {eleve.prenom[0]}{eleve.nom[0]}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Nom:</span> <strong>{eleve.nom}</strong></p>
                <p><span className="text-gray-500">Prénom:</span> <strong>{eleve.prenom}</strong></p>
                <p><span className="text-gray-500">Matricule:</span> <strong>{eleve.matricule}</strong></p>
                <p><span className="text-gray-500">Classe:</span> <strong>{eleve.classe}</strong></p>
                <p><span className="text-gray-500">Né(e) le:</span> <strong>{eleve.dateNaissance}</strong></p>
                <p><span className="text-gray-500">Sexe:</span> <strong>{eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}</strong></p>
              </div>
              <div className="text-center">
                {settings.bulletin.afficherRang && (
                  <div className="bg-gradient-to-br from-[#FF00FF] to-[#CCFF00] text-white rounded-lg p-3">
                    <p className="text-xs">RANG</p>
                    <p className="text-2xl font-bold">{rang}/{eleves.length}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tableau des notes */}
            <table className="bulletin-table w-full border-collapse text-sm mb-4">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Matière</th>
                  <th className="p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Coef</th>
                  <th className="p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Notes</th>
                  <th className="p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Moy.</th>
                  {settings.bulletin.afficherMoyenneClasse && (
                    <th className="p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Moy. Cl.</th>
                  )}
                  {settings.bulletin.afficherAppreciation && (
                    <th className="p-2 bg-gradient-to-r from-[#FF00FF] to-[#CCFF00] text-white">Appréciation</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {matieres.map((matiere, i) => {
                  const notesM = notesEleve.filter(n => n.matiereId === matiere.id);
                  const moyM = notesM.length > 0 ? notesM.reduce((s, n) => s + n.valeur, 0) / notesM.length : 0;
                  const appreciation = getAppreciation(moyM);
                  
                  // Moyenne de classe pour cette matière
                  const moyenneClasse = eleves.length > 0
                    ? eleves.reduce((sum, e) => {
                        const notesE = notes.filter(n => n.eleveId === e.id && n.matiereId === matiere.id && n.trimestre === trimestre);
                        return sum + (notesE.length > 0 ? notesE.reduce((s, n) => s + n.valeur, 0) / notesE.length : 0);
                      }, 0) / eleves.length
                    : 0;
                  
                  return (
                    <tr key={matiere.id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="matiere-cell p-2 font-medium" style={{ borderLeft: `4px solid ${matiere.couleur}` }}>
                        {matiere.nom}
                      </td>
                      <td className="p-2 text-center">{matiere.coefficient}</td>
                      <td className="p-2 text-center text-sm">
                        {notesM.map(n => n.valeur).join(' | ') || '-'}
                      </td>
                      <td className="note-cell p-2 text-center font-bold">
                        {notesM.length > 0 ? moyM.toFixed(2) : '-'}
                      </td>
                      {settings.bulletin.afficherMoyenneClasse && (
                        <td className="p-2 text-center text-gray-500">{moyenneClasse.toFixed(2)}</td>
                      )}
                      {settings.bulletin.afficherAppreciation && (
                        <td className="appreciation-cell p-2 text-sm" style={{ color: appreciation.color }}>
                          {notesM.length > 0 ? appreciation.text : '-'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Résumé */}
            <div className="bulletin-summary grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#FF00FF]/10 to-[#CCFF00]/10 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Moyenne Générale</p>
                <p className="text-3xl font-bold text-[#FF00FF]">{moyenne.toFixed(2)}/20</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Appréciation</p>
                <p className="text-xl font-semibold" style={{ color: getAppreciation(moyenne).color }}>
                  {getAppreciation(moyenne).text}
                </p>
              </div>
              {settings.bulletin.afficherRang && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Classement</p>
                  <p className="text-3xl font-bold text-[#CCFF00]">{rang}<sup>e</sup>/{eleves.length}</p>
                </div>
              )}
            </div>

            {/* Graphique radar */}
            {settings.bulletin.afficherGraphique && (
              <div className="bulletin-chart mx-auto mb-4" style={{ maxWidth: '250px', maxHeight: '250px' }}>
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: { display: false },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                      },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            )}

            {/* Mention et commentaire */}
            {(settings.bulletin.afficherMentions || comment) && (
              <div className="bulletin-comments p-4 bg-gray-50 rounded-lg border-l-4 border-[#FF00FF] mb-4">
                {settings.bulletin.afficherMentions && selectedMention && (
                  <div className="bulletin-mention inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-bold mb-2">
                    {mentions.find(m => m.id === selectedMention)?.icone}{' '}
                    {mentions.find(m => m.id === selectedMention)?.nom}
                  </div>
                )}
                {comment && (
                  <p className="text-gray-700 italic">"{comment}"</p>
                )}
              </div>
            )}

            {/* Signatures */}
            {settings.bulletin.afficherSignatures && (
              <div className="bulletin-signatures grid grid-cols-3 gap-6 pt-4 border-t border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Le Parent</p>
                  <div className="h-16 border-b border-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">L'Enseignant(e)</p>
                  {settings.signatureEnseignant ? (
                    <img src={settings.signatureEnseignant} alt="Signature" className="bulletin-signature-img mx-auto max-h-12" />
                  ) : (
                    <div className="h-16 border-b border-gray-300" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Le Directeur</p>
                  {settings.signatureDirecteur ? (
                    <img src={settings.signatureDirecteur} alt="Signature" className="bulletin-signature-img mx-auto max-h-12" />
                  ) : (
                    <div className="h-16 border-b border-gray-300" />
                  )}
                  {settings.bulletin.afficherCachet && settings.cachet && (
                    <img src={settings.cachet} alt="Cachet" className="bulletin-stamp mx-auto mt-2 max-h-16 opacity-70" />
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bulletin-footer text-center text-xs text-gray-400 mt-4 pt-2 border-t border-gray-200">
              {settings.ecoleAdresse} | Tél: {settings.ecoleTel} | {settings.ecoleEmail}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// PAGE PARAMÈTRES
// ============================================
function SettingsPage() {
  const store = useStore();
  const { settings, mentions, updateSettings, updateBulletinSettings, addMention, updateMention, deleteMention, exportData, importData, resetData, notify } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const themes = [
    { id: 'neon', name: 'Néon', colors: ['#FF00FF', '#CCFF00'] },
    { id: 'ocean', name: 'Océan', colors: ['#00CED1', '#00FA9A'] },
    { id: 'sunset', name: 'Coucher', colors: ['#FF6B6B', '#FFE66D'] },
    { id: 'forest', name: 'Forêt', colors: ['#00D084', '#7CB342'] },
    { id: 'royal', name: 'Royal', colors: ['#9B59B6', '#E74C3C'] },
  ];

  const handleImageUpload = (type: 'ecoleLogo' | 'heroImage' | 'cachet' | 'signatureDirecteur' | 'signatureEnseignant') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ [type]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulles-de-joie-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('success', 'Sauvegarde exportée avec succès!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importData(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const [showMentionModal, setShowMentionModal] = useState(false);
  const [editingMention, setEditingMention] = useState<Mention | null>(null);
  const [mentionForm, setMentionForm] = useState({ nom: '', condition: '', couleur: '#FFD700', icone: '⭐' });

  const handleMentionSubmit = () => {
    if (!mentionForm.nom) {
      notify('error', 'Veuillez entrer le nom de la mention');
      return;
    }
    if (editingMention) {
      updateMention(editingMention.id, mentionForm);
    } else {
      addMention(mentionForm);
    }
    setShowMentionModal(false);
    setEditingMention(null);
    setMentionForm({ nom: '', condition: '', couleur: '#FFD700', icone: '⭐' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
        <Settings size={28} />
        Paramètres
      </h2>

      {/* Thème */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette size={20} className="text-primary" />
          Thème de couleurs
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateSettings({ theme: theme.id as typeof settings.theme })}
              className={`p-4 rounded-xl transition-all ${
                settings.theme === theme.id ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors[0] }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors[1] }} />
              </div>
              <p className="text-sm font-medium">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Informations école */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap size={20} className="text-secondary" />
          Informations de l'école
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Logo */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Logo de l'école</label>
            <div className="flex items-center gap-4">
              {settings.ecoleLogo ? (
                <img src={settings.ecoleLogo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                  <Upload size={24} className="text-white/40" />
                </div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload('ecoleLogo')} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="btn btn-outline text-sm cursor-pointer">
                  Changer le logo
                </label>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Image Hero (Dashboard)</label>
            <div className="flex items-center gap-4">
              {settings.heroImage ? (
                <img src={settings.heroImage} alt="Hero" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                  <Upload size={24} className="text-white/40" />
                </div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload('heroImage')} className="hidden" id="hero-upload" />
                <label htmlFor="hero-upload" className="btn btn-outline text-sm cursor-pointer">
                  Changer l'image
                </label>
              </div>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Nom de l'école"
            value={settings.ecoleNom}
            onChange={(e) => updateSettings({ ecoleNom: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Slogan"
            value={settings.ecoleSlogan}
            onChange={(e) => updateSettings({ ecoleSlogan: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Adresse"
            value={settings.ecoleAdresse}
            onChange={(e) => updateSettings({ ecoleAdresse: e.target.value })}
            className="input"
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={settings.ecoleTel}
            onChange={(e) => updateSettings({ ecoleTel: e.target.value })}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={settings.ecoleEmail}
            onChange={(e) => updateSettings({ ecoleEmail: e.target.value })}
            className="input"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Année début"
              value={settings.anneeDebut}
              onChange={(e) => updateSettings({ anneeDebut: e.target.value })}
              className="input flex-1"
            />
            <input
              type="text"
              placeholder="Année fin"
              value={settings.anneeFin}
              onChange={(e) => updateSettings({ anneeFin: e.target.value })}
              className="input flex-1"
            />
          </div>
        </div>
      </div>

      {/* Options du bulletin */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          Options du Bulletin
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'afficherRang', label: 'Afficher le rang général' },
            { key: 'afficherRangMatiere', label: 'Afficher le rang par matière' },
            { key: 'afficherMoyenneClasse', label: 'Afficher la moyenne de classe' },
            { key: 'afficherAppreciation', label: 'Afficher les appréciations' },
            { key: 'afficherMentions', label: 'Afficher les mentions' },
            { key: 'afficherGraphique', label: 'Afficher le graphique radar' },
            { key: 'afficherPhoto', label: 'Afficher la photo de l\'élève' },
            { key: 'afficherSignatures', label: 'Afficher les signatures' },
            { key: 'afficherCachet', label: 'Afficher le cachet' },
          ].map((option) => (
            <label key={option.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10">
              <input
                type="checkbox"
                checked={settings.bulletin[option.key as keyof typeof settings.bulletin] as boolean}
                onChange={(e) => updateBulletinSettings({ [option.key]: e.target.checked })}
                className="w-5 h-5 rounded accent-[#FF00FF]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {/* Signatures et cachet */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">Signature Directeur</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('signatureDirecteur')} className="hidden" id="sig-dir" />
            <label htmlFor="sig-dir" className="block w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-primary">
              {settings.signatureDirecteur ? (
                <img src={settings.signatureDirecteur} alt="" className="max-h-12 mx-auto" />
              ) : (
                <Upload size={24} className="mx-auto text-white/40" />
              )}
            </label>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Signature Enseignant</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('signatureEnseignant')} className="hidden" id="sig-ens" />
            <label htmlFor="sig-ens" className="block w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-primary">
              {settings.signatureEnseignant ? (
                <img src={settings.signatureEnseignant} alt="" className="max-h-12 mx-auto" />
              ) : (
                <Upload size={24} className="mx-auto text-white/40" />
              )}
            </label>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Cachet de l'école</label>
            <input type="file" accept="image/*" onChange={handleImageUpload('cachet')} className="hidden" id="cachet" />
            <label htmlFor="cachet" className="block w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-primary">
              {settings.cachet ? (
                <img src={settings.cachet} alt="" className="max-h-12 mx-auto" />
              ) : (
                <Upload size={24} className="mx-auto text-white/40" />
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Gestion des mentions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award size={20} className="text-yellow-400" />
            Mentions personnalisées
          </h3>
          <button onClick={() => setShowMentionModal(true)} className="btn btn-primary text-sm">
            <Plus size={16} className="inline mr-1" /> Ajouter
          </button>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {mentions.map((mention) => (
            <div key={mention.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <span className="text-2xl">{mention.icone}</span>
              <div className="flex-1">
                <p className="font-medium">{mention.nom}</p>
                <p className="text-sm text-white/60">{mention.condition}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingMention(mention);
                    setMentionForm({ nom: mention.nom, condition: mention.condition, couleur: mention.couleur, icone: mention.icone });
                    setShowMentionModal(true);
                  }}
                  className="p-2 hover:bg-primary/20 rounded-lg text-primary"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteMention(mention.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sauvegarde */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download size={20} className="text-primary" />
          Sauvegarde & Import
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn btn-primary">
            <Download size={18} className="inline mr-2" />
            Exporter les données
          </button>
          <div>
            <input ref={importInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button onClick={() => importInputRef.current?.click()} className="btn btn-secondary">
              <Upload size={18} className="inline mr-2" />
              Importer
            </button>
          </div>
          <button
            onClick={() => {
              if (confirm('⚠️ Cette action supprimera toutes vos données. Continuer ?')) {
                resetData();
              }
            }}
            className="btn bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <RefreshCw size={18} className="inline mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Contact */}
      <div className="card card-primary">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-secondary" />
          Support Technique - Stein Technology
        </h3>
        <p className="text-white/70 mb-4">
          Besoin d'aide ou de personnalisation ? Contactez-nous !
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://wa.me/22949114951" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MessageCircle size={18} className="inline mr-2" />
            +229 49 11 49 51
          </a>
          <a href="mailto:codjosamuelstein@gmail.com" className="btn btn-secondary">
            <Mail size={18} className="inline mr-2" />
            Email
          </a>
        </div>
      </div>

      {/* Modal Mention */}
      <AnimatePresence>
        {showMentionModal && (
          <Modal onClose={() => { setShowMentionModal(false); setEditingMention(null); }}>
            <h3 className="text-xl font-bold mb-6 gradient-text">
              {editingMention ? 'Modifier la mention' : 'Nouvelle mention'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Émoji</label>
                  <input
                    type="text"
                    value={mentionForm.icone}
                    onChange={(e) => setMentionForm({ ...mentionForm, icone: e.target.value })}
                    className="input w-20 text-center text-2xl"
                    maxLength={2}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-white/60 mb-2">Nom de la mention</label>
                  <input
                    type="text"
                    value={mentionForm.nom}
                    onChange={(e) => setMentionForm({ ...mentionForm, nom: e.target.value })}
                    className="input"
                    placeholder="Ex: Félicitations"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Condition d'attribution</label>
                <input
                  type="text"
                  value={mentionForm.condition}
                  onChange={(e) => setMentionForm({ ...mentionForm, condition: e.target.value })}
                  className="input"
                  placeholder="Ex: Moyenne ≥ 16"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Couleur</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={mentionForm.couleur}
                    onChange={(e) => setMentionForm({ ...mentionForm, couleur: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mentionForm.couleur}
                    onChange={(e) => setMentionForm({ ...mentionForm, couleur: e.target.value })}
                    className="input flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowMentionModal(false); setEditingMention(null); }} className="flex-1 btn btn-outline">
                Annuler
              </button>
              <button onClick={handleMentionSubmit} className="flex-1 btn btn-primary">
                <Save size={18} className="inline mr-2" />
                {editingMention ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// COMPOSANTS UTILITAIRES
// ============================================
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
