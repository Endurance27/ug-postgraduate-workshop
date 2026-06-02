import ScheduleEditor from "./panels/ScheduleEditor";
import { useAdminContext } from "../../context/AdminContext";
export default function ScheduleRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <ScheduleEditor schedule={siteContent.schedule} onChange={(v) => updateContent("schedule", v)} />;
}
