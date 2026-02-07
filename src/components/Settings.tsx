import React, { useState } from 'react';
import { 
  Save, Upload, Image, Pen, Trash2, Plus, 
  Calendar, Building2, Phone, Mail, User, Check
} from 'lucide-react';
import { SchoolSettings, SchoolPeriod, PeriodType } from '../types';
import { fileToBase64, getOrdinal } from '../utils/helpers';

interface SettingsProps {
  settings: SchoolSettings;
  onSave: (settings: SchoolSettings) => void;
}

const periodTypes: { value: PeriodType; label: string; count: number }[] = [
  { value: 'trimestre', label: 'Trimestres', count: 3 },
  { value: 'semestre', label: 'Semestres', count: 2 },
  { value: 'quadrimestre', label: 'Quadrimestres', count: 3 },
  { value: 'annuel', label: 'Annuel', count: 1 },
  { value: 'custom', label: 'Personnalisé', count: 0 }
];

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [activeTab, setActiveTab] = useState<'school' | 'periods' | 'assets'>('school');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'stamp' | 'directorSignature' | 'teacherSignature'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    }
  };

  const handlePeriodTypeChange = (type: PeriodType) => {
    const typeConfig = periodTypes.find(t => t.value === type);
    if (!typeConfig) return;

    let newPeriods: SchoolPeriod[];
    
    if (type === 'custom') {
      newPeriods = formData.periodSettings.customPeriods;
    } else {
      const year = formData.academicYear;
      const [startYear, endYear] = year.split('-').map(Number);
      
      const typeLabels: Record<string, string> = {
        trimestre: 'Trimestre',
        semestre: 'Semestre',
        quadrimestre: 'Quadrimestre',
        annuel: 'Année'
      };
      
      newPeriods = Array.from({ length: typeConfig.count }, (_, i) => ({
        id: `period-${i + 1}`,
        order: i + 1,
        name: `${getOrdinal(i + 1)} ${typeLabels[type]}`,
        customName: `${getOrdinal(i + 1)} ${typeLabels[type]}`,
        type,
        startDate: i === 0 ? `${startYear}-09-01` : '',
        endDate: i === typeConfig.count - 1 ? `${endYear}-06-30` : '',
        academicYear: year,
        isActive: i === 0,
        displayFormat: '{type} {numero} - {annee}'
      }));
    }

    setFormData(prev => ({
      ...prev,
      periodSettings: {
        ...prev.periodSettings,
        periodType: type,
        numberOfPeriods: typeConfig.count,
        customPeriods: newPeriods
      }
    }));
  };

  const handleAddPeriod = () => {
    const newPeriod: SchoolPeriod = {
      id: `period-${Date.now()}`,
      order: formData.periodSettings.customPeriods.length + 1,
      name: 'Nouvelle période',
      customName: 'Nouvelle période',
      type: 'custom',
      startDate: '',
      endDate: '',
      academicYear: formData.academicYear,
      isActive: false,
      displayFormat: '{type} {numero} - {annee}'
    };
    
    setFormData(prev => ({
      ...prev,
      periodSettings: {
        ...prev.periodSettings,
        customPeriods: [...prev.periodSettings.customPeriods, newPeriod]
      }
    }));
  };

  const handleUpdatePeriod = (periodId: string, updates: Partial<SchoolPeriod>) => {
    setFormData(prev => ({
      ...prev,
      periodSettings: {
        ...prev.periodSettings,
        customPeriods: prev.periodSettings.customPeriods.map(p =>
          p.id === periodId ? { ...p, ...updates } : p
        )
      }
    }));
  };

  const handleDeletePeriod = (periodId: string) => {
    setFormData(prev => ({
      ...prev,
      periodSettings: {
        ...prev.periodSettings,
        customPeriods: prev.periodSettings.customPeriods.filter(p => p.id !== periodId)
      }
    }));
  };

  const handleSetActivePeriod = (periodId: string) => {
    setFormData(prev => ({
      ...prev,
      periodSettings: {
        ...prev.periodSettings,
        customPeriods: prev.periodSettings.customPeriods.map(p => ({
          ...p,
          isActive: p.id === periodId
        }))
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">⚙️ Paramètres</h1>
        <p className="opacity-90">Configuration de l'école et des périodes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'school', label: 'École', icon: Building2 },
          { id: 'periods', label: 'Périodes', icon: Calendar },
          { id: 'assets', label: 'Logo & Signatures', icon: Image }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* School Info Tab */}
      {activeTab === 'school' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
          <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-fuchsia-500" />
            Informations de l'école
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'école *
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={e => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Les Bulles de Joie"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Année scolaire
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="2026-2027"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <textarea
                value={formData.schoolAddress}
                onChange={e => setFormData(prev => ({ ...prev, schoolAddress: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 resize-none"
                placeholder="123 Rue de l'École, 75000 Paris"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.schoolPhone}
                onChange={e => setFormData(prev => ({ ...prev, schoolPhone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.schoolEmail}
                onChange={e => setFormData(prev => ({ ...prev, schoolEmail: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="contact@bullesdejoie.fr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nom du directeur/directrice
              </label>
              <input
                type="text"
                value={formData.directorName}
                onChange={e => setFormData(prev => ({ ...prev, directorName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Mme Marie DUPONT"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nom de l'enseignant(e)
              </label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={e => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="M. Jean MARTIN"
              />
            </div>
          </div>
        </div>
      )}

      {/* Periods Tab */}
      {activeTab === 'periods' && (
        <div className="space-y-6">
          {/* Period Type Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-fuchsia-500" />
              Type de découpage
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {periodTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handlePeriodTypeChange(type.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.periodSettings.periodType === type.value
                      ? 'border-fuchsia-500 bg-gradient-to-br from-fuchsia-50 to-rose-50 text-fuchsia-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold">{type.label}</p>
                  {type.count > 0 && (
                    <p className="text-sm text-gray-500">{type.count} période(s)</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Periods List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">📅 Périodes configurées</h3>
              <button
                onClick={handleAddPeriod}
                className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {formData.periodSettings.customPeriods.map((period, index) => (
                <div
                  key={period.id}
                  className={`p-4 rounded-xl border-2 ${
                    period.isActive ? 'border-fuchsia-500 bg-gradient-to-r from-fuchsia-50 to-rose-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white flex items-center justify-center font-bold shadow-md">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 grid md:grid-cols-4 gap-3 min-w-0">
                      <input
                        type="text"
                        value={period.customName}
                        onChange={e => handleUpdatePeriod(period.id, { customName: e.target.value, name: e.target.value })}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        placeholder="Nom de la période"
                      />
                      
                      <input
                        type="date"
                        value={period.startDate}
                        onChange={e => handleUpdatePeriod(period.id, { startDate: e.target.value })}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      />
                      
                      <input
                        type="date"
                        value={period.endDate}
                        onChange={e => handleUpdatePeriod(period.id, { endDate: e.target.value })}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      />
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetActivePeriod(period.id)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                            period.isActive
                              ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {period.isActive ? '✓ Active' : 'Activer'}
                        </button>
                        
                        <button
                          onClick={() => handleDeletePeriod(period.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.periodSettings.customPeriods.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune période configurée</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-fuchsia-500" />
              Logo de l'école
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden mb-4 border-2 border-dashed border-fuchsia-300 shadow-inner">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Image className="w-12 h-12 text-fuchsia-300" />
                )}
              </div>
              
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                  <Upload className="w-4 h-4" />
                  Choisir
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                </label>
                
                {formData.logo && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                PNG ou SVG recommandé<br />Max 300x300px
              </p>
            </div>
          </div>

          {/* Stamp */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-fuchsia-500" />
              Cachet officiel
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden mb-4 border-2 border-dashed border-fuchsia-300 shadow-inner">
                {formData.stamp ? (
                  <img src={formData.stamp} alt="Cachet" className="w-full h-full object-contain" />
                ) : (
                  <Check className="w-12 h-12 text-fuchsia-300" />
                )}
              </div>
              
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                  <Upload className="w-4 h-4" />
                  Choisir
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'stamp')}
                    className="hidden"
                  />
                </label>
                
                {formData.stamp && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, stamp: null }))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                PNG avec transparence recommandé
              </p>
            </div>
          </div>

          {/* Teacher Signature */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Pen className="w-5 h-5 text-fuchsia-500" />
              Signature de l'enseignant(e)
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-24 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-4 border-2 border-dashed border-gray-300">
                {formData.teacherSignature ? (
                  <img src={formData.teacherSignature} alt="Signature" className="max-w-full max-h-full object-contain" />
                ) : (
                  <Pen className="w-8 h-8 text-gray-300" />
                )}
              </div>
              
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                  <Upload className="w-4 h-4" />
                  Importer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'teacherSignature')}
                    className="hidden"
                  />
                </label>
                
                {formData.teacherSignature && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, teacherSignature: null }))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Director Signature */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Pen className="w-5 h-5 text-fuchsia-500" />
              Signature du directeur/directrice
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-24 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-4 border-2 border-dashed border-gray-300">
                {formData.directorSignature ? (
                  <img src={formData.directorSignature} alt="Signature" className="max-w-full max-h-full object-contain" />
                ) : (
                  <Pen className="w-8 h-8 text-gray-300" />
                )}
              </div>
              
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                  <Upload className="w-4 h-4" />
                  Importer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'directorSignature')}
                    className="hidden"
                  />
                </label>
                
                {formData.directorSignature && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, directorSignature: null }))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            saved
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:shadow-2xl'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-6 h-6" />
              ✅ Enregistré !
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              💾 Enregistrer les paramètres
            </>
          )}
        </button>
      </div>
    </div>
  );
};
