import { useState, useRef } from "react";
import { Image, Upload, ArrowRight, Check, X } from "lucide-react";
import { uploadToStorage, storageErrorMsg } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function GalleryPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const gallery = (siteContent.gallery as any[]) || [];
  const onChange = (v: unknown) => updateContent("gallery", v);
  const [items, setItems] = useState(gallery.map((p) => ({ ...p })));
  const [saved, setSaved] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRef = useRef(null);
  const uploadingIdxRef = useRef(null);

  const save = () => {
    onChange(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const update = (i, field, val) =>
    setItems((arr) =>
      arr.map((p, pi) => (pi === i ? { ...p, [field]: val } : p)),
    );
  const remove = (i) => setItems((arr) => arr.filter((_, pi) => pi !== i));
  const add = () =>
    setItems((arr) => [
      ...arr,
      { src: "", caption: "New Photo", year: "2026" },
    ]);

  const triggerUpload = (i) => {
    uploadingIdxRef.current = i;
    fileRef.current.click();
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || uploadingIdxRef.current === null) return;
    const idx = uploadingIdxRef.current;
    e.target.value = "";
    setUploadingIdx(idx);
    try {
      const url = await uploadToStorage(file);
      setItems((arr) => {
        const next = arr.map((p, pi) => (pi === idx ? { ...p, src: url } : p));
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="max-w-[800px]">
      <h2 className="mb-1.5 font-serif">
        Gallery
      </h2>
      <p className="text-[#666] text-sm mb-6">
        Manage photos shown on the Gallery page. Upload images or paste URLs.
        Each photo shows with a caption and year label.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Gallery saved.
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <div className="flex flex-col gap-[14px] mb-5">
        {items.map((p, i) => {
          const isUploading = uploadingIdx === i;
          return (
            <div
              key={i}
              className="bg-white border border-[#e0e0e0] rounded-xl px-[18px] py-4 flex gap-4 items-start"
            >
              <div
                className="w-[120px] h-[84px] rounded-lg overflow-hidden border border-[#eee] shrink-0 bg-[#f5f5f5]"
              >
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.caption}
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image size={24} color="#ccc" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-[1fr_100px_70px] gap-[10px] mb-2 items-end">
                  <div className="form-group mb-0">
                    <label>Caption</label>
                    <input
                      value={p.caption}
                      onChange={(e) => update(i, "caption", e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label>Year</label>
                    <input
                      value={p.year}
                      onChange={(e) => update(i, "year", e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-2 text-[13px] cursor-pointer mb-5"
                  >
                    <span className="inline-flex items-center gap-1">
                      <X size={12} /> Remove
                    </span>
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    value={p.src || ""}
                    onChange={(e) => update(i, "src", e.target.value)}
                    placeholder="/images/... or https://..."
                    className="flex-1 px-2.5 py-[7px] border-[1.5px] border-[#ddd] rounded-[7px] text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload(i)}
                    disabled={uploadingIdx !== null}
                    className={`bg-ug-blue-light text-ug-blue border border-[#b0bdd8] rounded-[7px] px-3.5 py-[7px] text-xs font-medium shrink-0 transition-opacity${uploadingIdx !== null ? " opacity-65 cursor-not-allowed" : " cursor-pointer"}`}
                  >
                    <span className="inline-flex items-center gap-[5px]">
                      <Upload size={13} />{" "}
                      {isUploading ? "Uploading…" : "Upload"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={add}
          className="bg-white border-2 border-dashed border-ug-gold text-[#b5700a] rounded-[10px] px-5 py-2.5 text-[13px] cursor-pointer"
        >
          + Add Photo
        </button>
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-1.5">
            Save Gallery <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
