import React, { useState, useRef } from 'react';
import { 
  Download, Upload, FileJson, FileSpreadsheet, 
  AlertCircle, Check, Loader2, Database 
} from 'lucide-react';
import { AppData, SchoolPeriod } from '../types';
import { exportToJSON, exportToExcel, importFromJSON, exportGradesToExcel } from '../utils/exports';

interface ExportImportProps {
  data: AppData;
  periods: SchoolPeriod[];
  onImport: (data: AppData) => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ data, periods, onImport }) => {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportToJSON(data, `bulles-de-joie-backup-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportExcel = () => {
    exportToExcel(data, `bulles-de-joie-export-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportGrades = (periodId: string) => {
    const period = periods.find(p => p.id === periodId);
    if (period) {
      exportGradesToExcel(
        data.students,
        data.subjects,
        data.grades,
        periodId,
        period.customName.replace(/\s+/g, '_')
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      const importedData = await importFromJSON(file);
      
      // Validate data structure
      if (!importedData.students || !importedData.subjects || !importedData.grades || !importedData.settings) {
        throw new Error('Format de fichier invalide');
      }

      onImport(importedData);
      setImportStatus('success');
      setImportMessage(`✅ Import réussi : ${importedData.students.length} élèves, ${importedData.subjects.length} matières, ${importedData.grades.length} notes`);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Erreur lors de l\'import');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const stats = {
    students: data.students.length,
    subjects: data.subjects.length,
    grades: data.grades.length,
    periods: periods.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">📦 Export / Import</h1>
        <p className="opacity-90">Sauvegardez et restaurez vos données</p>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-fuchsia-500" />
          Résumé des données
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.students}</p>
            <p className="text-sm text-blue-800 font-medium">👥 Élèves</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.subjects}</p>
            <p className="text-sm text-green-800 font-medium">📚 Matières</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.grades}</p>
            <p className="text-sm text-purple-800 font-medium">📝 Notes</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.periods}</p>
            <p className="text-sm text-orange-800 font-medium">📅 Périodes</p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-fuchsia-500" />
          Exporter les données
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* JSON Backup */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-fuchsia-500 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-rose-50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-100 to-rose-100 flex items-center justify-center group-hover:from-fuchsia-200 group-hover:to-rose-200 transition-colors">
              <FileJson className="w-7 h-7 text-fuchsia-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">💾 Sauvegarde JSON</p>
              <p className="text-sm text-gray-500">Sauvegarde complète de toutes les données</p>
            </div>
          </button>

          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
              <FileSpreadsheet className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">📊 Export Excel</p>
              <p className="text-sm text-gray-500">Toutes les données en format Excel</p>
            </div>
          </button>
        </div>

        {/* Export Grades by Period */}
        {periods.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">📋 Exporter les notes par période :</p>
            <div className="flex flex-wrap gap-2">
              {periods.map(period => (
                <button
                  key={period.id}
                  onClick={() => handleExportGrades(period.id)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-fuchsia-100 hover:to-rose-100 rounded-xl text-sm font-medium text-gray-700 hover:text-fuchsia-700 transition-all"
                >
                  📊 {period.customName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-fuchsia-500" />
          Importer des données
        </h3>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-fuchsia-500 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-rose-50 transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {importing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin" />
              <p className="text-gray-600 font-medium">⏳ Import en cours...</p>
            </div>
          ) : (
            <>
              <FileJson className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-medium">
                📁 Glissez un fichier JSON ou cliquez pour sélectionner
              </p>
              <button
                onClick={handleImportClick}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Sélectionner un fichier
              </button>
            </>
          )}
        </div>

        {/* Import Status */}
        {importStatus && (
          <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
            importStatus === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200'
          }`}>
            {importStatus === 'success' ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium">{importMessage}</p>
          </div>
        )}

        {/* Warning */}
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl flex items-start gap-3 border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">⚠️ Attention</p>
            <p>L'import remplacera toutes les données existantes. Assurez-vous d'avoir une sauvegarde avant de procéder.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
