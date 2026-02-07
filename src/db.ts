import Dexie, { Table } from 'dexie';

export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  class: string;
  photo?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export interface Subject {
  id?: number;
  name: string;
  coefficient: number;
  color: string;
  category: string;
}

export interface Grade {
  id?: number;
  studentId: number;
  subjectId: number;
  value: number;
  type: string;
  trimester: 'T1' | 'T2' | 'T3';
  date: string;
}

export interface SchoolSettings {
  id?: number;
  schoolName: string;
  schoolYear: string;
  logo?: string;
  stamp?: string;
  directorSignature?: string;
  teacherSignature?: string;
}

class SchoolDatabase extends Dexie {
  students!: Table<Student>;
  subjects!: Table<Subject>;
  grades!: Table<Grade>;
  settings!: Table<SchoolSettings>;

  constructor() {
    super('SteinTechnologySTTN');
    this.version(1).stores({
      students: '++id, firstName, lastName, class',
      subjects: '++id, name, category',
      grades: '++id, studentId, subjectId, trimester',
      settings: '++id'
    });
  }
}

export const db = new SchoolDatabase();
