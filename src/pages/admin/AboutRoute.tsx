import AboutPanel from "./panels/AboutPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function AboutRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <AboutPanel about={siteContent.about} onChange={(v) => updateContent("about", v)} />;
}
