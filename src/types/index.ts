// ─── User & Auth ────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// ─── Registration ────────────────────────────────────────────────────────────
export interface Registration {
  id?: string;
  title: string;
  fullName: string;
  email: string;
  institution: string;
  otherInstitution?: string;
  studentId: string;
  participantCategory?: string;
  isCsStudent: 'Yes' | 'No';
  department?: string;
  programme: string;
  cohort: string;
  isSubmittingAbstract: 'Yes' | 'No';
  participationType: 'Presenter' | 'Observer';
  attendanceMode: 'Physical' | 'Virtual' | 'Hybrid';
  paperTitle?: string;
  paperType?: string;
  thematicAreas?: string[];
  authorNames?: string;
  presentationType?: string;
  abstractBackground?: string;
  abstractMethods?: string;
  abstractResults?: string;
  abstractSignificance?: string;
  paymentStatus: 'Pending' | 'Confirmed';
  createdAt?: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export interface Payment {
  id: number;
  transactionId: string;
  studentId: string;
  name: string;
  email: string;
  programme: string;
  amount: number;
  method: 'mobile_money' | 'card';
  date: string;
  status: 'Confirmed' | 'Pending';
}

// ─── Schedule ────────────────────────────────────────────────────────────────
export interface ScheduleSession {
  time: string;
  title: string;
  track: string;
  venue: string;
  speaker?: string;
}

export interface ScheduleDay {
  day: string;
  date: string;
  sessions: ScheduleSession[];
}

// ─── Speaker ─────────────────────────────────────────────────────────────────
export interface Speaker {
  id: number;
  name: string;
  title: string;
  institution: string;
  role: string;
  bio: string;
  photo?: string;
}

// ─── Site Content ────────────────────────────────────────────────────────────
export interface SiteContent {
  event: Record<string, unknown>;
  home: Record<string, unknown>;
  about: Record<string, unknown>;
  schedule: Record<string, unknown>;
  speakers: Speaker[];
  sponsors: Record<string, unknown>;
  registration: Record<string, unknown>;
  livestream: Record<string, unknown>;
  gallery: Record<string, unknown>;
  contact: Record<string, unknown>;
  payments: Payment[];
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  page: string;
}
