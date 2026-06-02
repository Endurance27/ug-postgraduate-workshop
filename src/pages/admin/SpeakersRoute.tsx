import SpeakersPanel from "./panels/SpeakersPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function SpeakersRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <SpeakersPanel speakers={siteContent.speakers} onChange={(v) => updateContent("speakers", v)} />;
}
