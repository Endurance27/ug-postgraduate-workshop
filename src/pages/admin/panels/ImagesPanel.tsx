import { useState, useRef } from "react";
import { Image, Upload, Check, ArrowRight } from "lucide-react";
import { uploadToStorage, storageErrorMsg } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function ImagesPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const images = (siteContent.images as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("images", v);
  const [form, setForm] = useState({
    workshop: images.workshop || "/images/workshop-sessions.jpg",
    research: images.research || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students: images.students || "/images/dcs-research.jpg",
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadingKeyRef = useRef<string | null>(null);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const triggerUpload = (key: string) => {
    uploadingKeyRef.current = key;
    fileRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingKeyRef.current) return;
    const key = uploadingKeyRef.current;
    e.target.value = "";
    setUploading(key);
    try {
      const url = await uploadToStorage(file);
      setForm((f) => {
        const next = { ...f, [key]: url };
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploading(null);
    }
  };

  const IMAGE_DEFS = [
    {
      key: "workshop",
      label: "Workshop Sessions",
      usedOn: "Home hero background · Home photo strip · Home testimonials",
    },
    {
      key: "research",
      label: "Research Presentations",
      usedOn: "Home 'About' section · Home photo strip · About page hero",
    },
    {
      key: "networking",
      label: "Networking & Events",
      usedOn:
        "Home CTA background · Contact page · Speakers page · Sponsors page",
    },
    {
      key: "students",
      label: "Students / DCS Research",
      usedOn:
        "Home hero card photo · Home awards background · Home testimonials",
    },
  ];

  return (
    <div className="max-w-[760px]">
      <h2 className="mb-1.5 font-serif">Site Images</h2>
      <p className="text-[#666] text-sm mb-2">
        These 4 images appear across all pages of the site. Upload a new image
        or paste a URL — every page updates instantly.
      </p>
      <div className="alert alert-info mb-6 text-[13px]">
        <strong>Upload:</strong> click "Upload" to pick a file from your device.{" "}
        <strong>URL:</strong> paste <code>/images/yourfile.jpg</code> for files
        in <code>public/images/</code>, or any direct image link.
      </div>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Images saved and live on the site.
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <div className="flex flex-col gap-5">
        {IMAGE_DEFS.map((def) => {
          const val = form[def.key as keyof typeof form];
          const isUploading = uploading === def.key;
          return (
            <div
              key={def.key}
              className="bg-white border border-[#e0e0e0] rounded-[14px] p-[20px_22px] flex gap-5 items-start"
            >
              <div className="w-[140px] h-24 rounded-[10px] overflow-hidden border border-[#e0e0e0] shrink-0 bg-[#f5f5f5]">
                {val ? (
                  <img
                    src={val}
                    alt={def.label}
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image size={28} color="#bbb" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-0.5 text-ug-blue">
                  {def.label}
                </div>
                <div className="text-[11px] text-[#888] mb-2.5">
                  Used on: {def.usedOn}
                </div>
                <input
                  value={val || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [def.key]: e.target.value }))
                  }
                  placeholder="https://... or /images/filename.jpg"
                  className="w-full px-3 py-2 border-[1.5px] border-[#ddd] rounded-lg text-[13px] mb-2"
                />
                <button
                  type="button"
                  onClick={() => triggerUpload(def.key)}
                  disabled={!!uploading}
                  className="bg-ug-blue-light text-ug-blue border border-[#b0bdd8] rounded-[7px] px-4 py-1.5 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-65 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-[5px]">
                    <Upload size={13} />{" "}
                    {isUploading ? "Uploading…" : "Upload Image"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-primary mt-6" onClick={save}>
        <span className="inline-flex items-center gap-1.5">
          Save All Images <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
