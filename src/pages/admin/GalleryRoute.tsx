import GalleryPanel from "./panels/GalleryPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function GalleryRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <GalleryPanel gallery={siteContent.gallery} onChange={(v) => updateContent("gallery", v)} />;
}
