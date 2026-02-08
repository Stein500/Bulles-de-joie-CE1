import { useState, useMemo } from 'react';
import { useStore } from '../stores/useStore';
import { uid, generateDemoStudents } from '../lib/helpers';
import { Plus, Search, Trash2, Edit3, UserPlus, X, Users } from 'lucide-react';
import type { Student } from '../stores/useStore';

const emptyStudent = (): Student => ({
  id: uid(),
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'M',
  className: 'CM2',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
});

export function StudentManager() {
  const { students, addStudent, updateStudent, deleteStudent, setStudents, addToast, darkMode, demoNames } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students
      .filter((s) => `${s.lastName} ${s.firstName}`.toLowerCase().includes(q))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [students, search]);

  const openNew = () => {
    setEditing(emptyStudent());
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setEditing({ ...s });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.firstName.trim() || !editing.lastName.trim()) {
      addToast('Nom et prénom obligatoires', 'error');
      return;
    }
    const exists = students.find((s) => s.id === editing.id);
    if (exists) {
      updateStudent(editing.id, editing);
      addToast('Élève modifié ✓', 'success');
    } else {
      addStudent(editing);
      addToast('Élève ajouté ✓', 'success');
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cet élève et toutes ses notes ?')) {
      deleteStudent(id);
      addToast('Élève et ses notes supprimés définitivement', 'warning', 'Suppression');
    }
  };

  const addDemoStudents = (count: number) => {
    if (demoNames.firstNamesMale.length === 0 && demoNames.firstNamesFemale.length === 0) {
      addToast('Aucun prénom dans le répertoire démo. Allez dans Paramètres → Noms démo.', 'error');
      return;
    }
    if (demoNames.lastNames.length === 0) {
      addToast('Aucun nom de famille dans le répertoire démo. Allez dans Paramètres → Noms démo.', 'error');
      return;
    }
    const demos = generateDemoStudents(count, demoNames);
    setStudents([...students, ...demos]);
    addToast(`${count} élèves démo ajoutés ✓`, 'success');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let { width, height } = img;
        if (width > height) { height = (height / width) * maxSize; width = maxSize; }
        else { width = (width / height) * maxSize; height = maxSize; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        setEditing({ ...editing, photo: canvas.toDataURL('image/jpeg', 0.8) });
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAll = () => {
    if (confirm(`Supprimer les ${students.length} élèves et toutes leurs notes ?`)) {
      setStudents([]);
      useStore.getState().setGrades([]);
      addToast(`${students.length} élèves supprimés avec toutes leurs notes`, 'warning', 'Suppression massive');
    }
  };

  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 shadow ${cardClass}`}>
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <button onClick={openNew} className="gradient-principal flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg hover:opacity-90">
          <Plus size={16} /> Ajouter
        </button>
        <button onClick={() => addDemoStudents(10)} className="flex items-center gap-2 rounded-xl bg-bleu-roi px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90">
          <UserPlus size={16} /> +10 Démo
        </button>
        <button onClick={() => addDemoStudents(50)} className="flex items-center gap-2 rounded-xl bg-fuchsia-fonce px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90">
          <Users size={16} /> +50 Démo
        </button>
        {students.length > 0 && (
          <button onClick={handleDeleteAll} className="flex items-center gap-2 rounded-xl bg-rouge-bdj/10 border border-rouge-bdj/30 px-3 py-2 text-sm font-medium text-rouge-bdj hover:bg-rouge-bdj/20">
            <Trash2 size={14} /> Tout suppr.
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">{filtered.length} élève(s) trouvé(s) sur {students.length}</p>

      {/* Students list */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((student, idx) => (
          <div
            key={student.id}
            className={`group rounded-2xl p-4 shadow transition-all hover:shadow-lg hover:scale-[1.01] ${cardClass}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-bdj to-fuchsia-bdj text-sm font-bold text-white shadow">
                {student.photo ? (
                  <img src={student.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  `${student.firstName[0] || ''}${student.lastName[0] || ''}`
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{idx + 1}. {student.lastName} {student.firstName}</p>
                <p className="text-xs text-gray-500">{student.className} • {student.gender === 'M' ? '♂' : '♀'}</p>
                {student.parentPhone && <p className="text-xs text-gray-400 mt-0.5">📞 {student.parentPhone}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(student)} className={`rounded-lg p-1.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`} title="Modifier">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(student.id)} className={`rounded-lg p-1.5 transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/40' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`} title="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Users size={48} className="text-rose-clair" />
          <p className="text-gray-500">Aucun élève pour le moment</p>
          <div className="flex gap-3">
            <button onClick={openNew} className="gradient-principal rounded-xl px-6 py-2 text-sm font-medium text-white shadow">
              Ajouter un élève
            </button>
            <button onClick={() => addDemoStudents(10)} className="rounded-xl bg-bleu-roi px-6 py-2 text-sm font-medium text-white shadow">
              +10 élèves démo 🇧🇯
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-fade-in-up max-h-[90vh] overflow-y-auto`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{students.find((s) => s.id === editing.id) ? 'Modifier' : 'Nouvel'} élève</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-bdj to-fuchsia-bdj text-white text-xl font-bold overflow-hidden">
                  {editing.photo ? <img src={editing.photo} alt="" className="h-full w-full object-cover" /> : '📷'}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="cursor-pointer rounded-lg border border-dashed border-rose-clair px-3 py-1.5 text-xs text-rose-bdj hover:bg-rose-pale">
                    Choisir photo
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  {editing.photo && (
                    <button
                      onClick={() => setEditing({ ...editing, photo: undefined })}
                      className="text-[10px] text-rouge-bdj hover:underline"
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nom *</label>
                  <input
                    value={editing.lastName}
                    onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Prénom *</label>
                  <input
                    value={editing.firstName}
                    onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Sexe</label>
                  <select
                    value={editing.gender}
                    onChange={(e) => setEditing({ ...editing, gender: e.target.value as 'M' | 'F' })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Date naiss.</label>
                  <input
                    type="date"
                    value={editing.dateOfBirth}
                    onChange={(e) => setEditing({ ...editing, dateOfBirth: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Classe</label>
                  <input
                    value={editing.className}
                    onChange={(e) => setEditing({ ...editing, className: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nom du parent</label>
                  <input
                    value={editing.parentName || ''}
                    onChange={(e) => setEditing({ ...editing, parentName: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Téléphone</label>
                  <input
                    value={editing.parentPhone || ''}
                    onChange={(e) => setEditing({ ...editing, parentPhone: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Matricule (optionnel)</label>
                <input
                  value={editing.matricule || ''}
                  onChange={(e) => setEditing({ ...editing, matricule: e.target.value })}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                Annuler
              </button>
              <button onClick={handleSave} className="flex-1 gradient-principal rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-90">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
