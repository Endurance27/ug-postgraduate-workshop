import RegisterPanel from "./panels/RegisterPanel";
import { useAdminContext } from "../../context/AdminContext";
export default function RegisterRoute() {
  const { siteContent, updateContent } = useAdminContext();
  return <RegisterPanel event={siteContent.event} onChange={(v) => updateContent("event", v)} />;
}
