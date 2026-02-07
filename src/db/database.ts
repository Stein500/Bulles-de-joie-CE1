import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Student, Subject, Grade, SchoolSettings, SchoolPeriod, PeriodSettings, AppData } from '../types';

interface BullesDeJoieDB extends DBSchema {
  students: {
    key: string;
    value: Student;
    indexes: { 'by-class': string };
  };
  subjects: {
    key: string;
    value: Subject;
  };
  grades: {
    key: string;
    value: Grade;
    indexes: { 
      'by-student': string;
      'by-subject': string;
      'by-period': string;
    };
  };
  settings: {
    key: string;
    value: SchoolSettings;
  };
}

const DB_NAME = 'bulles-de-joie-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BullesDeJoieDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BullesDeJoieDB>> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB<BullesDeJoieDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Students store
      if (!db.objectStoreNames.contains('students')) {
        const studentStore = db.createObjectStore('students', { keyPath: 'id' });
        studentStore.createIndex('by-class', 'className');
      }
      
      // Subjects store
      if (!db.objectStoreNames.contains('subjects')) {
        db.createObjectStore('subjects', { keyPath: 'id' });
      }
      
      // Grades store
      if (!db.objectStoreNames.contains('grades')) {
        const gradeStore = db.createObjectStore('grades', { keyPath: 'id' });
        gradeStore.createIndex('by-student', 'studentId');
        gradeStore.createIndex('by-subject', 'subjectId');
        gradeStore.createIndex('by-period', 'periodId');
      }
      
      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    }
  });
  
  return dbInstance;
}

// Default periods
export function getDefaultPeriods(year: string): SchoolPeriod[] {
  const [startYear, endYear] = year.split('-').map(Number);
  return [
    {
      id: 'period-1',
      order: 1,
      name: '1er Trimestre',
      customName: '1er Trimestre',
      type: 'trimestre',
      startDate: `${startYear}-09-01`,
      endDate: `${startYear}-12-15`,
      academicYear: year,
      isActive: true,
      displayFormat: '{type} {numero} - {annee}'
    },
    {
      id: 'period-2',
      order: 2,
      name: '2ème Trimestre',
      customName: '2ème Trimestre',
      type: 'trimestre',
      startDate: `${startYear}-12-16`,
      endDate: `${endYear}-03-15`,
      academicYear: year,
      isActive: false,
      displayFormat: '{type} {numero} - {annee}'
    },
    {
      id: 'period-3',
      order: 3,
      name: '3ème Trimestre',
      customName: '3ème Trimestre',
      type: 'trimestre',
      startDate: `${endYear}-03-16`,
      endDate: `${endYear}-06-30`,
      academicYear: year,
      isActive: false,
      displayFormat: '{type} {numero} - {annee}'
    }
  ];
}

export function getDefaultSettings(): SchoolSettings {
  const currentYear = new Date().getFullYear();
  const academicYear = new Date().getMonth() >= 8 
    ? `${currentYear}-${currentYear + 1}` 
    : `${currentYear - 1}-${currentYear}`;
  
  const defaultPeriodSettings: PeriodSettings = {
    periodType: 'trimestre',
    numberOfPeriods: 3,
    customPeriods: getDefaultPeriods(academicYear),
    displayFormat: '{type} {numero} - {annee}',
    defaultPeriod: 'period-1'
  };
  
  return {
    schoolName: 'Les Bulles de Joie',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: '',
    directorName: '',
    logo: null,
    stamp: null,
    directorSignature: null,
    teacherSignature: null,
    teacherName: '',
    academicYear,
    periodSettings: defaultPeriodSettings
  };
}

// Students CRUD
export async function getAllStudents(): Promise<Student[]> {
  const db = await getDB();
  return db.getAll('students');
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const db = await getDB();
  return db.get('students', id);
}

export async function saveStudent(student: Student): Promise<void> {
  const db = await getDB();
  await db.put('students', student);
}

export async function deleteStudent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('students', id);
  // Also delete related grades
  const grades = await db.getAllFromIndex('grades', 'by-student', id);
  const tx = db.transaction('grades', 'readwrite');
  await Promise.all(grades.map(g => tx.store.delete(g.id)));
  await tx.done;
}

// Subjects CRUD
export async function getAllSubjects(): Promise<Subject[]> {
  const db = await getDB();
  return db.getAll('subjects');
}

export async function getSubject(id: string): Promise<Subject | undefined> {
  const db = await getDB();
  return db.get('subjects', id);
}

export async function saveSubject(subject: Subject): Promise<void> {
  const db = await getDB();
  await db.put('subjects', subject);
}

export async function deleteSubject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('subjects', id);
  // Also delete related grades
  const grades = await db.getAllFromIndex('grades', 'by-subject', id);
  const tx = db.transaction('grades', 'readwrite');
  await Promise.all(grades.map(g => tx.store.delete(g.id)));
  await tx.done;
}

// Grades CRUD
export async function getAllGrades(): Promise<Grade[]> {
  const db = await getDB();
  return db.getAll('grades');
}

export async function getGradesByStudent(studentId: string): Promise<Grade[]> {
  const db = await getDB();
  return db.getAllFromIndex('grades', 'by-student', studentId);
}

export async function getGradesByPeriod(periodId: string): Promise<Grade[]> {
  const db = await getDB();
  return db.getAllFromIndex('grades', 'by-period', periodId);
}

export async function saveGrade(grade: Grade): Promise<void> {
  const db = await getDB();
  await db.put('grades', grade);
}

export async function deleteGrade(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('grades', id);
}

// Settings
export async function getSettings(): Promise<SchoolSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'main');
  return settings || getDefaultSettings();
}

export async function saveSettings(settings: SchoolSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', { ...settings, id: 'main' } as SchoolSettings & { id: string });
}

// Export all data
export async function exportAllData(): Promise<AppData> {
  const [students, subjects, grades, settings] = await Promise.all([
    getAllStudents(),
    getAllSubjects(),
    getAllGrades(),
    getSettings()
  ]);
  
  return { students, subjects, grades, settings };
}

// Import all data
export async function importAllData(data: AppData): Promise<void> {
  const db = await getDB();
  
  // Clear all stores
  await Promise.all([
    db.clear('students'),
    db.clear('subjects'),
    db.clear('grades'),
    db.clear('settings')
  ]);
  
  // Import new data
  const tx1 = db.transaction('students', 'readwrite');
  await Promise.all(data.students.map(s => tx1.store.put(s)));
  await tx1.done;
  
  const tx2 = db.transaction('subjects', 'readwrite');
  await Promise.all(data.subjects.map(s => tx2.store.put(s)));
  await tx2.done;
  
  const tx3 = db.transaction('grades', 'readwrite');
  await Promise.all(data.grades.map(g => tx3.store.put(g)));
  await tx3.done;
  
  await saveSettings(data.settings);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
