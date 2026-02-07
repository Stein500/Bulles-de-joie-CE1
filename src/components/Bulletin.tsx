import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  Printer, Download, Settings2, User, 
  ChevronDown, FileText, Check, Eye
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { 
  Student, Subject, Grade, SchoolPeriod, 
  SchoolSettings, PrintSettings, BulletinData 
} from '../types';
import { 
  formatDate, getMention, calculateAverage, 
  calculateRanks, getSubjectsWithGrades, generateAppreciation 
} from '../utils/helpers';
import { generateBulletinPDF } from '../utils/exports';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface BulletinProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  periods: SchoolPeriod[];
  settings: SchoolSettings;
}

const defaultPrintSettings: PrintSettings = {
  fontSize: 10,
  compactMode: false,
  includeRadar: true,
  includeLogo: true,
  includeSignatures: true,
  includeStamp: true,
  colorMode: 'color'
};

export const Bulletin: React.FC<BulletinProps> = ({
  students,
  subjects,
  grades,
  periods,
  settings
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    periods.find(p => p.isActive)?.id || periods[0]?.id || ''
  );
  const [printSettings, setPrintSettings] = useState<PrintSettings>(defaultPrintSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const bulletinRef = useRef<HTMLDivElement>(null);

  const activeStudents = students.filter(s => s.isActive);
  const activeSubjects = subjects.filter(s => s.isActive);
  
  const selectedStudent = activeStudents.find(s => s.id === selectedStudentId);
  const selectedPeriod = periods.find(p => p.id === selectedPeriodId);

  // Calculate bulletin data
  const bulletinData = useMemo((): BulletinData | null => {
    if (!selectedStudent || !selectedPeriod) return null;

    const periodGrades = grades.filter(g => g.periodId === selectedPeriod.id);
    const studentGrades = periodGrades.filter(g => g.studentId === selectedStudent.id);
    
    const subjectsWithGrades = getSubjectsWithGrades(
      selectedStudent, 
      activeSubjects, 
      grades, 
      selectedPeriod.id,
      activeStudents
    );

    const generalAverage = calculateAverage(studentGrades, activeSubjects);
    const ranks = calculateRanks(activeStudents, grades, activeSubjects, selectedPeriod.id);
    const rank = ranks.get(selectedStudent.id) || 0;
    
    // Calculate class average
    let classTotal = 0;
    let classCount = 0;
    activeStudents.forEach(s => {
      const sGrades = periodGrades.filter(g => g.studentId === s.id);
      if (sGrades.length > 0) {
        classTotal += calculateAverage(sGrades, activeSubjects);
        classCount++;
      }
    });
    const classAverage = classCount > 0 ? classTotal / classCount : 0;

    return {
      student: selectedStudent,
      period: selectedPeriod,
      subjects: subjectsWithGrades,
      generalAverage,
      rank: `${rank}/${activeStudents.length}`,
      classAverage,
      appreciation: generateAppreciation(generalAverage, selectedStudent.firstName),
      schoolSettings: settings
    };
  }, [selectedStudent, selectedPeriod, grades, activeSubjects, activeStudents, settings]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!bulletinData) return null;

    const labels = bulletinData.subjects
      .filter(s => s.average > 0)
      .map(s => s.subject.name.length > 12 ? s.subject.name.substring(0, 10) + '...' : s.subject.name);
    const data = bulletinData.subjects.filter(s => s.average > 0).map(s => s.average);
    const classData = bulletinData.subjects.filter(s => s.average > 0).map(s => s.classAverage);

    if (data.length === 0) return null;

    return {
      labels,
      datasets: [
        {
          label: 'Élève',
          data,
          backgroundColor: 'rgba(255, 0, 255, 0.2)',
          borderColor: 'rgba(255, 0, 255, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 0, 255, 1)'
        },
        {
          label: 'Classe',
          data: classData,
          backgroundColor: 'rgba(204, 255, 0, 0.2)',
          borderColor: 'rgba(180, 220, 0, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(180, 220, 0, 1)'
        }
      ]
    };
  }, [bulletinData]);

  // Handle Print
  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    
    // Small delay to ensure state updates
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  }, []);

  // Handle Download PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!bulletinData) return;
    
    setIsDownloading(true);
    
    try {
      const doc = generateBulletinPDF(bulletinData, printSettings);
      const fileName = `Bulletin_${bulletinData.student.lastName}_${bulletinData.student.firstName}_${bulletinData.period.customName.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  }, [bulletinData, printSettings]);

  const globalMention = bulletinData ? getMention(bulletinData.generalAverage) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg no-print">
        <h1 className="text-2xl font-bold mb-2">Bulletin Scolaire</h1>
        <p className="opacity-90">Génération et impression des bulletins</p>
      </div>

      {/* Selection Controls */}
      <div className="flex flex-col md:flex-row gap-4 no-print">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
          <div className="relative">
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 appearance-none bg-white font-medium"
            >
              <option value="">-- Sélectionner un élève --</option>
              {activeStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.lastName.toUpperCase()} {student.firstName} - {student.className}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <div className="relative">
            <select
              value={selectedPeriodId}
              onChange={e => setSelectedPeriodId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 appearance-none bg-white font-medium"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.customName} - {period.academicYear}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {bulletinData && (
        <div className="flex flex-wrap gap-3 no-print">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Printer className="w-5 h-5" />
            )}
            {isPrinting ? 'Impression...' : 'Imprimer'}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? 'Génération...' : 'Télécharger PDF'}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              showSettings 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings2 className="w-5 h-5" />
            Options
          </button>
        </div>
      )}

      {/* Print Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-6 shadow-md no-print animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-fuchsia-500" />
            Options d'impression et PDF
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={printSettings.includeLogo}
                onChange={e => setPrintSettings(prev => ({ ...prev, includeLogo: e.target.checked }))}
                className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700">Inclure le logo</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={printSettings.includeSignatures}
                onChange={e => setPrintSettings(prev => ({ ...prev, includeSignatures: e.target.checked }))}
                className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700">Inclure les signatures</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={printSettings.includeStamp}
                onChange={e => setPrintSettings(prev => ({ ...prev, includeStamp: e.target.checked }))}
                className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700">Inclure le cachet</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={printSettings.includeRadar}
                onChange={e => setPrintSettings(prev => ({ ...prev, includeRadar: e.target.checked }))}
                className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700">Graphique radar (écran)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={printSettings.compactMode}
                onChange={e => setPrintSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700">Mode compact (1 page)</span>
            </label>
          </div>
        </div>
      )}

      {/* Bulletin Preview / Print Area */}
      {!selectedStudentId ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md no-print">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Sélectionnez un élève pour générer le bulletin</p>
          <p className="text-gray-400 text-sm mt-2">Choisissez un élève et une période ci-dessus</p>
        </div>
      ) : bulletinData && (
        <div 
          ref={bulletinRef}
          className={`bg-white rounded-2xl shadow-lg print:shadow-none print:rounded-none bulletin-container ${
            printSettings.compactMode ? 'compact-mode' : ''
          }`}
        >
          {/* Header */}
          <div className="border-b-4 border-fuchsia-500 p-6 print:p-4">
            <div className="flex items-start justify-between">
              {/* Logo */}
              <div className="w-20 h-20 print:w-16 print:h-16 flex-shrink-0">
                {printSettings.includeLogo && settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-white">BJ</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="text-center flex-1 px-4">
                <h1 className="text-2xl print:text-xl font-bold text-fuchsia-600">
                  {settings.schoolName.toUpperCase()}
                </h1>
                <h2 className="text-lg print:text-base font-semibold text-gray-700 mt-1">
                  BULLETIN SCOLAIRE OFFICIEL
                </h2>
                <p className="text-gray-600 mt-1 font-medium">
                  {bulletinData.period.customName} - {bulletinData.period.academicYear}
                </p>
              </div>

              {/* Stamp */}
              <div className="w-20 h-20 print:w-16 print:h-16 flex-shrink-0">
                {printSettings.includeStamp && settings.stamp ? (
                  <img src={settings.stamp} alt="Cachet" className="w-full h-full object-contain opacity-60" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="p-6 print:p-4 bg-gradient-to-r from-gray-50 to-fuchsia-50 print:bg-gray-100 border-b">
            <div className="flex items-center gap-6">
              {/* Photo */}
              <div className="w-20 h-24 print:w-16 print:h-20 rounded-lg bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-fuchsia-200 shadow-md">
                {bulletinData.student.photo ? (
                  <img src={bulletinData.student.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-fuchsia-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Nom et Prénom</p>
                  <p className="font-bold text-lg text-gray-800">
                    {bulletinData.student.lastName.toUpperCase()} {bulletinData.student.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Classe</p>
                  <p className="font-bold text-lg text-gray-800">{bulletinData.student.className}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date de naissance</p>
                  <p className="font-semibold text-gray-800">{formatDate(bulletinData.student.dateOfBirth, 'short')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Effectif de la classe</p>
                  <p className="font-semibold text-gray-800">{activeStudents.length} élèves</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <div className="p-6 print:p-4">
            <h3 className="font-bold text-gray-800 mb-4 text-center border-b-2 border-fuchsia-200 pb-2 text-lg">
              📚 RÉSULTATS SCOLAIRES
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white print:bg-gray-800">
                    <th className="p-3 print:p-2 text-left font-semibold border border-fuchsia-600 print:border-gray-700">MATIÈRE</th>
                    <th className="p-3 print:p-2 text-center font-semibold border border-fuchsia-600 print:border-gray-700 w-16">COEF</th>
                    <th className="p-3 print:p-2 text-center font-semibold border border-fuchsia-600 print:border-gray-700 w-24">NOTE/20</th>
                    <th className="p-3 print:p-2 text-center font-semibold border border-fuchsia-600 print:border-gray-700 w-24">MOY. CL.</th>
                    <th className="p-3 print:p-2 text-center font-semibold border border-fuchsia-600 print:border-gray-700 w-20">ÉCART</th>
                    <th className="p-3 print:p-2 text-center font-semibold border border-fuchsia-600 print:border-gray-700 w-32">MENTION</th>
                  </tr>
                </thead>
                <tbody>
                  {bulletinData.subjects.map((s, index) => {
                    const mention = getMention(s.average);
                    const ecart = s.average - s.classAverage;
                    
                    return (
                      <tr key={s.subject.id} className={index % 2 === 0 ? 'bg-gray-50 print:bg-white' : 'bg-white'}>
                        <td 
                          className="p-3 print:p-2 border border-gray-200 font-medium"
                          style={{ borderLeftColor: s.subject.color, borderLeftWidth: 4 }}
                        >
                          {s.subject.name}
                        </td>
                        <td className="p-3 print:p-2 text-center border border-gray-200 font-semibold">{s.subject.coefficient}</td>
                        <td className="p-3 print:p-2 text-center border border-gray-200 font-bold text-lg">
                          {s.average > 0 ? s.average.toFixed(1) : '-'}
                        </td>
                        <td className="p-3 print:p-2 text-center border border-gray-200 text-gray-600">
                          {s.classAverage > 0 ? s.classAverage.toFixed(1) : '-'}
                        </td>
                        <td className={`p-3 print:p-2 text-center border border-gray-200 font-semibold ${
                          s.average > 0 ? (ecart > 0 ? 'text-green-600' : ecart < 0 ? 'text-red-600' : 'text-gray-600') : 'text-gray-400'
                        }`}>
                          {s.average > 0 ? (ecart > 0 ? '+' : '') + ecart.toFixed(1) : '-'}
                        </td>
                        <td className="p-3 print:p-2 text-center border border-gray-200">
                          {s.average > 0 ? (
                            <span className={`inline-flex items-center gap-1 text-sm ${mention.color}`}>
                              {mention.emoji} {mention.text}
                            </span>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mx-6 print:mx-4 mb-6 p-4 bg-gradient-to-r from-fuchsia-100 via-rose-100 to-lime-100 rounded-xl print:border-2 print:border-gray-800 shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-center flex-1 min-w-[120px]">
                <p className="text-sm text-gray-600 font-medium">MOYENNE GÉNÉRALE</p>
                <p className="text-3xl print:text-2xl font-bold text-fuchsia-600">
                  {bulletinData.generalAverage.toFixed(2)}<span className="text-lg">/20</span>
                </p>
              </div>
              <div className="text-center flex-1 min-w-[80px]">
                <p className="text-sm text-gray-600 font-medium">RANG</p>
                <p className="text-3xl print:text-2xl font-bold text-gray-800">
                  {bulletinData.rank}
                </p>
              </div>
              <div className="text-center flex-1 min-w-[120px]">
                <p className="text-sm text-gray-600 font-medium">MOY. CLASSE</p>
                <p className="text-3xl print:text-2xl font-bold text-gray-600">
                  {bulletinData.classAverage.toFixed(2)}<span className="text-lg">/20</span>
                </p>
              </div>
              <div className="text-center flex-1 min-w-[120px]">
                <p className="text-sm text-gray-600 font-medium">MENTION</p>
                <p className={`text-xl font-bold ${globalMention?.color}`}>
                  {globalMention?.emoji} {globalMention?.text}
                </p>
              </div>
            </div>
          </div>

          {/* Radar Chart - Screen Only */}
          {printSettings.includeRadar && radarData && (
            <div className="px-6 print:hidden mb-6 no-print">
              <div className="max-w-md mx-auto bg-white rounded-xl p-4 shadow-inner">
                <h4 className="text-center font-semibold text-gray-700 mb-2">📊 Profil de compétences</h4>
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: { stepSize: 5, font: { size: 10 } },
                        pointLabels: { font: { size: 11 } }
                      }
                    },
                    plugins: {
                      legend: { 
                        position: 'bottom',
                        labels: { font: { size: 12 } }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Appreciation */}
          <div className="mx-6 print:mx-4 mb-6 p-4 border-2 border-fuchsia-200 rounded-xl bg-white">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              💬 APPRÉCIATION GÉNÉRALE
            </h4>
            <p className="text-gray-700 leading-relaxed italic">{bulletinData.appreciation}</p>
          </div>

          {/* Signatures */}
          {printSettings.includeSignatures && (
            <div className="px-6 print:px-4 pb-6 print:pb-4">
              <div className="border-t-2 border-gray-200 pt-6 grid grid-cols-3 gap-4 text-center">
                {/* Teacher */}
                <div>
                  <p className="font-semibold text-gray-700 mb-2">L'Enseignant(e)</p>
                  <p className="text-sm text-gray-500 mb-2">{settings.teacherName || '_______________'}</p>
                  <div className="h-16 flex items-center justify-center">
                    {settings.teacherSignature ? (
                      <img src={settings.teacherSignature} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-gray-300 text-sm border-b-2 border-dotted border-gray-300 w-24">&nbsp;</div>
                    )}
                  </div>
                </div>

                {/* Stamp */}
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Cachet de l'école</p>
                  <div className="h-20 flex items-center justify-center">
                    {settings.stamp ? (
                      <img src={settings.stamp} alt="Cachet" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Director */}
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Le Directeur/La Directrice</p>
                  <p className="text-sm text-gray-500 mb-2">{settings.directorName || '_______________'}</p>
                  <div className="h-16 flex items-center justify-center">
                    {settings.directorSignature ? (
                      <img src={settings.directorSignature} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-gray-300 text-sm border-b-2 border-dotted border-gray-300 w-24">&nbsp;</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 print:px-4 pb-4 text-center text-sm text-gray-400 border-t pt-4">
            <p>📅 Édité le {formatDate(new Date().toISOString(), 'full')} | {settings.schoolName}</p>
          </div>
        </div>
      )}
    </div>
  );
};
