import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BookOpen, FileText, Settings, Plus, Search, Edit2, Trash2,
  Save, X, Upload, Download, Printer, BarChart3, GraduationCap,
  Phone, Mail, Calendar, Award, TrendingUp, ChevronRight, Zap,
  CheckCircle, AlertCircle, Info, AlertTriangle, MessageCircle,
  Camera, Palette, Hash, User, Home, ClipboardList, FileSpreadsheet
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
  BarElement
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { db, Student, Subject, Grade, SchoolSettings } from './db';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Types
type Page = 'dashboard' | 'students' | 'subjects' | 'grades' | 'bulletin' | 'settings';
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type Trimester = 'T1' | 'T2' | 'T3';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Notification Component
const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <AlertCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };
  
  const colors = {
    success: 'from-green-500 to-emerald-600 border-green-400',
    error: 'from-red-500 to-rose-600 border-red-400',
    warning: 'from-yellow-500 to-orange-500 border-yellow-400',
    info: 'from-blue-500 to-cyan-600 border-blue-400'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 400);
    }, notification.duration || 4000);
    return () => clearTimeout(timer);
  }, [notification.duration, onClose]);

  return (
    <div className={`${isExiting ? 'animate-slide-out' : 'animate-slide-in'} 
      bg-gradient-to-r ${colors[notification.type]} 
      border-l-4 rounded-lg shadow-2xl p-4 mb-3 flex items-center gap-3
      backdrop-blur-sm bg-opacity-95`}
    >
      <div className="text-white">{icons[notification.type]}</div>
      <p className="text-white font-medium flex-1">{notification.message}</p>
      <button onClick={() => { setIsExiting(true); setTimeout(onClose, 400); }} 
        className="text-white/80 hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg animate-[shrink_4s_linear]" 
        style={{ width: '100%', animation: `shrink ${notification.duration || 4000}ms linear` }} />
    </div>
  );
};

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester>('T1');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Notification helper
  const notify = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, duration: type === 'error' ? 6000 : 4000 }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedStudents, loadedSubjects, loadedGrades, loadedSettings] = await Promise.all([
          db.students.toArray(),
          db.subjects.toArray(),
          db.grades.toArray(),
          db.settings.get(1)
        ]);
        setStudents(loadedStudents);
        setSubjects(loadedSubjects);
        setGrades(loadedGrades);
        setSettings(loadedSettings || {
          id: 1,
          schoolName: 'Stein Technology STTN',
          schoolYear: '2024-2025',
          logo: '',
          stamp: '',
          directorSignature: '',
          teacherSignature: ''
        });
        setIsLoading(false);
      } catch (error) {
        notify('error', 'Erreur de chargement des données');
        setIsLoading(false);
      }
    };
    loadData();
  }, [notify]);

  // Save settings
  const saveSettings = async (newSettings: SchoolSettings) => {
    try {
      await db.settings.put(newSettings);
      setSettings(newSettings);
      notify('success', 'Paramètres sauvegardés !');
    } catch (error) {
      notify('error', 'Erreur de sauvegarde');
    }
  };

  // Student CRUD
  const saveStudent = async (student: Omit<Student, 'id'> & { id?: number }) => {
    try {
      if (student.id) {
        await db.students.put(student as Student);
        setStudents(prev => prev.map(s => s.id === student.id ? student as Student : s));
        notify('success', 'Élève modifié !');
      } else {
        const id = await db.students.add(student as Omit<Student, 'id'>);
        setStudents(prev => [...prev, { ...student, id } as Student]);
        notify('success', 'Élève ajouté !');
      }
      setShowStudentModal(false);
      setEditingStudent(null);
    } catch (error) {
      notify('error', 'Erreur de sauvegarde');
    }
  };

  const deleteStudent = async (id: number) => {
    if (confirm('Supprimer cet élève ?')) {
      try {
        await db.students.delete(id);
        await db.grades.where('studentId').equals(id).delete();
        setStudents(prev => prev.filter(s => s.id !== id));
        setGrades(prev => prev.filter(g => g.studentId !== id));
        notify('success', 'Élève supprimé !');
      } catch (error) {
        notify('error', 'Erreur de suppression');
      }
    }
  };

  // Subject CRUD
  const saveSubject = async (subject: Omit<Subject, 'id'> & { id?: number }) => {
    try {
      if (subject.id) {
        await db.subjects.put(subject as Subject);
        setSubjects(prev => prev.map(s => s.id === subject.id ? subject as Subject : s));
        notify('success', 'Matière modifiée !');
      } else {
        const id = await db.subjects.add(subject as Omit<Subject, 'id'>);
        setSubjects(prev => [...prev, { ...subject, id } as Subject]);
        notify('success', 'Matière ajoutée !');
      }
      setShowSubjectModal(false);
      setEditingSubject(null);
    } catch (error) {
      notify('error', 'Erreur de sauvegarde');
    }
  };

  const deleteSubject = async (id: number) => {
    if (confirm('Supprimer cette matière ?')) {
      try {
        await db.subjects.delete(id);
        await db.grades.where('subjectId').equals(id).delete();
        setSubjects(prev => prev.filter(s => s.id !== id));
        setGrades(prev => prev.filter(g => g.subjectId !== id));
        notify('success', 'Matière supprimée !');
      } catch (error) {
        notify('error', 'Erreur de suppression');
      }
    }
  };

  // Grade CRUD
  const saveGrade = async (grade: Omit<Grade, 'id'>) => {
    try {
      const id = await db.grades.add(grade);
      setGrades(prev => [...prev, { ...grade, id } as Grade]);
      notify('success', 'Note enregistrée !');
      setShowGradeModal(false);
    } catch (error) {
      notify('error', 'Erreur de sauvegarde');
    }
  };

  // Calculate averages
  const calculateStudentAverage = (studentId: number, trimester: Trimester): number => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.trimester === trimester);
    if (studentGrades.length === 0) return 0;

    let totalWeighted = 0;
    let totalCoef = 0;

    subjects.forEach(subject => {
      const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
      if (subjectGrades.length > 0) {
        const avg = subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length;
        totalWeighted += avg * subject.coefficient;
        totalCoef += subject.coefficient;
      }
    });

    return totalCoef > 0 ? Math.round((totalWeighted / totalCoef) * 100) / 100 : 0;
  };

  const calculateSubjectAverage = (studentId: number, subjectId: number, trimester: Trimester): number => {
    const subjectGrades = grades.filter(
      g => g.studentId === studentId && g.subjectId === subjectId && g.trimester === trimester
    );
    if (subjectGrades.length === 0) return 0;
    return Math.round((subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length) * 100) / 100;
  };

  const calculateClassAverageForSubject = (subjectId: number, trimester: Trimester): number => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId && g.trimester === trimester);
    if (subjectGrades.length === 0) return 0;
    return Math.round((subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length) * 100) / 100;
  };

  const calculateRank = (studentId: number, trimester: Trimester): number => {
    const averages = students.map(s => ({
      id: s.id,
      avg: calculateStudentAverage(s.id!, trimester)
    })).sort((a, b) => b.avg - a.avg);
    
    const rank = averages.findIndex(a => a.id === studentId) + 1;
    return rank;
  };

  // Export functions
  const exportJSON = () => {
    const data = { students, subjects, grades, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sttn-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('success', 'Sauvegarde JSON exportée !');
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.students) {
          await db.students.clear();
          await db.students.bulkAdd(data.students);
          setStudents(data.students);
        }
        if (data.subjects) {
          await db.subjects.clear();
          await db.subjects.bulkAdd(data.subjects);
          setSubjects(data.subjects);
        }
        if (data.grades) {
          await db.grades.clear();
          await db.grades.bulkAdd(data.grades);
          setGrades(data.grades);
        }
        if (data.settings) {
          await db.settings.put(data.settings);
          setSettings(data.settings);
        }
        notify('success', 'Données importées avec succès !');
      } catch (error) {
        notify('error', 'Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Students sheet
    const studentsData = students.map(s => ({
      Nom: s.lastName,
      Prénom: s.firstName,
      'Date de naissance': s.birthDate,
      Classe: s.class,
      'Parent': s.parentName,
      'Téléphone': s.parentPhone
    }));
    const wsStudents = XLSX.utils.json_to_sheet(studentsData);
    XLSX.utils.book_append_sheet(wb, wsStudents, 'Élèves');

    // Grades sheet
    const gradesData = grades.map(g => {
      const student = students.find(s => s.id === g.studentId);
      const subject = subjects.find(s => s.id === g.subjectId);
      return {
        Élève: student ? `${student.lastName} ${student.firstName}` : '',
        Matière: subject?.name || '',
        Note: g.value,
        Type: g.type,
        Trimestre: g.trimester,
        Date: g.date
      };
    });
    const wsGrades = XLSX.utils.json_to_sheet(gradesData);
    XLSX.utils.book_append_sheet(wb, wsGrades, 'Notes');

    XLSX.writeFile(wb, `sttn-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    notify('success', 'Export Excel réussi !');
  };

  const exportPDF = () => {
    if (!selectedStudent) {
      notify('warning', 'Sélectionnez un élève');
      return;
    }

    const doc = new jsPDF();
    const avg = calculateStudentAverage(selectedStudent.id!, selectedTrimester);
    const rank = calculateRank(selectedStudent.id!, selectedTrimester);

    doc.setFontSize(18);
    doc.setTextColor(255, 0, 255);
    doc.text(settings?.schoolName || 'STTN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Bulletin - ${selectedTrimester} - ${settings?.schoolYear}`, 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Élève: ${selectedStudent.lastName} ${selectedStudent.firstName}`, 20, 45);
    doc.text(`Classe: ${selectedStudent.class}`, 20, 52);
    doc.text(`Moyenne: ${avg}/20`, 140, 45);
    doc.text(`Rang: ${rank}/${students.length}`, 140, 52);

    let y = 65;
    doc.setFillColor(255, 0, 255);
    doc.rect(20, y, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Matière', 25, y + 6);
    doc.text('Moy. Élève', 100, y + 6);
    doc.text('Moy. Classe', 140, y + 6);

    y += 10;
    doc.setTextColor(0, 0, 0);
    subjects.forEach(subject => {
      const subjectAvg = calculateSubjectAverage(selectedStudent.id!, subject.id!, selectedTrimester);
      const classAvg = calculateClassAverageForSubject(subject.id!, selectedTrimester);
      doc.text(subject.name, 25, y + 5);
      doc.text(subjectAvg.toString(), 108, y + 5);
      doc.text(classAvg.toString(), 148, y + 5);
      doc.rect(20, y, 170, 8);
      y += 8;
    });

    doc.save(`bulletin-${selectedStudent.lastName}-${selectedTrimester}.pdf`);
    notify('success', 'PDF généré !');
  };

  const printBulletin = () => {
    if (!selectedStudent) {
      notify('warning', 'Sélectionnez un élève');
      return;
    }
    window.print();
  };

  // Filtered students
  const filteredStudents = students.filter(s =>
    `${s.lastName} ${s.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-900 via-black to-lime-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-lime-400 animate-pulse flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Chargement...</h1>
        </div>
      </div>
    );
  }

  // Render pages
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-lime-500 shadow-lg shadow-fuchsia-500/30">
          <Zap className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">{settings?.schoolName}</h1>
        </div>
        <p className="text-lime-400 mt-2 font-medium">Année scolaire {settings?.schoolYear}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-fuchsia rounded-2xl p-5 text-center">
          <Users className="w-10 h-10 mx-auto mb-2 text-fuchsia-400" />
          <div className="text-3xl font-bold text-white">{students.length}</div>
          <div className="text-fuchsia-300 text-sm">Élèves</div>
        </div>
        <div className="card-citron rounded-2xl p-5 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-2 text-lime-400" />
          <div className="text-3xl font-bold text-white">{subjects.length}</div>
          <div className="text-lime-300 text-sm">Matières</div>
        </div>
        <div className="card-citron rounded-2xl p-5 text-center">
          <ClipboardList className="w-10 h-10 mx-auto mb-2 text-lime-400" />
          <div className="text-3xl font-bold text-white">{grades.length}</div>
          <div className="text-lime-300 text-sm">Notes</div>
        </div>
        <div className="card-fuchsia rounded-2xl p-5 text-center">
          <Award className="w-10 h-10 mx-auto mb-2 text-fuchsia-400" />
          <div className="text-3xl font-bold text-white">
            {students.length > 0 ? (students.reduce((sum, s) => sum + calculateStudentAverage(s.id!, selectedTrimester), 0) / students.length).toFixed(1) : '0'}
          </div>
          <div className="text-fuchsia-300 text-sm">Moy. Classe</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-bold text-fuchsia-400 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" /> Actions Rapides
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { setCurrentPage('students'); setShowStudentModal(true); }}
            className="btn-fuchsia p-4 rounded-xl flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Élève
          </button>
          <button onClick={() => { setCurrentPage('grades'); setShowGradeModal(true); }}
            className="btn-citron p-4 rounded-xl flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Note
          </button>
          <button onClick={exportJSON}
            className="glass p-4 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-fuchsia-500/20 transition-colors">
            <Download className="w-5 h-5 text-fuchsia-400" /> Sauvegarder
          </button>
          <label className="glass p-4 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-lime-500/20 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 text-lime-400" /> Importer
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Top Students */}
      {students.length > 0 && (
        <div className="card-citron rounded-2xl p-5">
          <h2 className="text-lg font-bold text-lime-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Top 5 - {selectedTrimester}
          </h2>
          <div className="space-y-2">
            {students
              .map(s => ({ ...s, avg: calculateStudentAverage(s.id!, selectedTrimester) }))
              .sort((a, b) => b.avg - a.avg)
              .slice(0, 5)
              .map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-300 text-black' : i === 2 ? 'bg-orange-400 text-black' : 'bg-gray-600 text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{s.lastName} {s.firstName}</div>
                    <div className="text-lime-400 text-sm">{s.class}</div>
                  </div>
                  <div className="text-xl font-bold text-lime-400">{s.avg}/20</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="glass rounded-2xl p-5 text-center">
        <h3 className="text-fuchsia-400 font-bold mb-3">Besoin d'aide ?</h3>
        <div className="flex justify-center gap-4">
          <a href="https://wa.me/22949114951" target="_blank" rel="noopener noreferrer"
            className="btn-fuchsia px-6 py-3 rounded-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
          <a href="mailto:codjosamuelstein@gmail.com"
            className="btn-citron px-6 py-3 rounded-xl flex items-center gap-2">
            <Mail className="w-5 h-5" /> Email
          </a>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
          Élèves
        </h1>
        <button onClick={() => { setEditingStudent(null); setShowStudentModal(true); }}
          className="btn-fuchsia p-3 rounded-xl">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fuchsia-400" />
        <input type="text" placeholder="Rechercher..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="input-styled w-full pl-12 pr-4 py-3 rounded-xl" />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredStudents.map(student => (
          <div key={student.id} className="card-fuchsia rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-lime-400 flex items-center justify-center overflow-hidden">
              {student.photo ? (
                <img src={student.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-white font-bold">{student.lastName} {student.firstName}</div>
              <div className="text-fuchsia-300 text-sm">{student.class}</div>
              <div className="text-lime-400 text-xs">Moy: {calculateStudentAverage(student.id!, selectedTrimester)}/20</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingStudent(student); setShowStudentModal(true); }}
                className="p-2 rounded-lg bg-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/50">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => deleteStudent(student.id!)}
                className="p-2 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Aucun élève trouvé</p>
          </div>
        )}
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <StudentModal
          student={editingStudent}
          onSave={saveStudent}
          onClose={() => { setShowStudentModal(false); setEditingStudent(null); }}
        />
      )}
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
          Matières
        </h1>
        <button onClick={() => { setEditingSubject(null); setShowSubjectModal(true); }}
          className="btn-citron p-3 rounded-xl">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        {subjects.map(subject => (
          <div key={subject.id} className="card-citron rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" 
              style={{ backgroundColor: subject.color + '40' }}>
              <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold">{subject.name}</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lime-400">Coef: {subject.coefficient}</span>
                <span className="text-gray-400">•</span>
                <span className="text-fuchsia-300">{subject.category}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingSubject(subject); setShowSubjectModal(true); }}
                className="p-2 rounded-lg bg-lime-500/30 text-lime-300 hover:bg-lime-500/50">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => deleteSubject(subject.id!)}
                className="p-2 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Aucune matière</p>
            <button onClick={() => setShowSubjectModal(true)}
              className="btn-citron mt-4 px-6 py-2 rounded-xl">
              Ajouter une matière
            </button>
          </div>
        )}
      </div>

      {showSubjectModal && (
        <SubjectModal
          subject={editingSubject}
          onSave={saveSubject}
          onClose={() => { setShowSubjectModal(false); setEditingSubject(null); }}
        />
      )}
    </div>
  );

  const renderGrades = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
          Saisie Notes
        </h1>
        <button onClick={() => setShowGradeModal(true)}
          className="btn-fuchsia p-3 rounded-xl">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Trimester Selector */}
      <div className="flex gap-2">
        {(['T1', 'T2', 'T3'] as Trimester[]).map(t => (
          <button key={t}
            onClick={() => setSelectedTrimester(t)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all
              ${selectedTrimester === t 
                ? 'bg-gradient-to-r from-fuchsia-500 to-lime-500 text-white shadow-lg' 
                : 'glass text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Recent Grades */}
      <div className="space-y-3">
        <h3 className="text-fuchsia-400 font-bold">Notes récentes - {selectedTrimester}</h3>
        {grades
          .filter(g => g.trimester === selectedTrimester)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 20)
          .map(grade => {
            const student = students.find(s => s.id === grade.studentId);
            const subject = subjects.find(s => s.id === grade.subjectId);
            return (
              <div key={grade.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-lime-400 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{grade.value}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{student?.lastName} {student?.firstName}</div>
                  <div className="text-fuchsia-300 text-sm">{subject?.name}</div>
                  <div className="text-gray-400 text-xs">{grade.type} • {grade.date}</div>
                </div>
              </div>
            );
          })}
        {grades.filter(g => g.trimester === selectedTrimester).length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Aucune note pour {selectedTrimester}</p>
          </div>
        )}
      </div>

      {showGradeModal && (
        <GradeModal
          students={students}
          subjects={subjects}
          trimester={selectedTrimester}
          onSave={saveGrade}
          onClose={() => setShowGradeModal(false)}
        />
      )}
    </div>
  );

  const renderBulletin = () => {
    const studentAvg = selectedStudent ? calculateStudentAverage(selectedStudent.id!, selectedTrimester) : 0;
    const studentRank = selectedStudent ? calculateRank(selectedStudent.id!, selectedTrimester) : 0;

    const radarData = {
      labels: subjects.map(s => s.name.substring(0, 10)),
      datasets: [{
        label: 'Notes',
        data: subjects.map(s => selectedStudent ? calculateSubjectAverage(selectedStudent.id!, s.id!, selectedTrimester) : 0),
        backgroundColor: 'rgba(255, 0, 255, 0.3)',
        borderColor: '#FF00FF',
        borderWidth: 2,
        pointBackgroundColor: '#CCFF00',
        pointBorderColor: '#CCFF00',
        pointRadius: 4
      }]
    };

    const radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 20,
          ticks: { stepSize: 4, color: '#999', backdropColor: 'transparent' },
          grid: { color: 'rgba(255, 0, 255, 0.2)' },
          angleLines: { color: 'rgba(204, 255, 0, 0.2)' },
          pointLabels: { color: '#fff', font: { size: 10 } }
        }
      },
      plugins: { legend: { display: false } }
    };

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
          Bulletin Scolaire
        </h1>

        {/* Trimester & Student Selection */}
        <div className="flex gap-2 mb-4">
          {(['T1', 'T2', 'T3'] as Trimester[]).map(t => (
            <button key={t}
              onClick={() => setSelectedTrimester(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm
                ${selectedTrimester === t 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-lime-500 text-white' 
                  : 'glass text-gray-400'}`}>
              {t}
            </button>
          ))}
        </div>

        <select value={selectedStudent?.id || ''}
          onChange={(e) => setSelectedStudent(students.find(s => s.id === Number(e.target.value)) || null)}
          className="input-styled w-full p-4 rounded-xl">
          <option value="">-- Sélectionner un élève --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.lastName} {s.firstName} - {s.class}</option>
          ))}
        </select>

        {selectedStudent && (
          <>
            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={printBulletin} className="btn-fuchsia flex-1 py-3 rounded-xl flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> Imprimer
              </button>
              <button onClick={exportPDF} className="btn-citron flex-1 py-3 rounded-xl flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> PDF
              </button>
              <button onClick={exportExcel} className="glass flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-white">
                <FileSpreadsheet className="w-5 h-5 text-lime-400" /> Excel
              </button>
            </div>

            {/* Preview - Also used for printing */}
            <div className="print-bulletin bulletin-preview bg-white rounded-2xl overflow-hidden" id="bulletin-print">
              {/* Print Header */}
              <div className="print-header flex justify-between items-center p-4 border-b-4 border-fuchsia-500">
                <div>
                  <h1 className="text-xl font-bold text-fuchsia-600">{settings?.schoolName}</h1>
                  <p className="text-sm text-gray-600">Année scolaire {settings?.schoolYear}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-gray-800">BULLETIN DE NOTES</h2>
                  <p className="text-lime-600 font-bold">{selectedTrimester === 'T1' ? '1er Trimestre' : selectedTrimester === 'T2' ? '2ème Trimestre' : '3ème Trimestre'}</p>
                </div>
              </div>

              {/* Student Info */}
              <div className="print-student-info grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-50 text-sm">
                <div><strong className="text-fuchsia-600">Nom:</strong> {selectedStudent.lastName}</div>
                <div><strong className="text-fuchsia-600">Prénom:</strong> {selectedStudent.firstName}</div>
                <div><strong className="text-fuchsia-600">Classe:</strong> {selectedStudent.class}</div>
                <div><strong className="text-fuchsia-600">Né(e) le:</strong> {selectedStudent.birthDate}</div>
              </div>

              {/* Grades Table */}
              <div className="p-3">
                <table className="print-table w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left bg-fuchsia-500 text-white p-2">Matière</th>
                      <th className="bg-fuchsia-500 text-white p-2">Coef</th>
                      <th className="bg-fuchsia-500 text-white p-2">Moy. Élève</th>
                      <th className="bg-fuchsia-500 text-white p-2">Moy. Classe</th>
                      <th className="bg-fuchsia-500 text-white p-2">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map(subject => {
                      const subjectAvg = calculateSubjectAverage(selectedStudent.id!, subject.id!, selectedTrimester);
                      const classAvg = calculateClassAverageForSubject(subject.id!, selectedTrimester);
                      let appreciation = '';
                      if (subjectAvg >= 16) appreciation = 'Excellent';
                      else if (subjectAvg >= 14) appreciation = 'Très Bien';
                      else if (subjectAvg >= 12) appreciation = 'Bien';
                      else if (subjectAvg >= 10) appreciation = 'Assez Bien';
                      else if (subjectAvg >= 8) appreciation = 'Passable';
                      else appreciation = 'Insuffisant';
                      
                      return (
                        <tr key={subject.id}>
                          <td className="text-left p-2 font-medium subject-name">{subject.name}</td>
                          <td className="p-2 text-center">{subject.coefficient}</td>
                          <td className="p-2 text-center font-bold" style={{ color: subjectAvg >= 10 ? '#16a34a' : '#dc2626' }}>
                            {subjectAvg || '-'}
                          </td>
                          <td className="p-2 text-center text-gray-600">{classAvg || '-'}</td>
                          <td className="p-2 text-center text-xs">{appreciation}</td>
                        </tr>
                      );
                    })}
                    <tr className="moyenne-row bg-lime-400">
                      <td colSpan={2} className="p-2 text-left font-bold">MOYENNE GÉNÉRALE</td>
                      <td className="p-2 text-center font-bold text-lg">{studentAvg}/20</td>
                      <td className="p-2 text-center font-bold">Rang: {studentRank}/{students.length}</td>
                      <td className="p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Chart & Stats */}
              <div className="print-summary grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                <div className="print-chart h-48 md:h-40">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="print-stats grid grid-cols-3 gap-2">
                  <div className="print-stat-box border-2 border-fuchsia-400 rounded-lg p-2 text-center">
                    <div className="value text-2xl font-bold text-fuchsia-600">{studentAvg}</div>
                    <div className="label text-xs text-gray-500">Moyenne</div>
                  </div>
                  <div className="print-stat-box border-2 border-lime-400 rounded-lg p-2 text-center">
                    <div className="value text-2xl font-bold text-lime-600">{studentRank}</div>
                    <div className="label text-xs text-gray-500">Rang</div>
                  </div>
                  <div className="print-stat-box border-2 border-fuchsia-400 rounded-lg p-2 text-center">
                    <div className="value text-2xl font-bold text-fuchsia-600">{students.length}</div>
                    <div className="label text-xs text-gray-500">Effectif</div>
                  </div>
                </div>
              </div>

              {/* Appreciation */}
              <div className="print-appreciation mx-3 p-3 border-2 border-lime-400 rounded-lg bg-lime-50">
                <h4 className="font-bold text-lime-700 mb-1">Appréciation du Conseil de Classe</h4>
                <p className="text-gray-700 text-sm">
                  {studentAvg >= 16 ? 'Excellent travail ! Félicitations du conseil de classe. Continuez ainsi.' :
                   studentAvg >= 14 ? 'Très bon travail. Encouragements du conseil de classe.' :
                   studentAvg >= 12 ? 'Bon travail. Continuez vos efforts.' :
                   studentAvg >= 10 ? 'Travail satisfaisant. Des efforts supplémentaires sont attendus.' :
                   'Travail insuffisant. Des efforts importants sont nécessaires.'}
                </p>
              </div>

              {/* Signatures */}
              <div className="print-signatures grid grid-cols-3 gap-3 p-3 mt-2">
                <div className="print-signature-box text-center">
                  <p className="text-xs text-gray-500 mb-6">Le Directeur</p>
                  {settings?.directorSignature && (
                    <img src={settings.directorSignature} alt="Signature" className="h-10 mx-auto" />
                  )}
                  <div className="border-t border-gray-300 pt-1 text-xs text-gray-400">Signature</div>
                </div>
                <div className="print-signature-box text-center">
                  <p className="text-xs text-gray-500 mb-6">Le Parent</p>
                  <div className="border-t border-gray-300 pt-1 text-xs text-gray-400">Signature</div>
                </div>
                <div className="print-signature-box text-center">
                  <p className="text-xs text-gray-500 mb-6">Cachet de l'école</p>
                  {settings?.stamp && (
                    <img src={settings.stamp} alt="Cachet" className="h-10 mx-auto" />
                  )}
                  <div className="border-t border-gray-300 pt-1 text-xs text-gray-400">Cachet</div>
                </div>
              </div>

              {/* Footer */}
              <div className="print-footer text-center py-2 border-t text-xs text-gray-400">
                {settings?.schoolName} • Bulletin généré le {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
        Paramètres
      </h1>

      <div className="space-y-4">
        {/* School Info */}
        <div className="card-fuchsia rounded-2xl p-5">
          <h3 className="text-fuchsia-400 font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" /> École
          </h3>
          <div className="space-y-3">
            <input type="text" placeholder="Nom de l'école"
              value={settings?.schoolName || ''} 
              onChange={(e) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, schoolName: e.target.value} : prev)}
              className="input-styled w-full p-3 rounded-xl" />
            <input type="text" placeholder="Année scolaire (ex: 2024-2025)"
              value={settings?.schoolYear || ''} 
              onChange={(e) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, schoolYear: e.target.value} : prev)}
              className="input-styled w-full p-3 rounded-xl" />
          </div>
        </div>

        {/* Images */}
        <div className="card-citron rounded-2xl p-5">
          <h3 className="text-lime-400 font-bold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" /> Images
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload label="Logo École" value={settings?.logo} 
              onChange={(v) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, logo: v} : prev)} />
            <ImageUpload label="Cachet/Tampon" value={settings?.stamp} 
              onChange={(v) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, stamp: v} : prev)} />
            <ImageUpload label="Signature Directeur" value={settings?.directorSignature} 
              onChange={(v) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, directorSignature: v} : prev)} />
            <ImageUpload label="Signature Prof" value={settings?.teacherSignature} 
              onChange={(v) => setSettings((prev: SchoolSettings | null) => prev ? {...prev, teacherSignature: v} : prev)} />
          </div>
        </div>

        {/* Save Button */}
        <button onClick={() => settings && saveSettings(settings)}
          className="btn-fuchsia w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg">
          <Save className="w-6 h-6" /> Sauvegarder les paramètres
        </button>

        {/* Export/Import */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-lime-400" /> Sauvegarde & Export
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={exportJSON} className="btn-citron py-3 rounded-xl flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Backup JSON
            </button>
            <label className="btn-fuchsia py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" /> Importer
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
            <button onClick={exportExcel} className="glass py-3 rounded-xl flex items-center justify-center gap-2 text-lime-400 col-span-2">
              <FileSpreadsheet className="w-5 h-5" /> Export Excel
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="glass rounded-2xl p-5 text-center">
          <h3 className="text-fuchsia-400 font-bold mb-3">Support Technique</h3>
          <p className="text-gray-400 text-sm mb-4">Besoin d'aide ? Contactez-nous !</p>
          <div className="flex gap-3 justify-center">
            <a href="https://wa.me/22949114951" target="_blank" rel="noopener noreferrer"
              className="btn-fuchsia px-5 py-3 rounded-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> +229 49 11 49 51
            </a>
            <a href="mailto:codjosamuelstein@gmail.com"
              className="btn-citron px-5 py-3 rounded-xl flex items-center gap-2">
              <Mail className="w-5 h-5" /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Background Bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-fuchsia-500/20 blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-lime-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 rounded-full bg-fuchsia-500/15 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/4 w-28 h-28 rounded-full bg-lime-500/15 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 w-80 max-w-[90vw]">
        {notifications.map(n => (
          <NotificationToast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 p-4 max-w-2xl mx-auto">
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'students' && renderStudents()}
        {currentPage === 'subjects' && renderSubjects()}
        {currentPage === 'grades' && renderGrades()}
        {currentPage === 'bulletin' && renderBulletin()}
        {currentPage === 'settings' && renderSettings()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-fuchsia-500/30 no-print">
        <div className="flex justify-around items-center py-2 max-w-2xl mx-auto">
          {[
            { id: 'dashboard' as Page, icon: Home, label: 'Accueil' },
            { id: 'students' as Page, icon: Users, label: 'Élèves' },
            { id: 'grades' as Page, icon: ClipboardList, label: 'Notes' },
            { id: 'bulletin' as Page, icon: FileText, label: 'Bulletin' },
            { id: 'settings' as Page, icon: Settings, label: 'Config' }
          ].map(item => (
            <button key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`nav-item flex flex-col items-center py-2 px-4 rounded-xl transition-all
                ${currentPage === item.id ? 'active' : 'text-gray-400'}`}>
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Floating Contact Button */}
      <div className="fixed bottom-24 right-4 z-50 no-print">
        <button onClick={() => setShowContactMenu(!showContactMenu)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-500 to-lime-500 
            flex items-center justify-center shadow-lg shadow-fuchsia-500/50 
            transition-transform ${showContactMenu ? 'rotate-45' : ''}`}>
          <Plus className="w-7 h-7 text-white" />
        </button>
        {showContactMenu && (
          <div className="absolute bottom-16 right-0 space-y-2 animate-bounce-in">
            <a href="https://wa.me/22949114951" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <a href="mailto:codjosamuelstein@gmail.com"
              className="flex items-center gap-2 bg-fuchsia-500 text-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
              <Mail className="w-5 h-5" /> Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
const ImageUpload: React.FC<{ label: string; value?: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className="block cursor-pointer">
      <div className="text-white text-sm mb-2">{label}</div>
      <div className="h-20 rounded-xl border-2 border-dashed border-fuchsia-400/50 flex items-center justify-center overflow-hidden hover:border-lime-400 transition-colors">
        {value ? (
          <img src={value} alt="" className="h-full object-contain" />
        ) : (
          <Upload className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </label>
  );
};

const StudentModal: React.FC<{
  student: Student | null;
  onSave: (s: Omit<Student, 'id'> & { id?: number }) => void;
  onClose: () => void;
}> = ({ student, onSave, onClose }) => {
  const [form, setForm] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    birthDate: student?.birthDate || '',
    class: student?.class || '',
    photo: student?.photo || '',
    parentName: student?.parentName || '',
    parentPhone: student?.parentPhone || '',
    address: student?.address || ''
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, photo: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-fuchsia-500/30 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
            {student ? 'Modifier Élève' : 'Nouvel Élève'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Photo */}
          <label className="block">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-fuchsia-500 overflow-hidden cursor-pointer hover:border-lime-400 transition-colors">
              {form.photo ? (
                <img src={form.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <p className="text-center text-gray-400 text-sm mt-2">Cliquez pour ajouter une photo</p>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Nom *" value={form.lastName}
              onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
              className="input-styled p-3 rounded-xl" required />
            <input type="text" placeholder="Prénom *" value={form.firstName}
              onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
              className="input-styled p-3 rounded-xl" required />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input type="date" placeholder="Date naissance" value={form.birthDate}
              onChange={e => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
              className="input-styled p-3 rounded-xl" />
            <input type="text" placeholder="Classe *" value={form.class}
              onChange={e => setForm(prev => ({ ...prev, class: e.target.value }))}
              className="input-styled p-3 rounded-xl" required />
          </div>

          <input type="text" placeholder="Nom du parent" value={form.parentName}
            onChange={e => setForm(prev => ({ ...prev, parentName: e.target.value }))}
            className="input-styled w-full p-3 rounded-xl" />
          
          <input type="tel" placeholder="Téléphone parent" value={form.parentPhone}
            onChange={e => setForm(prev => ({ ...prev, parentPhone: e.target.value }))}
            className="input-styled w-full p-3 rounded-xl" />

          <textarea placeholder="Adresse" value={form.address}
            onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
            className="input-styled w-full p-3 rounded-xl h-20 resize-none" />

          <button onClick={() => form.lastName && form.firstName && form.class && onSave({ ...form, id: student?.id })}
            className="btn-fuchsia w-full py-4 rounded-xl flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> {student ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SubjectModal: React.FC<{
  subject: Subject | null;
  onSave: (s: Omit<Subject, 'id'> & { id?: number }) => void;
  onClose: () => void;
}> = ({ subject, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: subject?.name || '',
    coefficient: subject?.coefficient || 1,
    color: subject?.color || '#FF00FF',
    category: subject?.category || 'Principal'
  });

  const colors = ['#FF00FF', '#CCFF00', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const categories = ['Principal', 'Secondaire', 'Sport', 'Art', 'Langue'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-lime-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
            {subject ? 'Modifier Matière' : 'Nouvelle Matière'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="Nom de la matière *" value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="input-styled w-full p-3 rounded-xl" required />

          <div>
            <label className="text-white text-sm mb-2 block">Coefficient: {form.coefficient}</label>
            <input type="range" min="1" max="5" value={form.coefficient}
              onChange={e => setForm(prev => ({ ...prev, coefficient: Number(e.target.value) }))}
              className="w-full accent-lime-400" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">Couleur</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => setForm(prev => ({ ...prev, color: c }))}
                  className={`w-10 h-10 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-white text-sm mb-2 block">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${form.category === cat 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-lime-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => form.name && onSave({ ...form, id: subject?.id })}
            className="btn-citron w-full py-4 rounded-xl flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> {subject ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const GradeModal: React.FC<{
  students: Student[];
  subjects: Subject[];
  trimester: Trimester;
  onSave: (g: Omit<Grade, 'id'>) => void;
  onClose: () => void;
}> = ({ students, subjects, trimester, onSave, onClose }) => {
  const [form, setForm] = useState({
    studentId: 0,
    subjectId: 0,
    value: 0,
    type: 'Contrôle',
    date: new Date().toISOString().split('T')[0]
  });

  const types = ['Examen', 'Contrôle', 'Devoir', 'Participation', 'TP'];

  const handleNumpad = (n: number | string) => {
    if (n === 'C') {
      setForm(prev => ({ ...prev, value: 0 }));
    } else if (n === '←') {
      setForm(prev => ({ ...prev, value: Math.floor(prev.value / 10) }));
    } else {
      const newValue = form.value * 10 + (n as number);
      if (newValue <= 20) {
        setForm(prev => ({ ...prev, value: newValue }));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-fuchsia-500/30 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
            Nouvelle Note - {trimester}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <select value={form.studentId} onChange={e => setForm(prev => ({ ...prev, studentId: Number(e.target.value) }))}
            className="input-styled w-full p-3 rounded-xl">
            <option value={0}>-- Sélectionner un élève --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>
            ))}
          </select>

          <select value={form.subjectId} onChange={e => setForm(prev => ({ ...prev, subjectId: Number(e.target.value) }))}
            className="input-styled w-full p-3 rounded-xl">
            <option value={0}>-- Sélectionner une matière --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button key={t} onClick={() => setForm(prev => ({ ...prev, type: t }))}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all
                  ${form.type === t 
                    ? 'bg-gradient-to-r from-fuchsia-500 to-lime-500 text-white' 
                    : 'bg-gray-700 text-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Big Note Display */}
          <div className="text-center py-4">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-lime-400">
              {form.value}/20
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9,'C',0,'←'].map(n => (
              <button key={n} onClick={() => handleNumpad(n)}
                className={`py-4 rounded-xl text-xl font-bold transition-all
                  ${n === 'C' ? 'bg-red-500/30 text-red-400 hover:bg-red-500/50' :
                    n === '←' ? 'bg-orange-500/30 text-orange-400 hover:bg-orange-500/50' :
                    'bg-gray-700 text-white hover:bg-gray-600 active:scale-95'}`}>
                {n}
              </button>
            ))}
          </div>

          {/* Quick Values */}
          <div className="flex gap-2">
            {[10, 12, 14, 16, 18, 20].map(v => (
              <button key={v} onClick={() => setForm(prev => ({ ...prev, value: v }))}
                className="flex-1 py-2 rounded-lg bg-lime-500/20 text-lime-400 font-bold hover:bg-lime-500/40">
                {v}
              </button>
            ))}
          </div>

          <button onClick={() => form.studentId && form.subjectId && onSave({ ...form, trimester })}
            disabled={!form.studentId || !form.subjectId}
            className="btn-fuchsia w-full py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-5 h-5" /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
