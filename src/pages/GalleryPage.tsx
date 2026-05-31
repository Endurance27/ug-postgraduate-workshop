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

const FALLBACK_PHOTOS = [
  {
    src: "/images/workshop-sessions.jpg",
    caption: "Workshop Sessions",
    year: "2025",
  },
  {
    src: "/images/research-presentations.jpg",
    caption: "Research Presentations",
    year: "2025",
  },
  {
    src: "/images/collaboration-networking.jpeg",
    caption: "Networking & Collaboration",
    year: "2025",
  },
  {
    src: "/images/dcs-research.jpg",
    caption: "Students at Work",
    year: "2025",
  },
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
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
          color: "#fff",
          padding: "72px 0 56px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/collaboration-networking.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span
            className="badge"
            style={{
              background: "rgba(201,168,76,0.25)",
              color: "#C9A84C",
              marginBottom: 14,
              display: "inline-block",
            }}
          >
            Maiden Workshop · 2025
          </span>
          <h1
            style={{
              color: "#fff",
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              marginBottom: 12,
            }}
          >
            Photo Gallery
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
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
              style={{
                breakInside: "avoid",
                marginBottom: 16,
                borderRadius: 12,
                overflow: "hidden",
                cursor: "zoom-in",
                position: "relative",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={p.src}
                alt={p.caption}
                style={{ width: "100%", display: "block", borderRadius: 12 }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  background:
                    "linear-gradient(transparent 55%, rgba(15,35,71,0.82))",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "14px 16px",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <div>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {p.caption}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 11,
                      margin: 0,
                    }}
                  >
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
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: 28,
              width: 48,
              height: 48,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ‹
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 900, width: "100%", textAlign: "center" }}
          >
            <img
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].caption}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: 12,
                objectFit: "contain",
              }}
            />
            <p
              style={{
                color: "#fff",
                marginTop: 14,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {PHOTOS[lightbox].caption}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {lightbox + 1} / {PHOTOS.length}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: 28,
              width: 48,
              height: 48,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ›
          </button>

          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </main>
  );
}
