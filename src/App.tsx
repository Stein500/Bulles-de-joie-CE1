import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Camera,
  Save,
  Download,
  Upload,
  Printer,
  X,
  Check,
  ChevronLeft,
  Star,
  Award,
  TrendingUp,
  Search,
} from "lucide-react";
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
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import type {
  Student,
  Subject,
  Grade,
  SchoolSettings,
  TabType,
  Period,
  AppData,
} from "./types";
import * as db from "./db";

// Enregistrer les composants Chart.js
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

// ========== COMPOSANT PRINCIPAL ==========
export function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(db.getDefaultSettings());
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("T1");

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedStudents, loadedSubjects, loadedGrades, loadedSettings] =
        await Promise.all([
          db.getAllStudents(),
          db.getAllSubjects(),
          db.getAllGrades(),
          db.getSettings(),
        ]);

      setStudents(loadedStudents);
      setSubjects(loadedSubjects);
      setGrades(loadedGrades);
      if (loadedSettings) setSettings(loadedSettings);

      // Initialiser les matières par défaut si vide
      if (loadedSubjects.length === 0) {
        const defaultSubjects = db.getDefaultSubjects();
        const newSubjects: Subject[] = [];
        for (const subj of defaultSubjects) {
          const created = await db.addSubject(subj);
          newSubjects.push(created);
        }
        setSubjects(newSubjects);
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    const [loadedStudents, loadedSubjects, loadedGrades] = await Promise.all([
      db.getAllStudents(),
      db.getAllSubjects(),
      db.getAllGrades(),
    ]);
    setStudents(loadedStudents);
    setSubjects(loadedSubjects);
    setGrades(loadedGrades);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-citron-50">
      {/* Bulles décoratives */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-fuchsia-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-citron-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-fuchsia-300/20 rounded-full blur-3xl animate-float" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 pb-24">
        {activeTab === "dashboard" && (
          <Dashboard
            students={students}
            subjects={subjects}
            grades={grades}
            settings={settings}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}
        {activeTab === "students" && (
          <StudentsPage students={students} onRefresh={refreshData} />
        )}
        {activeTab === "subjects" && (
          <SubjectsPage subjects={subjects} onRefresh={refreshData} />
        )}
        {activeTab === "grades" && (
          <GradesPage
            students={students}
            subjects={subjects}
            grades={grades}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            onRefresh={refreshData}
          />
        )}
        {activeTab === "bulletin" && (
          <BulletinPage
            students={students}
            subjects={subjects}
            grades={grades}
            settings={settings}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}
        {activeTab === "settings" && (
          <SettingsPage
            settings={settings}
            onSettingsUpdate={async (newSettings) => {
              await db.saveSettings(newSettings);
              setSettings(newSettings);
            }}
            onDataExport={async () => {
              const data = await db.exportAllData();
              downloadJSON(data, `bulles-de-joie-backup-${Date.now()}.json`);
            }}
            onDataImport={async (data) => {
              await db.importAllData(data);
              await loadData();
            }}
          />
        )}
      </div>

      {/* Navigation bottom */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// ========== ÉCRAN DE CHARGEMENT ==========
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-white/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
            <span className="text-3xl">🎈</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Les Bulles de Joie</h1>
        <p className="text-fuchsia-200">Chargement...</p>
      </div>
    </div>
  );
}

// ========== NAVIGATION ==========
function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  const tabs: { id: TabType; icon: typeof Home; label: string }[] = [
    { id: "dashboard", icon: Home, label: "Accueil" },
    { id: "students", icon: Users, label: "Élèves" },
    { id: "subjects", icon: BookOpen, label: "Matières" },
    { id: "grades", icon: ClipboardList, label: "Notes" },
    { id: "bulletin", icon: FileText, label: "Bulletin" },
    { id: "settings", icon: Settings, label: "Réglages" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-200 z-50 no-print">
      <div className="flex justify-around items-center py-2 px-1">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-2 rounded-xl transition-all ${
              activeTab === id
                ? "text-fuchsia-600 bg-fuchsia-50"
                : "text-gray-500 hover:text-fuchsia-500"
            }`}
          >
            <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ========== DASHBOARD ==========
function Dashboard({
  students,
  subjects,
  grades,
  settings,
  selectedPeriod,
  onPeriodChange,
}: {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  settings: SchoolSettings;
  selectedPeriod: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const periodGrades = grades.filter((g) => g.period === selectedPeriod);

  const stats = {
    totalStudents: students.length,
    totalSubjects: subjects.length,
    totalGrades: periodGrades.length,
    averageGrade:
      periodGrades.length > 0
        ? (
            periodGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) /
            periodGrades.length
          ).toFixed(1)
        : "0",
  };

  return (
    <div className="p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
            <span className="text-2xl">🎈</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {settings.schoolName || "Les Bulles de Joie"}
            </h1>
            <p className="text-sm text-gray-500">{settings.academicYear}</p>
          </div>
        </div>

        {/* Sélecteur de période */}
        <PeriodSelector selected={selectedPeriod} onChange={onPeriodChange} />
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<Users className="text-fuchsia-500" />}
          value={stats.totalStudents}
          label="Élèves"
          gradient="from-fuchsia-500/10 to-fuchsia-500/5"
        />
        <StatCard
          icon={<BookOpen className="text-citron-600" />}
          value={stats.totalSubjects}
          label="Matières"
          gradient="from-citron-500/10 to-citron-500/5"
        />
        <StatCard
          icon={<ClipboardList className="text-blue-500" />}
          value={stats.totalGrades}
          label="Notes saisies"
          gradient="from-blue-500/10 to-blue-500/5"
        />
        <StatCard
          icon={<TrendingUp className="text-green-500" />}
          value={stats.averageGrade}
          label="Moyenne classe"
          gradient="from-green-500/10 to-green-500/5"
        />
      </div>

      {/* Graphique des moyennes par matière */}
      {subjects.length > 0 && periodGrades.length > 0 && (
        <div className="card p-4 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-fuchsia-500" size={20} />
            Moyennes par matière
          </h2>
          <div className="h-64">
            <Bar
              data={{
                labels: subjects.map((s) => s.name),
                datasets: [
                  {
                    label: "Moyenne",
                    data: subjects.map((s) => {
                      const subjectGrades = periodGrades.filter(
                        (g) => g.subjectId === s.id
                      );
                      if (subjectGrades.length === 0) return 0;
                      return (
                        subjectGrades.reduce(
                          (sum, g) => sum + (g.value / g.maxValue) * 20,
                          0
                        ) / subjectGrades.length
                      );
                    }),
                    backgroundColor: subjects.map((s) => s.color + "80"),
                    borderColor: subjects.map((s) => s.color),
                    borderWidth: 2,
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, max: 20 },
                  x: { ticks: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Top 5 élèves */}
      {students.length > 0 && periodGrades.length > 0 && (
        <div className="card p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="text-citron-500" size={20} />
            Top 5 Élèves - {selectedPeriod}
          </h2>
          <TopStudentsList
            students={students}
            grades={periodGrades}
            subjects={subjects}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  gradient,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  gradient: string;
}) {
  return (
    <div className={`card p-4 bg-gradient-to-br ${gradient}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function PeriodSelector({
  selected,
  onChange,
}: {
  selected: Period;
  onChange: (p: Period) => void;
}) {
  const periods: Period[] = ["T1", "T2", "T3"];
  const labels = { T1: "Trimestre 1", T2: "Trimestre 2", T3: "Trimestre 3" };

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
            selected === p
              ? "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {labels[p]}
        </button>
      ))}
    </div>
  );
}

function TopStudentsList({
  students,
  grades,
  subjects,
}: {
  students: Student[];
  grades: Grade[];
  subjects: Subject[];
}) {
  const studentAverages = students.map((student) => {
    const studentGrades = grades.filter((g) => g.studentId === student.id);
    let totalWeighted = 0;
    let totalCoeff = 0;

    subjects.forEach((subject) => {
      const subjectGrades = studentGrades.filter(
        (g) => g.subjectId === subject.id
      );
      if (subjectGrades.length > 0) {
        const avg =
          subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) /
          subjectGrades.length;
        totalWeighted += avg * subject.coefficient;
        totalCoeff += subject.coefficient;
      }
    });

    return {
      student,
      average: totalCoeff > 0 ? totalWeighted / totalCoeff : 0,
    };
  });

  const sorted = studentAverages.sort((a, b) => b.average - a.average).slice(0, 5);

  return (
    <div className="space-y-3">
      {sorted.map(({ student, average }, index) => (
        <div
          key={student.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              index === 0
                ? "bg-yellow-400 text-yellow-900"
                : index === 1
                ? "bg-gray-300 text-gray-700"
                : index === 2
                ? "bg-orange-300 text-orange-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          {student.photo ? (
            <img
              src={student.photo}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-bold">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-fuchsia-600">{average.toFixed(2)}/20</p>
          </div>
        </div>
      ))}
      {sorted.length === 0 && (
        <p className="text-gray-500 text-center py-4">Aucune donnée</p>
      )}
    </div>
  );
}

// ========== PAGE ÉLÈVES ==========
function StudentsPage({
  students,
  onRefresh,
}: {
  students: Student[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (data: Omit<Student, "id" | "createdAt">) => {
    if (editStudent) {
      await db.updateStudent({ ...editStudent, ...data });
    } else {
      await db.addStudent(data);
    }
    onRefresh();
    setShowForm(false);
    setEditStudent(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cet élève et toutes ses notes ?")) {
      await db.deleteStudent(id);
      onRefresh();
    }
  };

  if (showForm) {
    return (
      <StudentForm
        student={editStudent}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditStudent(null);
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Élèves</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </header>

      {/* Recherche */}
      <div className="relative mb-4">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher un élève..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <div key={student.id} className="card p-4 flex items-center gap-4">
            {student.photo ? (
              <img
                src={student.photo}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 flex items-center justify-center text-white text-xl font-bold">
                {student.firstName[0]}
                {student.lastName[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {student.gender === "M" ? "👦" : "👧"}{" "}
                {new Date(student.dateOfBirth).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditStudent(student);
                  setShowForm(true);
                }}
                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucun élève trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentForm({
  student,
  onSave,
  onCancel,
}: {
  student: Student | null;
  onSave: (data: Omit<Student, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    dateOfBirth: student?.dateOfBirth || "",
    gender: student?.gender || ("M" as "M" | "F"),
    photo: student?.photo || "",
    parentName: student?.parentName || "",
    parentPhone: student?.parentPhone || "",
    address: student?.address || "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm({ ...form, photo: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4">
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {student ? "Modifier l'élève" : "Nouvel élève"}
        </h1>
      </header>

      <div className="space-y-4">
        {/* Photo */}
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer">
            {form.photo ? (
              <img
                src={form.photo}
                alt=""
                className="w-28 h-28 rounded-3xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                <Camera size={32} className="text-fuchsia-500" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-fuchsia-500 text-white flex items-center justify-center shadow-lg">
              <Camera size={18} />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance *
          </label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, gender: "M" })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                form.gender === "M"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              👦 Garçon
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, gender: "F" })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                form.gender === "F"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              👧 Fille
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du parent
          </label>
          <input
            type="text"
            value={form.parentName}
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone parent
          </label>
          <input
            type="tel"
            value={form.parentPhone}
            onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input-field resize-none"
            rows={2}
          />
        </div>

        <button
          onClick={() => {
            if (form.firstName && form.lastName && form.dateOfBirth) {
              onSave(form);
            }
          }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ========== PAGE MATIÈRES ==========
function SubjectsPage({
  subjects,
  onRefresh,
}: {
  subjects: Subject[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);

  const handleSave = async (data: Omit<Subject, "id">) => {
    if (editSubject) {
      await db.updateSubject({ ...editSubject, ...data });
    } else {
      await db.addSubject(data);
    }
    onRefresh();
    setShowForm(false);
    setEditSubject(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette matière et toutes les notes associées ?")) {
      await db.deleteSubject(id);
      onRefresh();
    }
  };

  if (showForm) {
    return (
      <SubjectForm
        subject={editSubject}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditSubject(null);
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Matières</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </header>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <div key={subject.id} className="card p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: subject.color }}
            >
              {subject.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{subject.name}</p>
              <p className="text-sm text-gray-500">
                Coef. {subject.coefficient} •{" "}
                {
                  {
                    principal: "Principal",
                    secondary: "Secondaire",
                    sport: "Sport",
                    art: "Art",
                  }[subject.category]
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditSubject(subject);
                  setShowForm(true);
                }}
                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectForm({
  subject,
  onSave,
  onCancel,
}: {
  subject: Subject | null;
  onSave: (data: Omit<Subject, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: subject?.name || "",
    coefficient: subject?.coefficient || 1,
    color: subject?.color || "#FF00FF",
    category: subject?.category || ("principal" as Subject["category"]),
  });

  const colors = [
    "#FF00FF",
    "#CCFF00",
    "#00CCFF",
    "#FF9900",
    "#9900FF",
    "#00FF99",
    "#FF6699",
    "#6699FF",
    "#FF3333",
    "#33CC33",
  ];

  return (
    <div className="p-4">
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {subject ? "Modifier la matière" : "Nouvelle matière"}
        </h1>
      </header>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la matière *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Ex: Mathématiques"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coefficient
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, coefficient: c })}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  form.coefficient === c
                    ? "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-12 h-12 rounded-2xl transition-all ${
                  form.color === c
                    ? "ring-4 ring-offset-2 ring-fuchsia-500 scale-110"
                    : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "principal", label: "📚 Principal" },
              { id: "secondary", label: "📖 Secondaire" },
              { id: "sport", label: "⚽ Sport" },
              { id: "art", label: "🎨 Art" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() =>
                  setForm({ ...form, category: id as Subject["category"] })
                }
                className={`py-3 rounded-xl font-medium transition-all ${
                  form.category === id
                    ? "bg-fuchsia-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (form.name) {
              onSave(form);
            }
          }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ========== PAGE NOTES ==========
function GradesPage({
  students,
  subjects,
  grades,
  selectedPeriod,
  onPeriodChange,
  onRefresh,
}: {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  selectedPeriod: Period;
  onPeriodChange: (p: Period) => void;
  onRefresh: () => void;
}) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [maxValue, setMaxValue] = useState("20");
  const [gradeType, setGradeType] = useState<Grade["type"]>("exam");

  const handleAddGrade = async () => {
    if (!selectedStudent || !selectedSubject || !gradeValue) return;

    await db.addGrade({
      studentId: selectedStudent.id,
      subjectId: selectedSubject.id,
      value: parseFloat(gradeValue),
      maxValue: parseFloat(maxValue),
      period: selectedPeriod,
      type: gradeType,
      date: new Date().toISOString().split("T")[0],
    });

    setGradeValue("");
    onRefresh();
  };

  const periodGrades = grades.filter((g) => g.period === selectedPeriod);

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Saisie des Notes</h1>
        <PeriodSelector selected={selectedPeriod} onChange={onPeriodChange} />
      </header>

      {/* Sélection élève */}
      <div className="card p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Élève
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedStudent?.id === student.id
                  ? "bg-fuchsia-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {student.firstName} {student.lastName[0]}.
            </button>
          ))}
        </div>
      </div>

      {/* Sélection matière */}
      {selectedStudent && (
        <div className="card p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matière
          </label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className={`p-3 rounded-xl font-medium transition-all border-2 ${
                  selectedSubject?.id === subject.id
                    ? "border-fuchsia-500 bg-fuchsia-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: subject.color }}
                />
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saisie note avec gros boutons */}
      {selectedStudent && selectedSubject && (
        <div className="card p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Note pour {selectedStudent.firstName} en {selectedSubject.name}
          </label>

          {/* Clavier numérique personnalisé */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {["7", "8", "9", "←", "4", "5", "6", ".", "1", "2", "3", "C", "0", "10", "15", "20"].map(
              (key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "←") {
                      setGradeValue(gradeValue.slice(0, -1));
                    } else if (key === "C") {
                      setGradeValue("");
                    } else if (key === "10" || key === "15" || key === "20") {
                      setGradeValue(key);
                    } else {
                      setGradeValue(gradeValue + key);
                    }
                  }}
                  className={`btn-icon ${
                    key === "←" || key === "C"
                      ? "bg-red-100 text-red-600"
                      : key === "10" || key === "15" || key === "20"
                      ? "bg-citron-100 text-citron-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {key}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                className="input-field text-center text-3xl font-bold"
                placeholder="0"
              />
            </div>
            <span className="text-2xl font-bold text-gray-400">/</span>
            <div className="w-20">
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="input-field text-center text-xl font-bold"
              />
            </div>
          </div>

          {/* Type de note */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: "exam", label: "📝 Examen" },
              { id: "test", label: "📋 Contrôle" },
              { id: "homework", label: "📚 Devoir" },
              { id: "participation", label: "🙋 Participation" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setGradeType(id as Grade["type"])}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  gradeType === id
                    ? "bg-citron-400 text-gray-900"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddGrade}
            disabled={!gradeValue}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check size={20} />
            Ajouter la note
          </button>
        </div>
      )}

      {/* Récapitulatif des notes */}
      <div className="card p-4">
        <h2 className="font-bold text-gray-900 mb-3">
          Notes saisies - {selectedPeriod}
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {periodGrades
            .slice()
            .reverse()
            .slice(0, 20)
            .map((grade) => {
              const student = students.find((s) => s.id === grade.studentId);
              const subject = subjects.find((s) => s.id === grade.subjectId);
              return (
                <div
                  key={grade.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject?.color }}
                  />
                  <span className="flex-1 text-sm">
                    {student?.firstName} {student?.lastName[0]}. - {subject?.name}
                  </span>
                  <span className="font-bold text-fuchsia-600">
                    {grade.value}/{grade.maxValue}
                  </span>
                  <button
                    onClick={async () => {
                      await db.deleteGrade(grade.id);
                      onRefresh();
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          {periodGrades.length === 0 && (
            <p className="text-gray-500 text-center py-4">Aucune note saisie</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== PAGE BULLETIN ==========
function BulletinPage({
  students,
  subjects,
  grades,
  settings,
  selectedPeriod,
  onPeriodChange,
}: {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  settings: SchoolSettings;
  selectedPeriod: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [appreciation, setAppreciation] = useState("");

  const periodGrades = grades.filter((g) => g.period === selectedPeriod);

  // Calcul des moyennes et rangs pour tous les élèves
  const studentStats = students.map((student) => {
    const studentGrades = periodGrades.filter((g) => g.studentId === student.id);
    let totalWeighted = 0;
    let totalCoeff = 0;

    subjects.forEach((subject) => {
      const subjectGrades = studentGrades.filter((g) => g.subjectId === subject.id);
      if (subjectGrades.length > 0) {
        const avg =
          subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) /
          subjectGrades.length;
        totalWeighted += avg * subject.coefficient;
        totalCoeff += subject.coefficient;
      }
    });

    return {
      student,
      average: totalCoeff > 0 ? totalWeighted / totalCoeff : 0,
    };
  });

  const sortedByAverage = [...studentStats].sort((a, b) => b.average - a.average);
  const getRank = (studentId: string) => {
    return sortedByAverage.findIndex((s) => s.student.id === studentId) + 1;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (!selectedStudent) return;

    const doc = new jsPDF();
    const rank = getRank(selectedStudent.id);
    const studentStat = studentStats.find(
      (s) => s.student.id === selectedStudent.id
    );

    doc.setFontSize(18);
    doc.text(settings.schoolName || "Les Bulles de Joie", 105, 20, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.text(`Bulletin Scolaire - ${selectedPeriod}`, 105, 30, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text(
      `Élève: ${selectedStudent.firstName} ${selectedStudent.lastName}`,
      20,
      50
    );
    doc.text(`Moyenne Générale: ${studentStat?.average.toFixed(2)}/20`, 20, 60);
    doc.text(`Rang: ${rank}/${students.length}`, 20, 70);

    let y = 90;
    doc.setFontSize(10);
    doc.text("Matière", 20, y);
    doc.text("Moyenne", 80, y);
    doc.text("Coef.", 120, y);
    doc.text("Moy. Pondérée", 150, y);
    y += 10;

    subjects.forEach((subject) => {
      const subjectGrades = periodGrades.filter(
        (g) => g.studentId === selectedStudent.id && g.subjectId === subject.id
      );
      if (subjectGrades.length > 0) {
        const avg =
          subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) /
          subjectGrades.length;
        doc.text(subject.name, 20, y);
        doc.text(avg.toFixed(2), 80, y);
        doc.text(subject.coefficient.toString(), 120, y);
        doc.text((avg * subject.coefficient).toFixed(2), 150, y);
        y += 8;
      }
    });

    if (appreciation) {
      y += 10;
      doc.text("Appréciation:", 20, y);
      y += 8;
      doc.text(appreciation, 20, y, { maxWidth: 170 });
    }

    doc.save(
      `bulletin-${selectedStudent.lastName}-${selectedStudent.firstName}-${selectedPeriod}.pdf`
    );
  };

  const handleExportExcel = () => {
    const data = students.map((student) => {
      const row: Record<string, string | number> = {
        Nom: student.lastName,
        Prénom: student.firstName,
      };

      subjects.forEach((subject) => {
        const subjectGrades = periodGrades.filter(
          (g) => g.studentId === student.id && g.subjectId === subject.id
        );
        if (subjectGrades.length > 0) {
          const avg =
            subjectGrades.reduce(
              (sum, g) => sum + (g.value / g.maxValue) * 20,
              0
            ) / subjectGrades.length;
          row[subject.name] = avg.toFixed(2);
        } else {
          row[subject.name] = "-";
        }
      });

      const stat = studentStats.find((s) => s.student.id === student.id);
      row["Moyenne Générale"] = stat?.average.toFixed(2) || "0";
      row["Rang"] = getRank(student.id);

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Bulletin ${selectedPeriod}`);
    XLSX.writeFile(wb, `bulletins-${selectedPeriod}.xlsx`);
  };

  // Données pour le radar chart
  const getRadarData = (student: Student) => {
    const studentGrades = periodGrades.filter((g) => g.studentId === student.id);

    return {
      labels: subjects.map((s) => s.name),
      datasets: [
        {
          label: `${student.firstName} ${student.lastName}`,
          data: subjects.map((subject) => {
            const subjectGrades = studentGrades.filter(
              (g) => g.subjectId === subject.id
            );
            if (subjectGrades.length === 0) return 0;
            return (
              subjectGrades.reduce(
                (sum, g) => sum + (g.value / g.maxValue) * 20,
                0
              ) / subjectGrades.length
            );
          }),
          backgroundColor: "rgba(255, 0, 255, 0.2)",
          borderColor: "#FF00FF",
          borderWidth: 2,
          pointBackgroundColor: "#FF00FF",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#FF00FF",
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <header className="mb-6 no-print">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bulletin Scolaire</h1>
        <PeriodSelector selected={selectedPeriod} onChange={onPeriodChange} />
      </header>

      {/* Sélection élève */}
      <div className="card p-4 mb-4 no-print">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un élève
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`p-3 rounded-xl font-medium text-left transition-all ${
                selectedStudent?.id === student.id
                  ? "bg-fuchsia-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {student.firstName} {student.lastName}
            </button>
          ))}
        </div>
      </div>

      {/* Actions d'export */}
      <div className="flex gap-2 mb-4 no-print">
        <button
          onClick={handlePrint}
          disabled={!selectedStudent}
          className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Printer size={18} />
          Imprimer
        </button>
        <button
          onClick={handleExportPDF}
          disabled={!selectedStudent}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download size={18} />
          PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="flex-1 bg-green-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Excel
        </button>
      </div>

      {/* Aperçu du bulletin */}
      {selectedStudent && (
        <div className="bulletin-container card overflow-hidden">
          {/* En-tête du bulletin */}
          <div className="bulletin-header bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="w-16 h-16 rounded-xl object-contain bg-white p-1"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">🎈</span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {settings.schoolName || "Les Bulles de Joie"}
                  </h2>
                  <p className="text-fuchsia-100 text-sm">{settings.schoolAddress}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">BULLETIN SCOLAIRE</p>
                <p className="text-fuchsia-100">
                  {selectedPeriod === "T1"
                    ? "1er Trimestre"
                    : selectedPeriod === "T2"
                    ? "2ème Trimestre"
                    : "3ème Trimestre"}
                </p>
                <p className="text-fuchsia-100 text-sm">{settings.academicYear}</p>
              </div>
            </div>
          </div>

          {/* Info élève */}
          <div className="p-4 bg-gray-50 border-b flex items-center gap-4">
            {selectedStudent.photo ? (
              <img
                src={selectedStudent.photo}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 text-xl font-bold">
                {selectedStudent.firstName[0]}
                {selectedStudent.lastName[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                Né(e) le{" "}
                {new Date(selectedStudent.dateOfBirth).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-fuchsia-600">
                {studentStats
                  .find((s) => s.student.id === selectedStudent.id)
                  ?.average.toFixed(2)}
                /20
              </p>
              <p className="text-sm text-gray-600">
                Rang: {getRank(selectedStudent.id)}/{students.length}
              </p>
            </div>
          </div>

          {/* Tableau des notes */}
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-fuchsia-500 text-white">
                  <th className="p-3 text-left rounded-tl-xl">Matière</th>
                  <th className="p-3 text-center">Coef</th>
                  <th className="p-3 text-center">Moyenne</th>
                  <th className="p-3 text-center">Moy. Classe</th>
                  <th className="p-3 text-center rounded-tr-xl">Appr.</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, idx) => {
                  const studentGrades = periodGrades.filter(
                    (g) =>
                      g.studentId === selectedStudent.id &&
                      g.subjectId === subject.id
                  );
                  const allSubjectGrades = periodGrades.filter(
                    (g) => g.subjectId === subject.id
                  );

                  const studentAvg =
                    studentGrades.length > 0
                      ? studentGrades.reduce(
                          (sum, g) => sum + (g.value / g.maxValue) * 20,
                          0
                        ) / studentGrades.length
                      : null;

                  const classAvg =
                    allSubjectGrades.length > 0
                      ? allSubjectGrades.reduce(
                          (sum, g) => sum + (g.value / g.maxValue) * 20,
                          0
                        ) / allSubjectGrades.length
                      : null;

                  const getAppreciation = (avg: number | null) => {
                    if (avg === null) return "-";
                    if (avg >= 16) return "Excellent";
                    if (avg >= 14) return "Très bien";
                    if (avg >= 12) return "Bien";
                    if (avg >= 10) return "Passable";
                    return "Insuffisant";
                  };

                  return (
                    <tr
                      key={subject.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3 font-medium">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </td>
                      <td className="p-3 text-center">{subject.coefficient}</td>
                      <td className="p-3 text-center font-bold">
                        {studentAvg !== null ? studentAvg.toFixed(2) : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {classAvg !== null ? classAvg.toFixed(2) : "-"}
                      </td>
                      <td className="p-3 text-center text-xs">
                        {getAppreciation(studentAvg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Radar Chart */}
          <div className="p-4 radar-chart-container">
            <h4 className="font-bold text-gray-900 mb-3">
              Profil de Compétences
            </h4>
            <div className="h-64">
              <Radar
                data={getRadarData(selectedStudent)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 20,
                      ticks: { stepSize: 5 },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>

          {/* Appréciation générale */}
          <div className="p-4 no-print">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appréciation générale
            </label>
            <textarea
              value={appreciation}
              onChange={(e) => setAppreciation(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Saisissez une appréciation..."
            />
          </div>

          {appreciation && (
            <div className="p-4 print-only">
              <p className="text-sm">
                <strong>Appréciation:</strong> {appreciation}
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="signature-section p-4 grid grid-cols-2 gap-4 border-t">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">
                L'Enseignant(e)
              </p>
              {settings.teacherSignature ? (
                <img
                  src={settings.teacherSignature}
                  alt="Signature"
                  className="h-16 mx-auto object-contain"
                />
              ) : (
                <div className="h-16 border-b-2 border-gray-300 w-32 mx-auto" />
              )}
              <p className="text-sm text-gray-600 mt-1">
                {settings.teacherName || "_________________"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Le Directeur/La Directrice
              </p>
              {settings.directorSignature ? (
                <img
                  src={settings.directorSignature}
                  alt="Signature"
                  className="h-16 mx-auto object-contain"
                />
              ) : (
                <div className="h-16 border-b-2 border-gray-300 w-32 mx-auto" />
              )}
              <p className="text-sm text-gray-600 mt-1">
                {settings.directorName || "_________________"}
              </p>
            </div>
          </div>

          {/* Cachet */}
          {settings.stamp && (
            <div className="p-4 flex justify-center">
              <img
                src={settings.stamp}
                alt="Cachet"
                className="h-24 object-contain opacity-70"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== PAGE PARAMÈTRES ==========
function SettingsPage({
  settings,
  onSettingsUpdate,
  onDataExport,
  onDataImport,
}: {
  settings: SchoolSettings;
  onSettingsUpdate: (s: SchoolSettings) => void;
  onDataExport: () => void;
  onDataImport: (data: AppData) => void;
}) {
  const [form, setForm] = useState(settings);

  const handleImageUpload = (
    field: "logo" | "stamp" | "directorSignature" | "teacherSignature"
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setForm({ ...form, [field]: ev.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target?.result as string) as AppData;
            if (confirm("Remplacer toutes les données par la sauvegarde ?")) {
              onDataImport(data);
            }
          } catch {
            alert("Fichier invalide");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </header>

      <div className="space-y-4">
        {/* Info école */}
        <div className="card p-4">
          <h2 className="font-bold text-gray-900 mb-4">
            Informations de l'École
          </h2>

          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleImageUpload("logo")}
                className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden"
              >
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={24} className="text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium">Logo de l'école</p>
                <p className="text-sm text-gray-500">Cliquez pour modifier</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'école
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={form.schoolAddress}
                onChange={(e) =>
                  setForm({ ...form, schoolAddress: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={form.schoolPhone}
                  onChange={(e) =>
                    setForm({ ...form, schoolPhone: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année scolaire
                </label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) =>
                    setForm({ ...form, academicYear: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Signatures et Cachet */}
        <div className="card p-4">
          <h2 className="font-bold text-gray-900 mb-4">Signatures et Cachet</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du directeur
              </label>
              <input
                type="text"
                value={form.directorName}
                onChange={(e) =>
                  setForm({ ...form, directorName: e.target.value })
                }
                className="input-field"
              />
              <button
                onClick={() => handleImageUpload("directorSignature")}
                className="mt-2 w-full h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"
              >
                {form.directorSignature ? (
                  <img
                    src={form.directorSignature}
                    alt=""
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">+ Signature</span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'enseignant
              </label>
              <input
                type="text"
                value={form.teacherName}
                onChange={(e) =>
                  setForm({ ...form, teacherName: e.target.value })
                }
                className="input-field"
              />
              <button
                onClick={() => handleImageUpload("teacherSignature")}
                className="mt-2 w-full h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"
              >
                {form.teacherSignature ? (
                  <img
                    src={form.teacherSignature}
                    alt=""
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">+ Signature</span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cachet de l'école
            </label>
            <button
              onClick={() => handleImageUpload("stamp")}
              className="w-full h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"
            >
              {form.stamp ? (
                <img
                  src={form.stamp}
                  alt=""
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">+ Ajouter un cachet (PNG)</span>
              )}
            </button>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={() => onSettingsUpdate(form)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Enregistrer les paramètres
        </button>

        {/* Export/Import */}
        <div className="card p-4">
          <h2 className="font-bold text-gray-900 mb-4">
            Sauvegarde et Restauration
          </h2>

          <div className="space-y-3">
            <button
              onClick={onDataExport}
              className="w-full py-3 px-4 rounded-xl bg-green-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Exporter toutes les données (JSON)
            </button>

            <button
              onClick={handleImport}
              className="w-full py-3 px-4 rounded-xl bg-blue-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Importer une sauvegarde
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Exportez régulièrement vos données pour éviter toute perte.
          </p>
        </div>

        {/* Info Termux */}
        <div className="card p-4 bg-gradient-to-br from-fuchsia-50 to-citron-50">
          <h3 className="font-bold text-gray-900 mb-2">📱 Installation Termux</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <code className="bg-gray-200 px-1 rounded">pkg install nodejs</code>
            </p>
            <p>
              <code className="bg-gray-200 px-1 rounded">npm install</code>
            </p>
            <p>
              <code className="bg-gray-200 px-1 rounded">npm run build</code>
            </p>
            <p className="mt-2">
              Le fichier <code className="bg-gray-200 px-1 rounded">dist/index.html</code>{" "}
              est autonome et fonctionne hors-ligne.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== UTILITAIRES ==========
function downloadJSON(data: AppData, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
