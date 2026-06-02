import ParticipantsPanel from "./panels/ParticipantsPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function ParticipantsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <ParticipantsPanel participants={siteContent.participants} onChange={(v) => updateContent("participants", v)} />;
}
