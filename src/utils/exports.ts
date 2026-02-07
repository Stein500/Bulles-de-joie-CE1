import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BulletinData, AppData, PrintSettings } from '../types';
import { formatDate, getMention } from './helpers';

// Export to Excel
export function exportToExcel(data: AppData, filename: string = 'bulles-de-joie-export'): void {
  const workbook = XLSX.utils.book_new();
  
  // Students sheet
  const studentsData = data.students.map(s => ({
    'Nom': s.lastName,
    'Prénom': s.firstName,
    'Date de naissance': formatDate(s.dateOfBirth, 'short'),
    'Genre': s.gender === 'M' ? 'Masculin' : 'Féminin',
    'Classe': s.className,
    'Parent': s.parentName,
    'Téléphone': s.parentPhone,
    'Adresse': s.address,
    'Inscrit le': formatDate(s.enrollmentDate, 'short'),
    'Actif': s.isActive ? 'Oui' : 'Non'
  }));
  const studentsSheet = XLSX.utils.json_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Élèves');
  
  // Subjects sheet
  const subjectsData = data.subjects.map(s => ({
    'Matière': s.name,
    'Coefficient': s.coefficient,
    'Catégorie': s.category,
    'Couleur': s.color,
    'Active': s.isActive ? 'Oui' : 'Non'
  }));
  const subjectsSheet = XLSX.utils.json_to_sheet(subjectsData);
  XLSX.utils.book_append_sheet(workbook, subjectsSheet, 'Matières');
  
  // Grades sheet
  const gradesData = data.grades.map(g => {
    const student = data.students.find(s => s.id === g.studentId);
    const subject = data.subjects.find(s => s.id === g.subjectId);
    return {
      'Élève': student ? `${student.lastName} ${student.firstName}` : 'Inconnu',
      'Matière': subject?.name || 'Inconnue',
      'Note': g.value,
      'Sur': g.maxValue,
      'Note/20': ((g.value / g.maxValue) * 20).toFixed(2),
      'Type': g.type,
      'Date': formatDate(g.date, 'short'),
      'Commentaire': g.comment
    };
  });
  const gradesSheet = XLSX.utils.json_to_sheet(gradesData);
  XLSX.utils.book_append_sheet(workbook, gradesSheet, 'Notes');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Export to JSON
export function exportToJSON(data: AppData, filename: string = 'bulles-de-joie-backup'): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import from JSON
export function importFromJSON(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
}

// Generate PDF bulletin
export function generateBulletinPDF(
  bulletinData: BulletinData,
  settings: PrintSettings
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;
  
  // Colors
  const fuchsiaColor: [number, number, number] = [255, 0, 255];
  const textColor: [number, number, number] = [51, 51, 51];
  const grayColor: [number, number, number] = [128, 128, 128];
  
  // === HEADER ===
  // Logo on left
  if (settings.includeLogo && bulletinData.schoolSettings.logo) {
    try {
      doc.addImage(bulletinData.schoolSettings.logo, 'PNG', margin, yPos, 22, 22);
    } catch (e) {
      // Logo loading failed, continue without it
      console.log('Logo non chargé');
    }
  }
  
  // School name and title - center
  doc.setFontSize(18);
  doc.setTextColor(...fuchsiaColor);
  doc.setFont('helvetica', 'bold');
  doc.text(bulletinData.schoolSettings.schoolName.toUpperCase(), pageWidth / 2, yPos + 7, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.text('BULLETIN SCOLAIRE OFFICIEL', pageWidth / 2, yPos + 14, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(`${bulletinData.period.customName} - ${bulletinData.period.academicYear}`, pageWidth / 2, yPos + 20, { align: 'center' });
  
  // Stamp on right
  if (settings.includeStamp && bulletinData.schoolSettings.stamp) {
    try {
      doc.addImage(bulletinData.schoolSettings.stamp, 'PNG', pageWidth - margin - 22, yPos, 22, 22);
    } catch (e) {
      console.log('Cachet non chargé');
    }
  }
  
  yPos += 28;
  
  // Separator line
  doc.setDrawColor(...fuchsiaColor);
  doc.setLineWidth(1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;
  
  // === STUDENT INFO ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  
  // Student info in two columns
  doc.text('Élève :', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${bulletinData.student.lastName.toUpperCase()} ${bulletinData.student.firstName}`, margin + 15, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Classe :', pageWidth / 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(bulletinData.student.className, pageWidth / 2 + 18, yPos);
  
  yPos += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Né(e) le :', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(bulletinData.student.dateOfBirth, 'short'), margin + 20, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Effectif :', pageWidth / 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${bulletinData.rank.split('/')[1] || '?'} élèves`, pageWidth / 2 + 18, yPos);
  
  // Student photo on right
  if (bulletinData.student.photo) {
    try {
      doc.addImage(bulletinData.student.photo, 'JPEG', pageWidth - margin - 18, yPos - 10, 18, 22);
    } catch (e) {
      console.log('Photo élève non chargée');
    }
  }
  
  yPos += 12;
  
  // === GRADES TABLE ===
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...fuchsiaColor);
  doc.text('RÉSULTATS SCOLAIRES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  
  // Table data
  const tableData = bulletinData.subjects.map(s => {
    const mention = getMention(s.average);
    const ecart = s.average > 0 ? s.average - s.classAverage : 0;
    return [
      s.subject.name,
      s.subject.coefficient.toString(),
      s.average > 0 ? s.average.toFixed(1) : '-',
      s.classAverage > 0 ? s.classAverage.toFixed(1) : '-',
      s.average > 0 ? (ecart >= 0 ? '+' : '') + ecart.toFixed(1) : '-',
      s.average > 0 ? `${mention.emoji} ${mention.text}` : '-'
    ];
  });
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coef', 'Note/20', 'Moy. Classe', 'Écart', 'Mention']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: fuchsiaColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: settings.compactMode ? 8 : 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: settings.compactMode ? 7 : 8,
      textColor: textColor
    },
    columnStyles: {
      0: { cellWidth: 50, halign: 'left' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 38, halign: 'center' }
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  // Get final Y position after table
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || yPos + 60;
  yPos = finalY + 8;
  
  // === SUMMARY BOX ===
  const boxHeight = 18;
  doc.setFillColor(255, 240, 255);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 3, 3, 'F');
  doc.setDrawColor(...fuchsiaColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 3, 3, 'S');
  
  const summaryY = yPos + 11;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...fuchsiaColor);
  
  // Summary content
  const colWidth = (pageWidth - 2 * margin) / 4;
  
  doc.text('MOYENNE', margin + colWidth * 0.5, summaryY - 4, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${bulletinData.generalAverage.toFixed(2)}/20`, margin + colWidth * 0.5, summaryY + 3, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.text('RANG', margin + colWidth * 1.5, summaryY - 4, { align: 'center' });
  doc.setFontSize(14);
  doc.text(bulletinData.rank, margin + colWidth * 1.5, summaryY + 3, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text('MOY. CLASSE', margin + colWidth * 2.5, summaryY - 4, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${bulletinData.classAverage.toFixed(2)}/20`, margin + colWidth * 2.5, summaryY + 3, { align: 'center' });
  
  const globalMention = getMention(bulletinData.generalAverage);
  doc.setFontSize(11);
  doc.text('MENTION', margin + colWidth * 3.5, summaryY - 4, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(...fuchsiaColor);
  doc.text(globalMention.text.toUpperCase(), margin + colWidth * 3.5, summaryY + 3, { align: 'center' });
  
  yPos += boxHeight + 10;
  
  // === APPRECIATION ===
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('APPRÉCIATION GÉNÉRALE :', margin, yPos);
  yPos += 5;
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const appreciationLines = doc.splitTextToSize(bulletinData.appreciation, pageWidth - 2 * margin);
  doc.text(appreciationLines, margin, yPos);
  yPos += appreciationLines.length * 4 + 10;
  
  // === SIGNATURES ===
  if (settings.includeSignatures) {
    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const sigColWidth = (pageWidth - 2 * margin) / 3;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    
    // Teacher
    doc.text("L'Enseignant(e)", margin + sigColWidth * 0.5, yPos, { align: 'center' });
    if (bulletinData.schoolSettings.teacherName) {
      doc.setFont('helvetica', 'normal');
      doc.text(bulletinData.schoolSettings.teacherName, margin + sigColWidth * 0.5, yPos + 5, { align: 'center' });
    }
    if (bulletinData.schoolSettings.teacherSignature) {
      try {
        doc.addImage(bulletinData.schoolSettings.teacherSignature, 'PNG', margin + sigColWidth * 0.5 - 15, yPos + 8, 30, 15);
      } catch (e) {
        console.log('Signature enseignant non chargée');
      }
    }
    
    // Stamp in center
    doc.setFont('helvetica', 'bold');
    doc.text('Cachet', margin + sigColWidth * 1.5, yPos, { align: 'center' });
    if (settings.includeStamp && bulletinData.schoolSettings.stamp) {
      try {
        doc.addImage(bulletinData.schoolSettings.stamp, 'PNG', margin + sigColWidth * 1.5 - 12, yPos + 5, 24, 24);
      } catch (e) {
        console.log('Cachet non chargé');
      }
    }
    
    // Director
    doc.setFont('helvetica', 'bold');
    doc.text('Le Directeur/La Directrice', margin + sigColWidth * 2.5, yPos, { align: 'center' });
    if (bulletinData.schoolSettings.directorName) {
      doc.setFont('helvetica', 'normal');
      doc.text(bulletinData.schoolSettings.directorName, margin + sigColWidth * 2.5, yPos + 5, { align: 'center' });
    }
    if (bulletinData.schoolSettings.directorSignature) {
      try {
        doc.addImage(bulletinData.schoolSettings.directorSignature, 'PNG', margin + sigColWidth * 2.5 - 15, yPos + 8, 30, 15);
      } catch (e) {
        console.log('Signature directeur non chargée');
      }
    }
  }
  
  // === FOOTER ===
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...grayColor);
  doc.text(`Édité le ${formatDate(new Date().toISOString(), 'full')}`, margin, pageHeight - 8);
  doc.text('Page 1/1', pageWidth - margin, pageHeight - 8, { align: 'right' });
  doc.text(bulletinData.schoolSettings.schoolName, pageWidth / 2, pageHeight - 8, { align: 'center' });
  
  return doc;
}

// Download PDF directly
export function downloadBulletinPDF(bulletinData: BulletinData, settings: PrintSettings): void {
  const doc = generateBulletinPDF(bulletinData, settings);
  const fileName = `Bulletin_${bulletinData.student.lastName}_${bulletinData.student.firstName}_${bulletinData.period.customName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}

// Export grades to Excel for a class
export function exportGradesToExcel(
  students: AppData['students'],
  subjects: AppData['subjects'],
  grades: AppData['grades'],
  periodId: string,
  periodName: string
): void {
  const workbook = XLSX.utils.book_new();
  
  // Create header row
  const activeSubjects = subjects.filter(s => s.isActive);
  const headers = ['Élève', ...activeSubjects.map(s => s.name), 'Moyenne'];
  
  // Create data rows
  const activeStudents = students.filter(s => s.isActive);
  const data = activeStudents.map(student => {
    const row: (string | number)[] = [`${student.lastName} ${student.firstName}`];
    
    let totalWeighted = 0;
    let totalCoef = 0;
    
    activeSubjects.forEach(subject => {
      const studentGrades = grades.filter(
        g => g.studentId === student.id && g.subjectId === subject.id && g.periodId === periodId
      );
      
      if (studentGrades.length > 0) {
        const avg = studentGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / studentGrades.length;
        row.push(parseFloat(avg.toFixed(2)));
        totalWeighted += avg * subject.coefficient;
        totalCoef += subject.coefficient;
      } else {
        row.push('-');
      }
    });
    
    row.push(totalCoef > 0 ? parseFloat((totalWeighted / totalCoef).toFixed(2)) : '-');
    
    return row;
  });
  
  const sheetData = [headers, ...data];
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  
  // Set column widths
  const colWidths = [{ wch: 25 }, ...activeSubjects.map(() => ({ wch: 12 })), { wch: 12 }];
  sheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, sheet, periodName.substring(0, 31)); // Sheet name max 31 chars
  
  XLSX.writeFile(workbook, `notes_${periodName.replace(/\s+/g, '_')}.xlsx`);
}
