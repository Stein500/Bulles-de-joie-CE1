import { create } from 'zustand';
import localforage from 'localforage';

localforage.config({ name: 'bulles-de-joie', storeName: 'school_data' });

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  photo?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  className: string;
  matricule?: string;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  color: string;
  category: string;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number | null;
}

export interface Period {
  id: string;
  name: string;
  type: 'trimestre' | 'semestre' | 'custom';
  startDate: string;
  endDate: string;
}

export interface AppreciationRule {
  id: string;
  min: number;
  max: number;
  label: string;
  color: string;
}

export interface MentionRule {
  id: string;
  minAverage: number;
  label: string;
  emoji: string;
  color: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  logo?: string;
  cachet?: string;
  signatureDirecteur?: string;
  signatureEnseignant?: string;
  anneeScolaire: string;
  primaryColor: string;
  showRanks: boolean;
  bulletinTitle: string;
  directorTitle: string;
  teacherTitle: string;
  parentTitle: string;
  noteMin: number;
  noteMax: number;
  noteDecimalPlaces: number;
}

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
  duration: number;
}


export interface DemoNamePool {
  firstNamesMale: string[];
  firstNamesFemale: string[];
  lastNames: string[];
}

interface AppState {
  // UI
  currentPage: string;
  darkMode: boolean;
  showSplash: boolean;
  toasts: Toast[];

  // Data
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  periods: Period[];
  settings: SchoolSettings;
  activePeriodId: string;
  appreciationRules: AppreciationRule[];
  mentionRules: MentionRule[];
  categories: string[];
  demoNames: DemoNamePool;

