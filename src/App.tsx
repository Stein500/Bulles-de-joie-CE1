import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Edit3, 
  FileText, Settings as SettingsIcon, Download, Menu, X 
} from 'lucide-react';
import { 
  Student, Subject, Grade, SchoolSettings, 
  SchoolPeriod, AppData 
} from './types';
import {
  getAllStudents, saveStudent, deleteStudent,
  getAllSubjects, saveSubject, deleteSubject,
  getAllGrades, saveGrade,
  getSettings, saveSettings, getDefaultSettings,
  importAllData, generateId
} from './db/database';
import { getDefaultSubjects } from './utils/helpers';
import { Dashboard } from './components/Dashboard';
import { StudentManager } from './components/StudentManager';
import { SubjectManager } from './components/SubjectManager';
import { GradeEntry } from './components/GradeEntry';
import { Bulletin } from './components/Bulletin';
import { Settings } from './components/Settings';
import { ExportImport } from './components/ExportImport';

type View = 'dashboard' | 'students' | 'subjects' | 'grades' | 'bulletin' | 'settings' | 'export';

export function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(getDefaultSettings());

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedStudents, loadedSubjects, loadedGrades, loadedSettings] = await Promise.all([
          getAllStudents(),
          getAllSubjects(),
          getAllGrades(),
          getSettings()
        ]);
        
        setStudents(loadedStudents);
        setSubjects(loadedSubjects);
        setGrades(loadedGrades);
        setSettings(loadedSettings);
        
        // Initialize default subjects if empty
        if (loadedSubjects.length === 0) {
          const defaults = getDefaultSubjects();
          const newSubjects: Subject[] = [];
          for (const sub of defaults) {
            const subject: Subject = { ...sub, id: generateId() };
            await saveSubject(subject);
            newSubjects.push(subject);
          }
          setSubjects(newSubjects);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Student handlers
  const handleSaveStudent = useCallback(async (student: Student) => {
    await saveStudent(student);
    setStudents(prev => {
      const exists = prev.find(s => s.id === student.id);
      if (exists) {
        return prev.map(s => s.id === student.id ? student : s);
      }
      return [...prev, student];
    });
  }, []);

  const handleDeleteStudent = useCallback(async (id: string) => {
    await deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
    // Also remove grades for this student
    setGrades(prev => prev.filter(g => g.studentId !== id));
  }, []);

  // Subject handlers
  const handleSaveSubject = useCallback(async (subject: Subject) => {
    await saveSubject(subject);
    setSubjects(prev => {
      const exists = prev.find(s => s.id === subject.id);
      if (exists) {
        return prev.map(s => s.id === subject.id ? subject : s);
      }
      return [...prev, subject];
    });
  }, []);

  const handleDeleteSubject = useCallback(async (id: string) => {
    await deleteSubject(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Also remove grades for this subject
    setGrades(prev => prev.filter(g => g.subjectId !== id));
  }, []);

  // Grade handlers
  const handleSaveGrade = useCallback(async (grade: Grade) => {
    await saveGrade(grade);
    setGrades(prev => {
      const exists = prev.find(g => g.id === grade.id);
      if (exists) {
        return prev.map(g => g.id === grade.id ? grade : g);
      }
      return [...prev, grade];
    });
  }, []);

  // Settings handlers
  const handleSaveSettings = useCallback(async (newSettings: SchoolSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  // Import handler
  const handleImport = useCallback(async (data: AppData) => {
    await importAllData(data);
    setStudents(data.students);
    setSubjects(data.subjects);
    setGrades(data.grades);
    setSettings(data.settings);
  }, []);

  const periods: SchoolPeriod[] = settings.periodSettings.customPeriods;
  const currentPeriod = periods.find(p => p.isActive) || periods[0] || null;

  const navItems: { id: View; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'from-fuchsia-500 to-rose-500' },
    { id: 'students', label: 'Élèves', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'subjects', label: 'Matières', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { id: 'grades', label: 'Saisie Notes', icon: Edit3, color: 'from-purple-500 to-violet-500' },
    { id: 'bulletin', label: 'Bulletins', icon: FileText, color: 'from-pink-500 to-rose-500' },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon, color: 'from-gray-600 to-gray-700' },
    { id: 'export', label: 'Export/Import', icon: Download, color: 'from-indigo-500 to-blue-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-rose-50 to-lime-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center animate-pulse shadow-xl">
            <span className="text-3xl font-bold text-white">BJ</span>
          </div>
          <p className="text-gray-600 font-medium">Chargement...</p>
          <p className="text-sm text-gray-400 mt-1">Les Bulles de Joie</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-lime-50 print:bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-40 border-b border-fuchsia-100 no-print">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-fuchsia-50 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-fuchsia-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">BJ</span>
            </div>
            <span className="font-bold text-gray-800">Les Bulles de Joie</span>
          </div>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden no-print"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 no-print
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">BJ</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800">Les Bulles de Joie</h1>
                <p className="text-xs text-fuchsia-600 font-medium">{settings.academicYear}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${currentView === item.id 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-fuchsia-600'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-fuchsia-50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-xl py-2 shadow-sm">
              <p className="text-lg font-bold text-fuchsia-600">{students.filter(s => s.isActive).length}</p>
              <p className="text-[10px] text-gray-500 font-medium">Élèves</p>
            </div>
            <div className="bg-white rounded-xl py-2 shadow-sm">
              <p className="text-lg font-bold text-lime-600">{subjects.filter(s => s.isActive).length}</p>
              <p className="text-[10px] text-gray-500 font-medium">Matières</p>
            </div>
            <div className="bg-white rounded-xl py-2 shadow-sm">
              <p className="text-lg font-bold text-blue-600">{grades.length}</p>
              <p className="text-[10px] text-gray-500 font-medium">Notes</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 print:ml-0 print:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {currentView === 'dashboard' && (
            <Dashboard
              students={students}
              subjects={subjects}
              grades={grades}
              currentPeriod={currentPeriod}
            />
          )}
          
          {currentView === 'students' && (
            <StudentManager
              students={students}
              onSave={handleSaveStudent}
              onDelete={handleDeleteStudent}
            />
          )}
          
          {currentView === 'subjects' && (
            <SubjectManager
              subjects={subjects}
              onSave={handleSaveSubject}
              onDelete={handleDeleteSubject}
            />
          )}
          
          {currentView === 'grades' && (
            <GradeEntry
              students={students}
              subjects={subjects}
              grades={grades}
              periods={periods}
              currentPeriod={currentPeriod}
              onSaveGrade={handleSaveGrade}
            />
          )}
          
          {currentView === 'bulletin' && (
            <Bulletin
              students={students}
              subjects={subjects}
              grades={grades}
              periods={periods}
              settings={settings}
            />
          )}
          
          {currentView === 'settings' && (
            <Settings
              settings={settings}
              onSave={handleSaveSettings}
            />
          )}
          
          {currentView === 'export' && (
            <ExportImport
              data={{ students, subjects, grades, settings }}
              periods={periods}
              onImport={handleImport}
            />
          )}
        </div>
      </main>
    </div>
  );
}
