import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  classe: string;
  photo?: string;
  nomParent: string;
  telParent: string;
  adresse: string;
  matricule: string;
}

export interface Matiere {
  id: string;
  nom: string;
  coefficient: number;
  couleur: string;
  categorie: 'principal' | 'secondaire' | 'sport' | 'art' | 'langue';
  ordre: number;
}

export interface Note {
  id: string;
  eleveId: string;
  matiereId: string;
  valeur: number;
  type: 'examen' | 'controle' | 'devoir' | 'participation' | 'interrogation';
  trimestre: 1 | 2 | 3;
  date: string;
  commentaire?: string;
}

export interface Mention {
  id: string;
  nom: string;
  condition: string;
  couleur: string;
  icone: string;
}

export interface BulletinSettings {
  afficherRang: boolean;
  afficherRangMatiere: boolean;
  afficherMoyenneClasse: boolean;
  afficherAppreciation: boolean;
  afficherMentions: boolean;
  afficherGraphique: boolean;
  afficherPhoto: boolean;
  afficherSignatures: boolean;
  afficherCachet: boolean;
  formatPapier: 'A4' | 'Letter';
  orientation: 'portrait' | 'paysage';
}

export interface Settings {
  ecoleNom: string;
  ecoleSlogan: string;
  ecoleLogo?: string;
  ecoleAdresse: string;
  ecoleTel: string;
  ecoleEmail: string;
  heroImage?: string;
  cachet?: string;
  signatureDirecteur?: string;
  signatureEnseignant?: string;
  anneeDebut: string;
  anneeFin: string;
  theme: 'neon' | 'ocean' | 'sunset' | 'forest' | 'royal';
  bulletin: BulletinSettings;
}

export interface CommentaireBulletin {
  eleveId: string;
  trimestre: number;
  commentaire: string;
  mentionId?: string;
}

interface AppState {
  // Data
  eleves: Eleve[];
  matieres: Matiere[];
  notes: Note[];
  mentions: Mention[];
  commentaires: CommentaireBulletin[];
  settings: Settings;
  
  // UI
  currentTab: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  
  // Actions Eleves
  addEleve: (eleve: Omit<Eleve, 'id' | 'matricule'>) => void;
  updateEleve: (id: string, eleve: Partial<Eleve>) => void;
  deleteEleve: (id: string) => void;
  
  // Actions Matieres
  addMatiere: (matiere: Omit<Matiere, 'id'>) => void;
  updateMatiere: (id: string, matiere: Partial<Matiere>) => void;
  deleteMatiere: (id: string) => void;
  reorderMatieres: (matieres: Matiere[]) => void;
  
  // Actions Notes
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Actions Mentions
  addMention: (mention: Omit<Mention, 'id'>) => void;
  updateMention: (id: string, mention: Partial<Mention>) => void;
  deleteMention: (id: string) => void;
  
  // Actions Commentaires
  setCommentaire: (eleveId: string, trimestre: number, commentaire: string, mentionId?: string) => void;
  
  // Actions Settings
  updateSettings: (settings: Partial<Settings>) => void;
  updateBulletinSettings: (settings: Partial<BulletinSettings>) => void;
  
  // Actions UI
  setCurrentTab: (tab: string) => void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  
  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
  resetData: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);
