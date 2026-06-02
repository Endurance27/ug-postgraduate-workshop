import RecordingsPanel from "./panels/RecordingsPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function RecordingsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <RecordingsPanel recordings={siteContent.recordings} onChange={(v) => updateContent("recordings", v)} />;
}
