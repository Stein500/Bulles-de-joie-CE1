import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Save, 
  User, Phone, MapPin, Calendar, Camera, Upload 
} from 'lucide-react';
import { Student } from '../types';
import { generateId } from '../db/database';
import { fileToBase64, formatDate } from '../utils/helpers';

interface StudentManagerProps {
  students: Student[];
  onSave: (student: Student) => void;
  onDelete: (id: string) => void;
}

const defaultStudent: Omit<Student, 'id'> = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'M',
  className: '',
  photo: null,
  parentName: '',
  parentPhone: '',
  address: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  isActive: true
};

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onSave,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(defaultStudent);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData(defaultStudent);
    setShowModal(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, photo: base64 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      ...formData,
      id: editingStudent?.id || generateId()
    };
    onSave(student);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">👥 Gestion des Élèves</h1>
        <p className="opacity-90">{students.filter(s => s.isActive).length} élèves actifs</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter un élève
        </button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all ${
              !student.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                {student.photo ? (
                  <img src={student.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-fuchsia-400" />
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {student.lastName.toUpperCase()} {student.firstName}
                </h3>
                <p className="text-sm text-fuchsia-600 font-medium">{student.className}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full ${student.gender === 'M' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                  <span className="text-xs text-gray-400">
                    {formatDate(student.dateOfBirth, 'short')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleEdit(student)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(student.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            {student.parentPhone && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-fuchsia-400" />
                <span>{student.parentPhone}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucun élève trouvé</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez des élèves pour commencer</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingStudent ? '✏️ Modifier l\'élève' : '➕ Nouvel élève'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Photo Upload */}
              <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden shadow-lg">
                    {formData.photo ? (
                      <img src={formData.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-fuchsia-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    placeholder="DUPONT"
                  />
                </div>
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={e => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value as 'M' | 'F' }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  >
                    <option value="M">👦 Masculin</option>
                    <option value="F">👧 Féminin</option>
                  </select>
                </div>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CM2, 6ème A..."
                  value={formData.className}
                  onChange={e => setFormData(prev => ({ ...prev, className: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>

              {/* Parent Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Nom du parent
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={e => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    placeholder="M. Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={e => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 resize-none"
                  placeholder="123 rue de l'École, 75000 Paris"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">✅ Élève actif</label>
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
              Êtes-vous sûr de vouloir supprimer cet élève ? Cette action est irréversible et supprimera également toutes ses notes.
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
