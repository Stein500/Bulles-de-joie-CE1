import React, { useState, useEffect } from 'react';
import { 
  Save, ChevronLeft, ChevronRight, Check, 
  AlertCircle, User, BookOpen, Calendar
} from 'lucide-react';
import { Student, Subject, Grade, SchoolPeriod } from '../types';
import { generateId } from '../db/database';
import { calculateSubjectAverage } from '../utils/helpers';

interface GradeEntryProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  periods: SchoolPeriod[];
  currentPeriod: SchoolPeriod | null;
  onSaveGrade: (grade: Grade) => void;
}

type EntryMode = 'by-student' | 'by-subject';

export const GradeEntry: React.FC<GradeEntryProps> = ({
  students,
  subjects,
  grades,
  periods,
  currentPeriod,
  onSaveGrade
}) => {
  const [mode, setMode] = useState<EntryMode>('by-student');
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(currentPeriod?.id || periods[0]?.id || '');
  const [gradeValues, setGradeValues] = useState<Record<string, { value: string; maxValue: string }>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, 'saved' | 'error' | null>>({});

  const activeStudents = students.filter(s => s.isActive);
  const activeSubjects = subjects.filter(s => s.isActive);
  const currentStudent = activeStudents[selectedStudentIndex];

  // Set default period on mount
  useEffect(() => {
    if (!selectedPeriodId && periods.length > 0) {
      const activePeriod = periods.find(p => p.isActive);
      setSelectedPeriodId(activePeriod?.id || periods[0].id);
    }
  }, [periods, selectedPeriodId]);

  // Load existing grades when student or period changes
  useEffect(() => {
    if (mode === 'by-student' && currentStudent && selectedPeriodId) {
      const newValues: Record<string, { value: string; maxValue: string }> = {};
      activeSubjects.forEach(subject => {
        const existingGrade = grades.find(
          g => g.studentId === currentStudent.id && 
               g.subjectId === subject.id && 
               g.periodId === selectedPeriodId
        );
        if (existingGrade) {
          newValues[subject.id] = { 
            value: existingGrade.value.toString(), 
            maxValue: existingGrade.maxValue.toString() 
          };
        } else {
          newValues[subject.id] = { value: '', maxValue: '20' };
        }
      });
      setGradeValues(newValues);
      setSaveStatus({});
    }
  }, [currentStudent?.id, selectedPeriodId, mode, grades, activeSubjects]);

  const handleGradeChange = (subjectId: string, field: 'value' | 'maxValue', val: string) => {
    setGradeValues(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId] || { value: '', maxValue: '20' },
        [field]: val
      }
    }));
    setSaveStatus(prev => ({ ...prev, [subjectId]: null }));
  };

  const handleSaveGrade = (subjectId: string) => {
    if (!currentStudent || !selectedPeriodId) return;

    const gradeData = gradeValues[subjectId];
    if (!gradeData || !gradeData.value) return;

    const value = parseFloat(gradeData.value);
    const maxValue = parseFloat(gradeData.maxValue) || 20;

    if (isNaN(value) || value < 0 || value > maxValue) {
      setSaveStatus(prev => ({ ...prev, [subjectId]: 'error' }));
      return;
    }

    const existingGrade = grades.find(
      g => g.studentId === currentStudent.id && 
           g.subjectId === subjectId && 
           g.periodId === selectedPeriodId
    );

    const grade: Grade = {
      id: existingGrade?.id || generateId(),
      studentId: currentStudent.id,
      subjectId,
      periodId: selectedPeriodId,
      value,
      maxValue,
      date: new Date().toISOString().split('T')[0],
      type: 'exam',
      comment: ''
    };

    onSaveGrade(grade);
    setSaveStatus(prev => ({ ...prev, [subjectId]: 'saved' }));
    
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [subjectId]: null }));
    }, 2000);
  };

  const handleQuickGrade = (subjectId: string, value: number) => {
    setGradeValues(prev => ({
      ...prev,
      [subjectId]: { value: value.toString(), maxValue: '20' }
    }));
    
    if (currentStudent && selectedPeriodId) {
      const existingGrade = grades.find(
        g => g.studentId === currentStudent.id && 
             g.subjectId === subjectId && 
             g.periodId === selectedPeriodId
      );

      const grade: Grade = {
        id: existingGrade?.id || generateId(),
        studentId: currentStudent.id,
        subjectId,
        periodId: selectedPeriodId,
        value,
        maxValue: 20,
        date: new Date().toISOString().split('T')[0],
        type: 'exam',
        comment: ''
      };

      onSaveGrade(grade);
      setSaveStatus(prev => ({ ...prev, [subjectId]: 'saved' }));
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [subjectId]: null }));
      }, 2000);
    }
  };

  const navigateStudent = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedStudentIndex > 0) {
      setSelectedStudentIndex(prev => prev - 1);
    } else if (direction === 'next' && selectedStudentIndex < activeStudents.length - 1) {
      setSelectedStudentIndex(prev => prev + 1);
    }
  };

  // By Subject Mode Component
  const renderBySubjectMode = () => {
    if (!selectedSubjectId) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeSubjects.map(subject => {
            const subjectGradesCount = grades.filter(
              g => g.subjectId === subject.id && g.periodId === selectedPeriodId
            ).length;
            
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className="p-6 rounded-2xl text-white font-semibold hover:scale-105 transition-transform shadow-lg relative"
                style={{ backgroundColor: subject.color }}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="truncate">{subject.name}</div>
                <p className="text-sm opacity-75 mt-1">Coef. {subject.coefficient}</p>
                {subjectGradesCount > 0 && (
                  <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                    {subjectGradesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    const subject = activeSubjects.find(s => s.id === selectedSubjectId);
    if (!subject) return null;

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-fuchsia-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour aux matières
        </button>

        <div 
          className="p-4 rounded-2xl text-white"
          style={{ backgroundColor: subject.color }}
        >
          <h3 className="text-xl font-bold">{subject.name}</h3>
          <p className="opacity-75">Coefficient {subject.coefficient}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-fuchsia-500 to-rose-500">
                <tr>
                  <th className="text-left p-4 font-semibold text-white">Élève</th>
                  <th className="text-center p-4 font-semibold text-white w-32">Note</th>
                  <th className="text-center p-4 font-semibold text-white w-24">/ sur</th>
                  <th className="text-center p-4 font-semibold text-white w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeStudents.map((student, idx) => {
                  const existingGrade = grades.find(
                    g => g.studentId === student.id && 
                         g.subjectId === selectedSubjectId && 
                         g.periodId === selectedPeriodId
                  );
                  const gradeKey = `${student.id}-${selectedSubjectId}`;
                  const localValue = gradeValues[gradeKey];
                  
                  return (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {student.photo ? (
                              <img src={student.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-fuchsia-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{student.lastName} {student.firstName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={localValue?.value ?? existingGrade?.value ?? ''}
                          onChange={e => {
                            setGradeValues(prev => ({
                              ...prev,
                              [gradeKey]: {
                                value: e.target.value,
                                maxValue: prev[gradeKey]?.maxValue || existingGrade?.maxValue?.toString() || '20'
                              }
                            }));
                          }}
                          className="w-full text-center px-3 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-lg font-bold"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="1"
                          value={localValue?.maxValue ?? existingGrade?.maxValue ?? 20}
                          onChange={e => {
                            setGradeValues(prev => ({
                              ...prev,
                              [gradeKey]: {
                                value: prev[gradeKey]?.value || existingGrade?.value?.toString() || '',
                                maxValue: e.target.value
                              }
                            }));
                          }}
                          className="w-full text-center px-3 py-2 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            const val = gradeValues[gradeKey] || { 
                              value: existingGrade?.value?.toString() || '', 
                              maxValue: existingGrade?.maxValue?.toString() || '20' 
                            };
                            if (val.value) {
                              const grade: Grade = {
                                id: existingGrade?.id || generateId(),
                                studentId: student.id,
                                subjectId: selectedSubjectId!,
                                periodId: selectedPeriodId,
                                value: parseFloat(val.value),
                                maxValue: parseFloat(val.maxValue) || 20,
                                date: new Date().toISOString().split('T')[0],
                                type: 'exam',
                                comment: ''
                              };
                              onSaveGrade(grade);
                            }
                          }}
                          className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Check if we have data to work with
  if (activeStudents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Saisie des Notes</h1>
          <p className="opacity-90">Interface optimisée pour une saisie rapide</p>
        </div>
        
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucun élève actif</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez des élèves dans "Gestion des Élèves" pour commencer la saisie</p>
        </div>
      </div>
    );
  }

  if (activeSubjects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Saisie des Notes</h1>
          <p className="opacity-90">Interface optimisée pour une saisie rapide</p>
        </div>
        
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucune matière configurée</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez des matières dans "Gestion des Matières" pour commencer</p>
        </div>
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Saisie des Notes</h1>
          <p className="opacity-90">Interface optimisée pour une saisie rapide</p>
        </div>
        
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucune période configurée</p>
          <p className="text-sm text-gray-400 mt-2">Configurez les périodes dans "Paramètres" pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Saisie des Notes</h1>
        <p className="opacity-90">Interface optimisée pour une saisie rapide</p>
      </div>

      {/* Period & Mode Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <select
            value={selectedPeriodId}
            onChange={e => setSelectedPeriodId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 bg-white font-medium"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>
                {period.customName} - {period.academicYear}
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 self-end">
          <button
            onClick={() => {
              setMode('by-student');
              setSelectedSubjectId(null);
            }}
            className={`px-6 py-3 font-medium transition-all ${
              mode === 'by-student' 
                ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Par élève
          </button>
          <button
            onClick={() => {
              setMode('by-subject');
              setSelectedSubjectId(null);
            }}
            className={`px-6 py-3 font-medium transition-all ${
              mode === 'by-subject' 
                ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Par matière
          </button>
        </div>
      </div>

      {mode === 'by-subject' ? (
        renderBySubjectMode()
      ) : (
        <>
          {/* Student Navigation */}
          {currentStudent && (
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateStudent('prev')}
                  disabled={selectedStudentIndex === 0}
                  className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-fuchsia-100 hover:to-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-lime-100 flex items-center justify-center overflow-hidden shadow-md">
                    {currentStudent.photo ? (
                      <img src={currentStudent.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-fuchsia-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {currentStudent.lastName.toUpperCase()} {currentStudent.firstName}
                    </h2>
                    <p className="text-gray-500">{currentStudent.className}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigateStudent('next')}
                  disabled={selectedStudentIndex === activeStudents.length - 1}
                  className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-fuchsia-100 hover:to-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-center mt-3 gap-1">
                {activeStudents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStudentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === selectedStudentIndex 
                        ? 'bg-fuchsia-500 w-6' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grade Entry Cards */}
          <div className="grid gap-4">
            {activeSubjects.map(subject => {
              const gradeData = gradeValues[subject.id] || { value: '', maxValue: '20' };
              const existingGrades = grades.filter(
                g => g.studentId === currentStudent?.id && 
                     g.subjectId === subject.id && 
                     g.periodId === selectedPeriodId
              );
              const currentAvg = calculateSubjectAverage(existingGrades);
              const status = saveStatus[subject.id];

              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-500">Coefficient {subject.coefficient}</p>
                    </div>
                    {currentAvg > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Moyenne</p>
                        <p className="text-lg font-bold text-fuchsia-600">{currentAvg.toFixed(1)}/20</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Grade Buttons - Mobile Optimized */}
                  <div className="grid grid-cols-7 sm:grid-cols-11 gap-1 mb-4">
                    {[0, 5, 8, 10, 12, 14, 16, 18, 20].map(i => (
                      <button
                        key={i}
                        onClick={() => handleQuickGrade(subject.id, i)}
                        className={`py-3 sm:py-2 rounded-lg text-sm font-bold transition-all touch-target ${
                          gradeData.value === i.toString()
                            ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white scale-105 shadow-md'
                            : i >= 16 ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : i >= 14 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : i >= 10 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>

                  {/* Manual Input */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Note"
                        value={gradeData.value}
                        onChange={e => handleGradeChange(subject.id, 'value', e.target.value)}
                        className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-xl font-bold"
                      />
                      <span className="text-gray-400 text-xl font-bold">/</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="20"
                        value={gradeData.maxValue}
                        onChange={e => handleGradeChange(subject.id, 'maxValue', e.target.value)}
                        className="w-20 text-center px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-xl"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleSaveGrade(subject.id)}
                      className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg ${
                        status === 'saved' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : status === 'error'
                          ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                          : 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:from-fuchsia-600 hover:to-rose-600'
                      }`}
                    >
                      {status === 'saved' ? (
                        <Check className="w-6 h-6" />
                      ) : status === 'error' ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <Save className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
