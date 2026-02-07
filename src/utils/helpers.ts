import { Grade, Subject, Student, SchoolPeriod, SubjectWithGrades } from '../types';

// Format date in French
export function formatDate(dateStr: string, format: 'full' | 'short' | 'month' = 'full'): string {
  const date = new Date(dateStr);
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const shortMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                       'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  if (format === 'month') {
    return shortMonths[date.getMonth()];
  }
  
  if (format === 'short') {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Get ordinal number in French
export function getOrdinal(n: number): string {
  if (n === 1) return '1er';
  return `${n}ème`;
}

// Format period display name
export function formatPeriodDisplay(period: SchoolPeriod): string {
  const typeNames: Record<string, string> = {
    trimestre: 'Trimestre',
    semestre: 'Semestre',
    quadrimestre: 'Quadrimestre',
    custom: 'Période',
    annuel: 'Année',
    mensuel: 'Mois'
  };
  
  return period.customName || 
    `${getOrdinal(period.order)} ${typeNames[period.type]} ${period.academicYear}`;
}

// Calculate average from grades
export function calculateAverage(grades: Grade[], subjects: Subject[]): number {
  if (grades.length === 0) return 0;
  
  let totalWeighted = 0;
  let totalCoef = 0;
  
  const gradesBySubject = new Map<string, Grade[]>();
  grades.forEach(g => {
    const arr = gradesBySubject.get(g.subjectId) || [];
    arr.push(g);
    gradesBySubject.set(g.subjectId, arr);
  });
  
  gradesBySubject.forEach((subjectGrades, subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const subjectAvg = subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / subjectGrades.length;
    totalWeighted += subjectAvg * subject.coefficient;
    totalCoef += subject.coefficient;
  });
  
  return totalCoef > 0 ? totalWeighted / totalCoef : 0;
}

// Calculate subject average
export function calculateSubjectAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  return grades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / grades.length;
}

// Get mention based on average
export function getMention(average: number): { text: string; emoji: string; color: string } {
  if (average >= 16) return { text: 'Excellent', emoji: '⭐', color: 'text-yellow-500' };
  if (average >= 14) return { text: 'Très Satisfaisant', emoji: '✅', color: 'text-green-500' };
  if (average >= 12) return { text: 'Satisfaisant', emoji: '👍', color: 'text-blue-500' };
  if (average >= 10) return { text: 'Passable', emoji: '⚠️', color: 'text-orange-500' };
  return { text: 'Insuffisant', emoji: '❌', color: 'text-red-500' };
}

// Calculate ranks for all students
export function calculateRanks(
  students: Student[],
  grades: Grade[],
  subjects: Subject[],
  periodId: string
): Map<string, number> {
  const averages: { studentId: string; average: number }[] = [];
  
  students.forEach(student => {
    const studentGrades = grades.filter(g => g.studentId === student.id && g.periodId === periodId);
    const avg = calculateAverage(studentGrades, subjects);
    averages.push({ studentId: student.id, average: avg });
  });
  
  averages.sort((a, b) => b.average - a.average);
  
  const ranks = new Map<string, number>();
  averages.forEach((item, index) => {
    ranks.set(item.studentId, index + 1);
  });
  
  return ranks;
}

// Calculate class average for a subject
export function calculateClassSubjectAverage(
  grades: Grade[],
  subjectId: string,
  periodId: string,
  _students: Student[]
): number {
  const subjectGrades = grades.filter(
    g => g.subjectId === subjectId && g.periodId === periodId
  );
  
  if (subjectGrades.length === 0) return 0;
  
  const studentAverages: number[] = [];
  const gradesByStudent = new Map<string, Grade[]>();
  
  subjectGrades.forEach(g => {
    const arr = gradesByStudent.get(g.studentId) || [];
    arr.push(g);
    gradesByStudent.set(g.studentId, arr);
  });
  
  gradesByStudent.forEach(sGrades => {
    const avg = calculateSubjectAverage(sGrades);
    studentAverages.push(avg);
  });
  
  return studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length;
}

// Get subjects with grades for bulletin
export function getSubjectsWithGrades(
  student: Student,
  subjects: Subject[],
  allGrades: Grade[],
  periodId: string,
  allStudents: Student[]
): SubjectWithGrades[] {
  return subjects.filter(s => s.isActive).map(subject => {
    const studentGrades = allGrades.filter(
      g => g.studentId === student.id && g.subjectId === subject.id && g.periodId === periodId
    );
    
    const average = calculateSubjectAverage(studentGrades);
    const classAverage = calculateClassSubjectAverage(allGrades, subject.id, periodId, allStudents);
    const mention = getMention(average);
    
    return {
      subject,
      grades: studentGrades,
      average,
      classAverage,
      mention: mention.text
    };
  });
}

// Generate appreciation based on average
export function generateAppreciation(average: number, studentName: string): string {
  if (average >= 16) {
    return `Excellent travail ${studentName} ! Tes résultats sont remarquables. Continue ainsi et maintiens ce niveau d'excellence. Félicitations !`;
  }
  if (average >= 14) {
    return `Très bon travail ${studentName}. Tes efforts sont récompensés par de très bons résultats. Continue sur cette lancée !`;
  }
  if (average >= 12) {
    return `Bon travail ${studentName}. Tes résultats sont satisfaisants. Quelques efforts supplémentaires te permettront d'atteindre l'excellence.`;
  }
  if (average >= 10) {
    return `Résultats passables ${studentName}. Un travail plus régulier et une meilleure concentration en classe sont nécessaires pour progresser.`;
  }
  return `${studentName}, tes résultats sont insuffisants. Un effort important est attendu pour le prochain trimestre. Ne te décourage pas et travaille régulièrement.`;
}

// Image to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

// Validate image dimensions
export async function validateImageDimensions(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}

// Generate default subjects
export function getDefaultSubjects(): Omit<Subject, 'id'>[] {
  return [
    { name: 'Français', coefficient: 3, color: '#3B82F6', category: 'Langues', isActive: true },
    { name: 'Mathématiques', coefficient: 3, color: '#EF4444', category: 'Sciences', isActive: true },
    { name: 'Sciences', coefficient: 2, color: '#10B981', category: 'Sciences', isActive: true },
    { name: 'Histoire-Géographie', coefficient: 2, color: '#F59E0B', category: 'Humanités', isActive: true },
    { name: 'Anglais', coefficient: 2, color: '#8B5CF6', category: 'Langues', isActive: true },
    { name: 'Éducation Physique', coefficient: 1, color: '#EC4899', category: 'Sports', isActive: true },
    { name: 'Arts Plastiques', coefficient: 1, color: '#06B6D4', category: 'Arts', isActive: true },
    { name: 'Musique', coefficient: 1, color: '#84CC16', category: 'Arts', isActive: true }
  ];
}
