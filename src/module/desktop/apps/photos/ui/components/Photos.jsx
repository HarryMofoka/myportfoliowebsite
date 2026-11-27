import windowWrapper from "@hoc/windowWrapper";
import useWindowsStore from "@store/window";
import { gallery } from "@constants";
import { useState, useEffect } from "react";
import PhotosSection from "../section/PhotosSection";
import PhotosAboutModal from "./PhotosAboutModal";

// Enrich gallery items cleanly with Harry Mofoka's authentic metadata
const enrichedGallery = gallery.map((item) => ({
  title: item.title || "Untitled",
  date: item.date || "2026",
  location: item.location || "Gauteng, South Africa",
  camera: item.camera || "Portfolio Capture",
  exposure: item.exposure || "Digital Build",
  lens: item.lens || "Web & Mobile",
  size: item.size || "1.2 MB",
  resolution: item.resolution || "1280 × 800",
  ...item,
}));

const Photos = () => {
  const { favorites, openWindow, setWindowData } = useWindowsStore();
  const photosWindowData = useWindowsStore((state) => state.windows.photos?.data);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("Library");
  const [showAbout, setShowAbout] = useState(false);

  // Sync openAbout from window data
  useEffect(() => {
    if (photosWindowData?.openAbout) {
      setShowAbout(true);
      setWindowData("photos", null);
    }
  }, [photosWindowData, setWindowData]);

  // Navigation history
  const [navHistory, setNavHistory] = useState(["Library"]);
  const [navIndex, setNavIndex] = useState(0);

  // Layout and view controls
  const [zoomLevel, setZoomLevel] = useState(4); // 1 (large columns) to 6 (small columns)
  const [viewMode, setViewMode] = useState("All Photos"); // Years, Months, Days, All Photos
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [rotations, setRotations] = useState({}); // { [id]: degrees }
  const [inAppViewerPhoto, setInAppViewerPhoto] = useState(null);

  // Custom photo titles modified locally
  const [customTitles, setCustomTitles] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync selection photo ID when active tab changes
  useEffect(() => {
    setSelectedPhotoId(null);
  }, [activeTab]);

  // Navigate back/forward
  const handleNavigate = (direction) => {
    if (direction === "back" && navIndex > 0) {
      const nextIdx = navIndex - 1;
      setNavIndex(nextIdx);
      setActiveTab(navHistory[nextIdx]);
    } else if (direction === "forward" && navIndex < navHistory.length - 1) {
      const nextIdx = navIndex + 1;
      setNavIndex(nextIdx);
      setActiveTab(navHistory[nextIdx]);
    }
  };

  const handleSelectAlbum = (album) => {
    setActiveTab(album);
    const newHistory = navHistory.slice(0, navIndex + 1);
    newHistory.push(album);
    setNavHistory(newHistory);
    setNavIndex(newHistory.length - 1);
  };

  // Get active photo list
  const activePhotos = enrichedGallery
    .map((photo) => ({
      ...photo,
      title: customTitles[photo.id] || photo.title,
      rotation: rotations[photo.id] || 0,
    }))
    .filter((item) => {
      // Tab filter
      if (activeTab === "Favorites") {
        if (!favorites.includes(item.id)) return false;
      } else if (item.category !== activeTab) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.camera.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const selectedPhoto =
    activePhotos.find((p) => p.id === selectedPhotoId) || activePhotos[0] || null;

  const handlePhotoClick = (photo) => {
    setSelectedPhotoId(photo.id);
  };

  const _handlePhotoDoubleClick = (photo) => {
    if (isMobile) {
      setInAppViewerPhoto(photo);
    } else {
      const index = activePhotos.findIndex((p) => p.id === photo.id);
      openWindow("imgfile", {
        currentIndex: index >= 0 ? index : 0,
        photos: activePhotos.map((p) => ({
          id: p.id,
          name: p.title,
          imageUrl: p.img,
          resolution: p.resolution || "1920 × 1080",
        })),
      });
    }
  };

  const handleRotateActivePhoto = () => {
    if (!selectedPhoto) return;
    const currentRot = rotations[selectedPhoto.id] || 0;
    const nextRot = (currentRot + 90) % 360;
    setRotations((prev) => ({
      ...prev,
      [selectedPhoto.id]: nextRot,
    }));
  };

  const handleUpdateTitle = (id, newTitle) => {
    setCustomTitles((prev) => ({
      ...prev,
      [id]: newTitle,
    }));
  };

  return (
    <>
      <PhotosSection
        isMobile={isMobile}
        filteredGallery={activePhotos}
        activeTab={activeTab}
        onSelectPhoto={handlePhotoClick}
        onSelectAlbum={handleSelectAlbum}
        // Extended controls
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPhoto={selectedPhoto}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        onRotate={handleRotateActivePhoto}
        inAppViewerPhoto={inAppViewerPhoto}
        setInAppViewerPhoto={setInAppViewerPhoto}
        onUpdateTitle={handleUpdateTitle}
        onDoubleClick={_handlePhotoDoubleClick}
        // History navigation
        canGoBack={navIndex > 0}
        canGoForward={navIndex < navHistory.length - 1}
        onNavigate={handleNavigate}
      />
      <PhotosAboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

const PhotosWindow = windowWrapper(Photos, "photos");
PhotosWindow.displayName = "Photos";
export default PhotosWindow;
