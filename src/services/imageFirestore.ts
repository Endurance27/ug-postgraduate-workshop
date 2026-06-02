/**
 * Firestore service — CRUD for image metadata in the `images` collection.
 * Each document id equals the image slot key ("workshop", "research", etc.).
 * Single Responsibility: all image-metadata Firestore I/O lives here.
 */
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageRecord {
  /** Firebase CDN URL */
  url: string;
  /** Firebase Storage path (needed for deletion) */
  storagePath: string;
  /** Human-readable label shown in admin */
  label: string;
  /** Optional admin-supplied description */
  description: string;
  /** ISO-8601 timestamp of last upload */
  uploadedAt: string;
  /** uid of the admin who last uploaded */
  uploadedBy: string;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/** Overwrites a single image record (no merge — stale fields are cleared). */
export async function saveImageRecord(
  key: string,
  record: Omit<ImageRecord, 'uploadedAt'>,
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const data: ImageRecord = { ...record, uploadedAt: new Date().toISOString() };
  await setDoc(doc(db, 'images', key), data);
}

/** Fetches one image record. Returns null when the document does not exist. */
export async function getImageRecord(key: string): Promise<ImageRecord | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'images', key));
  return snap.exists() ? (snap.data() as ImageRecord) : null;
}

/** Fetches all image records as a key→record map. */
export async function getAllImageRecords(): Promise<Record<string, ImageRecord>> {
  if (!db) return {};
  const snap = await getDocs(collection(db, 'images'));
  const result: Record<string, ImageRecord> = {};
  snap.forEach((d) => {
    result[d.id] = d.data() as ImageRecord;
  });
  return result;
}

/** Deletes an image record from Firestore. */
export async function deleteImageRecord(key: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await deleteDoc(doc(db, 'images', key));
}