  // Actions
  setPage: (page: string) => void;
  toggleDarkMode: () => void;
  setShowSplash: (show: boolean) => void;
  addToast: (message: string, type: Toast['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Students
  addStudent: (student: Student) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  setStudents: (students: Student[]) => void;

  // Subjects
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  setSubjects: (subjects: Subject[]) => void;

  // Grades
  setGrade: (grade: Grade) => void;
  setGrades: (grades: Grade[]) => void;
  bulkSetGrades: (grades: Grade[]) => void;

  // Periods
  addPeriod: (period: Period) => void;
  updatePeriod: (id: string, data: Partial<Period>) => void;
  deletePeriod: (id: string) => void;
  setActivePeriod: (id: string) => void;

  // Appreciation Rules
  addAppreciationRule: (rule: AppreciationRule) => void;
  updateAppreciationRule: (id: string, data: Partial<AppreciationRule>) => void;
  deleteAppreciationRule: (id: string) => void;
  setAppreciationRules: (rules: AppreciationRule[]) => void;

  // Mention Rules
  addMentionRule: (rule: MentionRule) => void;
  updateMentionRule: (id: string, data: Partial<MentionRule>) => void;
  deleteMentionRule: (id: string) => void;
  setMentionRules: (rules: MentionRule[]) => void;

  // Categories
  addCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  setCategories: (cats: string[]) => void;

  // Demo Names
  setDemoNames: (pool: DemoNamePool) => void;
  addDemoFirstNameMale: (name: string) => void;
  removeDemoFirstNameMale: (name: string) => void;
  addDemoFirstNameFemale: (name: string) => void;
  removeDemoFirstNameFemale: (name: string) => void;
  addDemoLastName: (name: string) => void;
  removeDemoLastName: (name: string) => void;
  renameDemoFirstNameMale: (oldName: string, newName: string) => void;
  renameDemoFirstNameFemale: (oldName: string, newName: string) => void;
  renameDemoLastName: (oldName: string, newName: string) => void;

  // Settings
  updateSettings: (data: Partial<SchoolSettings>) => void;

  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;

  // Import/Export
  exportAllData: () => string;
  importAllData: (json: string) => void;
}

export const defaultSubjects: Subject[] = [
  { id: 's1', name: 'Mathématiques', coefficient: 4, color: '#4169E1', category: 'Sciences' },
  { id: 's2', name: 'Français', coefficient: 4, color: '#DC143C', category: 'Langues' },
  { id: 's3', name: 'PCT', coefficient: 2, color: '#28A745', category: 'Sciences' },
  { id: 's4', name: 'Histoire-Géo', coefficient: 2, color: '#FF8C00', category: 'Humanités' },
  { id: 's5', name: 'Anglais', coefficient: 2, color: '#9B59B6', category: 'Langues' },
  { id: 's6', name: 'Éducation Civique', coefficient: 1, color: '#1ABC9C', category: 'Humanités' },
  { id: 's7', name: 'EPS', coefficient: 1, color: '#E74C3C', category: 'Sport' },
  { id: 's8', name: 'Arts Plastiques', coefficient: 1, color: '#FF69B4', category: 'Arts' },
];

const defaultPeriods: Period[] = [
  { id: 'p1', name: 'Trimestre 1', type: 'trimestre', startDate: '2024-09-01', endDate: '2024-12-15' },
  { id: 'p2', name: 'Trimestre 2', type: 'trimestre', startDate: '2025-01-06', endDate: '2025-03-15' },
  { id: 'p3', name: 'Trimestre 3', type: 'trimestre', startDate: '2025-03-31', endDate: '2025-06-30' },
];

const defaultSettings: SchoolSettings = {
  schoolName: 'Les Bulles de Joie',
  schoolAddress: 'Cotonou, Bénin',
  schoolPhone: '',
  schoolEmail: '',
  anneeScolaire: '2024-2025',
  primaryColor: '#FF69B4',
  showRanks: true,
  bulletinTitle: 'BULLETIN DE NOTES',
  directorTitle: 'Le/La Directeur(trice)',
  teacherTitle: "L'Enseignant(e)",
  parentTitle: 'Le Parent',
  noteMin: 0,
  noteMax: 20,
  noteDecimalPlaces: 2,
};

export const defaultAppreciationRules: AppreciationRule[] = [
  { id: 'a1', min: 0, max: 9.99, label: 'Insuffisant', color: '#DC143C' },
  { id: 'a2', min: 10, max: 13.99, label: 'Peu satisfaisant', color: '#FF8C00' },
  { id: 'a3', min: 14, max: 16.99, label: 'Satisfaisant', color: '#4169E1' },
  { id: 'a4', min: 17, max: 20, label: 'Très satisfaisant', color: '#28A745' },
];

export const defaultMentionRules: MentionRule[] = [
  { id: 'm1', minAverage: 16, label: "TABLEAU D'HONNEUR", emoji: '🏆', color: '#FFD700' },
  { id: 'm2', minAverage: 14, label: 'FÉLICITATIONS', emoji: '⭐', color: '#FF69B4' },
  { id: 'm3', minAverage: 12, label: 'ENCOURAGEMENTS', emoji: '👏', color: '#4169E1' },
  { id: 'm4', minAverage: 10, label: 'PASSABLE', emoji: '📝', color: '#28A745' },
  { id: 'm5', minAverage: 0, label: 'INSUFFISANT', emoji: '⚠️', color: '#DC143C' },
];

export const defaultCategories: string[] = [
  'Sciences', 'Langues', 'Humanités', 'Arts', 'Sport', 'Technique', 'Autre',
];

export const defaultDemoNames: DemoNamePool = {
  firstNamesMale: [
    'Koffi', 'Codjo', 'Dossa', 'Gbèdo', 'Agossou', 'Sènan', 'Zinsou', 'Todjo',
    'Akpédjé', 'Hounkpatin', 'Sossou', 'Yémalin', 'Médégan', 'Kokou',
    'Firmin', 'Hospice', 'Landry', 'Parfait', 'Prudence', 'Bernardin',
    'Moïse', 'Jérémie', 'Crépin', 'Nicéphore', 'Aurélien', 'Wilfried',
    'Boris', 'Ghislain', 'Romaric', 'Comlan', 'Togbé', 'Finagnon',
    'Ayédjo', 'Akotègnon', 'Désiré', 'Achille', 'Brice', 'Fernand',
    'Luc', 'Gérard', 'Thierry', 'Ibrahim', 'Moussa', 'Rachid', 'Aziz',
  ],
  firstNamesFemale: [
    'Akouavi', 'Adjovi', 'Akossou', 'Ayaba', 'Sessimè', 'Amavi', 'Yèmi',
    'Houéfa', 'Ablavi', 'Adovi', 'Folashade', 'Fifamè', 'Noudéfia',
    'Pélagie', 'Brigitte', 'Solange', 'Chanceline', 'Géraldine',
    'Francine', 'Rosine', 'Pascaline', 'Carmelle', 'Estelle',
    'Grâce', 'Prudentienne', 'Félicienne', 'Bénédicta', 'Hortensia',
    'Flore', 'Rachelle', 'Mariette', 'Thérèse', 'Cécile', 'Odette',
    'Victorine', 'Léontine', 'Kabiratou', 'Nafissatou', 'Latifatou',
  ],
  lastNames: [
    'Ahouandjinou', 'Hounkonnou', 'Agbossou', 'Kpossou', 'Adjadi',
    'Dossou', 'Houngbédji', 'Gnansounou', 'Togbé', 'Azanhoué',
    'Hounsou', 'Gandonou', 'Akplogan', 'Soglo', 'Béhanzin',
    'Quénum', 'Aguessy', 'Ahomadégbé', 'Kakpo', 'Vodounou',
    'Agbangla', 'Loko', 'Zannou', 'Amoussou', 'Adankon',
    'Gbaguidi', 'Dégbénon', 'Avocè', 'Hounsa', 'Djimon',
    'Ahanhanzo', 'Houéto', 'Kpoviessi', 'Assogba', 'Topanou',
    'Dansi', 'Zomahoun', 'Gnonlonfoun', 'Koudjo', 'Adjakpa',
    'Midahuen', 'Houessou', 'Vissoh', 'Sèdégbo', 'Ainadou',
    'Biaou', 'Tchégnonsi', 'Dohou', 'Agbodjogbé', 'Fagninou',
  ],
};

const uid = () => Math.random().toString(36).substring(2, 11);

export const useStore = create<AppState>((set, get) => ({
  currentPage: 'dashboard',
  darkMode: false,
  showSplash: true,
  toasts: [],
  students: [],
  subjects: defaultSubjects,
  grades: [],
  periods: defaultPeriods,
  settings: defaultSettings,
  activePeriodId: 'p1',
  appreciationRules: defaultAppreciationRules,
  mentionRules: defaultMentionRules,
  categories: defaultCategories,
  demoNames: defaultDemoNames,

  setPage: (page) => set({ currentPage: page }),
  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    set({ darkMode: newMode });
    document.documentElement.classList.toggle('dark', newMode);
    setTimeout(() => get().saveToStorage(), 100);
  },
  setShowSplash: (show) => set({ showSplash: show }),

  addToast: (message, type, title?) => {
    const id = uid();
    const duration = type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000;
    const toast: Toast = { id, title, message, type, timestamp: Date.now(), duration };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => get().removeToast(id), duration);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Students
  addStudent: (student) => {
    set((s) => ({ students: [...s.students, student] }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  updateStudent: (id, data) => {
    set((s) => ({ students: s.students.map((st) => (st.id === id ? { ...st, ...data } : st)) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deleteStudent: (id) => {
    set((s) => ({
      students: s.students.filter((st) => st.id !== id),
      grades: s.grades.filter((g) => g.studentId !== id),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setStudents: (students) => {
    set({ students });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Subjects
  addSubject: (subject) => {
    set((s) => ({ subjects: [...s.subjects, subject] }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  updateSubject: (id, data) => {
    set((s) => ({ subjects: s.subjects.map((su) => (su.id === id ? { ...su, ...data } : su)) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deleteSubject: (id) => {
    set((s) => ({
      subjects: s.subjects.filter((su) => su.id !== id),
      grades: s.grades.filter((g) => g.subjectId !== id),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setSubjects: (subjects) => {
    set({ subjects });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Grades
  setGrade: (grade) => {
    set((s) => {
      const idx = s.grades.findIndex(
        (g) => g.studentId === grade.studentId && g.subjectId === grade.subjectId && g.periodId === grade.periodId
      );
      if (idx >= 0) {
        const newGrades = [...s.grades];
        newGrades[idx] = grade;
        return { grades: newGrades };
      }
      return { grades: [...s.grades, grade] };
    });
    setTimeout(() => get().saveToStorage(), 100);
  },
  setGrades: (grades) => {
    set({ grades });
    setTimeout(() => get().saveToStorage(), 100);
  },
  bulkSetGrades: (newGrades) => {
    set((s) => {
      const gradeMap = new Map(
        s.grades.map((g) => [`${g.studentId}-${g.subjectId}-${g.periodId}`, g])
      );
      newGrades.forEach((g) => gradeMap.set(`${g.studentId}-${g.subjectId}-${g.periodId}`, g));
      return { grades: Array.from(gradeMap.values()) };
    });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Periods
  addPeriod: (period) => {
    set((s) => ({ periods: [...s.periods, period] }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  updatePeriod: (id, data) => {
    set((s) => ({ periods: s.periods.map((p) => (p.id === id ? { ...p, ...data } : p)) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deletePeriod: (id) => {
    set((s) => ({
      periods: s.periods.filter((p) => p.id !== id),
      grades: s.grades.filter((g) => g.periodId !== id),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setActivePeriod: (id) => {
    set({ activePeriodId: id });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Appreciation Rules
  addAppreciationRule: (rule) => {
    set((s) => ({ appreciationRules: [...s.appreciationRules, rule].sort((a, b) => a.min - b.min) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  updateAppreciationRule: (id, data) => {
    set((s) => ({
      appreciationRules: s.appreciationRules
        .map((r) => (r.id === id ? { ...r, ...data } : r))
        .sort((a, b) => a.min - b.min),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deleteAppreciationRule: (id) => {
    set((s) => ({ appreciationRules: s.appreciationRules.filter((r) => r.id !== id) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setAppreciationRules: (rules) => {
    set({ appreciationRules: rules.sort((a, b) => a.min - b.min) });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Mention Rules
  addMentionRule: (rule) => {
    set((s) => ({ mentionRules: [...s.mentionRules, rule].sort((a, b) => b.minAverage - a.minAverage) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  updateMentionRule: (id, data) => {
    set((s) => ({
      mentionRules: s.mentionRules
        .map((r) => (r.id === id ? { ...r, ...data } : r))
        .sort((a, b) => b.minAverage - a.minAverage),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deleteMentionRule: (id) => {
    set((s) => ({ mentionRules: s.mentionRules.filter((r) => r.id !== id) }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setMentionRules: (rules) => {
    set({ mentionRules: rules.sort((a, b) => b.minAverage - a.minAverage) });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Categories
  addCategory: (name) => {
    set((s) => {
      if (s.categories.includes(name)) return s;
      return { categories: [...s.categories, name] };
    });
    setTimeout(() => get().saveToStorage(), 100);
  },
  renameCategory: (oldName, newName) => {
    set((s) => ({
      categories: s.categories.map((c) => (c === oldName ? newName : c)),
      subjects: s.subjects.map((sub) => (sub.category === oldName ? { ...sub, category: newName } : sub)),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  deleteCategory: (name) => {
    set((s) => ({
      categories: s.categories.filter((c) => c !== name),
      subjects: s.subjects.map((sub) => (sub.category === name ? { ...sub, category: 'Autre' } : sub)),
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  setCategories: (cats) => {
    set({ categories: cats });
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Demo Names
  setDemoNames: (pool) => {
    set({ demoNames: pool });
    setTimeout(() => get().saveToStorage(), 100);
  },
  addDemoFirstNameMale: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesMale: [...s.demoNames.firstNamesMale, name] },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  removeDemoFirstNameMale: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesMale: s.demoNames.firstNamesMale.filter((n) => n !== name) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  addDemoFirstNameFemale: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesFemale: [...s.demoNames.firstNamesFemale, name] },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  removeDemoFirstNameFemale: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesFemale: s.demoNames.firstNamesFemale.filter((n) => n !== name) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  addDemoLastName: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, lastNames: [...s.demoNames.lastNames, name] },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  removeDemoLastName: (name) => {
    set((s) => ({
      demoNames: { ...s.demoNames, lastNames: s.demoNames.lastNames.filter((n) => n !== name) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  renameDemoFirstNameMale: (oldName, newName) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesMale: s.demoNames.firstNamesMale.map((n) => n === oldName ? newName : n) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  renameDemoFirstNameFemale: (oldName, newName) => {
    set((s) => ({
      demoNames: { ...s.demoNames, firstNamesFemale: s.demoNames.firstNamesFemale.map((n) => n === oldName ? newName : n) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },
  renameDemoLastName: (oldName, newName) => {
    set((s) => ({
      demoNames: { ...s.demoNames, lastNames: s.demoNames.lastNames.map((n) => n === oldName ? newName : n) },
    }));
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Settings
  updateSettings: (data) => {
    set((s) => ({ settings: { ...s.settings, ...data } }));
    setTimeout(() => get().saveToStorage(), 100);
  },

  // Persistence
  loadFromStorage: async () => {
    try {
      const data = await localforage.getItem<string>('app_state');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          students: parsed.students || [],
          subjects: parsed.subjects || defaultSubjects,
          grades: parsed.grades || [],
          periods: parsed.periods || defaultPeriods,
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          activePeriodId: parsed.activePeriodId || 'p1',
          darkMode: parsed.darkMode || false,
          appreciationRules: parsed.appreciationRules || defaultAppreciationRules,
          mentionRules: parsed.mentionRules || defaultMentionRules,
          categories: parsed.categories || defaultCategories,
          demoNames: parsed.demoNames || defaultDemoNames,
        });
        if (parsed.darkMode) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  },

  saveToStorage: async () => {
    try {
      const {
        students, subjects, grades, periods, settings, activePeriodId,
        darkMode, appreciationRules, mentionRules, categories, demoNames,
      } = get();
      await localforage.setItem(
        'app_state',
        JSON.stringify({
          students, subjects, grades, periods, settings, activePeriodId,
          darkMode, appreciationRules, mentionRules, categories, demoNames,
        })
      );
    } catch (e) {
      console.error('Error saving data:', e);
    }
  },

  exportAllData: () => {
    const {
      students, subjects, grades, periods, settings,
      appreciationRules, mentionRules, categories, demoNames,
    } = get();
    return JSON.stringify({
      students, subjects, grades, periods, settings,
      appreciationRules, mentionRules, categories, demoNames,
      exportDate: new Date().toISOString(),
    }, null, 2);
  },

  importAllData: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.students) set({ students: data.students });
      if (data.subjects) set({ subjects: data.subjects });
      if (data.grades) set({ grades: data.grades });
      if (data.periods) set({ periods: data.periods });
      if (data.settings) set({ settings: { ...defaultSettings, ...data.settings } });
      if (data.appreciationRules) set({ appreciationRules: data.appreciationRules });
      if (data.mentionRules) set({ mentionRules: data.mentionRules });
      if (data.categories) set({ categories: data.categories });
      if (data.demoNames) set({ demoNames: data.demoNames });
      get().saveToStorage();
      get().addToast('Données importées avec succès !', 'success');
    } catch {
      get().addToast("Erreur lors de l'import des données", 'error');
    }
  },
}));
