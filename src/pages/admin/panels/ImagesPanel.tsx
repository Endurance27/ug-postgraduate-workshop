import { useState, useEffect, useRef } from "react";
import {
  Image,
  Upload,
  Check,
  Trash2,
  AlertCircle,
  Loader,
} from "lucide-react";
import { auth } from "../../../firebase";
import {
  uploadSiteImage,
  deleteSiteImage,
  storageErrorMessage,
  validateImageFile,
  ALLOWED_EXTENSIONS,
  MAX_SIZE_MB,
} from "../../../services/imageStorage";
import {
  saveImageRecord,
  deleteImageRecord,
  getAllImageRecords,
} from "../../../services/imageFirestore";
import { useAdminContext } from "../../../context/AdminContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlotData {
  url: string;
  storagePath: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface SlotStatus {
  uploading: boolean;
  progress: number;
  error: string | null;
  successMsg: string | null;
}

// ─── Image slot definitions ───────────────────────────────────────────────────

const IMAGE_DEFS = [
  {
    key: "workshop",
    label: "Workshop Sessions",
    defaultUrl: "/images/workshop-sessions.jpg",
    usedOn: "Home hero background · Home photo strip · Home testimonials",
  },
  {
    key: "research",
    label: "Research Presentations",
    defaultUrl: "/images/research-presentations.jpg",
    usedOn: "Home 'About' section · Home photo strip · About page hero",
  },
  {
    key: "networking",
    label: "Networking & Events",
    defaultUrl: "/images/collaboration-networking.jpeg",
    usedOn: "Home CTA background · Contact page · Speakers page · Sponsors page",
  },
  {
    key: "students",
    label: "Students / DCS Research",
    defaultUrl: "/images/dcs-research.jpg",
    usedOn: "Home hero card photo · Home awards background · Home testimonials",
  },
] as const;

