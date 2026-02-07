// Types pour l'application de gestion scolaire

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  photo?: string; // Base64
  parentName?: string;
  parentPhone?: string;
  address?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  color: string;
  category: "principal" | "secondary" | "sport" | "art";
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: number;
  maxValue: number;
  period: "T1" | "T2" | "T3"; // Trimestre
  type: "exam" | "test" | "homework" | "participation";
  date: string;
  comment?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail?: string;
  academicYear: string;
  logo?: string; // Base64
  stamp?: string; // Base64 - Cachet de l'école
  directorSignature?: string; // Base64
  teacherSignature?: string; // Base64
  directorName: string;
  teacherName: string;
}

export interface ReportCardData {
  student: Student;
  subjects: SubjectWithGrades[];
  overallAverage: number;
  rank: number;
  totalStudents: number;
  period: "T1" | "T2" | "T3";
  appreciation: string;
  settings: SchoolSettings;
}

export interface SubjectWithGrades {
  subject: Subject;
  grades: Grade[];
  average: number;
  classAverage: number;
  minGrade: number;
  maxGrade: number;
}

export interface AppData {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  settings: SchoolSettings;
  exportedAt?: string;
}

export type TabType = "dashboard" | "students" | "subjects" | "grades" | "bulletin" | "settings";

export type Period = "T1" | "T2" | "T3";
