import AnnouncementsPanel from "./panels/AnnouncementsPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function AnnouncementsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <AnnouncementsPanel items={siteContent.announcements} onChange={(v) => updateContent("announcements", v)} />;
}