type SlotKey = (typeof IMAGE_DEFS)[number]["key"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDefaultSlotData(defaultUrl: string): SlotData {
  return { url: defaultUrl, storagePath: "", uploadedAt: "", uploadedBy: "" };
}

function makeDefaultStatus(): SlotStatus {
  return { uploading: false, progress: 0, error: null, successMsg: null };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImagesPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const images = (siteContent.images as Record<string, string>) || {};

  // Per-slot data state
  const [slotData, setSlotData] = useState<Record<string, SlotData>>(() => {
    const init: Record<string, SlotData> = {};
    IMAGE_DEFS.forEach((def) => {
      init[def.key] = {
        url: images[def.key] || def.defaultUrl,
        storagePath: "",
        uploadedAt: "",
        uploadedBy: "",
      };
    });
    return init;
  });

  // Per-slot URL draft (text input)
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    IMAGE_DEFS.forEach((def) => {
      init[def.key] = images[def.key] || def.defaultUrl;
    });
    return init;
  });

  // Per-slot UI status
  const [status, setStatus] = useState<Record<string, SlotStatus>>(() => {
    const init: Record<string, SlotStatus> = {};
    IMAGE_DEFS.forEach((def) => {
      init[def.key] = makeDefaultStatus();
    });
    return init;
  });

  const [loading, setLoading] = useState(true);

  // Hidden file inputs — one per slot
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ─── Load Firestore data on mount ─────────────────────────────────────────

  useEffect(() => {
    getAllImageRecords()
      .then((records) => {
        setSlotData((prev) => {
          const next = { ...prev };
          Object.entries(records).forEach(([key, rec]) => {
            if (next[key]) {
              next[key] = {
                url: rec.url,
                storagePath: rec.storagePath,
                uploadedAt: rec.uploadedAt,
                uploadedBy: rec.uploadedBy,
              };
            }
          });
          return next;
        });
        setUrlDrafts((prev) => {
          const next = { ...prev };
          Object.entries(records).forEach(([key, rec]) => {
            if (key in next) {
              next[key] = rec.url;
            }
          });
          return next;
        });
      })
      .catch((err) => console.error("Failed to load image records:", err))
      .finally(() => setLoading(false));
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function buildUrlMap(data: Record<string, SlotData>): Record<string, string> {
    const map: Record<string, string> = {};
    IMAGE_DEFS.forEach((def) => {
      map[def.key] = data[def.key]?.url || def.defaultUrl;
    });
    return map;
  }

  function setSlotStatus(key: string, patch: Partial<SlotStatus>) {
    setStatus((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  }

  // ─── File upload handler ───────────────────────────────────────────────────

  async function handleFileSelected(
    e: React.ChangeEvent<HTMLInputElement>,
    key: SlotKey,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    // clear input so the same file can be re-selected later
    e.target.value = "";

    const validationError = validateImageFile(file);
    if (validationError) {
      setSlotStatus(key, { error: validationError });
      return;
    }

    const def = IMAGE_DEFS.find((d) => d.key === key)!;
    const oldPath = slotData[key]?.storagePath;

    setSlotStatus(key, {
      uploading: true,
      progress: 0,
      error: null,
      successMsg: null,
    });

    try {
      const { url, storagePath } = await uploadSiteImage(
        file,
        key,
        auth.currentUser?.uid ?? "unknown",
        (pct) => setSlotStatus(key, { progress: pct }),
      );

      await saveImageRecord(key, {
        url,
        storagePath,
        label: def.label,
        description: "",
        uploadedBy: auth.currentUser?.uid ?? "",
      });

      if (oldPath && oldPath !== storagePath) {
        deleteSiteImage(oldPath).catch(console.warn);
      }

      const newSlotData: Record<string, SlotData> = {
        ...slotData,
        [key]: {
          url,
          storagePath,
          uploadedAt: new Date().toISOString(),
          uploadedBy: auth.currentUser?.uid ?? "",
        },
      };
      setSlotData(newSlotData);
      setUrlDrafts((prev) => ({ ...prev, [key]: url }));
      updateContent("images", buildUrlMap(newSlotData));

      setSlotStatus(key, {
        uploading: false,
        progress: 0,
        successMsg: "Uploaded and live on the site.",
      });
      setTimeout(() => setSlotStatus(key, { successMsg: null }), 3500);
    } catch (err) {
      setSlotStatus(key, {
        uploading: false,
        progress: 0,
        error: storageErrorMessage(err),
      });
    }
  }

  // ─── Save URL handler ──────────────────────────────────────────────────────

  async function handleSaveUrl(key: SlotKey) {
    const url = urlDrafts[key]?.trim();
    if (!url) return;

    const def = IMAGE_DEFS.find((d) => d.key === key)!;
    const oldPath = slotData[key]?.storagePath;

    setSlotStatus(key, { uploading: true, error: null, successMsg: null });

    try {
      if (oldPath && url !== slotData[key].url) {
        deleteSiteImage(oldPath).catch(console.warn);
      }

      await saveImageRecord(key, {
        url,
        storagePath: "",
        label: def.label,
        description: "",
        uploadedBy: auth.currentUser?.uid ?? "",
      });

      const newSlotData: Record<string, SlotData> = {
        ...slotData,
        [key]: {
          url,
          storagePath: "",
          uploadedAt: new Date().toISOString(),
          uploadedBy: auth.currentUser?.uid ?? "",
        },
      };
      setSlotData(newSlotData);
      updateContent("images", buildUrlMap(newSlotData));

      setSlotStatus(key, {
        uploading: false,
        successMsg: "URL saved and live on the site.",
      });
      setTimeout(() => setSlotStatus(key, { successMsg: null }), 3500);
    } catch (err) {
      setSlotStatus(key, {
        uploading: false,
        error: storageErrorMessage(err),
      });
    }
  }

  // ─── Delete handler ────────────────────────────────────────────────────────

  async function handleDelete(key: SlotKey) {
    const def = IMAGE_DEFS.find((d) => d.key === key)!;
    if (
      !window.confirm(
        `Reset "${def.label}" to the default image? This will delete the uploaded file from Firebase Storage.`,
      )
    )
      return;

    const oldPath = slotData[key]?.storagePath;
    setSlotStatus(key, { uploading: true, error: null, successMsg: null });

    try {
      if (oldPath) await deleteSiteImage(oldPath);
      await deleteImageRecord(key);

      const newSlotData: Record<string, SlotData> = {
        ...slotData,
        [key]: makeDefaultSlotData(def.defaultUrl),
      };
      setSlotData(newSlotData);
      setUrlDrafts((prev) => ({ ...prev, [key]: def.defaultUrl }));
      updateContent("images", buildUrlMap(newSlotData));

      setSlotStatus(key, {
        uploading: false,
        successMsg: "Reset to default image.",
      });
      setTimeout(() => setSlotStatus(key, { successMsg: null }), 3500);
    } catch (err) {
      setSlotStatus(key, {
        uploading: false,
        error: storageErrorMessage(err),
      });
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[760px]">
      {/* Header */}
      <h2 className="mb-1.5 font-serif">Site Images</h2>
      <p className="text-[#666] text-sm mb-3">
        These 4 images appear across all pages of the site. Upload a new image
        from your device or paste a URL — pages update instantly.
      </p>

      <div className="alert alert-info mb-6 text-[13px]">
        Accepted: {ALLOWED_EXTENSIONS.join(", ").toUpperCase()} &middot; Max{" "}
        {MAX_SIZE_MB} MB &middot; Upload from device or paste a URL — pages
        update instantly.
      </div>

      {/* Hidden file inputs — one per slot */}
      {IMAGE_DEFS.map((def) => (
        <input
          key={def.key}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          ref={(el) => {
            fileRefs.current[def.key] = el;
          }}
          onChange={(e) => handleFileSelected(e, def.key)}
        />
      ))}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center gap-3 py-10 text-[#888] text-sm">
          <Loader size={18} className="animate-spin text-ug-blue" />
          Loading image data…
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {IMAGE_DEFS.map((def) => {
            const sd = slotData[def.key];
            const st = status[def.key];
            const draftUrl = urlDrafts[def.key] ?? "";
            const isDraftDirty = draftUrl !== sd.url;
            const hasFirebaseFile = !!sd.storagePath;

            return (
              <div
                key={def.key}
                className="bg-white border border-[#e0e0e0] rounded-[14px] p-5 flex gap-5 items-start"
              >
                {/* Left — preview column */}
                <div className="w-[140px] shrink-0 flex flex-col gap-2">
                  <div className="w-[140px] h-24 rounded-[10px] overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5]">
                    {sd.url ? (
                      <img
                        src={sd.url}
                        alt={def.label}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image size={28} color="#bbb" />
                      </div>
                    )}
                  </div>
                  {sd.uploadedAt && (
                    <p className="text-[11px] text-[#999] leading-tight">
                      Updated {formatDate(sd.uploadedAt)}
                    </p>
                  )}
                </div>

                {/* Right — controls column */}
                <div className="flex-1 min-w-0">
                  {/* Label row */}
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <div>
                      <div className="font-semibold text-sm text-ug-blue">
                        {def.label}
                      </div>
                      <div className="text-[11px] text-[#888] mt-0.5">
                        Used on: {def.usedOn}
                      </div>
                    </div>
                    {hasFirebaseFile && (
                      <button
                        type="button"
                        onClick={() => handleDelete(def.key)}
                        disabled={st.uploading}
                        title="Reset to default image"
                        className="text-[#c0392b] hover:text-[#922b21] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 mt-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* URL input + Save button */}
                  <div className="flex gap-2 mt-2.5 mb-2">
                    <input
                      value={draftUrl}
                      onChange={(e) =>
                        setUrlDrafts((prev) => ({
                          ...prev,
                          [def.key]: e.target.value,
                        }))
                      }
                      placeholder="https://... or /images/filename.jpg"
                      className="flex-1 min-w-0 px-3 py-2 border-[1.5px] border-[#ddd] rounded-lg text-[13px]"
                    />
                    {isDraftDirty && (
                      <button
                        type="button"
                        onClick={() => handleSaveUrl(def.key)}
                        disabled={st.uploading}
                        className="bg-ug-blue text-white border border-ug-blue rounded-[7px] px-3 py-1.5 text-[12px] font-medium disabled:opacity-65 disabled:cursor-not-allowed cursor-pointer shrink-0"
                      >
                        Save URL
                      </button>
                    )}
                  </div>

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => fileRefs.current[def.key]?.click()}
                    disabled={st.uploading}
                    className="bg-ug-blue-light text-ug-blue border border-[#b0bdd8] rounded-[7px] px-4 py-1.5 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-65 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-[5px]">
                      {st.uploading ? (
                        <>
                          <Loader size={13} className="animate-spin" />
                          {st.progress > 0
                            ? `Uploading… ${st.progress}%`
                            : "Uploading…"}
                        </>
                      ) : (
                        <>
                          <Upload size={13} /> Upload Image
                        </>
                      )}
                    </span>
                  </button>

                  {/* Progress bar */}
                  {st.uploading && st.progress > 0 && (
                    <div className="mt-2 h-[6px] bg-[#e0e7f0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ug-blue rounded-full transition-[width] duration-200"
                        style={{ width: st.progress + "%" }}
                      />
                    </div>
                  )}

                  {/* Error */}
                  {st.error && (
                    <div className="mt-2 flex items-start gap-1.5 text-[12px] text-[#c0392b] bg-[#fdecea] rounded-[6px] px-3 py-2">
                      <AlertCircle size={13} className="shrink-0 mt-px" />
                      {st.error}
                    </div>
                  )}

                  {/* Success */}
                  {st.successMsg && (
                    <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#1B6B3A] bg-[#e8f5ee] rounded-[6px] px-3 py-2">
                      <Check size={13} className="shrink-0" />
                      {st.successMsg}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
