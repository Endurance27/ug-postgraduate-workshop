import { useState } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Photo {
  src: string;
  caption: string;
  year: string;
}

interface GalleryPageProps {
  gallery?: Photo[];
}

const BASE = import.meta.env.BASE_URL;
const FALLBACK_PHOTOS = [
  { src: `${BASE}images/workshop-sessions.jpg`,         caption: "Workshop Sessions",          year: "2025" },
  { src: `${BASE}images/research-presentations.jpg`,    caption: "Research Presentations",     year: "2025" },
  { src: `${BASE}images/collaboration-networking.jpeg`, caption: "Networking & Collaboration", year: "2025" },
  { src: `${BASE}images/dcs-research.jpg`,              caption: "Students at Work",           year: "2025" },
];

export default function GalleryPage({ gallery }: GalleryPageProps) {
  const PHOTOS = gallery && gallery.length > 0 ? gallery : FALLBACK_PHOTOS;
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox((i) => ((i ?? 0) - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setLightbox((i) => ((i ?? 0) + 1) % PHOTOS.length);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/collaboration-networking.jpeg')" }}
        />
        <div className="container relative z-10">
          <span
            className="badge inline-block mb-[14px]"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
          >
            Maiden Workshop · 2025
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Photo Gallery
          </h1>
          <p className="text-white/75 text-base">
            Moments from the 1st DCS Postgraduate Workshop
          </p>
        </div>
      </section>

      <div className="container section">
        <div
          style={{
            columns: "3 280px",
            columnGap: 16,
          }}
        >
          {PHOTOS.map((p, i) => (
            <div
              key={i}
              onClick={() => setLightbox(i)}
              className="break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-zoom-in relative transition-transform duration-200 hover:scale-[1.02]"
            >
              <img
                src={p.src}
                alt={p.caption}
                className="w-full block rounded-xl"
              />
              <div
                className="absolute inset-0 rounded-xl flex items-end p-[14px_16px] opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(transparent 55%, rgba(15,35,71,0.82))",
                }}
              >
                <div>
                  <p className="text-white text-[13px] font-semibold m-0">
                    {p.caption}
                  </p>
                  <p className="text-white/65 text-[11px] m-0">
                    {p.year} Workshop
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/[0.92] z-[2000] flex items-center justify-center p-6"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/15 border-none text-white text-[28px] w-12 h-12 rounded-full cursor-pointer"
          >
            ‹
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[900px] w-full text-center"
          >
            <img
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].caption}
              className="max-w-full max-h-[75vh] rounded-xl object-contain"
            />
            <p className="text-white mt-[14px] text-[15px] font-semibold">
              {PHOTOS[lightbox].caption}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {lightbox + 1} / {PHOTOS.length}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/15 border-none text-white text-[28px] w-12 h-12 rounded-full cursor-pointer"
          >
            ›
          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 bg-white/15 border-none text-white text-xl w-10 h-10 rounded-full cursor-pointer flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </main>
  );
}
