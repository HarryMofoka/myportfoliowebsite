import React from "react";
import { ChevronRight } from "lucide-react";

export const PhotosCollectionsMobile = ({
  gallery = [],
  favorites = [],
  onSelectPhoto,
  onSelectAlbum,
}) => {
  const getCoverImage = (category) => {
    const item = gallery.find((p) => p.category === category);
    return item ? item.img : "/contacts/avatars/harry.jpg";
  };

  const getFavoritesCover = () => {
    if (favorites.length > 0) {
      const favId = favorites[0];
      const item = gallery.find((p) => p.id === favId);
      if (item) return item.img;
    }
    return "/contacts/avatars/harry.jpg";
  };

  const albumList = [
    {
      name: "Library",
      count: gallery.filter((p) => p.category === "Library").length,
      img: getCoverImage("Library"),
    },
    {
      name: "Projects",
      count: gallery.filter((p) => p.category === "Projects").length,
      img: getCoverImage("Projects"),
    },
    {
      name: "Experiments",
      count: gallery.filter((p) => p.category === "Experiments").length,
      img: getCoverImage("Experiments"),
    },
    {
      name: "Portraits",
      count: gallery.filter((p) => p.category === "Portraits").length,
      img: getCoverImage("Portraits"),
    },
    ...(favorites.length > 0
      ? [{ name: "Favorites", count: favorites.length, img: getFavoritesCover() }]
      : []),
  ];

  const portraitPhotos = gallery.filter((p) => p.category === "Portraits");
  const projectPhotos = gallery.filter((p) => p.category === "Projects");

  const portraitLabels = ["Harry", "De Deur", "Nexlink ZA", "HM."];

  return (
    <div style={{ padding: "0 10px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Highlights Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Recent Highlights</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {[
            { date: "Portraits", photos: gallery.slice(0, 2) },
            { date: "Flagship Builds", photos: gallery.slice(2, 6) },
            { date: "UI & 3D Lab", photos: gallery.slice(9, 13) },
          ].map((group, idx) => (
            <div
              key={idx}
              style={{
                flexShrink: 0,
                width: 140,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  position: "relative",
                  background: "#e5e5ea",
                }}
                onClick={() => group.photos[0] && onSelectPhoto(group.photos[0])}
              >
                {group.photos[0] && (
                  <img
                    src={group.photos[0].img}
                    alt={group.date}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                    padding: "8px 10px",
                  }}
                >
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{group.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portraits & Identity Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Harry &amp; Brands</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {portraitPhotos.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onSelectPhoto(p)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  border: "2px solid #fff",
                  background: "#e5e5ea",
                }}
              >
                <img
                  src={p.img}
                  alt={p.title || "Harry Mofoka"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#1c1c1e", fontWeight: 500 }}>
                {portraitLabels[idx % portraitLabels.length]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Builds Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Featured Builds</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
          }}
          className="scrollbar-none"
        >
          {projectPhotos.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPhoto(p)}
              style={{
                flexShrink: 0,
                width: 220,
                height: 140,
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                background: "#e5e5ea",
              }}
            >
              <img
                src={p.img}
                alt={p.title || "Project"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.88)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 14,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    opacity: 0.85,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Build
                </span>
                <p
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    marginTop: 2,
                    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  }}
                >
                  {p.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Albums Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Albums</h2>
          <ChevronRight size={18} style={{ color: "#8e8e93" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {albumList.map((album) => (
            <div
              key={album.name}
              onClick={() => onSelectAlbum(album.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  background: "#e5e5ea",
                }}
              >
                <img
                  src={album.img}
                  alt={album.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1e" }}>{album.name}</p>
                <p style={{ fontSize: 12, color: "#8e8e93" }}>{album.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
