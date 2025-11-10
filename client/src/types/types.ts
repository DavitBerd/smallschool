export type Role = "admin" | "mentor" | "student";

export type User = {
  _id: string;
  email: string;
  role: Role;
  semesters: number[];
  missedLectures: number;
  group: string;
};

export type Homework = {
  _id: string;
  name: string;
  description?: string;
  points: number;
  deadline: string;
  group: string;
  semester: number;
  createdBy: string;
};

export type Submission = {
  _id: string;
  student: User;
  homework: string;
  link?: string;
  grade?: number | null;
  graded: boolean;
};
export type CreateForm = {
  name: string;
  description?: string;
  points: number;
  deadline: string;
  group: string;
  semester: 1 | 2 | 3;
};
export type Student = {
  _id: string;
  email: string;
  missedLectures: number;
  semesters: number[];
  group: string;
};