const generateMatricule = () => `BDJ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

const defaultMatieres: Omit<Matiere, 'id'>[] = [
  { nom: 'Français', coefficient: 3, couleur: '#FF00FF', categorie: 'principal', ordre: 1 },
  { nom: 'Mathématiques', coefficient: 3, couleur: '#CCFF00', categorie: 'principal', ordre: 2 },
  { nom: 'Sciences', coefficient: 2, couleur: '#00FFFF', categorie: 'principal', ordre: 3 },
  { nom: 'Histoire-Géo', coefficient: 2, couleur: '#FF6B6B', categorie: 'secondaire', ordre: 4 },
  { nom: 'Anglais', coefficient: 2, couleur: '#4ECDC4', categorie: 'langue', ordre: 5 },
  { nom: 'Sport', coefficient: 1, couleur: '#45B7D1', categorie: 'sport', ordre: 6 },
  { nom: 'Arts Plastiques', coefficient: 1, couleur: '#96CEB4', categorie: 'art', ordre: 7 },
  { nom: 'Musique', coefficient: 1, couleur: '#DDA0DD', categorie: 'art', ordre: 8 },
];

const defaultMentions: Omit<Mention, 'id'>[] = [
  { nom: 'Félicitations du jury', condition: 'Moyenne ≥ 16 et comportement exemplaire', couleur: '#FFD700', icone: '🏆' },
  { nom: 'Tableau d\'honneur', condition: 'Moyenne ≥ 14', couleur: '#C0C0C0', icone: '⭐' },
  { nom: 'Tableau d\'encouragement', condition: 'Progrès significatifs', couleur: '#CD7F32', icone: '📈' },
  { nom: 'Avertissement travail', condition: 'Travail insuffisant', couleur: '#FF6B6B', icone: '⚠️' },
  { nom: 'Avertissement conduite', condition: 'Comportement à améliorer', couleur: '#FF4444', icone: '🚫' },
];

const defaultSettings: Settings = {
  ecoleNom: 'Les Bulles de Joie',
  ecoleSlogan: 'Espace Enseignant - L\'excellence dans la joie',
  ecoleAdresse: 'Cotonou, Bénin',
  ecoleTel: '+229 49 11 49 51',
  ecoleEmail: 'codjosamuelstein@gmail.com',
  anneeDebut: '2024',
  anneeFin: '2025',
  theme: 'neon',
  bulletin: {
    afficherRang: true,
    afficherRangMatiere: false,
    afficherMoyenneClasse: true,
    afficherAppreciation: true,
    afficherMentions: true,
    afficherGraphique: true,
    afficherPhoto: true,
    afficherSignatures: true,
    afficherCachet: true,
    formatPapier: 'A4',
    orientation: 'portrait',
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      eleves: [],
      matieres: defaultMatieres.map(m => ({ ...m, id: generateId() })),
      notes: [],
      mentions: defaultMentions.map(m => ({ ...m, id: generateId() })),
      commentaires: [],
      settings: defaultSettings,
      currentTab: 'dashboard',
      notifications: [],

      // Eleves Actions
      addEleve: (eleve) => {
        const newEleve: Eleve = { ...eleve, id: generateId(), matricule: generateMatricule() };
        set((state) => ({ eleves: [...state.eleves, newEleve] }));
        get().notify('success', `Élève ${eleve.prenom} ${eleve.nom} ajouté avec succès!`);
      },
      
      updateEleve: (id, eleve) => {
        set((state) => ({
          eleves: state.eleves.map((e) => (e.id === id ? { ...e, ...eleve } : e)),
        }));
        get().notify('success', 'Élève modifié avec succès!');
      },
      
      deleteEleve: (id) => {
        set((state) => ({
          eleves: state.eleves.filter((e) => e.id !== id),
          notes: state.notes.filter((n) => n.eleveId !== id),
          commentaires: state.commentaires.filter((c) => c.eleveId !== id),
        }));
        get().notify('success', 'Élève supprimé avec succès!');
      },

      // Matieres Actions
      addMatiere: (matiere) => {
        const newMatiere: Matiere = { ...matiere, id: generateId() };
        set((state) => ({ matieres: [...state.matieres, newMatiere] }));
        get().notify('success', `Matière "${matiere.nom}" ajoutée avec succès!`);
      },
      
      updateMatiere: (id, matiere) => {
        set((state) => ({
          matieres: state.matieres.map((m) => (m.id === id ? { ...m, ...matiere } : m)),
        }));
        get().notify('success', 'Matière modifiée avec succès!');
      },
      
      deleteMatiere: (id) => {
        set((state) => ({
          matieres: state.matieres.filter((m) => m.id !== id),
          notes: state.notes.filter((n) => n.matiereId !== id),
        }));
        get().notify('success', 'Matière supprimée avec succès!');
      },
      
      reorderMatieres: (matieres) => {
        set({ matieres });
      },

      // Notes Actions
      addNote: (note) => {
        const newNote: Note = { ...note, id: generateId() };
        set((state) => ({ notes: [...state.notes, newNote] }));
        get().notify('success', 'Note enregistrée avec succès!');
      },
      
      updateNote: (id, note) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...note } : n)),
        }));
        get().notify('success', 'Note modifiée avec succès!');
      },
      
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
        get().notify('success', 'Note supprimée!');
      },

      // Mentions Actions
      addMention: (mention) => {
        const newMention: Mention = { ...mention, id: generateId() };
        set((state) => ({ mentions: [...state.mentions, newMention] }));
        get().notify('success', `Mention "${mention.nom}" ajoutée!`);
      },
      
      updateMention: (id, mention) => {
        set((state) => ({
          mentions: state.mentions.map((m) => (m.id === id ? { ...m, ...mention } : m)),
        }));
        get().notify('success', 'Mention modifiée!');
      },
      
      deleteMention: (id) => {
        set((state) => ({ mentions: state.mentions.filter((m) => m.id !== id) }));
        get().notify('success', 'Mention supprimée!');
      },

      // Commentaires Actions
      setCommentaire: (eleveId, trimestre, commentaire, mentionId) => {
        set((state) => {
          const existing = state.commentaires.findIndex(
            (c) => c.eleveId === eleveId && c.trimestre === trimestre
          );
          if (existing >= 0) {
            const newCommentaires = [...state.commentaires];
            newCommentaires[existing] = { eleveId, trimestre, commentaire, mentionId };
            return { commentaires: newCommentaires };
          }
          return { commentaires: [...state.commentaires, { eleveId, trimestre, commentaire, mentionId }] };
        });
      },

      // Settings Actions
      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        get().notify('success', 'Paramètres enregistrés!');
      },
      
      updateBulletinSettings: (bulletinSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            bulletin: { ...state.settings.bulletin, ...bulletinSettings },
          },
        }));
        get().notify('success', 'Options du bulletin mises à jour!');
      },

      // UI Actions
      setCurrentTab: (tab) => set({ currentTab: tab }),
      
      notify: (type, message) => {
        const id = generateId();
        set((state) => ({
          notifications: [...state.notifications, { id, type, message }],
        }));
        setTimeout(() => get().removeNotification(id), 5000);
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      // Import/Export
      exportData: () => {
        const { eleves, matieres, notes, mentions, commentaires, settings } = get();
        return JSON.stringify({ eleves, matieres, notes, mentions, commentaires, settings }, null, 2);
      },
      
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            eleves: data.eleves || [],
            matieres: data.matieres || [],
            notes: data.notes || [],
            mentions: data.mentions || [],
            commentaires: data.commentaires || [],
            settings: { ...defaultSettings, ...data.settings },
          });
          get().notify('success', 'Données importées avec succès!');
          return true;
        } catch (e) {
          get().notify('error', 'Erreur lors de l\'importation');
          return false;
        }
      },
      
      resetData: () => {
        set({
          eleves: [],
          matieres: defaultMatieres.map(m => ({ ...m, id: generateId() })),
          notes: [],
          mentions: defaultMentions.map(m => ({ ...m, id: generateId() })),
          commentaires: [],
          settings: defaultSettings,
        });
        get().notify('info', 'Toutes les données ont été réinitialisées');
      },
    }),
    {
      name: 'bulles-de-joie-storage',
    }
  )
);

// Utility functions
export const getAppreciation = (note: number): { text: string; color: string } => {
  if (note >= 17) return { text: 'Très satisfaisant', color: '#10B981' };
  if (note >= 14) return { text: 'Satisfaisant', color: '#3B82F6' };
  if (note >= 10) return { text: 'Peu satisfaisant', color: '#F59E0B' };
  return { text: 'Insuffisant', color: '#EF4444' };
};

export const calculateMoyenne = (notes: Note[], matieres: Matiere[]): number => {
  if (notes.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCoef = 0;
  
  const notesByMatiere = notes.reduce((acc, note) => {
    if (!acc[note.matiereId]) acc[note.matiereId] = [];
    acc[note.matiereId].push(note.valeur);
    return acc;
  }, {} as Record<string, number[]>);
  
  Object.entries(notesByMatiere).forEach(([matiereId, vals]) => {
    const matiere = matieres.find((m) => m.id === matiereId);
    if (matiere) {
      const moyenne = vals.reduce((a, b) => a + b, 0) / vals.length;
      totalPoints += moyenne * matiere.coefficient;
      totalCoef += matiere.coefficient;
    }
  });
  
  return totalCoef > 0 ? Math.round((totalPoints / totalCoef) * 100) / 100 : 0;
};
