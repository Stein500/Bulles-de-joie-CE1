import { useState } from 'react';
import { useStore, defaultSubjects, defaultCategories } from '../stores/useStore';
import { uid } from '../lib/helpers';
import { Plus, Trash2, Edit3, X, BookOpen, RotateCcw, Check, FolderPlus, Tag } from 'lucide-react';
import type { Subject } from '../stores/useStore';

const subjectColors = ['#4169E1', '#DC143C', '#28A745', '#FF8C00', '#9B59B6', '#1ABC9C', '#E74C3C', '#FF69B4', '#2ECC71', '#3498DB', '#F39C12', '#8E44AD'];

export function SubjectManager() {
  const {
    subjects, addSubject, updateSubject, deleteSubject, setSubjects,
    addToast, darkMode, periods, categories, addCategory, renameCategory,
    deleteCategory, setCategories,
  } = useStore();
  const [editing, setEditing] = useState<Subject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'subjects' | 'periods' | 'categories'>('subjects');

  // Category editing
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // Icon button classes — ALWAYS VISIBLE with proper contrast
  const iconEdit = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`;
  const iconDelete = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/40' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`;

  const openNew = () => {
    setEditing({
      id: uid(),
      name: '',
      coefficient: 2,
      color: subjectColors[subjects.length % subjectColors.length],
      category: categories[0] || 'Autre',
    });
    setShowForm(true);
  };

  const openEdit = (s: Subject) => {
    setEditing({ ...s });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) {
      addToast('Nom de matière obligatoire', 'error');
      return;
    }
    const exists = subjects.find((s) => s.id === editing.id);
    if (exists) {
      updateSubject(editing.id, editing);
      addToast('Matière modifiée ✓', 'success');
    } else {
      addSubject(editing);
      addToast('Matière ajoutée ✓', 'success');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette matière et toutes les notes associées ?')) {
      deleteSubject(id);
      addToast('Matière supprimée', 'info');
    }
  };

  const handleDeleteAll = () => {
    if (confirm(`Supprimer les ${subjects.length} matières et toutes les notes ?`)) {
      setSubjects([]);
      useStore.getState().setGrades([]);
      addToast('Toutes les matières supprimées', 'info');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Remplacer toutes les matières par les valeurs par défaut ?')) {
      setSubjects([...defaultSubjects]);
      addToast('Matières réinitialisées ✓', 'success');
    }
  };

  const grouped = categories.map((cat) => ({
    category: cat,
    items: subjects.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  // Also show uncategorized
  const uncategorized = subjects.filter((s) => !categories.includes(s.category));

  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const inputClass = darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200';

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab('subjects')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === 'subjects' ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow'}`}
        >
          📚 Matières ({subjects.length})
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === 'categories' ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow'}`}
        >
          🏷️ Catégories ({categories.length})
        </button>
        <button
          onClick={() => setTab('periods')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === 'periods' ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow'}`}
        >
          📅 Périodes ({periods.length})
        </button>
      </div>

      {tab === 'subjects' && (
        <>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button onClick={handleResetDefaults} className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <RotateCcw size={14} /> Défaut
            </button>
            {subjects.length > 0 && (
              <button onClick={handleDeleteAll} className="flex items-center gap-1 rounded-xl bg-rouge-bdj/10 border border-rouge-bdj/30 px-3 py-2 text-xs font-medium text-rouge-bdj hover:bg-rouge-bdj/20">
                <Trash2 size={14} /> Tout supprimer
              </button>
            )}
            <button onClick={openNew} className="gradient-principal flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Plus size={16} /> Ajouter une matière
            </button>
          </div>

          {grouped.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">{group.category}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((sub) => (
                  <div key={sub.id} className={`flex items-center gap-3 rounded-2xl p-4 shadow transition hover:shadow-lg ${cardClass}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shadow" style={{ background: sub.color }}>
                      {sub.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold">{sub.name}</p>
                      <p className="text-xs text-gray-500">Coef. {sub.coefficient} • {sub.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(sub)} className={iconEdit} title="Modifier"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(sub.id)} className={iconDelete} title="Supprimer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Non catégorisé</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {uncategorized.map((sub) => (
                  <div key={sub.id} className={`flex items-center gap-3 rounded-2xl p-4 shadow transition hover:shadow-lg ${cardClass}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shadow" style={{ background: sub.color }}>
                      {sub.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold">{sub.name}</p>
                      <p className="text-xs text-gray-500">Coef. {sub.coefficient}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(sub)} className={iconEdit} title="Modifier"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(sub.id)} className={iconDelete} title="Supprimer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subjects.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-20">
              <BookOpen size={48} className="text-rose-clair" />
              <p className="text-gray-500">Aucune matière configurée</p>
              <div className="flex gap-3">
                <button onClick={openNew} className="gradient-principal rounded-xl px-6 py-2 text-sm font-medium text-white shadow">
                  Ajouter une matière
                </button>
                <button onClick={handleResetDefaults} className="rounded-xl bg-bleu-roi px-6 py-2 text-sm font-medium text-white shadow">
                  Charger les défauts
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={() => { setCategories([...defaultCategories]); addToast('Catégories réinitialisées ✓', 'success'); }}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <RotateCcw size={14} /> Défaut
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Gérez les catégories de matières. Renommer une catégorie met à jour automatiquement toutes les matières associées. Supprimer une catégorie déplace ses matières dans « Autre ».
          </p>

          {/* Add new category */}
          <div className={`flex items-center gap-3 rounded-2xl p-4 shadow ${cardClass}`}>
            <FolderPlus size={20} className="text-rose-bdj shrink-0" />
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nouvelle catégorie..."
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${inputClass}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCatName.trim()) {
                  addCategory(newCatName.trim());
                  addToast(`Catégorie « ${newCatName.trim()} » ajoutée ✓`, 'success');
                  setNewCatName('');
                }
              }}
            />
            <button
              onClick={() => {
                if (newCatName.trim()) {
                  addCategory(newCatName.trim());
                  addToast(`Catégorie « ${newCatName.trim()} » ajoutée ✓`, 'success');
                  setNewCatName('');
                }
              }}
              disabled={!newCatName.trim()}
              className="gradient-principal rounded-xl px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            {categories.map((cat) => {
              const subCount = subjects.filter((s) => s.category === cat).length;
              const isEditing = editingCat === cat;

              return (
                <div
                  key={cat}
                  className={`flex items-center gap-3 rounded-xl p-3 transition ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-rose-pale/50'}`}
                >
                  <Tag size={16} className="text-rose-bdj shrink-0" />
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className={`flex-1 rounded-lg border px-3 py-1 text-sm ${inputClass}`}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editCatName.trim()) {
                            renameCategory(cat, editCatName.trim());
                            addToast(`Catégorie renommée en « ${editCatName.trim()} » ✓`, 'success');
                            setEditingCat(null);
                          }
                          if (e.key === 'Escape') setEditingCat(null);
                        }}
                      />
                      <button
                        onClick={() => {
                          if (editCatName.trim()) {
                            renameCategory(cat, editCatName.trim());
                            addToast(`Catégorie renommée ✓`, 'success');
                            setEditingCat(null);
                          }
                        }}
                        className="text-green-500 hover:text-green-400 p-1"
                      >
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingCat(null)} className="text-red-500 hover:text-red-400 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{cat}</p>
                        <p className="text-xs text-gray-500">{subCount} matière(s)</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingCat(cat); setEditCatName(cat); }}
                          className={iconEdit}
                          title="Renommer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer la catégorie « ${cat} » ? Les matières seront déplacées dans « Autre ».`)) {
                              deleteCategory(cat);
                              addToast(`Catégorie « ${cat} » supprimée ✓`, 'info');
                            }
                          }}
                          className={iconDelete}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucune catégorie. Ajoutez-en ou restaurez les valeurs par défaut.
            </div>
          )}
        </div>
      )}

      {tab === 'periods' && <PeriodsTab />}

      {/* Subject Form Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{subjects.find((s) => s.id === editing.id) ? 'Modifier' : 'Nouvelle'} matière</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nom de la matière *</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Coefficient</label>
                  <input
                    type="number"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={editing.coefficient}
                    onChange={(e) => setEditing({ ...editing, coefficient: parseFloat(e.target.value) || 1 })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Catégorie</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    {!categories.includes(editing.category) && (
                      <option value={editing.category}>{editing.category}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Couleur</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subjectColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditing({ ...editing, color: c })}
                      className={`h-8 w-8 rounded-full transition ${editing.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                      style={{ background: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded-full border-0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Annuler</button>
              <button onClick={handleSave} className="flex-1 gradient-principal rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PeriodsTab() {
  const { periods, addPeriod, updatePeriod, deletePeriod, addToast, darkMode } = useStore();
  const [editingPeriod, setEditingPeriod] = useState<{ id: string; name: string; type: 'trimestre' | 'semestre' | 'custom'; startDate: string; endDate: string } | null>(null);

  const iconEdit = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`;
  const iconDelete = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/40' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`;

  const handleSavePeriod = () => {
    if (!editingPeriod || !editingPeriod.name.trim()) return;
    const exists = periods.find((p) => p.id === editingPeriod.id);
    if (exists) {
      updatePeriod(editingPeriod.id, editingPeriod);
      addToast('Période modifiée ✓', 'success');
    } else {
      addPeriod(editingPeriod);
      addToast('Période ajoutée ✓', 'success');
    }
    setEditingPeriod(null);
  };

  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const inputClass = darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditingPeriod({ id: uid(), name: '', type: 'trimestre', startDate: '', endDate: '' })}
          className="gradient-principal flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <Plus size={16} /> Ajouter une période
        </button>
      </div>

      <div className="space-y-3">
        {periods.map((period) => (
          <div key={period.id} className={`flex items-center gap-4 rounded-2xl p-4 shadow ${cardClass}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-bleu-roi to-bleu-clair text-sm font-bold text-white shadow">
              📅
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{period.name}</p>
              <p className="text-xs text-gray-500">{period.type} • {period.startDate} → {period.endDate}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditingPeriod({ ...period })} className={iconEdit} title="Modifier"><Edit3 size={14} /></button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer « ${period.name} » et toutes les notes associées ?`)) {
                    deletePeriod(period.id);
                    addToast('Période supprimée', 'info');
                  }
                }}
                className={iconDelete}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {periods.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-gray-500">Aucune période scolaire</p>
          <button
            onClick={() => setEditingPeriod({ id: uid(), name: 'Trimestre 1', type: 'trimestre', startDate: '', endDate: '' })}
            className="gradient-principal rounded-xl px-6 py-2 text-sm font-medium text-white shadow"
          >
            Ajouter une période
          </button>
        </div>
      )}

      {editingPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{periods.find((p) => p.id === editingPeriod.id) ? 'Modifier la' : 'Nouvelle'} période</h3>
              <button onClick={() => setEditingPeriod(null)} className="rounded-lg p-1 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nom *</label>
                <input
                  value={editingPeriod.name}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
                  placeholder="Nom de la période"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Type</label>
                <select
                  value={editingPeriod.type}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, type: e.target.value as 'trimestre' | 'semestre' | 'custom' })}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`}
                >
                  <option value="trimestre">Trimestre</option>
                  <option value="semestre">Semestre</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Date début</label>
                  <input type="date" value={editingPeriod.startDate} onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Date fin</label>
                  <input type="date" value={editingPeriod.endDate} onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })} className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputClass}`} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setEditingPeriod(null)} className={`flex-1 rounded-xl px-4 py-2.5 text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Annuler</button>
              <button onClick={handleSavePeriod} className="flex-1 gradient-principal rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
