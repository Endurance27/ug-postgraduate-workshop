// Fix: shared hook — subscribes to workshop/siteContent via onSnapshot so all
// public pages reflect admin changes in real-time without polling or reload.
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export interface SiteContentSnapshot {
  event: Record<string, unknown>;
  home: Record<string, unknown>;
  about: Record<string, unknown>;
  footer: Record<string, unknown>;
  contact: Record<string, unknown>;
  schedule: unknown[];
  speakers: Record<string, unknown>;
  sponsors: unknown[];
  gallery: unknown[];
  recordings: unknown[];
  stream: Record<string, unknown>;
  awards: unknown[];
  pastWinners: unknown[];
  announcements: unknown[];
  feed: unknown[];
  faqs: unknown[];
  images: Record<string, string>;
  [key: string]: unknown;
}

const EMPTY: SiteContentSnapshot = {
  event: {},
  home: {},
  about: {},
  footer: {},
  contact: {},
  schedule: [],
  speakers: {},
  sponsors: [],
  gallery: [],
  recordings: [],
  stream: {},
  awards: [],
  pastWinners: [],
  announcements: [],
  feed: [],
  faqs: [],
  images: {},
};

export function useSiteContent(seed?: Partial<SiteContentSnapshot>): {
  data: SiteContentSnapshot;
  loading: boolean;
  error: string;
} {
  const [data, setData] = useState<SiteContentSnapshot>({ ...EMPTY, ...(seed || {}) });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "workshop", "siteContent"),
      (snap) => {
        if (snap.exists()) {
          setData((prev) => ({ ...EMPTY, ...prev, ...(snap.data() as SiteContentSnapshot) }));
        }
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { data, loading, error };
}
