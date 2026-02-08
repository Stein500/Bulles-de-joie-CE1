import { useState, useMemo, useCallback, useRef } from 'react';
import { useStore } from '../stores/useStore';
import { uid, getStudentAverage, getRanks, getMention, getSubjectClassAverage } from '../lib/helpers';
import { Search, Calculator, Clipboard, Download, Trash2, Edit3, Check, X, Plus, UserPlus } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function GradeEntry() {
  const {
    students, subjects, grades, periods, activePeriodId,
    setGrade, bulkSetGrades, addToast, darkMode, setActivePeriod,
    settings, mentionRules, updateStudent, deleteStudent,
    updateSubject, addStudent,
  } = useStore();
  const showRanks = settings.showRanks;
  const noteMin = settings.noteMin;
  const noteMax = settings.noteMax;
  const noteDP = settings.noteDecimalPlaces;
  const [search, setSearch] = useState('');
  const [showNumpad, setShowNumpad] = useState(false);
  const [activeCell, setActiveCell] = useState<{ studentId: string; subjectId: string } | null>(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectCoef, setEditSubjectCoef] = useState(1);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickFirstName, setQuickFirstName] = useState('');
  const [quickLastName, setQuickLastName] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const sortedStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students
      .filter((s) => `${s.lastName} ${s.firstName}`.toLowerCase().includes(q))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [students, search]);

  const ranks = useMemo(() => getRanks(students, activePeriodId, grades, subjects), [students, activePeriodId, grades, subjects]);

  const getGradeValue = useCallback(
    (studentId: string, subjectId: string): string => {
      const g = grades.find((g) => g.studentId === studentId && g.subjectId === subjectId && g.periodId === activePeriodId);
      return g?.value !== null && g?.value !== undefined ? String(g.value) : '';
    },
    [grades, activePeriodId]
  );

  const handleGradeChange = useCallback(
    (studentId: string, subjectId: string, value: string) => {
      if (value === '') {
        setGrade({ studentId, subjectId, periodId: activePeriodId, value: null });
        return;
      }
      const num = parseFloat(value.replace(',', '.'));
      if (!isNaN(num) && num >= noteMin && num <= noteMax) {
        setGrade({ studentId, subjectId, periodId: activePeriodId, value: num });
      }
    },
    [activePeriodId, setGrade, noteMin, noteMax]
  );

  const handleClearGrade = useCallback(
    (studentId: string, subjectId: string) => {
      setGrade({ studentId, subjectId, periodId: activePeriodId, value: null });
      addToast('Note supprimée ✓', 'info');
    },
    [activePeriodId, setGrade, addToast]
  );

  const handleClearAllStudentGrades = useCallback(
    (studentId: string) => {
      if (!confirm('Supprimer toutes les notes de cet élève pour cette période ?')) return;
      subjects.forEach((sub) => {
        setGrade({ studentId, subjectId: sub.id, periodId: activePeriodId, value: null });
      });
      addToast('Notes de l\'élève supprimées ✓', 'info');
    },
    [activePeriodId, setGrade, addToast, subjects]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, studentIdx: number, subjectIdx: number) => {
      const inputs = tableRef.current?.querySelectorAll<HTMLInputElement>('input[data-grade]');
      if (!inputs) return;
      const cols = subjects.length;
      const currentIdx = studentIdx * cols + subjectIdx;
      if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); inputs[currentIdx + cols]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); inputs[currentIdx - cols]?.focus(); }
      else if (e.key === 'ArrowRight') { if (e.currentTarget.selectionStart === e.currentTarget.value.length) inputs[currentIdx + 1]?.focus(); }
      else if (e.key === 'ArrowLeft') { if (e.currentTarget.selectionStart === 0) inputs[currentIdx - 1]?.focus(); }
      else if (e.key === 'Delete') {
        const student = sortedStudents[studentIdx];
        const subject = subjects[subjectIdx];
        if (student && subject) handleClearGrade(student.id, subject.id);
      }
    },
    [subjects, sortedStudents, handleClearGrade]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, startStudentIdx: number, startSubjectIdx: number) => {
      const pasteData = e.clipboardData.getData('text');
      if (!pasteData.includes('\t') && !pasteData.includes('\n')) return;
      e.preventDefault();
      const rows = pasteData.split('\n').filter((r) => r.trim());
      const newGrades: Array<{ studentId: string; subjectId: string; periodId: string; value: number | null }> = [];
      rows.forEach((row, rowIdx) => {
        const cells = row.split('\t');
        cells.forEach((cell, colIdx) => {
          const student = sortedStudents[startStudentIdx + rowIdx];
          const subject = subjects[startSubjectIdx + colIdx];
          if (student && subject) {
            const val = parseFloat(cell.trim().replace(',', '.'));
            if (!isNaN(val) && val >= noteMin && val <= noteMax) {
              newGrades.push({ studentId: student.id, subjectId: subject.id, periodId: activePeriodId, value: val });
            }
          }
        });
      });
      if (newGrades.length > 0) {
        bulkSetGrades(newGrades);
        addToast(`${newGrades.length} notes collées ✓`, 'success');
      }
    },
    [sortedStudents, subjects, activePeriodId, bulkSetGrades, addToast, noteMin, noteMax]
  );

  // Inline name editing
  const startEditingName = (student: typeof sortedStudents[0]) => {
    setEditingName(student.id);
    setEditLastName(student.lastName);
    setEditFirstName(student.firstName);
  };
  const saveEditingName = () => {
    if (editingName && editLastName.trim() && editFirstName.trim()) {
      updateStudent(editingName, { lastName: editLastName.trim(), firstName: editFirstName.trim() });
      addToast('Nom modifié ✓', 'success');
    }
    setEditingName(null);
  };

  // Inline subject editing
  const startEditingSubject = (sub: typeof subjects[0]) => {
    setEditingSubject(sub.id);
    setEditSubjectName(sub.name);
    setEditSubjectCoef(sub.coefficient);
  };
  const saveEditingSubject = () => {
    if (editingSubject && editSubjectName.trim()) {
      updateSubject(editingSubject, { name: editSubjectName.trim(), coefficient: editSubjectCoef });
      addToast('Matière modifiée ✓', 'success');
    }
    setEditingSubject(null);
  };

  // Quick add student
  const handleQuickAdd = () => {
    if (!quickFirstName.trim() || !quickLastName.trim()) {
      addToast('Nom et prénom obligatoires', 'error');
      return;
    }
    addStudent({
      id: uid(),
      firstName: quickFirstName.trim(),
      lastName: quickLastName.trim(),
      dateOfBirth: '',
      gender: 'M',
      className: 'CM2',
      parentName: '',
      parentPhone: '',
    });
    addToast(`${quickLastName.trim()} ${quickFirstName.trim()} ajouté ✓`, 'success');
    setQuickFirstName('');
    setQuickLastName('');
    setShowQuickAdd(false);
  };

  // Numpad
  const handleNumpadClick = (digit: string) => {
    if (digit === 'C') { setNumpadValue(''); return; }
    if (digit === '←') { setNumpadValue((v) => v.slice(0, -1)); return; }
    if (digit === '✓') {
      if (activeCell) {
        handleGradeChange(activeCell.studentId, activeCell.subjectId, numpadValue);
        addToast(`Note ${numpadValue} enregistrée ✓`, 'success');
        const idx = sortedStudents.findIndex((s) => s.id === activeCell.studentId);
        if (idx < sortedStudents.length - 1) {
          setActiveCell({ studentId: sortedStudents[idx + 1].id, subjectId: activeCell.subjectId });
        }
      }
      setNumpadValue('');
      return;
    }
    setNumpadValue((v) => {
      const newVal = v + digit;
      const num = parseFloat(newVal.replace(',', '.'));
      if (num > noteMax) return v;
      return newVal;
    });
  };

  const midPoint = (noteMin + noteMax) / 2;

  const exportToExcel = () => {
    const data = sortedStudents.map((s) => {
      const row: Record<string, string | number> = { Nom: s.lastName, Prénom: s.firstName };
      subjects.forEach((sub) => {
        const g = grades.find((g) => g.studentId === s.id && g.subjectId === sub.id && g.periodId === activePeriodId);
        row[sub.name] = g?.value ?? '';
      });
      const avg = getStudentAverage(s.id, activePeriodId, grades, subjects);
      row['Moyenne'] = avg ?? '';
      if (showRanks) row['Rang'] = ranks.get(s.id) ?? '';
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notes');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `notes-${periods.find((p) => p.id === activePeriodId)?.name || 'export'}.xlsx`);
    addToast('Export Excel réussi ✓', 'success');
  };

  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200';

  // Icon button classes — ALWAYS VISIBLE
  const iconBtnEdit = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'}`;
  const iconBtnDelete = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-900/40' : 'text-orange-500 hover:text-orange-700 hover:bg-orange-100'}`;
  const iconBtnRemove = `rounded-lg p-1.5 transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/40' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                p.id === activePeriodId ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2 shadow ${cardClass}`}>
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <button onClick={() => setShowQuickAdd(!showQuickAdd)} className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium shadow transition ${showQuickAdd ? 'gradient-principal text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
          <UserPlus size={16} /> + Élève
        </button>
        <button onClick={() => setShowNumpad(!showNumpad)} className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium shadow transition ${showNumpad ? 'gradient-principal text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
          <Calculator size={16} /> Pavé
        </button>
        <button onClick={exportToExcel} className="flex items-center gap-2 rounded-xl bg-vert-bdj px-3 py-2 text-sm font-medium text-white shadow">
          <Download size={16} /> Excel
        </button>
      </div>

      {/* Note range info */}
      <div className={`flex items-center gap-3 text-xs rounded-lg px-3 py-1.5 ${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-rose-pale/50 text-gray-500'}`}>
        <span>📊 Barème: <strong>{noteMin}</strong> → <strong>{noteMax}</strong></span>
        <span>•</span>
        <span>Décimales: <strong>{noteDP}</strong></span>
        <span className="ml-auto flex items-center gap-1"><Clipboard size={12} /> Ctrl+V coller • Entrée ↓ • Tab → • Suppr = effacer</span>
      </div>

      {/* Quick add student inline */}
      {showQuickAdd && (
        <div className={`flex items-center gap-3 rounded-xl p-3 shadow animate-fade-in-up ${cardClass}`}>
          <Plus size={16} className="text-rose-bdj shrink-0" />
          <input value={quickLastName} onChange={(e) => setQuickLastName(e.target.value)} placeholder="Nom *" className={`flex-1 rounded-lg border px-2 py-1.5 text-sm ${inputClass}`} autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(); }} />
          <input value={quickFirstName} onChange={(e) => setQuickFirstName(e.target.value)} placeholder="Prénom *" className={`flex-1 rounded-lg border px-2 py-1.5 text-sm ${inputClass}`}
            onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(); }} />
          <button onClick={handleQuickAdd} className="gradient-principal rounded-lg px-3 py-1.5 text-sm font-bold text-white"><Check size={16} /></button>
          <button onClick={() => setShowQuickAdd(false)} className="text-gray-400 hover:text-rouge-bdj"><X size={16} /></button>
        </div>
      )}

      <div className="flex gap-4">
        {/* Table */}
        <div ref={tableRef} className={`flex-1 overflow-auto rounded-2xl shadow-lg ${cardClass}`}>
          {students.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-16 text-center">
              <p className="text-gray-500">Ajoutez d'abord des élèves</p>
              <button onClick={() => setShowQuickAdd(true)} className="gradient-principal rounded-xl px-6 py-2 text-sm font-medium text-white shadow">
                <UserPlus size={16} className="inline mr-2" />Ajouter un élève
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="gradient-header text-white text-xs sticky top-0 z-10">
                  <th className="sticky left-0 z-20 px-2 py-3 text-left font-medium whitespace-nowrap" style={{ background: '#C71585' }}>
                    # Élève
                  </th>
                  {subjects.map((sub) => (
                    <th key={sub.id} className="px-2 py-3 text-center font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition" title="Double-cliquez pour modifier">
                      {editingSubject === sub.id ? (
                        <div className="flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            value={editSubjectName}
                            onChange={(e) => setEditSubjectName(e.target.value)}
                            className="w-16 rounded border border-white/50 bg-white/20 px-1 py-0.5 text-[10px] text-white text-center outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditingSubject();
                              if (e.key === 'Escape') setEditingSubject(null);
                            }}
                          />
                          <div className="flex items-center gap-0.5">
                            <span className="text-[8px] opacity-70">c.</span>
                            <input
                              type="number"
                              min={0.5}
                              max={10}
                              step={0.5}
                              value={editSubjectCoef}
                              onChange={(e) => setEditSubjectCoef(parseFloat(e.target.value) || 1)}
                              className="w-8 rounded border border-white/50 bg-white/20 px-0.5 py-0 text-[9px] text-white text-center outline-none"
                            />
                            <button onClick={saveEditingSubject} className="text-green-300 ml-0.5"><Check size={10} /></button>
                            <button onClick={() => setEditingSubject(null)} className="text-red-300"><X size={10} /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-0.5" onDoubleClick={() => startEditingSubject(sub)}>
                          <span className="text-[10px]">{sub.name.substring(0, 6)}</span>
                          <span className="text-[9px] opacity-60">c.{sub.coefficient}</span>
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-center font-medium">Moy.</th>
                  {showRanks && <th className="px-2 py-3 text-center font-medium">Rang</th>}
                  <th className="px-2 py-3 text-center font-medium">Mention</th>
                  <th className="px-2 py-3 text-center font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, sIdx) => {
                  const avg = getStudentAverage(student.id, activePeriodId, grades, subjects);
                  const rank = ranks.get(student.id);
                  const mention = avg !== null ? getMention(avg, mentionRules) : null;
                  const isEditingThis = editingName === student.id;

                  return (
                    <tr key={student.id} className={`border-b transition ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-rose-pale/50'} ${sIdx % 2 === 0 ? '' : darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                      <td className={`sticky left-0 z-10 px-2 py-1.5 text-xs font-medium whitespace-nowrap ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {isEditingThis ? (
                          <div className="flex items-center gap-1">
                            <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className={`w-16 rounded border px-1 py-0.5 text-xs ${inputClass}`} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveEditingName(); if (e.key === 'Escape') setEditingName(null); }} />
                            <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className={`w-14 rounded border px-1 py-0.5 text-xs ${inputClass}`} onKeyDown={(e) => { if (e.key === 'Enter') saveEditingName(); if (e.key === 'Escape') setEditingName(null); }} />
                            <button onClick={saveEditingName} className="text-green-500"><Check size={12} /></button>
                            <button onClick={() => setEditingName(null)} className="text-red-500"><X size={12} /></button>
                          </div>
                        ) : (
                          <span className="cursor-pointer hover:text-rose-bdj transition-colors" onDoubleClick={() => startEditingName(student)} title="Double-cliquez pour modifier">
                            <span className="text-gray-400 mr-1">{sIdx + 1}.</span>
                            {student.lastName} {student.firstName.substring(0, 1)}.
                          </span>
                        )}
                      </td>
                      {subjects.map((sub, subIdx) => {
                        const val = getGradeValue(student.id, sub.id);
                        const numVal = parseFloat(val);
                        const isInvalid = val !== '' && (isNaN(numVal) || numVal < noteMin || numVal > noteMax);
                        const isActive = activeCell?.studentId === student.id && activeCell?.subjectId === sub.id;
                        return (
                          <td key={sub.id} className="px-1 py-1 group/cell relative">
                            <input data-grade type="text" inputMode="decimal" value={val}
                              onChange={(e) => handleGradeChange(student.id, sub.id, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, sIdx, subIdx)}
                              onPaste={(e) => handlePaste(e, sIdx, subIdx)}
                              onFocus={() => setActiveCell({ studentId: student.id, subjectId: sub.id })}
                              className={`w-14 rounded-lg border px-1.5 py-1 text-center text-xs font-medium outline-none transition-all ${
                                isInvalid ? 'border-red-400 bg-red-50 text-red-600'
                                : isActive ? 'border-rose-bdj ring-2 ring-rose-bdj/30'
                                : numVal >= (noteMax * 0.8) ? `${inputClass} text-yellow-600`
                                : numVal >= midPoint ? `${inputClass} text-vert-bdj`
                                : numVal >= noteMin && val !== '' ? `${inputClass} text-rouge-bdj`
                                : inputClass
                              }`}
                            />
                            {val !== '' && (
                              <button onClick={() => handleClearGrade(student.id, sub.id)} className="absolute -top-1 -right-1 hidden group-hover/cell:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[8px] shadow font-bold" title="Supprimer">×</button>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-2 py-1.5 text-center">
                        {avg !== null && (
                          <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: avg >= midPoint ? '#28A745' : '#DC143C' }}>
                            {avg.toFixed(noteDP)}
                          </span>
                        )}
                      </td>
                      {showRanks && <td className="px-2 py-1.5 text-center text-xs font-bold">{rank ? `${rank}e` : '—'}</td>}
                      <td className="px-2 py-1.5 text-center">
                        {mention && <span className="text-[10px] whitespace-nowrap" title={mention.label}>{mention.emoji}</span>}
                      </td>
                      <td className="px-1 py-1.5 text-center">
                        <div className="flex items-center gap-0.5 justify-center">
                          <button onClick={() => startEditingName(student)} className={iconBtnEdit} title="Modifier le nom"><Edit3 size={13} /></button>
                          <button onClick={() => handleClearAllStudentGrades(student.id)} className={iconBtnDelete} title="Effacer les notes"><Trash2 size={13} /></button>
                          <button onClick={() => { if (confirm(`Supprimer ${student.lastName} ${student.firstName} ?`)) { deleteStudent(student.id); addToast('Élève supprimé ✓', 'info'); } }} className={iconBtnRemove} title="Supprimer l'élève"><X size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Class average row */}
                <tr className={`font-bold ${darkMode ? 'bg-gray-700' : 'bg-rose-pale'}`}>
                  <td className={`sticky left-0 z-10 px-2 py-2 text-xs ${darkMode ? 'bg-gray-700' : 'bg-rose-pale'}`}>📊 Moy. classe</td>
                  {subjects.map((sub) => {
                    const avg = getSubjectClassAverage(sub.id, activePeriodId, grades);
                    return <td key={sub.id} className="px-1 py-2 text-center text-xs">{avg !== null ? avg.toFixed(noteDP) : '—'}</td>;
                  })}
                  <td className="px-2 py-2 text-center text-xs">
                    {(() => {
                      const withAvg = students.filter((s) => getStudentAverage(s.id, activePeriodId, grades, subjects) !== null);
                      const classAvg = withAvg.length > 0 ? withAvg.reduce((sum, s) => sum + (getStudentAverage(s.id, activePeriodId, grades, subjects) || 0), 0) / withAvg.length : null;
                      return classAvg !== null ? classAvg.toFixed(noteDP) : '—';
                    })()}
                  </td>
                  <td colSpan={showRanks ? 3 : 2} />
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Numpad */}
        {showNumpad && (
          <div className={`w-52 shrink-0 rounded-2xl p-4 shadow-lg ${cardClass} animate-slide-in-right`}>
            <div className="mb-3 text-center">
              <p className="text-[10px] text-gray-500">
                {activeCell
                  ? `${sortedStudents.find((s) => s.id === activeCell.studentId)?.lastName || ''} — ${subjects.find((s) => s.id === activeCell.subjectId)?.name || ''}`
                  : 'Sélectionnez une cellule'}
              </p>
              <div className={`mt-2 rounded-xl border-2 border-rose-bdj px-3 py-3 text-center text-2xl font-bold ${darkMode ? 'bg-gray-700' : 'bg-rose-pale'}`}>
                {numpadValue || '—'}
              </div>
              <p className="text-[9px] text-gray-400 mt-1">Barème: {noteMin} → {noteMax}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '←'].map((d) => (
                <button key={d} onClick={() => handleNumpadClick(d)} className={`rounded-xl py-3 text-lg font-bold transition-all active:scale-95 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                  {d}
                </button>
              ))}
              <button onClick={() => handleNumpadClick('C')} className="rounded-xl bg-rouge-bdj py-3 text-sm font-bold text-white active:scale-95">C</button>
              <button onClick={() => handleNumpadClick('✓')} className="col-span-2 gradient-principal rounded-xl py-3 text-lg font-bold text-white shadow-lg active:scale-95">✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
