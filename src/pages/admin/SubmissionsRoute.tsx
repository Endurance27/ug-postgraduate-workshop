import SubmissionsPanel from "./panels/SubmissionsPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function SubmissionsRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <SubmissionsPanel submissions={siteContent.submissions} onChange={(v) => updateContent("submissions", v)} />;
}
