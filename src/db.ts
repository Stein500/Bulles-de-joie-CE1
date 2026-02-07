import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { Student, Subject, Grade, SchoolSettings, AppData } from "./types";

interface BullesDeJoieDB extends DBSchema {
  students: {
    key: string;
    value: Student;
    indexes: { "by-lastName": string };
  };
  subjects: {
    key: string;
    value: Subject;
  };
  grades: {
    key: string;
    value: Grade;
    indexes: { "by-studentId": string; "by-subjectId": string };
  };
  settings: {
    key: string;
    value: SchoolSettings;
  };
}

const DB_NAME = "bulles-de-joie-db";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BullesDeJoieDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BullesDeJoieDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BullesDeJoieDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store pour les élèves
      if (!db.objectStoreNames.contains("students")) {
        const studentStore = db.createObjectStore("students", { keyPath: "id" });
        studentStore.createIndex("by-lastName", "lastName");
      }

      // Store pour les matières
      if (!db.objectStoreNames.contains("subjects")) {
        db.createObjectStore("subjects", { keyPath: "id" });
      }

      // Store pour les notes
      if (!db.objectStoreNames.contains("grades")) {
        const gradeStore = db.createObjectStore("grades", { keyPath: "id" });
        gradeStore.createIndex("by-studentId", "studentId");
        gradeStore.createIndex("by-subjectId", "subjectId");
      }

      // Store pour les paramètres
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
      }
    },
  });

  return dbInstance;
}

// Génère un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ========== STUDENTS ==========

export async function getAllStudents(): Promise<Student[]> {
  const db = await getDB();
  return db.getAll("students");
}

export async function addStudent(student: Omit<Student, "id" | "createdAt">): Promise<Student> {
  const db = await getDB();
  const newStudent: Student = {
    ...student,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await db.add("students", newStudent);
  return newStudent;
}

export async function updateStudent(student: Student): Promise<void> {
  const db = await getDB();
  await db.put("students", student);
}

export async function deleteStudent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("students", id);
  // Supprimer aussi les notes de l'élève
  const grades = await db.getAllFromIndex("grades", "by-studentId", id);
  for (const grade of grades) {
    await db.delete("grades", grade.id);
  }
}

// ========== SUBJECTS ==========

export async function getAllSubjects(): Promise<Subject[]> {
  const db = await getDB();
  return db.getAll("subjects");
}

export async function addSubject(subject: Omit<Subject, "id">): Promise<Subject> {
  const db = await getDB();
  const newSubject: Subject = {
    ...subject,
    id: generateId(),
  };
  await db.add("subjects", newSubject);
  return newSubject;
}

export async function updateSubject(subject: Subject): Promise<void> {
  const db = await getDB();
  await db.put("subjects", subject);
}

export async function deleteSubject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("subjects", id);
  // Supprimer aussi les notes de cette matière
  const grades = await db.getAllFromIndex("grades", "by-subjectId", id);
  for (const grade of grades) {
    await db.delete("grades", grade.id);
  }
}

// ========== GRADES ==========

export async function getAllGrades(): Promise<Grade[]> {
  const db = await getDB();
  return db.getAll("grades");
}

export async function getGradesByStudent(studentId: string): Promise<Grade[]> {
  const db = await getDB();
  return db.getAllFromIndex("grades", "by-studentId", studentId);
}

export async function addGrade(grade: Omit<Grade, "id">): Promise<Grade> {
  const db = await getDB();
  const newGrade: Grade = {
    ...grade,
    id: generateId(),
  };
  await db.add("grades", newGrade);
  return newGrade;
}

export async function updateGrade(grade: Grade): Promise<void> {
  const db = await getDB();
  await db.put("grades", grade);
}

export async function deleteGrade(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("grades", id);
}

// ========== SETTINGS ==========

const SETTINGS_KEY = "main-settings";

export async function getSettings(): Promise<SchoolSettings | null> {
  const db = await getDB();
  const settings = await db.get("settings", SETTINGS_KEY);
  return settings || null;
}

export async function saveSettings(settings: Omit<SchoolSettings, "id">): Promise<void> {
  const db = await getDB();
  await db.put("settings", { ...settings, id: SETTINGS_KEY } as SchoolSettings & { id: string });
}

// ========== EXPORT / IMPORT ==========

export async function exportAllData(): Promise<AppData> {
  const [students, subjects, grades, settings] = await Promise.all([
    getAllStudents(),
    getAllSubjects(),
    getAllGrades(),
    getSettings(),
  ]);

  return {
    students,
    subjects,
    grades,
    settings: settings || getDefaultSettings(),
    exportedAt: new Date().toISOString(),
  };
}

export async function importAllData(data: AppData): Promise<void> {
  const db = await getDB();

  // Effacer les données existantes
  const tx = db.transaction(["students", "subjects", "grades", "settings"], "readwrite");

  await Promise.all([
    tx.objectStore("students").clear(),
    tx.objectStore("subjects").clear(),
    tx.objectStore("grades").clear(),
    tx.objectStore("settings").clear(),
  ]);

  await tx.done;

  // Importer les nouvelles données
  for (const student of data.students) {
    await db.add("students", student);
  }
  for (const subject of data.subjects) {
    await db.add("subjects", subject);
  }
  for (const grade of data.grades) {
    await db.add("grades", grade);
  }
  if (data.settings) {
    await saveSettings(data.settings);
  }
}

export function getDefaultSettings(): SchoolSettings {
  return {
    schoolName: "Les Bulles de Joie",
    schoolAddress: "",
    schoolPhone: "",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    directorName: "",
    teacherName: "",
  };
}

export function getDefaultSubjects(): Omit<Subject, "id">[] {
  return [
    { name: "Français", coefficient: 3, color: "#FF00FF", category: "principal" },
    { name: "Mathématiques", coefficient: 3, color: "#CCFF00", category: "principal" },
    { name: "Sciences", coefficient: 2, color: "#00CCFF", category: "principal" },
    { name: "Histoire-Géo", coefficient: 2, color: "#FF9900", category: "secondary" },
    { name: "Anglais", coefficient: 2, color: "#9900FF", category: "secondary" },
    { name: "Éducation Physique", coefficient: 1, color: "#00FF99", category: "sport" },
    { name: "Arts Plastiques", coefficient: 1, color: "#FF6699", category: "art" },
  ];
}
