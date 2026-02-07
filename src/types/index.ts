// Types pour l'application Les Bulles de Joie

export type PeriodType = 'trimestre' | 'semestre' | 'quadrimestre' | 'custom' | 'annuel' | 'mensuel';

export interface SchoolPeriod {
  id: string;
  order: number;
  name: string;
  customName: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  academicYear: string;
  isActive: boolean;
  displayFormat: string;
}

export interface PeriodSettings {
  periodType: PeriodType;
  numberOfPeriods: number;
  customPeriods: SchoolPeriod[];
  displayFormat: string;
  defaultPeriod: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  className: string;
  photo: string | null;
  parentName: string;
  parentPhone: string;
  address: string;
  enrollmentDate: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  color: string;
  category: string;
  isActive: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  maxValue: number;
  date: string;
  type: 'exam' | 'test' | 'homework' | 'participation';
  comment: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  directorName: string;
  logo: string | null;
  stamp: string | null;
  directorSignature: string | null;
  teacherSignature: string | null;
  teacherName: string;
  academicYear: string;
  periodSettings: PeriodSettings;
}

export interface BulletinData {
  student: Student;
  period: SchoolPeriod;
  subjects: SubjectWithGrades[];
  generalAverage: number;
  rank: string;
  classAverage: number;
  appreciation: string;
  schoolSettings: SchoolSettings;
}

export interface SubjectWithGrades {
  subject: Subject;
  grades: Grade[];
  average: number;
  classAverage: number;
  mention: string;
}

export interface PrintSettings {
  fontSize: number;
  compactMode: boolean;
  includeRadar: boolean;
  includeLogo: boolean;
  includeSignatures: boolean;
  includeStamp: boolean;
  colorMode: 'color' | 'grayscale';
}

export interface AppData {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  settings: SchoolSettings;
}
