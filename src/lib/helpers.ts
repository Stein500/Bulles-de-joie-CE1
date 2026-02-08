import type { Student, Grade, Subject, AppreciationRule, MentionRule, DemoNamePool } from '../stores/useStore';

export const uid = () => Math.random().toString(36).substring(2, 11);

export function getStudentAverage(
  studentId: string,
  periodId: string,
  grades: Grade[],
  subjects: Subject[]
): number | null {
  const studentGrades = grades.filter(
    (g) => g.studentId === studentId && g.periodId === periodId && g.value !== null
  );
  if (studentGrades.length === 0) return null;

  let totalWeighted = 0;
  let totalCoef = 0;

  for (const grade of studentGrades) {
    const subject = subjects.find((s) => s.id === grade.subjectId);
    if (subject && grade.value !== null) {
      totalWeighted += grade.value * subject.coefficient;
      totalCoef += subject.coefficient;
    }
  }

  return totalCoef > 0 ? Math.round((totalWeighted / totalCoef) * 100) / 100 : null;
}

export function getClassAverage(
  students: Student[],
  periodId: string,
  grades: Grade[],
  subjects: Subject[]
): number | null {
  const averages = students
    .map((s) => getStudentAverage(s.id, periodId, grades, subjects))
    .filter((a): a is number => a !== null);

  if (averages.length === 0) return null;
  return Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 100) / 100;
}

export function getSubjectClassAverage(
  subjectId: string,
  periodId: string,
  grades: Grade[]
): number | null {
  const subGrades = grades.filter(
    (g) => g.subjectId === subjectId && g.periodId === periodId && g.value !== null
  );
  if (subGrades.length === 0) return null;
  const sum = subGrades.reduce((a, g) => a + (g.value || 0), 0);
  return Math.round((sum / subGrades.length) * 100) / 100;
}

export function getRanks(
  students: Student[],
  periodId: string,
  grades: Grade[],
  subjects: Subject[]
): Map<string, number> {
  const avgs: { id: string; avg: number }[] = [];
  for (const s of students) {
    const avg = getStudentAverage(s.id, periodId, grades, subjects);
    if (avg !== null) avgs.push({ id: s.id, avg });
  }
  avgs.sort((a, b) => b.avg - a.avg);
  const ranks = new Map<string, number>();
  avgs.forEach((a, i) => ranks.set(a.id, i + 1));
  return ranks;
}

export function getMention(
  average: number,
  mentionRules: MentionRule[]
): { label: string; emoji: string; color: string } | null {
  const sorted = [...mentionRules].sort((a, b) => b.minAverage - a.minAverage);
  for (const rule of sorted) {
    if (average >= rule.minAverage) {
      return { label: rule.label, emoji: rule.emoji, color: rule.color };
    }
  }
  if (sorted.length > 0) {
    const last = sorted[sorted.length - 1];
    return { label: last.label, emoji: last.emoji, color: last.color };
  }
  return null;
}

export function getAppreciation(
  average: number,
  appreciationRules: AppreciationRule[]
): { label: string; color: string } {
  const sorted = [...appreciationRules].sort((a, b) => a.min - b.min);
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (average >= sorted[i].min && average <= sorted[i].max) {
      return { label: sorted[i].label, color: sorted[i].color };
    }
  }
  if (sorted.length > 0) {
    return { label: sorted[0].label, color: sorted[0].color };
  }
  return { label: 'Non évalué', color: '#999999' };
}

/**
 * Generate demo students from custom name pool
 */
export function generateDemoStudents(count: number, namePool: DemoNamePool, defaultClass: string = 'CM2'): Student[] {
  const { firstNamesMale, firstNamesFemale, lastNames } = namePool;

  if (firstNamesMale.length === 0 && firstNamesFemale.length === 0) {
    return [];
  }
  if (lastNames.length === 0) {
    return [];
  }

  const students: Student[] = [];
  for (let i = 0; i < count; i++) {
    const hasMales = firstNamesMale.length > 0;
    const hasFemales = firstNamesFemale.length > 0;
    let gender: 'M' | 'F';
    if (hasMales && hasFemales) gender = Math.random() > 0.5 ? 'M' : 'F';
    else if (hasMales) gender = 'M';
    else gender = 'F';

    const firstNames = gender === 'M' ? firstNamesMale : firstNamesFemale;
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    students.push({
      id: uid(),
      firstName: fn,
      lastName: ln,
      dateOfBirth: `20${String(Math.floor(Math.random() * 10) + 10).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender,
      className: defaultClass,
      parentName: `M./Mme ${ln}`,
      parentPhone: `+229 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
    });
  }
  return students.sort((a, b) => a.lastName.localeCompare(b.lastName));
}
