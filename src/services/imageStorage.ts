/**
 * Firebase Storage service — image upload, delete, validation.
 * Single Responsibility: all Storage I/O lives here.
 */
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { auth, storage } from '../firebase';

// ─── Validation ───────────────────────────────────────────────────────────────

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const MAX_SIZE_MB = 5;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/** Returns an error string if the file is invalid, or null if it's fine. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return `Unsupported format "${file.type}". Please use JPG, PNG, or WebP.`;
  }
  const sizeMB = (file.size / 1024 / 1024).toFixed(1);
  if (file.size > MAX_SIZE_BYTES) {
    return `File is ${sizeMB} MB — maximum is ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  /** Firebase CDN download URL */
  url: string;
  /** Full Storage path — required later for deletion */
  storagePath: string;
}

/**
 * Uploads a validated image to Firebase Storage.
 *
 * @param file       Image file to upload
 * @param slotKey    Logical folder key, e.g. "workshop" or "research"
 * @param uid        auth.currentUser.uid (passed in rather than looked up here for testability)
 * @param onProgress Optional callback; called with 0–100 as bytes transfer progress
 */
export async function uploadSiteImage(
  file: File,
  slotKey: string,
  uid: string,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  if (!auth.currentUser) throw new Error('You must be signed in to upload images.');

  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  void ext; // used for documentation purposes; safeName captures it
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `site-images/${slotKey}/${uid}/${Date.now()}-${safeName}`;

  const storageRef = ref(storage, storagePath);
  const task = uploadBytesResumable(storageRef, file);

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      resolve,
    );
  });

  const url = await getDownloadURL(task.snapshot.ref);
  return { url, storagePath };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a file from Firebase Storage by its path.
 * Silently succeeds if:
 *   - storagePath is empty
 *   - storagePath starts with "/images/" (local public asset — never delete)
 *   - file does not exist in Storage (already deleted)
 */
export async function deleteSiteImage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  if (storagePath.startsWith('/images/')) return; // local public asset — skip
  if (!storage) return;

  try {
    await deleteObject(ref(storage, storagePath));
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === 'storage/object-not-found') return; // already gone — fine
    throw err;
  }
}

// ─── Error formatting ─────────────────────────────────────────────────────────

export function storageErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const msg  = (error as { message?: string })?.message;
  const MAP: Record<string, string> = {
    'storage/unauthorized':          'Access denied — check Firebase Storage rules.',
    'storage/canceled':              'Upload was cancelled.',
    'storage/quota-exceeded':        'Firebase Storage quota exceeded.',
    'storage/retry-limit-exceeded':  'Upload timed out. Please try again.',
    'storage/invalid-format':        'Invalid image file.',
    'storage/object-not-found':      'File not found in storage.',
  };
  return (code && MAP[code]) || msg || 'Image operation failed. Please try again.';
}
