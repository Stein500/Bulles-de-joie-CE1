import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, BookOpen, Palette } from 'lucide-react';
import { Subject } from '../types';
import { generateId } from '../db/database';

interface SubjectManagerProps {
  subjects: Subject[];
  onSave: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

const defaultSubject: Omit<Subject, 'id'> = {
  name: '',
  coefficient: 1,
  color: '#FF00FF',
  category: 'Général',
  isActive: true
};

const colorPresets = [
  '#FF00FF', '#CCFF00', '#3B82F6', '#EF4444', '#10B981',
  '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const categories = ['Langues', 'Sciences', 'Humanités', 'Arts', 'Sports', 'Général'];

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  onSave,
  onDelete
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<Omit<Subject, 'id'>>(defaultSubject);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingSubject(null);
    setFormData(defaultSubject);
    setShowModal(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData(subject);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject: Subject = {
      ...formData,
      id: editingSubject?.id || generateId()
    };
    onSave(subject);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  // Group subjects by category
  const groupedSubjects = subjects.reduce((acc, subject) => {
    const cat = subject.category || 'Général';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">📚 Gestion des Matières</h1>
        <p className="opacity-90">{subjects.filter(s => s.isActive).length} matières actives</p>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all w-full sm:w-auto"
      >
        <Plus className="w-5 h-5" />
        Ajouter une matière
      </button>

      {/* Subjects by Category */}
      {Object.entries(groupedSubjects).map(([category, categorySubjects]) => (
        <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-fuchsia-500" />
            {category}
            <span className="text-sm text-gray-400 font-normal">({categorySubjects.length})</span>
          </h3>
          
          <div className="grid gap-3">
            {categorySubjects.map(subject => (
              <div
                key={subject.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  subject.isActive 
                    ? 'border-transparent bg-gradient-to-r from-gray-50 to-fuchsia-50' 
                    : 'border-dashed border-gray-200 opacity-60'
                }`}
              >
                {/* Color Indicator */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                  style={{ backgroundColor: subject.color }}
                >
                  {subject.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">
                      Coefficient: <strong className="text-fuchsia-600">{subject.coefficient}</strong>
                    </span>
                    {!subject.isActive && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(subject.id)}
                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {subjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucune matière configurée</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez des matières pour commencer</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingSubject ? '✏️ Modifier la matière' : '➕ Nouvelle matière'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la matière *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Mathématiques, Français..."
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>

              {/* Coefficient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coefficient *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(coef => (
                    <button
                      key={coef}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coefficient: coef }))}
                      className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                        formData.coefficient === coef
                          ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {coef}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Couleur
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-xl transition-all shadow-md ${
                        formData.color === color ? 'ring-4 ring-offset-2 ring-fuchsia-500 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded-xl cursor-pointer border-2 border-gray-200"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="subjectActive"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
                />
                <label htmlFor="subjectActive" className="text-sm text-gray-700 font-medium">✅ Matière active</label>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-gray-50 to-fuchsia-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">👁️ Aperçu</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{formData.name || 'Nom de la matière'}</p>
                    <p className="text-sm text-gray-500">Coefficient {formData.coefficient}</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-2">⚠️ Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette matière ? Toutes les notes associées seront également supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium hover:shadow-lg transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
