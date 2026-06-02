import HomePanel from "./panels/HomePanel";
import { useAdminContext } from "../../context/AdminContext";
export default function HomeRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return (
    <HomePanel
      event={siteContent.event}
      onChange={(v) => updateContent("event", v)}
      home={siteContent.home || {}}
      onChangeHome={(v) => updateContent("home", v)}
      onSaveAll={(v) => updateContent(v)}
    />
  );
}
