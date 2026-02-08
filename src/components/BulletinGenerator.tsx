import { useState, useRef } from 'react';
import { useStore } from '../stores/useStore';
import { getStudentAverage, getRanks, getMention, getAppreciation, getSubjectClassAverage, getClassAverage } from '../lib/helpers';
import { FileText, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

export function BulletinGenerator() {
  const {
    students, subjects, grades, periods, activePeriodId, settings, darkMode,
    setActivePeriod, mentionRules, appreciationRules
  } = useStore();
  const showRanks = settings.showRanks;
  const noteMax = settings.noteMax;
  const noteDP = settings.noteDecimalPlaces;
  const midPoint = (settings.noteMin + noteMax) / 2;
  const [currentStudentIdx, setCurrentStudentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('list');
  const printRef = useRef<HTMLDivElement>(null);

  const sortedStudents = [...students].sort((a, b) => a.lastName.localeCompare(b.lastName));
  const ranks = getRanks(students, activePeriodId, grades, subjects);
  const classAvg = getClassAverage(students, activePeriodId, grades, subjects);
  const activePeriod = periods.find((p) => p.id === activePeriodId);
  const currentStudent = sortedStudents[currentStudentIdx];

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Bulletin - ${currentStudent?.lastName} ${currentStudent?.firstName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>* { margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif; } body{padding:0;} @media print { body { -webkit-print-color-adjust:exact;print-color-adjust:exact; } }</style></head><body>
      ${printContent.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    let allBulletins = '';
    sortedStudents.forEach((student) => {
      allBulletins += `<div style="page-break-after:always;">${generateBulletinHTML(student)}</div>`;
    });
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Bulletins - Classe complète</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>* { margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif; } body{padding:0;} @media print { body { -webkit-print-color-adjust:exact;print-color-adjust:exact; } }</style></head><body>
      ${allBulletins}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  };

  const generateBulletinHTML = (student: typeof sortedStudents[0]) => {
    const avg = getStudentAverage(student.id, activePeriodId, grades, subjects);
    const rank = ranks.get(student.id);
    const mention = avg !== null ? getMention(avg, mentionRules) : null;
    const appreciation = avg !== null ? getAppreciation(avg, appreciationRules) : { label: '', color: '#999' };
    const pc = settings.primaryColor || '#FF69B4';

    const subjectRows = subjects.map((sub) => {
      const g = grades.find((g) => g.studentId === student.id && g.subjectId === sub.id && g.periodId === activePeriodId);
      const subAvg = getSubjectClassAverage(sub.id, activePeriodId, grades);
      const noteVal = g?.value ?? null;
      const noteAppreciation = noteVal !== null ? getAppreciation(noteVal, appreciationRules) : null;
      return `
        <tr>
          <td style="padding:6px 10px;border:1px solid #ddd;font-weight:500;font-size:11px;background:${sub.color}10;">${sub.name}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center;font-size:11px;">${sub.coefficient}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center;font-weight:700;font-size:13px;color:${(noteVal ?? 0) >= midPoint ? '#28A745' : '#DC143C'}">
            ${noteVal !== null ? noteVal.toFixed(noteDP) : '—'}
          </td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center;font-size:11px;color:#666">${subAvg !== null ? subAvg.toFixed(noteDP) : '—'}</td>
          <td style="padding:6px;border:1px solid #ddd;text-align:center;font-size:10px;color:${noteAppreciation?.color || '#999'};font-weight:600;">${noteAppreciation?.label || '—'}</td>
        </tr>
      `;
    }).join('');

    return `
      <div style="max-width:800px;margin:20px auto;padding:30px;border:3px solid ${pc};border-radius:12px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${pc},#FF00FF,#DC143C);"></div>
        
        <div style="text-align:center;margin-bottom:20px;padding-top:10px;">
          ${settings.logo ? `<img src="${settings.logo}" style="height:60px;margin-bottom:8px;" />` : ''}
          <h1 style="font-size:20px;color:${pc};margin:4px 0;">${settings.schoolName}</h1>
          ${settings.schoolAddress ? `<p style="font-size:10px;color:#888;">${settings.schoolAddress}${settings.schoolPhone ? ` • Tél: ${settings.schoolPhone}` : ''}${settings.schoolEmail ? ` • ${settings.schoolEmail}` : ''}</p>` : ''}
          <div style="margin-top:12px;padding:8px 20px;background:linear-gradient(135deg,${pc},#C71585);color:white;border-radius:20px;display:inline-block;">
            <span style="font-size:14px;font-weight:700;">${settings.bulletinTitle}</span>
          </div>
          <p style="font-size:11px;color:#666;margin-top:8px;">${activePeriod?.name} — Année scolaire ${settings.anneeScolaire}</p>
        </div>

        <div style="display:flex;gap:20px;margin-bottom:20px;padding:12px;background:#FFF0F5;border-radius:8px;">
          <div style="flex:1;">
            <p style="font-size:10px;color:#888;">Nom et Prénom</p>
            <p style="font-size:14px;font-weight:700;">${student.lastName} ${student.firstName}</p>
          </div>
          <div>
            <p style="font-size:10px;color:#888;">Classe</p>
            <p style="font-size:14px;font-weight:600;">${student.className}</p>
          </div>
          <div>
            <p style="font-size:10px;color:#888;">Sexe</p>
            <p style="font-size:14px;">${student.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
          </div>
          <div>
            <p style="font-size:10px;color:#888;">Date naiss.</p>
            <p style="font-size:14px;">${student.dateOfBirth || '—'}</p>
          </div>
          ${student.matricule ? `<div><p style="font-size:10px;color:#888;">Matricule</p><p style="font-size:14px;">${student.matricule}</p></div>` : ''}
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:linear-gradient(135deg,${pc},#C71585);">
              <th style="padding:8px 10px;border:1px solid ${pc};color:white;text-align:left;font-size:11px;">Matière</th>
              <th style="padding:8px;border:1px solid ${pc};color:white;text-align:center;font-size:11px;width:50px;">Coef.</th>
              <th style="padding:8px;border:1px solid ${pc};color:white;text-align:center;font-size:11px;width:70px;">Note/${noteMax}</th>
              <th style="padding:8px;border:1px solid ${pc};color:white;text-align:center;font-size:11px;width:70px;">Moy. Cl.</th>
              <th style="padding:8px;border:1px solid ${pc};color:white;text-align:center;font-size:11px;width:90px;">Appréciation</th>
            </tr>
          </thead>
          <tbody>${subjectRows}</tbody>
        </table>

        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <div style="flex:1;padding:16px;background:linear-gradient(135deg,${pc}15,#FF00FF10);border-radius:12px;text-align:center;border:2px solid ${pc}30;">
            <p style="font-size:10px;color:#888;">Moyenne générale</p>
            <p style="font-size:28px;font-weight:800;color:${(avg ?? 0) >= midPoint ? '#28A745' : '#DC143C'};">${avg !== null ? avg.toFixed(noteDP) : '—'}/${noteMax}</p>
          </div>
          ${showRanks ? `
          <div style="flex:0.5;padding:16px;background:#FFF0F5;border-radius:12px;text-align:center;">
            <p style="font-size:10px;color:#888;">Rang</p>
            <p style="font-size:24px;font-weight:800;color:${pc};">${rank ? `${rank}e` : '—'}</p>
            <p style="font-size:10px;color:#888;">sur ${students.length}</p>
          </div>` : ''}
          <div style="flex:0.5;padding:16px;background:#FFF0F5;border-radius:12px;text-align:center;">
            <p style="font-size:10px;color:#888;">Moy. classe</p>
            <p style="font-size:24px;font-weight:800;color:#4169E1;">${classAvg?.toFixed(noteDP) ?? '—'}</p>
          </div>
        </div>

        ${mention ? `
        <div style="text-align:center;margin-bottom:16px;">
          <span style="display:inline-block;padding:8px 24px;background:${mention.color};color:white;border-radius:20px;font-weight:700;font-size:13px;">
            ${mention.emoji} ${mention.label}
          </span>
        </div>` : ''}

        <div style="padding:14px;background:#f8f8f8;border-radius:10px;margin-bottom:20px;border-left:4px solid ${appreciation.color};">
          <p style="font-size:10px;color:#888;margin-bottom:6px;">Appréciation du conseil de classe</p>
          <p style="font-size:14px;font-weight:700;color:${appreciation.color};">${appreciation.label}</p>
        </div>

        <div style="display:flex;justify-content:space-between;margin-top:30px;padding-top:20px;border-top:1px dashed #ddd;">
          <div style="text-align:center;">
            <p style="font-size:10px;color:#888;margin-bottom:30px;">${settings.teacherTitle}</p>
            ${settings.signatureEnseignant ? `<img src="${settings.signatureEnseignant}" style="height:40px;" />` : ''}
          </div>
          <div style="text-align:center;">
            <p style="font-size:10px;color:#888;margin-bottom:30px;">${settings.parentTitle}</p>
          </div>
          <div style="text-align:center;">
            <p style="font-size:10px;color:#888;margin-bottom:30px;">${settings.directorTitle}</p>
            ${settings.signatureDirecteur ? `<img src="${settings.signatureDirecteur}" style="height:40px;" />` : ''}
            ${settings.cachet ? `<img src="${settings.cachet}" style="height:50px;margin-top:4px;" />` : ''}
          </div>
        </div>

        <div style="text-align:center;margin-top:16px;padding-top:8px;border-top:2px solid ${pc};">
          <p style="font-size:8px;color:#aaa;">Bulletin généré par ${settings.schoolName} — Gestion Scolaire</p>
        </div>
      </div>
    `;
  };

  const cardClass = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1">
            {periods.map((p) => (
              <button key={p.id} onClick={() => setActivePeriod(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${p.id === activePeriodId ? 'gradient-principal text-white shadow' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                {p.name}
              </button>
            ))}
          </div>
          <button onClick={handlePrintAll} className="gradient-principal flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-90 ml-auto">
            <Printer size={18} /> IMPRIMER TOUS LES BULLETINS
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedStudents.map((student, idx) => {
            const avg = getStudentAverage(student.id, activePeriodId, grades, subjects);
            const rank = ranks.get(student.id);
            const mention = avg !== null ? getMention(avg, mentionRules) : null;
            const appreciation = avg !== null ? getAppreciation(avg, appreciationRules) : null;
            return (
              <button key={student.id} onClick={() => { setCurrentStudentIdx(idx); setViewMode('preview'); }}
                className={`group rounded-2xl p-4 text-left shadow transition-all hover:shadow-lg hover:scale-[1.01] ${cardClass}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-bdj to-fuchsia-bdj text-sm font-bold text-white">
                    {showRanks && rank ? rank : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold">{student.lastName} {student.firstName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {avg !== null && (
                        <>
                          <span className="font-bold" style={{ color: avg >= midPoint ? '#28A745' : '#DC143C' }}>{avg.toFixed(noteDP)}/{noteMax}</span>
                          {showRanks && rank && <><span>•</span><span>{rank}e</span></>}
                        </>
                      )}
                    </div>
                    {appreciation && (
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: appreciation.color }}>{appreciation.label}</p>
                    )}
                  </div>
                  {mention && <span className="text-lg">{mention.emoji}</span>}
                  <FileText size={16} className={`transition ${darkMode ? 'text-gray-500 group-hover:text-rose-clair' : 'text-gray-400 group-hover:text-rose-bdj'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {students.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20">
            <FileText size={48} className="text-rose-clair" />
            <p className="text-gray-500">Ajoutez des élèves et des notes pour générer les bulletins</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setViewMode('list')} className={`rounded-xl px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-600 shadow'}`}>
          ← Retour à la liste
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setCurrentStudentIdx(Math.max(0, currentStudentIdx - 1))} disabled={currentStudentIdx === 0} className="rounded-lg p-2 disabled:opacity-30 hover:bg-gray-100"><ChevronLeft size={18} /></button>
          <span className="text-sm font-medium">{currentStudentIdx + 1} / {sortedStudents.length}</span>
          <button onClick={() => setCurrentStudentIdx(Math.min(sortedStudents.length - 1, currentStudentIdx + 1))} disabled={currentStudentIdx === sortedStudents.length - 1} className="rounded-lg p-2 disabled:opacity-30 hover:bg-gray-100"><ChevronRight size={18} /></button>
        </div>
        <button onClick={handlePrint} className="gradient-principal flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          <Printer size={16} /> Imprimer
        </button>
      </div>
      <div ref={printRef} className="mx-auto max-w-[850px]">
        {currentStudent && <div dangerouslySetInnerHTML={{ __html: generateBulletinHTML(currentStudent) }} />}
      </div>
    </div>
  );
}
